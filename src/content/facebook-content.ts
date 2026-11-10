import { detectCurrentFacebookPage } from '../services/facebook/detectors/page-detector';
import {
  performProgressiveGroupScan,
  checkFacebookLoginStatus,
  detectFacebookUserProfile,
  scanPageForGroups,
  fetchJoinedGroupsViaSession,
} from '../services/facebook/detectors/group-discovery';
import { mergeDiscoveredGroups } from '../services/facebook/discovery-manager';
import { ActivePostTabPayload, RuntimeMessage } from '../types/messages';
import { resolveSpintax } from '../utils/helpers';
import { convertToRichHtml, deduplicateRepeatedCaption } from '../utils/text-styler';
import { renderAutoJoinerDock } from '../services/facebook/auto-joiner-ui';
import { AutoJoinerController, isFacebookSearchPage } from '../services/facebook/auto-joiner-engine';

console.log('[AGP:Content] Facebook Assistant Content Script initialized.');

let helperContainer: HTMLElement | null = null;
let shadowRoot: ShadowRoot | null = null;
let activePayload: ActivePostTabPayload | null = null;
let isCollapsed = false;
let isCaptionExpanded = false;
let currentQueueState: any = null;
let currentQueueStats: any = null;
let queuePollInterval: any = null;
let isWidgetDismissed = false;

/**
 * Completely closes the assistant dock and stops auto-posting immediately.
 */
function closeAndStopEverything() {
  if (autoPostTimer) {
    clearInterval(autoPostTimer);
    autoPostTimer = null;
  }
  if (queuePollInterval) {
    clearInterval(queuePollInterval);
    queuePollInterval = null;
  }
  isAutoPosting = false;
  autoPilotPaused = true;
  isWidgetDismissed = true;

  // Stop background queue execution immediately
  try {
    chrome.runtime.sendMessage({ type: 'STOP_QUEUE' });
  } catch (_) {}

  // Remove dock UI completely from DOM
  if (helperContainer) {
    helperContainer.remove();
    helperContainer = null;
    shadowRoot = null;
  }

  showToast('🛑 Auto-Posting বন্ধ করা হয়েছে (Stopped & Closed)');
}

// Window beforeunload suppression is handled natively at document_start by prevent-beforeunload.js in MAIN world


/**
 * Copies text to clipboard safely.
 */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

/**
 * Copies rich HTML and plain text to clipboard safely.
 */
async function copyRichText(plainText: string, htmlText: string): Promise<boolean> {
  try {
    if (navigator.clipboard && (window as any).ClipboardItem) {
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const htmlBlob = new Blob([htmlText], { type: 'text/html' });
      await navigator.clipboard.write([
        new (window as any).ClipboardItem({
          'text/plain': textBlob,
          'text/html': htmlBlob,
        }),
      ]);
      return true;
    }
  } catch (_) {}

  // Fallback: document.execCommand('copy') with rich HTML DataTransfer
  try {
    const listener = (e: ClipboardEvent) => {
      e.preventDefault();
      e.clipboardData?.setData('text/plain', plainText);
      e.clipboardData?.setData('text/html', htmlText);
    };
    document.addEventListener('copy', listener);
    const ok = document.execCommand('copy');
    document.removeEventListener('copy', listener);
    if (ok) return true;
  } catch (_) {}

  return copyText(plainText);
}

/**
 * Shows a toast notification on the Facebook page.
 * Works both with and without the shadow root helper panel.
 */
function showToast(message: string, isError = false) {
  // Try shadow root first
  if (shadowRoot) {
    const existing = shadowRoot.getElementById('agp-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'agp-toast';
    toast.innerText = message;
    toast.style.cssText = `
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: ${isError ? '#ef4444' : '#10b981'};
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      z-index: 1000;
      pointer-events: none;
      animation: fadeInOut 2.2s ease forwards;
    `;
    shadowRoot.appendChild(toast);
    setTimeout(() => toast.remove(), 2400);
    return;
  }

  // Fallback: Global toast on the page body (for /groups/joins/ page where helper dock is not active)
  if (typeof document !== 'undefined' && document.body) {
    const existingGlobal = document.getElementById('agp-global-toast');
    if (existingGlobal) existingGlobal.remove();

    const toast = document.createElement('div');
    toast.id = 'agp-global-toast';
    toast.innerText = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${isError ? '#ef4444' : '#10b981'};
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      padding: 10px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      z-index: 2147483647;
      pointer-events: none;
      opacity: 0;
      transform: translateY(-10px);
      transition: opacity 0.3s ease, transform 0.3s ease;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;
    document.body.appendChild(toast);
    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
}

// ============================================================================
// AUTOMATED FACEBOOK GROUP POSTER ROBOT
// ============================================================================

let isAutoPosting = false;
let autoPostStatus = 'Preparing auto-post...';
let autoPostCountdown = 3;
let autoPostTimer: any = null;
let autoPilotPaused = false;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * Resiliently converts a media item (base64 DataURL, video, image, or remote/blob URL) to a valid File object.
 * Correctly detects MP4, WEBM, MOV, MKV videos as well as JPEG, PNG, WEBP images.
 */
async function mediaToFile(mediaItem: string, fallbackName = 'media_1'): Promise<File | null> {
  try {
    if (!mediaItem || typeof mediaItem !== 'string') return null;

    let mime = 'image/jpeg';
    let blob: Blob | null = null;

    // Fast path: use native fetch to decode Data URLs, Blob URLs, or HTTP URLs directly into a Blob
    if (
      mediaItem.startsWith('data:') ||
      mediaItem.startsWith('blob:') ||
      mediaItem.startsWith('http://') ||
      mediaItem.startsWith('https://')
    ) {
      try {
        const resp = await fetch(mediaItem);
        if (resp.ok || mediaItem.startsWith('data:') || mediaItem.startsWith('blob:')) {
          blob = await resp.blob();
          if (blob && blob.size > 0) {
            mime = (blob.type || '').toLowerCase() || 'image/jpeg';
          }
        }
      } catch (fetchErr) {
        console.warn('[AGP:AutoPost] fetch blob parsing failed, falling back to manual decode:', fetchErr);
      }
    }

    // Fallback: manual base64 decoding if fetch was not used or failed
    if (!blob || blob.size === 0) {
      let data = mediaItem;
      if (mediaItem.startsWith('data:')) {
        const commaIdx = mediaItem.indexOf(',');
        if (commaIdx !== -1) {
          const header = mediaItem.slice(0, commaIdx);
          data = mediaItem.slice(commaIdx + 1);
          const mimeMatch = header.match(/:(.*?);/);
          mime = mimeMatch ? mimeMatch[1].toLowerCase() : 'image/jpeg';
        }
      }
      try {
        const binary = atob(data.trim().replace(/\s/g, ''));
        const u8 = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          u8[i] = binary.charCodeAt(i);
        }
        if (u8.length === 0) return null;
        if (u8.length > 8 && u8[4] === 0x66 && u8[5] === 0x74 && u8[6] === 0x79 && u8[7] === 0x70) {
          mime = 'video/mp4';
        }
        blob = new Blob([u8.buffer], { type: mime });
      } catch (decodeErr) {
        console.warn('[AGP:AutoPost] base64 decode failed:', decodeErr);
        return null;
      }
    }

    if (!blob || blob.size === 0) return null;

    // Determine correct extension based on MIME type
    const isVideo = mime.startsWith('video/');
    let ext = 'jpg';
    if (mime.includes('video/mp4') || mime.includes('mp4')) ext = 'mp4';
    else if (mime.includes('video/webm') || mime.includes('webm')) ext = 'webm';
    else if (mime.includes('video/quicktime') || mime.includes('mov')) ext = 'mov';
    else if (mime.includes('video/x-m4v') || mime.includes('m4v')) ext = 'm4v';
    else if (mime.includes('video/mkv') || mime.includes('matroska')) ext = 'mkv';
    else if (isVideo) ext = 'mp4';
    else if (mime.includes('png')) ext = 'png';
    else if (mime.includes('webp')) ext = 'webp';
    else if (mime.includes('gif')) ext = 'gif';

    const timestamp = Date.now();
    const indexPart = fallbackName.replace(/\D/g, '') || '1';
    const prefix = isVideo ? 'VID' : 'IMG';
    const finalFilename = `${prefix}_${timestamp}_${indexPart}.${ext}`;

    return new File([blob], finalFilename, { type: mime, lastModified: timestamp });
  } catch (err) {
    console.warn('[AGP:AutoPost] mediaToFile error:', err);
    return null;
  }
}

/**
 * Synchronous base64 fallback converter.
 */
function base64ToFile(dataUrl: string, filename: string): File {
  try {
    const parts = dataUrl.split(',');
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const binary = atob(parts[1] || parts[0]);
    const u8 = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      u8[i] = binary.charCodeAt(i);
    }
    return new File([u8], filename, { type: mime });
  } catch (err) {
    console.warn('[AGP:AutoPost] base64ToFile error:', err);
    return new File([new Uint8Array(0)], filename, { type: 'image/jpeg' });
  }
}

/**
 * Robust visibility check for DOM elements that works with position: fixed, flex, and modals.
 */
function isElementVisible(el: HTMLElement | null): boolean {
  if (!el) return false;
  if (el.offsetParent !== null) return true;
  try {
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  } catch {
    return false;
  }
}

/**
 * Strictly blacklists elements that belong to cover photos, group banners,
 * media viewer links, or comments.
 * Never allows clicking cover photos or media viewer items as composer triggers.
 */
function isComposerBlacklisted(el: HTMLElement | null): boolean {
  if (!el) return true;

  // 1. Tag checks: never consider raw images, icons, or videos as the composer pill
  const tag = el.tagName.toUpperCase();
  if (tag === 'IMG' || tag === 'SVG' || tag === 'VIDEO' || tag === 'AUDIO') {
    return true;
  }

  // 2. Cover photo and banners
  if (
    el.closest(
      '[data-pagelet*="CoverPhoto"], [data-pagelet*="GroupCover"], [data-pagelet*="GroupBanner"], div[data-pagelet="CoverPhoto"]'
    )
  ) {
    return true;
  }

  // 3. Full-screen media viewer or theater mode
  if (el.closest('[data-pagelet*="MediaViewer"], div[aria-label*="Photo viewer" i]')) {
    return true;
  }

  // 4. Links to specific photos, videos, albums, or individual post permalinks
  if (
    el.closest(
      'a[href*="/photo/"], a[href*="/photos/"], a[href*="/media/"], a[href*="/album/"], a[href*="/videos/"], a[href*="/posts/"], a[href*="/permalink/"]'
    )
  ) {
    return true;
  }

  // 5. Comments, comment boxes, and post reaction menus
  if (
    el.closest(
      '[data-pagelet*="Comment"], [aria-label*="Comment as" i], [aria-label="Write a comment" i], [aria-label*="Actions for this post" i], [aria-label*="Like" i]'
    )
  ) {
    return true;
  }

  // 6. Aria labels that identify cover/profile photos
  const aria = (el.getAttribute('aria-label') || '').toLowerCase();
  if (
    aria.includes('cover photo') ||
    aria.includes('কভার ফটো') ||
    aria.startsWith('photo:') ||
    aria.includes('photo by') ||
    aria.includes('profile picture') ||
    aria.includes('প্রোফাইল ছবি')
  ) {
    return true;
  }

  if (el.getAttribute('role') === 'img') {
    return true;
  }

  return false;
}

const COMPOSER_KEYWORDS = [
  "what's on your mind",
  "whats on your mind",
  "what is on your mind",
  "write something",
  "write something to",
  "create a public post",
  "create a post",
  "create post",
  "write post",
  "start discussion",
  "write discussion",
  "what are you selling",
  "sell something",
  "anonymous post",
  "পোস্ট তৈরি করুন",
  "একটি পোস্ট তৈরি করুন",
  "কিছু লিখুন",
  "পাবলিক পোস্ট",
  "আপনার মনে কী আছে",
  "আপনার মনে কি আছে",
  "আপনার মনে কি চলছে",
  "কী ভাবছেন",
  "কি ভাবছেন",
  "আলোচনা শুরু করুন",
  "কী বিক্রি করছেন",
  "কি বিক্রি করছেন",
  "কিছু বিক্রি করুন",
  "বেনামী পোস্ট",
  "discussion",
  "আলোচনা"
];

/**
 * Checks whether text, ARIA label, or placeholder represents an explicit post composer trigger.
 */
function isComposerTextMatch(rawTxt: string, rawAria: string, rawPlaceholder?: string): boolean {
  const normAria = (rawAria || '').toLowerCase();
  const normTxt = (rawTxt || '').toLowerCase().replace(/\u2026/g, '...').trim();
  const normPh = (rawPlaceholder || '').toLowerCase();

  for (const kw of COMPOSER_KEYWORDS) {
    if (normAria.includes(kw)) return true;
    if (normPh.includes(kw)) return true;
    if (normTxt.startsWith(kw)) return true;
    if (normTxt.length < 120 && normTxt.includes(kw)) return true;
  }

  return false;
}

/**
 * Detects and instantly closes Facebook's full-screen theater photo/media viewer.
 * This prevents the extension from getting stuck if Facebook opened a photo viewer.
 */
async function closePhotoViewerIfOpen(): Promise<boolean> {
  const isTheater =
    window.location.href.includes('/photo') ||
    Boolean(
      document.querySelector(
        '[data-pagelet*="MediaViewer"], div[aria-label="Close"][role="button"], img[data-visualcompletion="media-vc-image"]'
      )
    );

  if (!isTheater) return false;

  console.log('[AGP:AutoPost] Photo theater viewer detected! Closing it to return to group page...');

  // 1. Try clicking the top-left Close (X) button
  const closeBtn = document.querySelector<HTMLElement>(
    '[aria-label="Close" i][role="button"], [aria-label="Close" i], [aria-label="Exit" i], div[aria-label="Close" i], [data-pagelet*="MediaViewer"] [aria-label*="Close" i]'
  );
  if (closeBtn && isElementVisible(closeBtn)) {
    try {
      closeBtn.click();
      await sleep(350);
      return true;
    } catch (_) {}
  }

  // 2. Dispatch Escape key to dismiss viewer
  try {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true }));
    await sleep(300);
  } catch (_) {}

  // 3. If URL still has /photo, navigate back to group
  if (window.location.href.includes('/photo')) {
    try {
      window.history.back();
      await sleep(500);
    } catch (_) {}
  }

  return true;
}

/**
 * Attempts to switch to the "Discussion" tab if the composer is hidden under another group tab.
 * Crucial for Buy & Sell groups that land on "Featured" or "Items for sale" tabs.
 */
function trySwitchToDiscussionTab(): boolean {
  const tabs = Array.from(document.querySelectorAll<HTMLElement>('[role="tab"], a[role="tab"], [role="tablist"] a, a[href*="/discussion"]'));
  for (const tab of tabs) {
    const text = (tab.textContent || '').trim().toLowerCase();
    const href = (tab.getAttribute('href') || '').toLowerCase();
    if (
      text === 'discussion' ||
      text === 'আলোচনা' ||
      href.endsWith('/discussion') ||
      href.endsWith('/discussion/') ||
      href.includes('/discussion/?')
    ) {
      try {
        tab.click();
        console.log('[AGP:AutoPost] Clicked "Discussion" tab to reveal composer.');
        return true;
      } catch (_) {}
    }
  }
  return false;
}

/**
 * Locates Facebook's "Write something..." / "Create a public post" trigger element.
 * Fully supports mobile Kiwi/Lemur browsers, touch screens, and desktop layouts.
 * Strictly excludes cover photos, profile images, media links, and feed posts.
 */
function findComposerTrigger(): HTMLElement | null {
  // Layer 1: Dedicated composer pagelets (Highest reliability)
  const composerContainers = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-pagelet="GroupInlineComposer"], [data-pagelet="FeedInlineComposer"], [data-pagelet="GroupComposer"], [data-pagelet*="Composer" i]'
    )
  );

  for (const container of composerContainers) {
    if (isComposerBlacklisted(container)) continue;

    // A. Look for text trigger inside the composer card
    const candidates = Array.from(container.querySelectorAll<HTMLElement>('span, div, [role="button"], button, textarea, input'));
    for (const el of candidates) {
      if (isComposerBlacklisted(el)) continue;
      const aria = el.getAttribute('aria-label') || '';
      const txt = el.textContent || '';
      const ph = el.getAttribute('placeholder') || '';
      if (isComposerTextMatch(txt, aria, ph)) {
        const clickable = el.closest<HTMLElement>('[role="button"], button') || el.closest<HTMLElement>('[tabindex="0"]') || el;
        if (clickable && isElementVisible(clickable) && !isComposerBlacklisted(clickable)) {
          return clickable;
        }
      }
    }

    // B. Look for Photo/Video quick button INSIDE this composer container only
    const photoBtn = container.querySelector<HTMLElement>(
      '[aria-label*="Photo/video" i], [aria-label*="Photo / video" i], [aria-label*="Add Photos" i], [aria-label*="ছবি/ভিডিও" i], [aria-label*="ছবি" i], [aria-label*="Photo" i]'
    );
    if (photoBtn && isElementVisible(photoBtn) && !isComposerBlacklisted(photoBtn)) {
      const clickable = photoBtn.closest<HTMLElement>('[role="button"], button') || photoBtn;
      if (clickable && isElementVisible(clickable) && !isComposerBlacklisted(clickable)) {
        return clickable;
      }
    }

    // C. Any generic clickable pill inside the composer card
    const firstPill = container.querySelector<HTMLElement>('[role="button"], div[tabindex="0"]');
    if (firstPill && isElementVisible(firstPill) && !isComposerBlacklisted(firstPill)) {
      return firstPill;
    }
  }

  // Layer 2: Global semantic scan across [role="main"] and group feed
  const queryScope = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[role="main"] [role="button"], [role="main"] div[tabindex="0"], [role="main"] span, [role="main"] div, div[role="feed"] [role="button"], div[role="feed"] span, div[role="button"], button, span'
    )
  );

  for (const el of queryScope) {
    if (isComposerBlacklisted(el)) continue;

    const aria = el.getAttribute('aria-label') || '';
    const txt = el.textContent || '';
    const ph = el.getAttribute('placeholder') || '';

    if (isComposerTextMatch(txt, aria, ph)) {
      const clickable =
        el.closest<HTMLElement>('[role="button"], button') ||
        el.closest<HTMLElement>('[tabindex="0"]') ||
        el;
      if (clickable && isElementVisible(clickable) && !isComposerBlacklisted(clickable)) {
        return clickable;
      }
    }
  }

  // Layer 3: Mobile web / mbasic / m.facebook.com composer elements
  const mobileTriggers = Array.from(
    document.querySelectorAll<HTMLElement>(
      'div[data-sigil*="m-composer"], div#MComposer, textarea[name="status"], button[value="Post"], div[role="button"][data-sigil*="touchable"]'
    )
  );
  for (const mt of mobileTriggers) {
    if (isElementVisible(mt) && !isComposerBlacklisted(mt)) return mt;
  }

  return null;
}

/**
 * Detects if the Facebook Create Post dialog is currently open.
 * Strictly excludes theater photo/media viewers, comment boxes, and chat tabs.
 * Supports both modal dialogs and expanded in-place inline composers.
 */
function findOpenPostDialog(): HTMLElement | null {
  // 1. Check modal dialogs
  const dialogs = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[role="dialog"], [aria-modal="true"], div[data-pagelet*="ComposerModal"]'
    )
  );
  for (const d of dialogs) {
    if (!isElementVisible(d)) continue;

    // Strictly exclude photo viewer, media viewer, theater mode
    if (
      d.getAttribute('data-pagelet')?.toLowerCase().includes('mediaviewer') ||
      d.querySelector('[data-pagelet*="MediaViewer"], img[data-visualcompletion="media-vc-image"], div[aria-label*="Photo viewer" i]')
    ) {
      continue;
    }

    // Exclude chat tabs, messenger windows, comment popups, feed articles
    if (
      d.closest('[role="article"]') ||
      d.querySelector('[data-pagelet*="ChatTab"], [aria-label*="Messenger" i], [aria-label*="Chats" i]')
    ) {
      continue;
    }

    const text = (d.textContent || '').toLowerCase();
    const aria = (d.getAttribute('aria-label') || '').toLowerCase();

    // Check for Post / Publish submit button
    const hasPostBtn = Boolean(
      d.querySelector(
        '[aria-label="Post" i], [aria-label="Publish" i], [aria-label="পোস্ট" i], [aria-label="সাবমিট" i], div[aria-label="Next" i], [role="button"][aria-label="Post" i]'
      )
    );

    // Check for "Add to your post" toolbar
    const hasAddToPost = Boolean(
      d.querySelector(
        '[aria-label*="Add to your post" i], [aria-label*="আপনার পোস্টে যোগ করুন" i], [aria-label*="Photo/video" i]'
      ) ||
      text.includes('add to your post') ||
      text.includes('আপনার পোস্টে যোগ করুন')
    );

    const isPostHeader =
      aria.includes('create post') ||
      aria.includes('create a post') ||
      aria.includes('create a public post') ||
      aria.includes('পোস্ট তৈরি করুন') ||
      text.includes('create a public post') ||
      text.includes('create post') ||
      text.includes('পোস্ট তৈরি করুন') ||
      text.includes('what are you selling') ||
      text.includes('কী বিক্রি করছেন');

    // Only accept if genuine composer indicators exist (not a comment box)
    if (hasPostBtn || hasAddToPost || isPostHeader) {
      const hasEditor = Boolean(
        d.querySelector('div[role="textbox"][contenteditable="true"], div[contenteditable="true"]')
      );
      if (hasEditor || hasPostBtn || hasAddToPost) {
        return d;
      }
    }
  }

  // 2. Check for expanded in-place inline composer card (common on responsive desktop and mobile)
  const inlineEditors = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-pagelet*="Composer"] div[role="textbox"][contenteditable="true"], [data-pagelet*="InlineComposer"] div[role="textbox"][contenteditable="true"]'
    )
  );
  for (const ie of inlineEditors) {
    if (!isElementVisible(ie)) continue;
    if (ie.closest('[aria-label*="Comment" i], [data-pagelet*="Comment"]')) continue;
    const parentContainer = ie.closest<HTMLElement>('[data-pagelet*="Composer"], [data-pagelet*="InlineComposer"]') || ie.parentElement;
    if (parentContainer && isElementVisible(parentContainer)) {
      return parentContainer;
    }
  }

  return null;
}

/**
 * Detects if Facebook is showing "This content isn't available right now" / Broken URL / Deleted group.
 */
function isFacebookPageUnavailable(): boolean {
  const bodyText = (document.body ? document.body.innerText : '').toLowerCase();
  const title = (document.title || '').toLowerCase();
  const currentUrl = window.location.href.toLowerCase();

  return (
    currentUrl.includes('/groups/grp_') ||
    bodyText.includes("this content isn't available right now") ||
    bodyText.includes("this content isn't available") ||
    bodyText.includes("content isn't available right now") ||
    bodyText.includes("the link you followed may be broken") ||
    bodyText.includes("page may have been removed") ||
    bodyText.includes("এই কন্টেন্টটি এখন উপলব্ধ নয়") ||
    bodyText.includes("এই লিঙ্কটি হয়তো ত্রুটিপূর্ণ") ||
    title.includes("page not found") ||
    title.includes("content not found") ||
    Boolean(document.querySelector('[role="main"] [aria-label*="Go to Feed" i], [role="main"] a[href="/"][role="button"]'))
  );
}

/**
 * Clicks the composer trigger and waits for the dialog to open.
 * Dispatches Touch, Pointer, and Mouse events.
 * Strictly prevents opening cover photos or media viewer.
 */
async function openComposerModal(): Promise<HTMLElement | null> {
  if (isFacebookPageUnavailable()) return null;

  // 0. If Facebook photo viewer / theater is currently open, close it immediately!
  await closePhotoViewerIfOpen();

  let dialog = findOpenPostDialog();
  if (dialog) return dialog;

  // 1. First attempt to find trigger immediately
  let trigger = findComposerTrigger();

  if (!trigger) {
    // Scroll to the very top to ensure composer card is in view
    window.scrollTo({ top: 0, behavior: 'instant' });
    await sleep(200);
    dialog = findOpenPostDialog();
    if (dialog) return dialog;
    trigger = findComposerTrigger();
  }

  if (!trigger) {
    // If not found, switch to Discussion tab (crucial for Buy & Sell groups!)
    trySwitchToDiscussionTab();
    await sleep(350);
    dialog = findOpenPostDialog();
    if (dialog) return dialog;
    trigger = findComposerTrigger();
  }

  if (!trigger) {
    // Scroll down slightly (350px) past the cover photo to trigger lazy rendering of composer
    window.scrollTo({ top: 350, behavior: 'instant' });
    await sleep(200);
    dialog = findOpenPostDialog();
    if (dialog) return dialog;
    trigger = findComposerTrigger();
  }

  if (!trigger) {
    // Reactive polling (up to 5.5s)
    const triggerStart = Date.now();
    while (Date.now() - triggerStart < 5500) {
      dialog = findOpenPostDialog();
      if (dialog) return dialog;
      trigger = findComposerTrigger();
      if (trigger) break;
      await sleep(30);
    }
  }

  if (!trigger) {
    console.log('[AGP:AutoPost] Composer trigger not found on page.');
    return null;
  }

  trigger.scrollIntoView({ behavior: 'instant', block: 'center' });
  await sleep(40);

  // Touch & Mouse dispatch for mobile Kiwi & touch screens
  try {
    trigger.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, cancelable: true }));
    trigger.dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true }));
  } catch (_) {}

  trigger.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
  trigger.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
  trigger.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
  trigger.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
  trigger.click();

  // Also click any direct child span or div if trigger is a wrapper
  const innerTarget = trigger.querySelector<HTMLElement>('span, div');
  if (innerTarget && innerTarget !== trigger && !isComposerBlacklisted(innerTarget)) {
    try {
      innerTarget.click();
    } catch (_) {}
  }

  // Poll for dialog opening (up to 5.5s)
  const start = Date.now();
  while (Date.now() - start < 5500) {
    dialog = findOpenPostDialog();
    if (dialog) return dialog;
    await sleep(25);
  }

  // Check if accidental photo viewer opened anyway, and close it immediately
  if (await closePhotoViewerIfOpen()) {
    console.warn('[AGP:AutoPost] Accidental photo viewer closed.');
  }

  return null;
}

/**
 * Injects caption text strictly into the Create Post modal's Lexical editor.
 * Guarantees 100% exact user formatting and design:
 * - Line breaks (\n) and empty spacer lines are fully preserved without collapsing
 * - Uses Main World Bridge (DataTransfer with text/plain + text/html paragraphs)
 * - Uses non-breaking space (\u00A0) for blank lines in keystroke fallback so Facebook never collapses them
 * - Bullet points, emojis, phone numbers, Bengali & English text stay exactly on their respective lines
 * - Always copies to system clipboard so user can manual Ctrl+V anytime if needed
 */
async function injectCaptionIntoEditor(dialog: HTMLElement, rawCaptionText: string): Promise<boolean> {
  if (!rawCaptionText || !rawCaptionText.trim()) return true;

  // Resolve spintax, deduplicate any repeated content, and normalize line endings
  const captionText = deduplicateRepeatedCaption(resolveSpintax(rawCaptionText))
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  const lines = captionText.split('\n');

  // Copy to system clipboard in parallel background (non-blocking for ultra-fast typing speed)
  copyRichText(captionText.trim(), convertToRichHtml(captionText)).catch(() => {});

  let editor: HTMLElement | null = null;
  const start = Date.now();

  const editorSelectors = [
    'div[role="textbox"][contenteditable="true"]',
    'div[data-lexical-editor="true"][contenteditable="true"]',
    'div[contenteditable="true"]:not([aria-label*="comment" i]):not([aria-label*="মন্তব্য" i])',
    'div[data-editor="true"]',
    'div[aria-label*="Create a public post" i][contenteditable="true"]',
    'div[aria-label*="Write something" i][contenteditable="true"]',
    'div[aria-label*="কিছু লিখুন" i][contenteditable="true"]',
    'div[aria-label*="পাবলিক পোস্ট" i][contenteditable="true"]',
    'div[aria-placeholder*="Create a public post" i]',
    'div[aria-placeholder*="Write something" i]',
  ];

  while (Date.now() - start < 4000) {
    for (const sel of editorSelectors) {
      const candidate = dialog.querySelector<HTMLElement>(sel) || document.querySelector<HTMLElement>(`[role="dialog"] ${sel}`);
      if (candidate && isElementVisible(candidate)) {
        editor = candidate;
        break;
      }
    }
    if (editor) break;
    await sleep(10);
  }

  if (!editor) {
    console.warn('[AGP:AutoPost] Create post editor not found inside modal.');
    return false;
  }

  // Guard: If editor already has this caption (or >= 70% match), do NOT inject again!
  const currentInitialText = (editor.textContent || '').trim();
  const captionSnippet = captionText.trim().slice(0, 30);
  if (currentInitialText.length >= captionText.trim().length * 0.7 && (!captionSnippet || currentInitialText.includes(captionSnippet))) {
    console.log('[AGP:AutoPost] Editor already contains caption. Skipping duplicate injection.');
    return true;
  }

  // 1. Focus editor and position cursor
  editor.scrollIntoView({ behavior: 'instant', block: 'center' });
  window.focus();
  editor.focus();

  // Dispatch full pointer and mouse sequence to simulate physical user click
  const mouseOpts = { bubbles: true, cancelable: true, view: window };
  editor.dispatchEvent(new PointerEvent('pointerdown', mouseOpts));
  editor.dispatchEvent(new MouseEvent('mousedown', mouseOpts));
  editor.dispatchEvent(new PointerEvent('pointerup', mouseOpts));
  editor.dispatchEvent(new MouseEvent('mouseup', mouseOpts));
  editor.dispatchEvent(new MouseEvent('click', mouseOpts));
  editor.dispatchEvent(new FocusEvent('focus', { bubbles: false }));
  editor.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));

  // Strategy 1: Try MAIN world bridge (runs with full page JS/Lexical access)
  try {
    const messageId = 'agp_inj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    const mainWorldPromise = new Promise<boolean>((resolve) => {
      const handler = (event: MessageEvent) => {
        if (
          event.data &&
          event.data.type === 'AGP_MAIN_INJECT_CAPTION_RESPONSE' &&
          event.data.messageId === messageId
        ) {
          window.removeEventListener('message', handler);
          resolve(Boolean(event.data.success));
        }
      };
      window.addEventListener('message', handler);
      setTimeout(() => {
        window.removeEventListener('message', handler);
        resolve(false);
      }, 250);
    });

    window.postMessage({
      type: 'AGP_MAIN_INJECT_CAPTION',
      messageId,
      caption: captionText,
    }, '*');

    const mainWorldOk = await mainWorldPromise;
    if (mainWorldOk) {
      console.log('[AGP:AutoPost] MAIN world injection succeeded with exact layout!');
      const textNow = (editor.textContent || '').trim();
      if (textNow.length > 0) return true;
    }
  } catch (bridgeErr) {
    console.warn('[AGP:AutoPost] MAIN world bridge error, using direct content injection:', bridgeErr);
  }

  // Guard: Before running Strategy 2, check if Strategy 1 already succeeded in populating editor!
  const textAfterBridge = (editor.textContent || '').trim();
  if (textAfterBridge.length >= captionText.trim().length * 0.7 && (!captionSnippet || textAfterBridge.includes(captionSnippet))) {
    console.log('[AGP:AutoPost] Editor already populated by bridge. Skipping fallback Strategy 2.');
    return true;
  }

  // Clear any existing / leftover text completely to ensure fresh clean insertion
  const selection = window.getSelection();
  if (selection) {
    const range = document.createRange();
    range.selectNodeContents(editor);
    selection.removeAllRanges();
    selection.addRange(range);
    editor.dispatchEvent(new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'deleteContentBackward',
    }));
  }
  document.execCommand('selectAll', false);
  document.execCommand('delete', false);
  await sleep(10);

  // Select inner paragraph or editor
  const p = editor.querySelector('p') || editor;
  p.dispatchEvent(new MouseEvent('mousedown', mouseOpts));
  p.dispatchEvent(new MouseEvent('mouseup', mouseOpts));
  p.click();

  if (selection) {
    const range = document.createRange();
    if (p.childNodes.length > 0) {
      range.setStart(p, 0);
      range.setEnd(p, p.childNodes.length);
    } else {
      range.selectNodeContents(p);
    }
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  document.dispatchEvent(new Event('selectionchange'));

  let injectionSuccess = false;

  // Prepare rich multi-line HTML preserving all paragraphs, bullets, and styled formatting
  const htmlParagraphs = convertToRichHtml(captionText);

  // Strategy 2: Native Paste Event with DataTransfer (text/plain + text/html)
  try {
    const dt = new DataTransfer();
    dt.setData('text/plain', captionText);
    dt.setData('text/html', htmlParagraphs);

    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: dt,
    });
    editor.dispatchEvent(pasteEvent);

    await sleep(20);

    let textNow = (editor.textContent || '').trim();
    // Only if pasteEvent was completely ignored, fallback to beforeinput
    if (!textNow || textNow.length < 5) {
      editor.dispatchEvent(new InputEvent('beforeinput', {
        bubbles: true,
        cancelable: true,
        inputType: 'insertFromPaste',
        dataTransfer: dt,
      }));
      await sleep(15);
      textNow = (editor.textContent || '').trim();
    }

    // Fallback: document.execCommand insertHTML
    if (!textNow || textNow.length < 5) {
      try {
        document.execCommand('insertHTML', false, htmlParagraphs);
        await sleep(15);
        textNow = (editor.textContent || '').trim();
      } catch (_) {}
    }

    const blockElements = editor.querySelectorAll('p, h1, h2, h3, ul, ol, li, blockquote');
    const hasRichBlocks = editor.querySelectorAll('h1, h2, ul, ol, blockquote').length > 0;
    if (textNow.length > 0 && (!captionText.includes('\n') || blockElements.length > 1 || hasRichBlocks || textNow.length >= captionText.trim().length * 0.4)) {
      console.log('[AGP:AutoPost] Direct Native Paste event succeeded. Block count:', blockElements.length);
      injectionSuccess = true;
    }
  } catch (err) {
    console.warn('[AGP:AutoPost] Native paste event error:', err);
  }

  // Strategy 3: Keystroke simulation with non-collapsing empty spacer lines (\u00A0)
  if (!injectionSuccess) {
    try {
      console.log('[AGP:AutoPost] Trying Strategy 3: Line-by-line Enter keystrokes with non-collapsing spacing...');
      document.execCommand('selectAll', false);
      document.execCommand('delete', false);
      await sleep(10);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const isLast = i === lines.length - 1;

        if (line.length > 0) {
          document.execCommand('insertText', false, line);
        } else {
          // CRITICAL: Non-breaking space ensures empty spacer line / paragraph NEVER collapses in Facebook!
          document.execCommand('insertText', false, '\u00A0');
        }

        if (!isLast) {
          editor.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
            cancelable: true,
          }));

          editor.dispatchEvent(new InputEvent('beforeinput', {
            inputType: 'insertParagraph',
            bubbles: true,
            cancelable: true,
          }));

          document.execCommand('insertParagraph', false);

          editor.dispatchEvent(new InputEvent('input', {
            inputType: 'insertParagraph',
            bubbles: true,
          }));

          editor.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true,
          }));
        }
      }

      await sleep(15);
      const textNow = (editor.textContent || '').trim();
      if (textNow.length > 0) {
        console.log('[AGP:AutoPost] Strategy 3 succeeded.');
        injectionSuccess = true;
      }
    } catch (err) {
      console.warn('[AGP:AutoPost] Strategy 3 error:', err);
    }
  }

  // Notify Lexical, React, and DOM of state change
  editor.dispatchEvent(new Event('input', { bubbles: true }));
  editor.dispatchEvent(new Event('change', { bubbles: true }));
  document.dispatchEvent(new Event('selectionchange'));

  await sleep(15);

  const verifiedText = (editor.textContent || '').trim();
  return verifiedText.length > 0;
}

/**
 * Finds the green Photo/Video trigger button inside Facebook Create Post modal.
 */
function findPhotoButton(dialog: HTMLElement): HTMLElement | null {
  // Strategy 1: ARIA labels on button/div (including photo, video, and bilingual variants)
  const photoBtn = dialog.querySelector<HTMLElement>(
    '[aria-label*="Photo/video" i], [aria-label*="Photo / video" i], [aria-label*="Add photo" i], [aria-label*="Add Photos" i], [aria-label*="Add photos or videos" i], [aria-label*="Add video" i], [aria-label*="Add Photos/videos" i], [aria-label*="ফটো/ভিডিও" i], [aria-label*="Photo" i], [aria-label*="Video" i], [aria-label*="ছবি/ভিডিও" i], [aria-label*="ছবি" i], [aria-label*="ভিডিও" i], div[aria-label*="Photo" i], div[aria-label*="Video" i], div[aria-label*="ফটো" i], div[aria-label*="ভিডিও" i]'
  );
  if (photoBtn && isElementVisible(photoBtn)) return photoBtn;

  // Strategy 2: Image or SVG with photo/video icon inside "Add to your post" section
  const allClickables = Array.from(dialog.querySelectorAll<HTMLElement>('[role="button"], button, div[tabindex="0"]'));
  for (const el of allClickables) {
    const aria = (el.getAttribute('aria-label') || '').toLowerCase();
    if (
      aria.includes('photo') ||
      aria.includes('video') ||
      aria.includes('image') ||
      aria.includes('ফটো') ||
      aria.includes('ছবি') ||
      aria.includes('ভিডিও')
    ) {
      if (isElementVisible(el)) return el;
    }
  }

  // Strategy 3: Find "Add to your post" container and take the first action button
  const addToPostLabels = Array.from(dialog.querySelectorAll<HTMLElement>('span, div, p'));
  for (const lbl of addToPostLabels) {
    const txt = (lbl.textContent || '').trim().toLowerCase();
    if (txt === 'add to your post' || txt === 'আপনার পোস্টে যোগ করুন' || txt.includes('add to your post')) {
      const parent = lbl.closest('div');
      const row = parent?.parentElement || parent;
      const firstBtn = row?.querySelector<HTMLElement>('[role="button"], img, svg');
      if (firstBtn && isElementVisible(firstBtn)) {
        return firstBtn.closest('[role="button"]') || firstBtn;
      }
    }
  }

  return null;
}

/**
 * Finds the file input inside the Create Post dialog or active document modal.
 * Supports both video and image file inputs.
 */
function findFileInput(dialog: HTMLElement): HTMLInputElement | null {
  return (
    dialog.querySelector<HTMLInputElement>('input[type="file"][accept*="video"]') ||
    dialog.querySelector<HTMLInputElement>('input[type="file"][accept*="image"]') ||
    dialog.querySelector<HTMLInputElement>('input[type="file"]') ||
    document.querySelector<HTMLInputElement>('[role="dialog"] input[type="file"]') ||
    document.querySelector<HTMLInputElement>('input[type="file"]')
  );
}

/**
 * Checks if Facebook Create Post dialog is displaying a file upload error banner.
 * Detects English, Bengali, and generic variants (e.g. "Your file can't be uploaded").
 */
function checkForUploadError(dialog: HTMLElement): string | null {
  const text = (dialog.textContent || '').toLowerCase();
  if (
    text.includes("your file can't be uploaded") ||
    text.includes("file can't be uploaded") ||
    text.includes("আপলোড করা যাবে না") ||
    text.includes("আপলোড করা যায়নি") ||
    text.includes("couldn't be uploaded") ||
    text.includes("error uploading")
  ) {
    const errorEl = Array.from(dialog.querySelectorAll<HTMLElement>('span, div, p')).find(el => {
      const t = (el.textContent || '').toLowerCase();
      return (
        t.includes("your file can't be uploaded") ||
        t.includes("file can't be uploaded") ||
        t.includes("আপলোড করা যাবে না") ||
        t.includes("আপলোড করা যায়নি") ||
        t.includes("couldn't be uploaded")
      );
    });
    return errorEl?.textContent?.trim() || "Your file can't be uploaded";
  }
  return null;
}

/**
 * Attaches photos or videos strictly into the Create Post modal's file input.
 * Handles Data URLs, base64 strings, blob URLs, videos (MP4, WEBM, MOV).
 */
async function attachPhotosToDialog(dialog: HTMLElement, mediaList: string[]): Promise<boolean> {
  if (!mediaList || mediaList.length === 0) return true;

  const hasVideo = mediaList.some(
    m => m.includes('video') || m.includes('.mp4') || m.includes('.mov') || m.includes('.webm') || m.includes('data:video')
  );

  // 1. Look for existing file input
  let fileInput = findFileInput(dialog);

  // 2. If not mounted yet, find and click the Photo/Video button
  if (!fileInput) {
    const photoBtn = findPhotoButton(dialog);
    if (photoBtn) {
      photoBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
      photoBtn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
      photoBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      photoBtn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
      photoBtn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
      photoBtn.click();

      // Poll for file input (up to 2.5 seconds, check every 20ms)
      const pollStart = Date.now();
      while (Date.now() - pollStart < 2500) {
        fileInput = findFileInput(dialog);
        if (fileInput) break;
        await sleep(20);
      }
    }
  }

  if (!fileInput) {
    console.warn('[AGP:AutoPost] File input not found inside create post modal.');
    return false;
  }

  // 3. Prepare File objects in parallel via DataTransfer with exact video/photo extensions
  const dt = new DataTransfer();
  const preparedFiles = await Promise.all(
    mediaList.map((mediaItem, i) => mediaToFile(mediaItem, `media_${i + 1}`))
  );
  for (const file of preparedFiles) {
    if (file && file.size > 0) {
      dt.items.add(file);
      console.log(`[AGP:AutoPost] Prepared media file: ${file.name} (${file.type}, ${file.size} bytes)`);
    }
  }

  if (dt.files.length === 0) {
    console.warn('[AGP:AutoPost] No valid non-empty files prepared from mediaList.');
    return false;
  }

  // 4. Assign files and trigger React input reconciliation
  // NOTE: We dispatch change only on fileInput.
  // We do NOT dispatch a duplicate drop event on dropZone as doing both triggers
  // concurrent upload streams on Facebook which results in "Your file can't be uploaded".
  fileInput.files = dt.files;
  const tracker = (fileInput as any)._valueTracker;
  if (tracker) tracker.setValue('');

  fileInput.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
  fileInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));

  // 5. Wait for Facebook media preview to appear (break immediately as soon as preview is mounted!)
  const maxWait = hasVideo ? 12000 : 4000;
  const startWait = Date.now();
  while (Date.now() - startWait < maxWait) {
    const uploadErr = checkForUploadError(dialog);
    if (uploadErr) {
      console.warn('[AGP:AutoPost] Facebook upload error detected:', uploadErr);
      return false;
    }

    const hasMediaPreview = Boolean(
      dialog.querySelector(
        'video, img[src*="blob:"], img[src*="data:"], img[src*="fbcdn.net"], div[aria-label*="Video" i], div[aria-label*="Photo" i], div[data-pagelet*="MediaViewer"], div[aria-label*="Edit" i], button[aria-label*="Edit" i], div[aria-label*="Remove" i], div[role="button"][aria-label*="Edit" i]'
      )
    );

    if (hasMediaPreview) {
      console.log('[AGP:AutoPost] Media preview mounted immediately in composer.');
      break;
    }
    await sleep(10);
  }

  // Final check: did Facebook display an upload error?
  if (checkForUploadError(dialog)) {
    return false;
  }

  return true;
}

// Alias for semantic clarity
const attachMediaToDialog = attachPhotosToDialog;

/**
 * Checks if text or aria-label indicates user is already a member / joined.
 */
function isAlreadyJoinedIndicator(txt: string, aria: string): boolean {
  return (
    txt.includes('joined') ||
    txt.includes('যোগ দিয়েছেন') ||
    txt.includes('মেম্বার') ||
    txt.includes('member') ||
    txt.includes('leave group') ||
    txt.includes('গ্রুপ ত্যাগ') ||
    aria.includes('joined') ||
    aria.includes('যোগ দিয়েছেন') ||
    aria.includes('member')
  );
}

/**
 * Finds the "Join Group" or "Request to Join" button on Facebook group page.
 * Supports English, Bengali, Hindi, and modern Facebook DOM structures.
 */
function findJoinGroupButton(): HTMLElement | null {
  // 1. Precise ARIA label selectors
  const ariaSelectors = [
    '[aria-label*="Join group" i]',
    '[aria-label*="Join Group" i]',
    '[aria-label*="গ্রুপে যোগ দিন" i]',
    '[aria-label*="যোগ দিন" i]',
    '[aria-label*="গ্রুপে যুক্ত হন" i]',
    '[aria-label*="Request to join" i]',
    '[aria-label*="Request to Join" i]',
    '[aria-label*="গ্রুপে যোগ দেওয়ার অনুরোধ" i]',
    '[aria-label*="যোগ দেওয়ার অনুরোধ" i]',
    '[aria-label*="গ্রুপে যোগদানের অনুরোধ" i]',
    'div[role="button"][aria-label*="Join" i]',
    'div[role="button"][aria-label*="যোগ" i]',
    'button[aria-label*="Join" i]',
    'button[aria-label*="যোগ" i]',
  ];

  for (const sel of ariaSelectors) {
    const candidate = document.querySelector<HTMLElement>(sel);
    if (candidate && isElementVisible(candidate)) {
      const txt = (candidate.innerText || candidate.textContent || '').trim().toLowerCase();
      const aria = (candidate.getAttribute('aria-label') || '').toLowerCase();
      if (!isAlreadyJoinedIndicator(txt, aria)) {
        return candidate;
      }
    }
  }

  // 2. Scan buttons and role="button" elements inside header/action areas
  const buttons = Array.from(
    document.querySelectorAll<HTMLElement>(
      'div[role="main"] [role="button"], div[role="main"] button, div[role="region"] [role="button"], [role="banner"] [role="button"], div[role="button"], button'
    )
  );

  for (const btn of buttons) {
    if (!isElementVisible(btn)) continue;
    const txt = (btn.innerText || btn.textContent || '').trim().toLowerCase();
    const aria = (btn.getAttribute('aria-label') || '').toLowerCase();

    if (isAlreadyJoinedIndicator(txt, aria)) continue;

    if (
      txt === 'join group' ||
      txt === 'join' ||
      txt === 'গ্রুপে যোগ দিন' ||
      txt === 'যোগ দিন' ||
      txt === 'গ্রুপে যুক্ত হন' ||
      txt === 'request to join' ||
      txt === 'request to join group' ||
      txt === 'যোগ দেওয়ার অনুরোধ' ||
      txt === 'যোগ দেওয়ার অনুরোধ জানান' ||
      txt.includes('join group') ||
      txt.includes('গ্রুপে যোগ দিন')
    ) {
      return btn;
    }
  }

  return null;
}

/**
 * Detects if current user is not a member of the group (needs to join first).
 */
function isUserNotMemberOfGroup(): boolean {
  const hasJoinBtn = Boolean(findJoinGroupButton());
  const hasComposer = Boolean(findComposerTrigger());
  return hasJoinBtn && !hasComposer;
}

/**
 * Automatically joins or sends a request to join a Facebook group.
 * Handles instant membership groups as well as rule acknowledgment/questionnaire modals.
 */
async function attemptAutoJoinGroup(): Promise<{ success: boolean; isInstantMember: boolean; reason: string }> {
  const joinBtn = findJoinGroupButton();
  if (!joinBtn) {
    return { success: false, isInstantMember: false, reason: 'Join button not found' };
  }

  console.log('[AGP:AutoJoin] Found Join button. Executing automatic join click...');
  autoPostStatus = '⚡ Auto-joining group (গ্রুপে যোগ দেওয়া হচ্ছে)...';
  renderHelperPanel();
  showToast('⚡ Auto-joining group...', true);

  joinBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
  await sleep(10);

  // Dispatch full native click event sequence
  const mouseOpts = { bubbles: true, cancelable: true, view: window };
  joinBtn.dispatchEvent(new PointerEvent('pointerdown', mouseOpts));
  joinBtn.dispatchEvent(new MouseEvent('mousedown', mouseOpts));
  joinBtn.dispatchEvent(new PointerEvent('pointerup', mouseOpts));
  joinBtn.dispatchEvent(new MouseEvent('mouseup', mouseOpts));
  joinBtn.click();

  // Rapidly poll up to 350ms (15ms checks) for modal or instant membership state update
  const waitModalStart = Date.now();
  let dialog: HTMLElement | null = null;
  while (Date.now() - waitModalStart < 350) {
    dialog = document.querySelector<HTMLElement>('div[role="dialog"]');
    if (dialog && isElementVisible(dialog)) break;
    const composerTrigger = findComposerTrigger();
    if (composerTrigger && isElementVisible(composerTrigger)) break;
    await sleep(15);
  }

  // Check if Facebook displayed a rules confirmation or questions dialog
  if (dialog && isElementVisible(dialog)) {
    console.log('[AGP:AutoJoin] Rules agreement or membership question dialog detected. Handling...');
    
    // Automatically check all rule agreement checkboxes (e.g. "I agree to group rules")
    const checkboxes = Array.from(dialog.querySelectorAll<HTMLElement>('input[type="checkbox"], div[role="checkbox"]'));
    for (const cb of checkboxes) {
      const isChecked = cb.getAttribute('aria-checked') === 'true' || (cb as HTMLInputElement).checked;
      if (!isChecked) {
        cb.click();
      }
    }

    // Fill any required question textareas if empty
    const inputs = Array.from(dialog.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('textarea, input[type="text"]'));
    for (const inp of inputs) {
      if (!inp.value || !inp.value.trim()) {
        inp.value = 'Agree';
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    // Look for submit / agree button
    const submitBtn = Array.from(dialog.querySelectorAll<HTMLElement>('button, [role="button"], input[type="submit"]')).find(b => {
      const t = (b.innerText || b.textContent || b.getAttribute('aria-label') || '').trim().toLowerCase();
      return (
        t === 'submit' ||
        t === 'send' ||
        t === 'agree' ||
        t === 'confirm' ||
        t === 'সাবমিট' ||
        t === 'জমা দিন' ||
        t === 'সম্মতি দিচ্ছি' ||
        t.includes('submit') ||
        t.includes('সাবমিট')
      );
    });

    if (submitBtn && isElementVisible(submitBtn)) {
      console.log('[AGP:AutoJoin] Clicking modal submit button...');
      submitBtn.click();
      const waitSubmit = Date.now();
      while (Date.now() - waitSubmit < 600) {
        if (!document.querySelector('div[role="dialog"]')) break;
        await sleep(20);
      }
    }
  }

  // Rapidly poll up to 3500ms for composer or joined indicator, with slight scroll down to ensure composer is rendered
  const startCheck = Date.now();
  while (Date.now() - startCheck < 3500) {
    let composerTrigger = findComposerTrigger();
    if (composerTrigger && isElementVisible(composerTrigger)) {
      console.log('[AGP:AutoJoin] Instant membership granted! Composer available.');
      showToast('✅ Joined group! Post box ready.', true);
      return { success: true, isInstantMember: true, reason: 'Instant member' };
    }
    // Try scrolling down slightly in case composer is below the cover photo
    if (Date.now() - startCheck > 1000 && window.scrollY < 200) {
      window.scrollBy({ top: 300, behavior: 'instant' });
    }
    await sleep(25);
  }

  // Check if request was successfully sent and is pending admin review
  const bodyText = (document.body ? document.body.innerText : '').toLowerCase();
  const isPending =
    bodyText.includes('requested') ||
    bodyText.includes('pending') ||
    bodyText.includes('অনুরোধ করা হয়েছে') ||
    bodyText.includes('cancel request') ||
    bodyText.includes('অনুরোধ বাতিল');

  if (isPending) {
    console.log('[AGP:AutoJoin] Join request sent (Pending admin approval).');
    return { success: true, isInstantMember: false, reason: 'Join request pending admin approval' };
  }

  // Check if composer is available or button indicates joined
  const finalComposer = findComposerTrigger();
  if (finalComposer) {
    return { success: true, isInstantMember: true, reason: 'Instant member' };
  }

  // If join button is no longer present, assume join succeeded and proceed to post
  if (!findJoinGroupButton()) {
    console.log('[AGP:AutoJoin] Join button disappeared. Group is joined, proceeding to post...');
    return { success: true, isInstantMember: true, reason: 'Instant member' };
  }

  return { success: true, isInstantMember: false, reason: 'Join submitted' };
}

/**
 * Detects if posting is blocked, restricted, or forbidden in this Facebook group.
 */
function isPostingForbiddenOrRestricted(): { forbidden: boolean; reason: string } {
  if (isFacebookPageUnavailable()) {
    return { forbidden: true, reason: 'Group unavailable or broken link' };
  }

  const bodyText = (document.body ? document.body.innerText : '').toLowerCase();

  // Check for admin-only posting or group posting turned off
  if (
    bodyText.includes('only admins can post') ||
    bodyText.includes('শুধুমাত্র অ্যাডমিনরা এই গ্রুপে পোস্ট করতে পারবেন') ||
    bodyText.includes('শুধুমাত্র অ্যাডমিনরা পোস্ট করতে পারবেন') ||
    bodyText.includes('posting is paused for this group') ||
    bodyText.includes('posting is turned off') ||
    bodyText.includes('এই গ্রুপের জন্য পোস্ট করা সাময়িকভাবে বন্ধ আছে') ||
    bodyText.includes('posting in this group has been paused')
  ) {
    return { forbidden: true, reason: 'Posting is paused or admin-only in this group' };
  }

  // Check for account restrictions / bans in group
  if (
    bodyText.includes("you can't post to this group") ||
    bodyText.includes("you've been temporarily blocked") ||
    bodyText.includes("you have been muted") ||
    bodyText.includes("আপনার অ্যাকাউন্ট সাময়িকভাবে ব্লক করা হয়েছে") ||
    bodyText.includes("আপনাকে এই গ্রুপে পোস্ট করা থেকে সাময়িকভাবে নিষিদ্ধ করা হয়েছে")
  ) {
    return { forbidden: true, reason: 'Account restricted or muted in this group' };
  }

  return { forbidden: false, reason: '' };
}

let isSkipping = false;

// Safe helper for composer dialog cleanup (no-op to prevent aborting in-flight posts)
function closePostDialogIfOpen() {}

/**
 * Resiliently auto-skips the current group and advances the queue automatically without stopping.
 */
async function autoSkipCurrentGroup(reason: string) {
  if (isSkipping || !activePayload?.queueItem) return;
  isSkipping = true;
  isAutoPosting = false;

  if (autoPostTimer) {
    clearInterval(autoPostTimer);
    autoPostTimer = null;
  }

  try { window.onbeforeunload = null; } catch (_) {}

  console.warn(`[AGP:AutoPost] Auto-skipping group: ${reason}`);
  autoPostStatus = `⚡ Auto-skipping: ${reason}...`;
  renderHelperPanel();
  showToast(`⚡ Auto-skipping: ${reason}...`, true);

  await sleep(200);

  chrome.runtime.sendMessage({
    type: 'SKIP_CURRENT_ITEM',
    payload: {
      itemId: activePayload.queueItem.id,
      reason,
    },
  });
}

/**
 * Finds and clicks Facebook's blue "Post" button strictly inside the Create Post modal.
 * Also handles groups requiring admin approval where button is labeled "Submit" / "সাবমিট".
 */
async function findAndClickPostButton(dialog: HTMLElement, timeoutMs = 15000): Promise<boolean> {
  const start = Date.now();
  let lastStatusUpdate = 0;
  while (Date.now() - start < timeoutMs) {
    const dialogs = [dialog, ...Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"]'))];
    for (const d of dialogs) {
      const buttons = Array.from(d.querySelectorAll<HTMLElement>('[role="button"], button'));
      for (const btn of buttons) {
        const aria = (btn.getAttribute('aria-label') || '').toLowerCase().trim();
        const txt = (btn.textContent || '').toLowerCase().trim();
        const disabledAttr = btn.getAttribute('aria-disabled') === 'true' ||
                             (btn as HTMLButtonElement).disabled ||
                             btn.classList.contains('aria-disabled') ||
                             btn.classList.contains('disabled');

        const isPostMatch =
          aria === 'post' ||
          aria === 'publish' ||
          aria === 'submit' ||
          aria === 'submit for review' ||
          aria === 'পোস্ট' ||
          aria === 'সাবমিট' ||
          aria === 'পোস্ট করুন' ||
          aria === 'সাবমিট করুন' ||
          aria.includes('post to group') ||
          aria.includes('গ্রুপে পোস্ট') ||
          aria.includes('submit for review') ||
          aria.includes('রিভিউ') ||
          txt === 'post' ||
          txt === 'পোস্ট' ||
          txt === 'publish' ||
          txt === 'submit' ||
          txt === 'submit for review' ||
          txt === 'পোস্ট করুন' ||
          txt === 'সাবমিট' ||
          txt === 'সাবমিট করুন' ||
          txt === 'post to group' ||
          txt === 'পাবলিশ' ||
          txt.includes('submit for review') ||
          txt.includes('রিভিউয়ের জন্য সাবমিট');

        if (isPostMatch && !disabledAttr) {
          btn.scrollIntoView({ behavior: 'instant', block: 'center' });
          btn.style.outline = '3px solid #10b981';
          btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
          btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
          btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true }));
          btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
          btn.click();
          return true;
        }
      }
    }

    if (Date.now() - lastStatusUpdate > 2500) {
      lastStatusUpdate = Date.now();
      const elapsedSec = Math.round((Date.now() - start) / 1000);
      if (elapsedSec >= 4) {
        autoPostStatus = `⚡ Step 4/4: Media processing & uploading (${elapsedSec}s)...`;
        renderHelperPanel();
      }
    }

    await sleep(20);
  }
  return false;
}

/**
 * Main automated routine that executes end-to-end posting and advances to next group.
 * Automatically skips groups where posting is impossible without stopping the queue.
 */
async function runAutomatedPostingRoutine() {
  if (isAutoPosting || !activePayload || !activePayload.queueItem) return;

  // 0. Check if Facebook page is broken or unavailable
  if (isFacebookPageUnavailable()) {
    await autoSkipCurrentGroup('Group unavailable on Facebook');
    return;
  }

  // Check if wrong group detected
  if (!activePayload.isGroupMatch) {
    await autoSkipCurrentGroup('Wrong group URL detected');
    return;
  }

  // 1. Check if user is not a member of the group: AUTO-JOIN!
  if (isUserNotMemberOfGroup() || findJoinGroupButton()) {
    isAutoPosting = true;
    autoPostStatus = '⚡ Step 0/4: Auto-joining group (গ্রুপে যোগ দেওয়া হচ্ছে)...';
    renderHelperPanel();
    showToast('⚡ Auto-joining group...', true);

    const joinResult = await attemptAutoJoinGroup();
    if (joinResult.isInstantMember) {
      console.log('[AGP:AutoPost] Successfully auto-joined group! Proceeding with post immediately...');
      autoPostStatus = '⚡ Joined! Step 1/4: Opening Post Box...';
      renderHelperPanel();
      showToast('✅ Joined! Now opening post box...', true);
      // Proceed immediately to post without dead delay
    } else {
      // Pending admin approval or join request submitted
      autoPostStatus = `⚡ ${joinResult.reason}. Advancing to next group...`;
      renderHelperPanel();
      showToast(`⚡ ${joinResult.reason}`, true);
      await sleep(100);
      await autoSkipCurrentGroup(joinResult.reason);
      return;
    }
  }

  // Pre-check for posting restrictions (admin-only, banned, muted)
  const restriction = isPostingForbiddenOrRestricted();
  if (restriction.forbidden) {
    await autoSkipCurrentGroup(restriction.reason);
    return;
  }

  isAutoPosting = true;
  autoPostStatus = '⚡ Step 1/4: Opening Post Box...';
  renderHelperPanel();

  try {
    // 1. Open Facebook composer modal
    const dialog = await openComposerModal();
    if (!dialog) {
      if (isFacebookPageUnavailable()) {
        await autoSkipCurrentGroup('Group unavailable on Facebook');
        return;
      }
      await autoSkipCurrentGroup('Could not open Facebook post box');
      return;
    }

    // 2. Inject caption
    autoPostStatus = '⚡ Step 2/4: Typing caption...';
    renderHelperPanel();
    const caption = activePayload.caption || activePayload.formattedPost || '';
    if (caption && caption.trim()) {
      const injected = await injectCaptionIntoEditor(dialog, caption);
      if (!injected) {
        console.warn('[AGP:AutoPost] Caption injection check returned false, but clipboard has caption. Proceeding to photos...');
        showToast('⚠️ Caption in clipboard (Ctrl+V ready)');
      }
    }

    // 3. Attach media (photos or videos) if present
    const media = activePayload.media || [];
    const hasVideo = media.some(
      m => m.includes('video') || m.includes('.mp4') || m.includes('.mov') || m.includes('.webm') || m.includes('data:video')
    );
    const photoCount = media.filter(
      m => !m.includes('video') && !m.includes('.mp4') && !m.includes('.mov') && !m.includes('.webm') && !m.includes('data:video')
    ).length;
    const videoCount = media.length - photoCount;

    if (media.length > 0) {
      let mediaLabel = `${media.length} files`;
      if (photoCount > 0 && videoCount > 0) {
        mediaLabel = `${photoCount} photos + ${videoCount} video`;
      } else if (videoCount > 0) {
        mediaLabel = `${videoCount} video`;
      } else {
        mediaLabel = `${photoCount} photos`;
      }
      autoPostStatus = `⚡ Step 3/4: Attaching ${mediaLabel}...`;
      renderHelperPanel();
      const attached = await attachPhotosToDialog(dialog, media);
      if (!attached) {
        const uploadErr = checkForUploadError(dialog);
        if (uploadErr) {
          console.warn('[AGP:AutoPost] Upload rejected by Facebook:', uploadErr);
          autoPostStatus = `❌ Upload failed: ${uploadErr}`;
          renderHelperPanel();
          await autoSkipCurrentGroup(`Media rejected by Facebook: ${uploadErr}`);
          return;
        }
        console.warn('[AGP:AutoPost] Media attachment warning - continuing post workflow');
      }
    }

    // 4. Click Submit Post button INSTANTLY as soon as ready!
    autoPostStatus = hasVideo
      ? '⚡ Step 4/4: Video uploading & submitting post... (ভিডিও আপলোড হচ্ছে)'
      : '⚡ Step 4/4: Submitting post...';
    renderHelperPanel();
    const timeout = hasVideo ? 90000 : 20000;
    const clicked = await findAndClickPostButton(dialog, timeout);
    if (!clicked) {
      const uploadErr = checkForUploadError(dialog);
      if (uploadErr) {
        await autoSkipCurrentGroup(`Facebook upload error: ${uploadErr}`);
      } else {
        await autoSkipCurrentGroup('Post button disabled or timed out');
      }
      return;
    }

    // 5. Success! Wait for submission to process and modal to close
    autoPostStatus = '⚡ Post submitted! Shifting to next group...';
    renderHelperPanel();

    const subStart = Date.now();
    let postFinished = false;
    const maxWaitMs = hasVideo ? 25000 : 3500;

    while (Date.now() - subStart < maxWaitMs) {
      const currentDialog = findOpenPostDialog();

      // If the post modal is closed, submission has succeeded!
      if (!currentDialog) {
        console.log('[AGP:AutoPost] Composer dialog closed cleanly. Post submitted successfully!');
        postFinished = true;
        break;
      }

      // Check for Facebook upload error during submit
      const uploadErr = checkForUploadError(currentDialog);
      if (uploadErr) {
        console.warn('[AGP:AutoPost] Post aborted due to Facebook file error:', uploadErr);
        autoPostStatus = `❌ Upload error: ${uploadErr}`;
        renderHelperPanel();
        await autoSkipCurrentGroup(`Facebook upload error: ${uploadErr}`);
        return;
      }

      // Check if admin approval dialog or pending review confirmation appeared
      const allDialogs = Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"]'));
      for (const d of allDialogs) {
        const dText = (d.textContent || '').toLowerCase();
        if (
          dText.includes('pending') ||
          dText.includes('approval') ||
          dText.includes('admin') ||
          dText.includes('অনুমোদনের অপেক্ষায়') ||
          dText.includes('অনুমোদন') ||
          dText.includes('সাবমিট করা হয়েছে') ||
          dText.includes('আপনার পোস্টটি জমা দেওয়া হয়েছে')
        ) {
          const okBtn = Array.from(d.querySelectorAll<HTMLElement>('[role="button"], button')).find(b => {
            const t = (b.textContent || '').toLowerCase().trim();
            return t === 'done' || t === 'ok' || t === 'ঠিক আছে' || t === 'close' || t === 'বন্ধ করুন' || t === 'got it';
          });
          if (okBtn) {
            okBtn.click();
            postFinished = true;
            break;
          }
        }
      }

      if (postFinished) break;
      await sleep(10);
    }

    // Verify if submission actually succeeded
    if (!postFinished) {
      const remainingDialog = findOpenPostDialog();
      if (remainingDialog) {
        const uploadErr = checkForUploadError(remainingDialog);
        if (uploadErr) {
          console.warn('[AGP:AutoPost] Facebook upload error remained:', uploadErr);
          autoPostStatus = `❌ Upload failed: ${uploadErr}`;
          renderHelperPanel();
          await autoSkipCurrentGroup(`Facebook upload error: ${uploadErr}`);
          return;
        }

        const postBtnDisabled = Boolean(remainingDialog.querySelector('[aria-disabled="true"], button[disabled]'));
        if (postBtnDisabled) {
          console.warn('[AGP:AutoPost] Post button remained disabled after wait');
          autoPostStatus = '❌ Post button stayed disabled';
          renderHelperPanel();
          await autoSkipCurrentGroup('Post button disabled or upload blocked by Facebook');
          return;
        }
      }
    }

    try { window.onbeforeunload = null; } catch (_) {}

    autoPostStatus = '⚡ Post submitted! Moving to next group...';
    renderHelperPanel();

    const qIdx = activePayload.queueIndex;
    const total = activePayload.totalQueueItems;
    const posted = (activePayload.postedCount || (qIdx - 1)) + 1;
    showToast(`⚡ Auto-Posted to Group #${qIdx}! (${posted}/${total} done)`);

    // Advance queue via background service worker (which will automatically navigate/close this tab!)
    chrome.runtime.sendMessage({
      type: 'MARK_AS_POSTED',
      payload: { itemId: activePayload.queueItem.id },
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log('[AGP:AutoPost] Routine caught error, auto-skipping:', msg);
    await autoSkipCurrentGroup(msg || 'Posting failed');
  }
}

/**
 * Initiates hands-free auto-posting instantly when tab opens.
 * Auto-skips any group where posting cannot be done.
 */
function startAutoPostingCountdown() {
  if (autoPilotPaused || isAutoPosting || !activePayload?.queueItem) return;

  if (isFacebookPageUnavailable()) {
    autoPostStatus = '⚡ Group unavailable on Facebook. Auto-skipping...';
    renderHelperPanel();
    setTimeout(() => {
      autoSkipCurrentGroup('Group unavailable on Facebook');
    }, 10);
    return;
  }

  if (!activePayload.isGroupMatch) {
    autoPostStatus = `⚡ Wrong group detected. Auto-skipping to next group...`;
    renderHelperPanel();
    showToast('⚠️ Wrong group detected. Auto-skipping...', true);
    setTimeout(() => {
      if (!autoPilotPaused) {
        autoSkipCurrentGroup('Wrong group URL detected');
      }
    }, 20);
    return;
  }

  // If user is not joined to the group, do NOT skip! Launch auto-join & post routine!
  if (isUserNotMemberOfGroup() || findJoinGroupButton()) {
    autoPostStatus = '⚡ Not joined: Auto-joining group...';
    renderHelperPanel();
    showToast('⚡ Auto-joining group...', true);

    if (autoPostTimer) clearInterval(autoPostTimer);
    autoPostTimer = null;

    setTimeout(() => {
      if (!autoPilotPaused && !isAutoPosting) {
        runAutomatedPostingRoutine();
      }
    }, 0);
    return;
  }

  const restriction = isPostingForbiddenOrRestricted();
  if (restriction.forbidden) {
    autoPostStatus = `⚡ Cannot post: ${restriction.reason}. Auto-skipping...`;
    renderHelperPanel();
    setTimeout(() => {
      autoSkipCurrentGroup(restriction.reason);
    }, 20);
    return;
  }

  autoPostStatus = '⚡ Instant Auto-Posting in progress...';
  renderHelperPanel();

  if (autoPostTimer) clearInterval(autoPostTimer);
  autoPostTimer = null;

  // Immediately launch auto-posting without countdown waiting!
  setTimeout(() => {
    if (!autoPilotPaused && !isAutoPosting) {
      runAutomatedPostingRoutine();
    }
  }, 0);
}


/**
 * Builds the HTML content for the helper panel dock.
 */
function renderHelperPanel() {
  if (isWidgetDismissed || !shadowRoot) return;

  const pageInfo = detectCurrentFacebookPage();
  const userProfile = detectFacebookUserProfile();

  if (!pageInfo.isGroupPage) {
    const isRunning = Boolean(currentQueueState?.isRunning && !currentQueueState?.isPaused);
    const isPaused = Boolean(currentQueueState?.isPaused);
    const activeTabId = currentQueueState?.activeTabId;
    const currentGroupName = currentQueueState?.expectedGroupName || '';
    const progressCount = currentQueueStats?.completed || 0;
    const totalCount = currentQueueStats?.total || 0;
    const percent = totalCount > 0 ? Math.round((progressCount / totalCount) * 100) : 0;

    shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }
        .launcher-pill {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #18191a;
          color: #ffffff;
          padding: 10px 16px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.15);
          cursor: pointer;
          z-index: 2147483647;
          user-select: none;
          transition: all 0.2s ease;
        }
        .launcher-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.5);
          background: #242526;
        }
        .badge-logo {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 900;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(99,102,241,0.4);
        }
        .launcher-title {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        .status-pill {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .status-pill.running {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }
        .status-pill.ready {
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.4);
        }
        .status-pill.paused {
          background: rgba(245, 158, 11, 0.2);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.4);
        }
        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          animation: pulseDot 1.4s infinite;
        }
        .panel-root {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 360px;
          max-width: calc(100vw - 24px);
          max-height: calc(100vh - 32px);
          background: #18191a;
          color: #e4e6eb;
          border-radius: 16px;
          box-shadow: 0 16px 48px -4px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.12);
          z-index: 2147483647;
          overflow-y: auto;
          transition: transform 0.25s ease, opacity 0.2s ease;
        }
        @media (max-width: 480px) {
          .panel-root {
            bottom: 8px !important;
            right: 8px !important;
            left: 8px !important;
            width: auto !important;
            max-width: none !important;
            border-radius: 12px !important;
          }
          .launcher-pill {
            bottom: 12px !important;
            right: 12px !important;
          }
        }
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #242526;
          border-bottom: 1px solid #3a3b3c;
          user-select: none;
        }
        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          color: #ffffff;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .icon-btn {
          background: transparent;
          border: none;
          color: #b0b3b8;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .icon-btn:hover {
          background: #3a3b3c;
          color: #ffffff;
        }
        .close-btn {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          line-height: 1;
          transition: all 0.15s ease;
        }
        .close-btn:hover {
          background: rgba(239, 68, 68, 0.25) !important;
          color: #ef4444 !important;
        }
        .launcher-close-btn {
          color: #94a3b8;
          font-size: 12px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 9999px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.15s ease;
          margin-left: 6px;
          line-height: 1;
        }
        .launcher-close-btn:hover {
          background: #ef4444 !important;
          color: #ffffff !important;
        }
        .panel-body {
          padding: 14px 16px;
        }
        .info-card {
          background: #242526;
          border: 1px solid #3a3b3c;
          border-radius: 10px;
          padding: 10px 12px;
          margin-bottom: 12px;
        }
        .info-card-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #cbd5e1;
          margin-bottom: 6px;
        }
        .info-card-row:last-child {
          margin-bottom: 0;
        }
        .info-card strong {
          color: #ffffff;
        }
        .primary-btn {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: #ffffff;
          width: 100%;
          font-size: 13px;
          font-weight: 800;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 8px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
          transition: all 0.15s ease;
        }
        .primary-btn:hover {
          background: linear-gradient(135deg, #4f46e5, #4338ca);
          transform: translateY(-1px);
        }
        .action-btn {
          background: #3a3b3c;
          color: #e4e6eb;
          border: none;
          padding: 8px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
        }
        .action-btn:hover {
          background: #4e4f50;
          color: #ffffff;
        }
        .button-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
          margin-bottom: 8px;
        }
        .progress-container {
          background: #242526;
          border: 1px solid #3a3b3c;
          border-radius: 10px;
          padding: 8px 12px;
          margin-bottom: 10px;
        }
        .progress-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 11px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 6px;
        }
        .progress-bar-bg {
          width: 100%;
          height: 6px;
          background: #3a3b3c;
          border-radius: 9999px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #06b6d4);
          border-radius: 9999px;
          transition: width 0.3s ease;
        }
      </style>

      ${isCollapsed ? `
        <div class="launcher-pill" id="agp-launcher-btn" title="Click to open AI Group Poster Assistant">
          <div class="badge-logo">AI</div>
          <span class="launcher-title">AI Group Poster</span>
          ${isRunning ? `
            <span class="status-pill running">
              <span class="pulse-dot"></span>
              Auto-Posting (${progressCount}/${totalCount})
            </span>
          ` : isPaused ? `
            <span class="status-pill paused">⏸️ Paused</span>
          ` : `
            <span class="status-pill ready">⚡ Turbo Ready</span>
          `}
          <span style="font-size: 12px; color: #94a3b8;">▲</span>
          <button class="launcher-close-btn" id="agp-launcher-close" title="Stop & Close (ডাইরেক্ট অফ)">✕</button>
        </div>
      ` : `
        <div class="panel-root">
          <div class="panel-header">
            <div class="header-title">
              <div class="badge-logo">AI</div>
              <span>AI GROUP POSTER</span>
              ${isRunning ? `<span class="status-pill running"><span class="pulse-dot"></span> Auto-Posting</span>` : isPaused ? `<span class="status-pill paused">⏸️ Paused</span>` : `<span class="status-pill ready">⚡ Ready</span>`}
            </div>
            <div class="header-actions">
              <button class="icon-btn" id="agp-toggle-btn" title="Minimize">▼ Minimize</button>
              <button class="close-btn" id="agp-close-btn" title="Stop & Close (ডাইরেক্ট অফ)">✕</button>
            </div>
          </div>

          <div class="panel-body">
            ${isRunning ? `
              <div class="progress-container">
                <div class="progress-label">
                  <span>Posting: <strong>${progressCount} of ${totalCount}</strong> Groups</span>
                  <span>${percent}%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: ${percent}%"></div>
                </div>
              </div>

              <div class="info-card">
                <div class="info-card-row">
                  <span>Current Group:</span>
                  <strong>${currentGroupName || 'Active Group'}</strong>
                </div>
                <div class="info-card-row">
                  <span>Speed:</span>
                  <span style="color: #34d399; font-weight: 700;">⚡ Instant (Turbo)</span>
                </div>
              </div>

              ${activeTabId ? `
                <button class="primary-btn" id="btn-focus-tab">
                  🚀 Focus Active Posting Tab
                </button>
              ` : ''}

              <button class="action-btn" id="btn-pause-queue" style="width: 100%; margin-bottom: 8px;">
                ⏸️ Pause Auto-Posting
              </button>
            ` : `
              <div class="info-card">
                <div class="info-card-row">
                  <span>Logged in as:</span>
                  <strong>${userProfile.name || 'Facebook User'}</strong>
                </div>
                <div class="info-card-row">
                  <span>Posting Speed:</span>
                  <span style="color: #34d399; font-weight: 700;">⚡ Turbo (0s delay)</span>
                </div>
                <div class="info-card-row">
                  <span>System:</span>
                  <span style="color: #60a5fa; font-weight: 600;">Active & Synced</span>
                </div>
              </div>

              ${isPaused ? `
                <button class="primary-btn" id="btn-resume-queue">
                  ▶️ Resume Auto-Posting Queue
                </button>
              ` : `
                <button class="primary-btn" id="btn-open-dashboard">
                  📊 Open Full Dashboard
                </button>
              `}

              <div class="button-grid">
                <button class="action-btn" id="btn-sync-groups">🔄 Sync Groups</button>
                <button class="action-btn" id="btn-start-queue">🤖 Start Queue</button>
              </div>
            `}

            ${isRunning ? `
              <button class="action-btn" id="btn-open-dashboard" style="width: 100%;">
                Open Full Dashboard ↗
              </button>
            ` : ''}
          </div>
        </div>
      `}
    `;

    shadowRoot.getElementById('agp-launcher-btn')?.addEventListener('click', (e) => {
      if ((e.target as HTMLElement)?.closest('#agp-launcher-close')) return;
      isCollapsed = false;
      renderHelperPanel();
    });
    shadowRoot.getElementById('agp-toggle-btn')?.addEventListener('click', () => {
      isCollapsed = true;
      renderHelperPanel();
    });
    shadowRoot.getElementById('agp-close-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAndStopEverything();
    });
    shadowRoot.getElementById('agp-launcher-close')?.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAndStopEverything();
    });
    shadowRoot.getElementById('btn-focus-tab')?.addEventListener('click', () => {
      if (activeTabId) {
        chrome.runtime.sendMessage({ type: 'FOCUS_POSTING_TAB', tabId: activeTabId });
      }
    });
    shadowRoot.getElementById('btn-pause-queue')?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'PAUSE_QUEUE' }, () => {
        showToast('Auto-posting paused');
        inspectPageAndConnect();
      });
    });
    shadowRoot.getElementById('btn-resume-queue')?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'RESUME_QUEUE' }, () => {
        showToast('Resuming auto-posting...');
        inspectPageAndConnect();
      });
    });
    shadowRoot.getElementById('btn-start-queue')?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'START_QUEUE' }, () => {
        showToast('Starting auto-posting queue...');
        inspectPageAndConnect();
      });
    });
    shadowRoot.getElementById('btn-sync-groups')?.addEventListener('click', () => {
      window.location.href = 'https://www.facebook.com/groups/joins/?nav_source=tab';
    });
    shadowRoot.getElementById('btn-open-dashboard')?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'OPEN_DASHBOARD' });
    });
    return;
  }

  const group = activePayload?.group;
  const post = activePayload?.post;
  const queueIndex = activePayload?.queueIndex || 1;
  const totalItems = activePayload?.totalQueueItems || 1;
  const postedTotal = activePayload?.postedCount ?? Math.max(0, queueIndex - 1);
  const progressPercent = totalItems > 0 ? Math.round((postedTotal / totalItems) * 100) : 0;
  const formattedPost = activePayload?.formattedPost || post?.description || '';
  const rawCaption = activePayload?.caption || post?.caption || post?.description || '';
  const mediaCount = activePayload?.media ? activePayload.media.length : (post?.images ? post.images.length : 0);

  // Group Match Verification
  const isMatch = activePayload ? activePayload.isGroupMatch : true;
  const expectedGroupName = activePayload?.expectedGroupName || group?.name || 'Expected Group';
  const currentGroupName = pageInfo.groupName || 'Current Page';

  shadowRoot.innerHTML = `
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -6px); }
        15% { opacity: 1; transform: translate(-50%, 0); }
        85% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -6px); }
      }
      @keyframes pulseDot {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); opacity: 0.6; }
      }
      .panel-root {
        position: fixed;
        bottom: 24px;
        right: 24px;
        width: 380px;
        background: #18191a;
        color: #e4e6eb;
        border-radius: 16px;
        box-shadow: 0 16px 48px -4px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.12);
        z-index: 2147483647;
        overflow: hidden;
        transition: transform 0.25s ease, opacity 0.2s ease;
      }
      .panel-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: #242526;
        border-bottom: 1px solid #3a3b3c;
        user-select: none;
      }
      .header-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 800;
        color: #ffffff;
        letter-spacing: 0.2px;
      }
      .badge-logo {
        width: 22px;
        height: 22px;
        background: #6366f1;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 900;
        color: #ffffff;
      }
      .autopilot-pill {
        font-size: 10px;
        font-weight: 700;
        background: rgba(16, 185, 129, 0.2);
        color: #34d399;
        border: 1px solid rgba(16, 185, 129, 0.4);
        padding: 2px 7px;
        border-radius: 9999px;
      }
      .header-actions {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .icon-btn {
        background: transparent;
        border: none;
        color: #b0b3b8;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
      }
      .icon-btn:hover {
        background: #3a3b3c;
        color: #ffffff;
      }
      .icon-btn.close-btn {
        color: #f87171;
        font-size: 14px;
        font-weight: 700;
        padding: 2px 7px;
        margin-left: 4px;
        border-radius: 6px;
      }
      .icon-btn.close-btn:hover {
        background: rgba(239, 68, 68, 0.25);
        color: #ef4444;
      }
      .panel-body {
        padding: 14px 16px;
        display: ${isCollapsed ? 'none' : 'block'};
      }
      .warning-box {
        background: rgba(239, 68, 68, 0.15);
        border: 1px solid rgba(239, 68, 68, 0.4);
        color: #fca5a5;
        padding: 10px 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        font-size: 11px;
        line-height: 1.4;
      }

      /* Total Posted Progress Bar */
      .progress-container {
        background: #242526;
        border: 1px solid #3a3b3c;
        border-radius: 10px;
        padding: 8px 12px;
        margin-bottom: 10px;
      }
      .progress-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 6px;
      }
      .progress-bar-bg {
        width: 100%;
        height: 6px;
        background: #3a3b3c;
        border-radius: 9999px;
        overflow: hidden;
      }
      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #06b6d4);
        border-radius: 9999px;
        transition: width 0.3s ease;
      }

      /* Live Auto-Post Status Box */
      .autopost-box {
        background: rgba(99, 102, 241, 0.12);
        border: 1px solid rgba(99, 102, 241, 0.35);
        border-radius: 10px;
        padding: 10px 12px;
        margin-bottom: 10px;
      }
      .autopost-header {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 800;
        color: #a5b4fc;
        text-transform: uppercase;
        margin-bottom: 3px;
      }
      .pulse-dot {
        width: 7px;
        height: 7px;
        background: #10b981;
        border-radius: 50%;
        animation: pulseDot 1.4s infinite;
      }
      .autopost-status-text {
        font-size: 12px;
        font-weight: 600;
        color: #ffffff;
        line-height: 1.35;
      }

      .meta-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      .group-name {
        font-size: 12px;
        font-weight: 700;
        color: #e2e8f0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 210px;
      }
      .queue-badge {
        font-size: 11px;
        font-weight: 700;
        background: rgba(99, 102, 241, 0.2);
        color: #a5b4fc;
        padding: 2px 8px;
        border-radius: 12px;
        border: 1px solid rgba(99, 102, 241, 0.4);
      }
      .post-card {
        background: #242526;
        border: 1px solid #3a3b3c;
        border-radius: 10px;
        padding: 8px 12px;
        margin-bottom: 10px;
      }
      .post-title {
        font-size: 11px;
        font-weight: 700;
        color: #ffffff;
        margin-bottom: 3px;
      }
      .media-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 10px;
        font-weight: 600;
        background: #3a3b3c;
        color: #93c5fd;
        padding: 2px 7px;
        border-radius: 6px;
        margin-bottom: 4px;
      }
      .post-preview {
        font-size: 11px;
        color: #cbd5e1;
        max-height: ${isCaptionExpanded ? '160px' : '55px'};
        overflow-y: auto;
        white-space: pre-wrap;
        line-height: 1.4;
        border-left: 2px solid #6366f1;
        padding-left: 8px;
      }
      .button-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        margin-bottom: 8px;
      }
      .action-btn {
        background: #3a3b3c;
        color: #e4e6eb;
        border: none;
        padding: 8px 10px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
        text-align: center;
      }
      .action-btn:hover {
        background: #4e4f50;
        color: #ffffff;
      }
      .auto-btn {
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: #ffffff;
        width: 100%;
        font-size: 13px;
        font-weight: 800;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 6px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
      }
      .auto-btn:hover {
        background: linear-gradient(135deg, #4f46e5, #4338ca);
      }
      .auto-btn.running {
        background: linear-gradient(135deg, #d97706, #b45309);
      }
      .primary-btn {
        background: #10b981;
        color: #ffffff;
        width: 100%;
        font-size: 12px;
        font-weight: 700;
        padding: 8px;
        border-radius: 8px;
        margin-bottom: 6px;
      }
      .primary-btn:hover {
        background: #059669;
      }
      .workflow-row {
        display: flex;
        gap: 6px;
      }
      .secondary-btn {
        flex: 1;
        background: #3a3b3c;
        color: #e4e6eb;
        border: none;
        padding: 7px;
        border-radius: 8px;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
      }
      .secondary-btn:hover {
        background: #4e4f50;
        color: #ffffff;
      }
      .link-btn {
        background: transparent;
        color: #818cf8;
        border: none;
        font-size: 10px;
        cursor: pointer;
        padding: 2px;
        margin-top: 6px;
        width: 100%;
        text-align: center;
        text-decoration: underline;
      }
    </style>

    <div class="panel-root">
      <div class="panel-header">
        <div class="header-title">
          <div class="badge-logo">AI</div>
          <span>AI GROUP POSTER</span>
          <span class="autopilot-pill">● Auto-Pilot ON</span>
        </div>
        <div class="header-actions">
          <button class="icon-btn" id="agp-toggle-btn">
            ${isCollapsed ? '▲ Expand' : '▼ Minimize'}
          </button>
          <button class="icon-btn close-btn" id="agp-close-btn" title="Stop & Close (ডাইরেক্ট অফ)">✕</button>
        </div>
      </div>

      <div class="panel-body">
        ${
          !isMatch
            ? `
          <div class="warning-box">
            <strong>⚠️ Wrong Group Detected!</strong><br/>
            Expected: <strong>${expectedGroupName}</strong><br/>
            Current page: <em>${currentGroupName}</em><br/>
            <span style="font-size: 11px; color: #fca5a5;">Auto-skipping to next group...</span>
          </div>
        `
            : ''
        }

        <div class="progress-container">
          <div class="progress-label">
            <span>Posted: <strong>${postedTotal} of ${totalItems}</strong> Groups</span>
            <span>${progressPercent}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
          </div>
        </div>

        <div class="autopost-box">
          <div class="autopost-header">
            <span class="pulse-dot"></span>
            <span>${isAutoPosting ? 'Auto-Posting in Progress' : (autoPilotPaused ? 'Auto-Pilot Paused' : 'Auto-Pilot Running')}</span>
          </div>
          <div class="autopost-status-text">${autoPostStatus}</div>
        </div>

        <div class="meta-row">
          <span class="group-name" title="${expectedGroupName}">${expectedGroupName}</span>
          <span class="queue-badge">Queue ${queueIndex} / ${totalItems}</span>
        </div>

        <div class="post-card">
          <div class="post-title">${post?.productName || post?.title || 'Prepared Listing'}</div>
          ${
            mediaCount > 0
              ? (post?.images || activePayload?.media || []).some(m => m.includes('video') || m.includes('data:video') || m.endsWith('.mp4') || m.endsWith('.webm') || m.endsWith('.mov'))
                ? `<div class="media-badge" style="background:#065f46;color:#6ee7b7;border:1px solid #059669;">🎬 Video Attached (${mediaCount})</div>`
                : `<div class="media-badge">📷 ${mediaCount} Photos attached</div>`
              : ''
          }
          <div class="post-preview">${rawCaption || formattedPost || 'No prepared caption.'}</div>
        </div>

        <button class="auto-btn ${isAutoPosting ? 'running' : ''}" id="btn-auto-post">
          ${isAutoPosting ? '⏸️ Pause Auto-Posting' : '🤖 Auto-Post Now'}
        </button>

        ${
          isUserNotMemberOfGroup() || findJoinGroupButton()
            ? `<button class="action-btn" id="btn-auto-join" style="background:#2563eb;color:#ffffff;font-weight:700;margin-top:6px;width:100%;justify-content:center;box-shadow:0 2px 4px rgba(37,99,235,0.3);">
                ➕ Auto-Join Group (গ্রুপে যোগ দিন)
              </button>`
            : ''
        }

        <button class="action-btn primary-btn" id="btn-mark-posted">
          ✅ Mark Posted & Next Group
        </button>

        <div class="button-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
          <button class="action-btn" id="btn-toggle-caption">
            ${isCaptionExpanded ? 'Collapse' : '👁️ View'}
          </button>
          <button class="action-btn" id="btn-copy-caption">📋 Copy</button>
          <button class="action-btn" id="btn-paste-caption" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #fff; font-weight: bold;" title="ক্যাপশন সরাসরি পোস্টে পেস্ট করুন">✨ Paste to FB</button>
        </div>

        <div class="workflow-row">
          <button class="secondary-btn" id="btn-skip">⏭️ Skip Group</button>
          <button class="secondary-btn" id="btn-pause">⏸️ Pause Session</button>
        </div>

        <button class="link-btn" id="btn-open-dashboard">
          Open Extension Dashboard ↗
        </button>
      </div>
    </div>
  `;

  // Attach event listeners
  shadowRoot.getElementById('agp-toggle-btn')?.addEventListener('click', () => {
    isCollapsed = !isCollapsed;
    renderHelperPanel();
  });

  shadowRoot.getElementById('agp-close-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAndStopEverything();
  });

  shadowRoot.getElementById('btn-auto-post')?.addEventListener('click', () => {
    if (isAutoPosting) {
      autoPilotPaused = true;
      isAutoPosting = false;
      autoPostStatus = 'Auto-posting paused by user';
      if (autoPostTimer) clearInterval(autoPostTimer);
      showToast('Auto-posting paused');
      renderHelperPanel();
    } else {
      autoPilotPaused = false;
      if (autoPostTimer) clearInterval(autoPostTimer);
      runAutomatedPostingRoutine();
    }
  });

  shadowRoot.getElementById('btn-auto-join')?.addEventListener('click', async () => {
    const btn = shadowRoot?.getElementById('btn-auto-join');
    if (btn) btn.textContent = '⏳ Joining...';
    const res = await attemptAutoJoinGroup();
    if (res.isInstantMember) {
      runAutomatedPostingRoutine();
    }
  });

  shadowRoot.getElementById('btn-toggle-caption')?.addEventListener('click', () => {
    isCaptionExpanded = !isCaptionExpanded;
    renderHelperPanel();
  });

  shadowRoot.getElementById('btn-copy-caption')?.addEventListener('click', async () => {
    const text = rawCaption || formattedPost;
    const resolved = resolveSpintax(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const rich = convertToRichHtml(resolved);
    if (await copyRichText(resolved, rich)) showToast('📋 Caption & Design copied (Ctrl+V ready)!');
  });

  shadowRoot.getElementById('btn-paste-caption')?.addEventListener('click', async () => {
    const text = rawCaption || formattedPost;
    const resolved = resolveSpintax(text).replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const modal = document.querySelector<HTMLElement>('[role="dialog"]') || document.body;
    showToast('✨ Pasting caption with exact styling...');
    const ok = await injectCaptionIntoEditor(modal, resolved);
    if (ok) {
      showToast('✅ Caption pasted with exact design!');
    } else {
      showToast('⚠️ Click inside post box and press Ctrl+V', true);
    }
  });

  shadowRoot.getElementById('btn-mark-posted')?.addEventListener('click', () => {
    if (autoPostTimer) clearInterval(autoPostTimer);
    try { window.onbeforeunload = null; } catch (_) {}
    chrome.runtime.sendMessage({
      type: 'MARK_AS_POSTED',
      payload: { itemId: activePayload?.queueItem?.id },
    }, () => {
      showToast('Marked as Posted! Moving to next group...');
    });
  });

  shadowRoot.getElementById('btn-skip')?.addEventListener('click', () => {
    if (autoPostTimer) clearInterval(autoPostTimer);
    try { window.onbeforeunload = null; } catch (_) {}
    chrome.runtime.sendMessage({
      type: 'SKIP_CURRENT_ITEM',
      payload: { itemId: activePayload?.queueItem?.id, reason: 'Skipped by user' },
    }, () => {
      showToast('Skipped group. Moving to next...');
    });
  });

  shadowRoot.getElementById('btn-pause')?.addEventListener('click', () => {
    if (autoPostTimer) clearInterval(autoPostTimer);
    autoPilotPaused = true;
    isAutoPosting = false;
    chrome.runtime.sendMessage({ type: 'PAUSE_QUEUE' }, () => {
      showToast('Posting Session Paused');
    });
  });

  shadowRoot.getElementById('btn-open-dashboard')?.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'OPEN_DASHBOARD' });
  });
}


/**
 * Initializes or updates helper dock UI on Facebook.
 */
function initHelperDock() {
  if (isWidgetDismissed) return;
  if (!helperContainer) {
    helperContainer = document.createElement('div');
    helperContainer.id = 'ai-group-poster-dock-root';
    document.body.appendChild(helperContainer);
    shadowRoot = helperContainer.attachShadow({ mode: 'open' });
  }

  renderHelperPanel();
}

/**
 * Checks page state and communicates with background service worker.
 */
function inspectPageAndConnect() {
  if (isWidgetDismissed) return;
  const pageInfo = detectCurrentFacebookPage();
  const userProfile = detectFacebookUserProfile();

  // Notify background about logged in profile
  if (userProfile.isLoggedIn) {
    chrome.runtime.sendMessage({
      type: 'FB_USER_PROFILE_DETECTED',
      payload: userProfile,
    });
  }

  // Handshake with background if on a group page
  if (pageInfo.isGroupPage) {
    chrome.runtime.sendMessage({
      type: 'FB_PAGE_DETECTED',
      payload: {
        url: pageInfo.canonicalUrl,
        groupIdOrSlug: pageInfo.groupIdOrSlug,
        pageTitle: pageInfo.groupName,
      },
    });

    // Query background for prepared post for this tab
    chrome.runtime.sendMessage(
      { type: 'GET_ACTIVE_POST_FOR_TAB', payload: { url: pageInfo.canonicalUrl } },
      (response) => {
        if (chrome.runtime.lastError) return;
        // Strict tab isolation: if this is user's regular personal browsing tab, leave it completely alone!
        if (response?.isUserTab) {
          return;
        }
        if (response && response.payload) {
          activePayload = response.payload;
          initHelperDock();
          if (activePayload && activePayload.queueItem) {
            startAutoPostingCountdown();
          }
        }
      }
    );
  } else if (isFacebookSearchPage()) {
    // Facebook Group Search page: Inject Auto-Joiner HUD and check if auto-join was requested
    console.log('[AGP:Content] Facebook Group Search Page detected.');
    renderAutoJoinerDock();

    // Check if background requested an immediate auto-join upon page navigation
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      chrome.storage.local.get(['agp_pending_auto_join', 'agp_auto_join_config'], (res) => {
        const pending = res?.agp_pending_auto_join;
        const config = res?.agp_auto_join_config;
        if (pending && pending.active && (Date.now() - (pending.requestedAt || 0) < 90000)) {
          console.log('[AGP:Content] Detected pending Auto-Join request. Starting auto-joiner...');
          chrome.storage.local.remove('agp_pending_auto_join');
          const autoConfig = pending.config || config || {
            searchUrl: window.location.href,
            delaySec: 0,
            maxGroups: 0,
            autoAnswerQuestions: true,
            defaultAnswer: 'Yes, I agree to the group rules and guidelines.',
            saveToGroups: true,
          };
          renderAutoJoinerDock(autoConfig);
          // Wait 1.5s for initial search cards to render
          setTimeout(() => {
            AutoJoinerController.getInstance().start(autoConfig);
          }, 1500);
        }
      });
    }
  } else {
    // Non-group Facebook page (e.g. facebook.com homepage feed, profile, etc.)
    // Do not inject helper dock into user's normal browsing feeds to maintain complete tab isolation.
  }
}

/**
 * Displays the sync notification card at the top of the Facebook window (matching reference screenshot).
 */
let userRequestedDiscoveryFinish = false;

/**
 * Displays the sync notification card at the top of the Facebook window (matching reference screenshot).
 */
function showSyncOverlayBanner(initialCount: number = 0, targetTotal?: number | null) {
  if (typeof document === 'undefined' || !document.body) return;

  userRequestedDiscoveryFinish = false;
  const existing = document.getElementById('agp-sync-window-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'agp-sync-window-overlay';
  overlay.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981;"></span>
        <span style="font-weight: 800; font-size: 14px; color: #ffffff; letter-spacing: -0.2px;">
          Syncing Facebook Groups
        </span>
      </div>
      <div id="agp-sync-counter-badge" style="background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 9999px;">
        ${initialCount} Found
      </div>
    </div>
    <div id="agp-sync-status-text" style="font-size: 12px; color: #cbd5e1; margin-bottom: 3px; font-weight: 500;">
      Scrolling automatically to find all joined groups...
    </div>
    <div style="font-size: 11px; color: #94a3b8; margin-bottom: 12px;">
      Bangla & English groups are detected. Keep this tab visible.
    </div>
    <div style="display: flex; gap: 8px;">
      <button id="agp-sync-finish-btn" type="button" style="flex: 1; background: #10b981; color: #ffffff; font-weight: 700; font-size: 12px; padding: 8px 12px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 2px 8px rgba(16,185,129,0.35);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        Save & Finish Now (<span id="agp-sync-btn-count">${initialCount}</span>)
      </button>
      <button id="agp-sync-cancel-btn" type="button" style="background: rgba(255,255,255,0.08); color: #cbd5e1; font-weight: 600; font-size: 12px; padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); cursor: pointer;">
        Cancel
      </button>
    </div>
  `;
  overlay.style.cssText = `
    position: fixed;
    top: 18px;
    left: 50%;
    transform: translateX(-50%);
    width: 380px;
    max-width: 90vw;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    color: #ffffff;
    padding: 14px 18px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(99, 102, 241, 0.2);
    z-index: 2147483647;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    pointer-events: auto;
    text-align: left;
    line-height: 1.4;
  `;
  document.body.appendChild(overlay);

  // Bind Finish button
  const finishBtn = document.getElementById('agp-sync-finish-btn');
  if (finishBtn) {
    finishBtn.onclick = () => {
      userRequestedDiscoveryFinish = true;
      finishBtn.innerHTML = `<span>Saving...</span>`;
      finishBtn.style.opacity = '0.7';
      finishBtn.style.pointerEvents = 'none';
      if (currentScanAbortController) {
        currentScanAbortController.abort();
      }
    };
  }

  // Bind Cancel button
  const cancelBtn = document.getElementById('agp-sync-cancel-btn');
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      userRequestedDiscoveryFinish = true;
      hideSyncOverlayBanner();
      if (currentScanAbortController) {
        currentScanAbortController.abort();
      }
    };
  }
}

function updateSyncOverlayBanner(count: number, targetTotal?: number | null) {
  const badge = document.getElementById('agp-sync-counter-badge');
  if (badge) {
    badge.innerText = targetTotal ? `${count} / ${targetTotal} Found` : `${count} Found`;
  }
  const btnCount = document.getElementById('agp-sync-btn-count');
  if (btnCount) {
    btnCount.innerText = String(count);
  }
  const status = document.getElementById('agp-sync-status-text');
  if (status && count > 0) {
    status.innerText = `Found ${count} groups. Scrolling for more...`;
  }
}

function hideSyncOverlayBanner() {
  const overlay = document.getElementById('agp-sync-window-overlay');
  if (overlay) overlay.remove();
}

// Runtime message listener for group discovery commands and session detection
let currentScanAbortController: AbortController | null = null;
let lastDiscoveryMetrics: any = null;

chrome.runtime.onMessage.addListener((message: RuntimeMessage, sender, sendResponse) => {
  if (message.type === 'START_GROUP_DISCOVERY') {
    (async () => {
      try {
        console.log('[AGP:Content] Starting deep group discovery scan on current Facebook page...');
        const userProfile = detectFacebookUserProfile();
        const accountContext = userProfile.userId || userProfile.name || undefined;

        // Show prominent overlay banner on Facebook popup window (matching screenshot)
        showSyncOverlayBanner();

        // Install GraphQL interceptor to capture groups from network responses
        installGraphQLInterceptor();

        const result = await performProgressiveGroupScan({
          maxRounds: 350,
          stagnantLimit: 35,
          scrollDelayMs: 300,
          accountContext,
          shouldStop: () => userRequestedDiscoveryFinish,
          onBatchDiscovered: async (items, totalSoFar, metrics) => {
            lastDiscoveryMetrics = metrics;
            // Also include intercepted groups from GraphQL responses
            const intercepted = getInterceptedGroupsAsDiscovered();
            const allItems = [...items];
            for (const ig of intercepted) {
              if (!allItems.find(a => a.groupId.toLowerCase() === ig.groupId.toLowerCase())) {
                allItems.push(ig as any);
              }
            }

            updateSyncOverlayBanner(allItems.length);

            try {
              // Send live batch to background service worker and popup
              chrome.runtime.sendMessage({
                type: 'GROUP_BATCH_DISCOVERED',
                payload: {
                  liveGroups: allItems,
                  verifiedCount: allItems.length,
                  duplicatesRemoved: metrics?.duplicatesRemoved || 0,
                  debugMetrics: metrics,
                },
              });
            } catch {}

            try {
              await mergeDiscoveredGroups(allItems as any, { syncMode: 'merge', accountContext });
            } catch (mergeErr) {
              console.warn('[AGP:Content] Progressive batch merge error:', mergeErr);
            }
          },
          onProgress: (count, status, targetTotal, metrics) => {
            lastDiscoveryMetrics = metrics;
            const interceptedCount = interceptedGroups.size;
            const totalCount = Math.max(count, interceptedCount);
            updateSyncOverlayBanner(totalCount, targetTotal);
            try {
              chrome.runtime.sendMessage({
                type: 'GROUP_DISCOVERY_PROGRESS',
                payload: {
                  foundCount: totalCount,
                  status,
                  targetCount: targetTotal,
                  debugMetrics: metrics,
                },
              });
            } catch {}
          },
        });

        // Final merge of all intercepted groups
        const intercepted = getInterceptedGroupsAsDiscovered();
        if (intercepted.length > 0) {
          try {
            await mergeDiscoveredGroups(intercepted as any, { syncMode: 'merge', accountContext });
          } catch {}
        }

        // Combine DOM-scanned groups with intercepted groups
        const allGroups = [...result.groups];
        for (const ig of intercepted) {
          if (!allGroups.find(g => g.groupId.toLowerCase() === ig.groupId.toLowerCase())) {
            allGroups.push(ig as any);
          }
        }

        const totalFound = Math.max(result.totalFound, allGroups.length);
        lastDiscoveryMetrics = result.debugMetrics;

        hideSyncOverlayBanner();

        sendResponse({
          success: true,
          payload: {
            groups: allGroups,
            sourceUrl: window.location.href,
            isLoggedIn: result.isLoggedIn,
            totalFoundOnPage: totalFound,
            profile: userProfile,
            outcome: result.outcome,
            completionReason: result.completionReason,
            isPartial: result.isPartial,
            debugMetrics: result.debugMetrics,
          },
        });
      } catch (err: unknown) {
        hideSyncOverlayBanner();
        const errorMsg = err instanceof Error ? err.message : String(err);
        sendResponse({ success: false, error: errorMsg });
      }
    })();
    return true; // Keep message channel open for async response
  }

  if (message.type === 'CANCEL_GROUP_DISCOVERY') {
    hideSyncOverlayBanner();
    if (currentScanAbortController) {
      currentScanAbortController.abort();
      currentScanAbortController = null;
    }
    showToast('AI Group Poster: Discovery cancelled.', true);
    sendResponse({ success: true });
    return false;
  }

  if (message.type === 'GET_DEBUG_METRICS') {
    sendResponse({ success: true, debugMetrics: lastDiscoveryMetrics });
    return false;
  }

  if (message.type === 'CHECK_FACEBOOK_SESSION') {
    const isLoggedIn = checkFacebookLoginStatus();
    const userProfile = detectFacebookUserProfile();
    sendResponse({ success: true, isLoggedIn, profile: userProfile, currentUrl: window.location.href });
    return false;
  }

  if (message.type === 'GET_FACEBOOK_USER_INFO') {
    (async () => {
      try {
        const isLoggedIn = checkFacebookLoginStatus();
        const profile = detectFacebookUserProfile();
        const scanResult = scanPageForGroups(profile.userId || profile.name || undefined);
        let groups = scanResult.items;

        sendResponse({
          success: true,
          isLoggedIn,
          profile,
          groups,
          totalGroups: groups.length,
          currentUrl: window.location.href,
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        sendResponse({ success: false, error: errorMsg });
      }
    })();
    return true; // Keep message port open for async response
  }

  /* ================= AUTO-JOINER HANDLERS ================= */
  if (message.type === 'START_AUTO_JOIN' || message.type === 'AUTO_JOIN_START_ON_PAGE') {
    (async () => {
      try {
        const rawConfig = (message.payload || {}) as any;
        const config = {
          ...rawConfig,
          delaySec: typeof rawConfig.delaySec === 'number' ? rawConfig.delaySec : 0,
        };
        renderAutoJoinerDock(config);
        const finalState = await AutoJoinerController.getInstance().start(config);
        sendResponse({ success: true, state: finalState });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        sendResponse({ success: false, error: errorMsg });
      }
    })();
    return true;
  }

  if (message.type === 'PAUSE_AUTO_JOIN' || message.type === 'AUTO_JOIN_PAUSE_ON_PAGE') {
    AutoJoinerController.getInstance().pause();
    sendResponse({ success: true });
    return false;
  }

  if (message.type === 'RESUME_AUTO_JOIN' || message.type === 'AUTO_JOIN_RESUME_ON_PAGE') {
    AutoJoinerController.getInstance().resume();
    sendResponse({ success: true });
    return false;
  }

  if (message.type === 'STOP_AUTO_JOIN' || message.type === 'AUTO_JOIN_STOP_ON_PAGE') {
    AutoJoinerController.getInstance().stop();
    sendResponse({ success: true });
    return false;
  }

  if (message.type === 'GET_AUTO_JOIN_STATE') {
    const state = AutoJoinerController.getInstance().getState();
    sendResponse({ success: true, state });
    return false;
  }
});

let isAutoScanningJoins = false;
let interceptedGroups = new Map<string, { name: string; id: string; imageUrl?: string }>();

/**
 * Intercept fetch/XHR responses to capture group data from Facebook's GraphQL responses.
 * This is the most reliable way to capture ALL groups from infinite scroll loading.
 */
function installGraphQLInterceptor() {
  if (typeof window === 'undefined') return;
  if ((window as any).__agpFetchIntercepted) return;
  (window as any).__agpFetchIntercepted = true;

  const originalFetch = window.fetch;
  window.fetch = async function (...args: any[]) {
    const response = await originalFetch.apply(this, args as any);

    try {
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || '';
      // Only intercept Facebook GraphQL API calls
      if (url.includes('/api/graphql') || url.includes('graphql')) {
        const clonedResponse = response.clone();
        clonedResponse.text().then(text => {
          if (text.includes('Group') && (text.includes('/groups/') || text.includes('__typename":"Group"'))) {
            extractGroupsFromGraphQLResponse(text);
          }
        }).catch(() => {});
      }
    } catch {}

    return response;
  };

  console.log('[AGP:Content] GraphQL response interceptor installed');
}

function extractGroupsFromGraphQLResponse(text: string) {
  try {
    // Pattern: {"__typename":"Group","id":"123","name":"..."}
    const regex = /"__typename"\s*:\s*"Group"[^}]*?"id"\s*:\s*"(\d+)"[^}]*?"name"\s*:\s*"([^"]+)"/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text)) !== null) {
      const gId = m[1];
      const gName = m[2].trim();
      if (gId && gName && gName.length >= 2) {
        interceptedGroups.set(gId, { name: gName, id: gId });
      }
    }

    // Pattern: "node":{"__typename":"Group","id":"123","name":"..."}
    const nodeRegex = /"node"\s*:\s*\{\s*"__typename"\s*:\s*"Group"\s*,\s*"id"\s*:\s*"(\d+)"\s*,\s*"name"\s*:\s*"([^"]+)"/g;
    while ((m = nodeRegex.exec(text)) !== null) {
      const gId = m[1];
      const gName = m[2].trim();
      if (gId && gName && gName.length >= 2) {
        interceptedGroups.set(gId, { name: gName, id: gId });
      }
    }

    if (interceptedGroups.size > 0) {
      console.log(`[AGP:Content] GraphQL interceptor: total ${interceptedGroups.size} groups captured`);
    }
  } catch {}
}

/**
 * Returns groups captured by the GraphQL interceptor formatted as DiscoveredGroupItems.
 */
function getInterceptedGroupsAsDiscovered() {
  const items: Array<{ name: string; url: string; groupId: string; privacy: string; imageUrl?: string }> = [];
  for (const [gId, data] of interceptedGroups) {
    items.push({
      name: data.name,
      url: `https://www.facebook.com/groups/${gId}/`,
      groupId: gId,
      privacy: 'UNKNOWN',
      imageUrl: data.imageUrl,
    });
  }
  return items;
}

async function triggerAutoScanIfJoinsPage() {
  const href = window.location.href.toLowerCase();
  if ((href.includes('/groups/joins') || href.includes('category=membership')) && !isAutoScanningJoins) {
    isAutoScanningJoins = true;
    console.log('[AGP:Content] Detected Your Groups page (/groups/joins/)! Starting full auto-scan of all joined groups...');
    showToast('AI Group Poster: Auto-scanning your joined groups...');

    // Install interceptor to capture GraphQL group data from infinite scroll
    installGraphQLInterceptor();

    showSyncOverlayBanner(0);

    try {
      const result = await performProgressiveGroupScan({
        maxRounds: 350,
        stagnantLimit: 35,
        scrollDelayMs: 300,
        shouldStop: () => userRequestedDiscoveryFinish,
        onBatchDiscovered: async (items, totalSoFar) => {
          // Also merge any intercepted groups from GraphQL responses
          const intercepted = getInterceptedGroupsAsDiscovered();
          const allItems = [...items];
          for (const ig of intercepted) {
            if (!allItems.find(a => a.groupId === ig.groupId)) {
              allItems.push(ig as any);
            }
          }
          updateSyncOverlayBanner(allItems.length);
          try {
            await mergeDiscoveredGroups(allItems as any, { syncMode: 'merge' });
          } catch (mergeErr) {
            console.warn('[AGP:Content] Batch save err:', mergeErr);
          }
        },
        onProgress: (count, status, targetTotal) => {
          // Include intercepted groups in the count
          const interceptedCount = interceptedGroups.size;
          const totalCount = Math.max(count, interceptedCount);
          updateSyncOverlayBanner(totalCount, targetTotal);
          showToast(`AI Group Poster: Found ${totalCount}${targetTotal ? ` / ${targetTotal}` : ''} groups...`);
          try {
            chrome.runtime.sendMessage({
              type: 'GROUP_DISCOVERY_PROGRESS',
              payload: { foundCount: totalCount, status, targetCount: targetTotal },
            });
          } catch {}
        },
      });

      // Final merge including all intercepted groups
      const intercepted = getInterceptedGroupsAsDiscovered();
      if (intercepted.length > 0) {
        try {
          await mergeDiscoveredGroups(intercepted as any, { syncMode: 'merge' });
          console.log(`[AGP:Content] Final merge: added ${intercepted.length} intercepted groups`);
        } catch {}
      }

      const totalGroups = Math.max(result.totalFound, interceptedGroups.size);
      showToast(`AI Group Poster: Sync complete! Found ${totalGroups} groups.`);
    } catch (err) {
      console.warn('[AGP:Content] Auto-scan err:', err);
    } finally {
      isAutoScanningJoins = false;
      setTimeout(hideSyncOverlayBanner, 1500);
    }
  }
}

// Listen for instantaneous groups captured by the MAIN-world GraphQL interceptor and instant URL changes
window.addEventListener('message', (e) => {
  if (e.source !== window || !e.data) return;
  if (e.data.type === 'AGP_MAIN_GRAPHQL_GROUPS' && Array.isArray(e.data.groups)) {
    for (const g of e.data.groups) {
      if (g.id && g.name) {
        interceptedGroups.set(g.id, { name: g.name, id: g.id });
      }
    }
    console.log(`[AGP:Content] Intercepted ${interceptedGroups.size} groups from MAIN world GraphQL`);
  }
  if (e.data.type === 'AGP_MAIN_URL_CHANGED') {
    handleUrlTransition();
  }
});

// Direct runtime message from service worker for 0ms group navigation
chrome.runtime.onMessage.addListener((msg) => {
  if (msg && msg.type === 'AGP_NAVIGATE_TO_GROUP') {
    handleUrlTransition();
  }
});

// Run initial inspection immediately
checkMobileFacebookEnvironment();
inspectPageAndConnect();
setTimeout(triggerAutoScanIfJoinsPage, 100);

// High-performance, zero-overhead navigation tracker
let lastTrackedUrl = window.location.href;
function handleUrlTransition() {
  if (window.location.href !== lastTrackedUrl) {
    lastTrackedUrl = window.location.href;
    checkMobileFacebookEnvironment();
    inspectPageAndConnect();
    setTimeout(triggerAutoScanIfJoinsPage, 100);
  }
}

/**
 * Detects if the mobile user is on m.facebook.com and offers 1-click switch to Desktop site
 */
function checkMobileFacebookEnvironment() {
  const host = window.location.hostname.toLowerCase();
  if (host.startsWith('m.') || host.includes('mbasic.')) {
    if (document.getElementById('agp-mobile-banner')) return;
    const banner = document.createElement('div');
    banner.id = 'agp-mobile-banner';
    banner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 2147483647;
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      border-bottom: 2px solid #6366f1;
      padding: 10px 14px;
      color: #fff;
      font-family: -apple-system, Roboto, sans-serif;
      box-shadow: 0 4px 15px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    `;
    banner.innerHTML = `
      <div style="font-size: 11.5px; line-height: 1.4;">
        <strong>📱 AI Group Poster:</strong> মোবাইলে অটোমেশনের জন্য Kiwi Browser-এর ৩টি ডট (⋮) থেকে <strong>"Desktop site"</strong> অন করুন অথবা এখানে ট্যাপ করুন।
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <button id="agp-switch-desktop-btn" style="background: #3b82f6; border: none; border-radius: 6px; color: #fff; padding: 6px 10px; font-weight: bold; font-size: 11px; white-space: nowrap; cursor: pointer;">
          🖥️ Desktop Mode
        </button>
        <button id="agp-close-banner-btn" style="background: transparent; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 2px 6px;">✕</button>
      </div>
    `;
    document.body.appendChild(banner);

    const switchBtn = document.getElementById('agp-switch-desktop-btn');
    if (switchBtn) {
      switchBtn.onclick = () => {
        window.location.href = window.location.href.replace('://m.', '://www.').replace('://mbasic.', '://www.');
      };
    }
    const closeBtn = document.getElementById('agp-close-banner-btn');
    if (closeBtn) {
      closeBtn.onclick = () => banner.remove();
    }
  }
}

window.addEventListener('popstate', handleUrlTransition, { passive: true });
window.addEventListener('hashchange', handleUrlTransition, { passive: true });
setInterval(handleUrlTransition, 1000);

// Active Posting Keepalive: Prevents Chrome MV3 Service Worker dormancy while posting is running
setInterval(() => {
  if (isAutoPosting || (activePayload && activePayload.queueItem)) {
    try {
      chrome.runtime.sendMessage({ type: 'KEEPALIVE_PING' }, () => {
        if (chrome.runtime.lastError) {} // Suppress transient errors
      });
    } catch (_) {}
  }
}, 10000);


