import { AutoJoinState, AutoJoinConfig } from '../../types/auto-joiner';
import {
  AutoJoinerController,
  extractSearchQuery,
  scanPageForGroupCards,
} from './auto-joiner-engine';
import { getGroups, setGroups, getPosts, setPosts } from '../storage/chrome-storage';
import { generateId } from '../../utils/helpers';
import { Group } from '../../types/group';
import { Post } from '../../types/post';

let autoJoinContainer: HTMLElement | null = null;
let shadowRoot: ShadowRoot | null = null;

// Local persistent draft state
let draftCaption = '';
let draftPhotos: string[] = [];
let activeTab: 'POST_AND_JOIN' | 'JOIN_ONLY' = 'POST_AND_JOIN';
let targetGroupCount = 0; // 0 = all
let pacingDelaySec = 5;
let isGroupsListExpanded = false;
let isDockMinimized = false;
let hasLoadedDraft = false;

// Campaign execution state
interface CampaignState {
  isRunning: boolean;
  isPaused: boolean;
  status: 'IDLE' | 'SCANNING' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'ERROR';
  message: string;
  total: number;
  completed: number;
  skipped: number;
  failed: number;
  currentGroupName: string;
  startedAt?: number;
}

let campaignState: CampaignState = {
  isRunning: false,
  isPaused: false,
  status: 'IDLE',
  message: 'Ready to auto-join and post to Facebook groups from this search page.',
  total: 0,
  completed: 0,
  skipped: 0,
  failed: 0,
  currentGroupName: '',
};

let campaignPollTimer: any = null;

/**
 * Converts a File object into a compressed base64 Data URL string.
 * Resizes large camera photos down to max 1280px with jpeg compression
 * to keep memory and storage lean and avoid quota limits.
 */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (file.type.startsWith('video/')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawUrl = (e.target?.result as string) || '';
      if (!rawUrl) return resolve('');
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const maxDim = 1280;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(rawUrl);
        }
      };
      img.onerror = () => resolve(rawUrl);
      img.src = rawUrl;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Saves draft caption and photos into local storage.
 */
async function saveDraftToStorage() {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      await chrome.storage.local.set({
        agp_search_poster_caption: draftCaption,
        agp_search_poster_photos: draftPhotos,
        agp_search_poster_delay: pacingDelaySec,
        agp_search_poster_target: targetGroupCount,
      });
    }
  } catch (err) {
    console.warn('[AGP:SearchPoster] Failed to save draft to storage:', err);
  }
}

/**
 * Loads draft caption and photos from local storage.
 */
async function loadDraftFromStorage() {
  if (hasLoadedDraft) return;
  hasLoadedDraft = true;
  try {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      const res = await chrome.storage.local.get([
        'agp_search_poster_caption',
        'agp_search_poster_photos',
        'agp_search_poster_delay',
        'agp_search_poster_target',
      ]);
      if (typeof res?.agp_search_poster_caption === 'string') {
        draftCaption = res.agp_search_poster_caption;
      }
      if (Array.isArray(res?.agp_search_poster_photos)) {
        draftPhotos = res.agp_search_poster_photos;
      }
      if (typeof res?.agp_search_poster_delay === 'number') {
        pacingDelaySec = res.agp_search_poster_delay;
      }
      if (typeof res?.agp_search_poster_target === 'number') {
        targetGroupCount = res.agp_search_poster_target;
      }
    }
  } catch (err) {
    console.warn('[AGP:SearchPoster] Failed to load draft from storage:', err);
  }
}

/**
 * Injects or updates the floating Auto-Join & Post Commander widget on Facebook search pages.
 */
export async function renderAutoJoinerDock(config?: AutoJoinConfig) {
  if (typeof document === 'undefined') return;

  await loadDraftFromStorage();

  const controller = AutoJoinerController.getInstance();
  const state = controller.getState();

  if (!autoJoinContainer) {
    autoJoinContainer = document.createElement('div');
    autoJoinContainer.id = 'agp-auto-joiner-root';
    autoJoinContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483646;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    `;
    shadowRoot = autoJoinContainer.attachShadow({ mode: 'open' });
    document.body.appendChild(autoJoinContainer);

    // Subscribe to auto-joiner controller changes
    controller.subscribe(newState => {
      updateDockContent(newState, config);
    });

    // Check if background queue is already running
    checkInitialQueueStatus(config);
  }

  updateDockContent(state, config);
  startSearchPageAutoScanner(config);
}

let searchAutoScanTimer: any = null;
let lastDetectedCount = -1;
let searchPageObserver: MutationObserver | null = null;

/**
 * Rapidly updates DOM elements in the assistant dock when new groups are detected,
 * without interrupting the user's focus or typing in the caption textarea.
 */
function refreshDiscoveredGroupsInDock(cards: ScannedCardResult[]) {
  if (!shadowRoot) return;
  const count = cards.length;

  // 1. Update preview toggle count
  const toggleEl = shadowRoot.getElementById('btn-toggle-groups');
  if (toggleEl) {
    const strongEl = toggleEl.querySelector('strong');
    if (strongEl) {
      strongEl.textContent = `${count} Groups`;
    }
  }

  // 2. Update select dropdown option 0
  const optZero = shadowRoot.querySelector('#agp-select-target option[value="0"]');
  if (optZero) {
    optZero.textContent = `All Found (${count})`;
  }

  // 3. Update Start campaign button text
  const startBtn = shadowRoot.getElementById('btn-start-campaign');
  if (startBtn && !campaignState.isRunning) {
    const target = targetGroupCount > 0 ? targetGroupCount : count;
    startBtn.innerHTML = `<span>🚀</span> Start Join & Post (${target} Groups)`;
  }

  // 4. Update group list box if visible
  const listBox = shadowRoot.querySelector('.groups-list-box');
  if (listBox) {
    if (cards.length > 0) {
      listBox.innerHTML = cards
        .map(
          s => `
        <div class="group-row">
          <span style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${s.item.name}">
            ${s.item.name}
          </span>
          <span class="group-badge" style="background: ${s.item.privacy === 'PUBLIC' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${s.item.privacy === 'PUBLIC' ? '#34d399' : '#fbbf24'};">
            ${s.item.privacy}
          </span>
        </div>
      `
        )
        .join('');
    } else {
      listBox.innerHTML = `<div style="text-align: center; color: #64748b; font-size: 11px; padding: 10px;">Scrolling page to detect group cards...</div>`;
    }
  }

  // 5. Update stats grid in JOIN ONLY mode
  const foundStat = shadowRoot.querySelector('.stats-grid .stat-item:first-child .stat-num');
  if (foundStat) {
    foundStat.textContent = String(count);
  }
}

/**
 * Actively monitors Facebook search page hydration, scrolling, and DOM mutations
 * to continuously update detected groups and count in real-time.
 */
function startSearchPageAutoScanner(config?: AutoJoinConfig) {
  if (searchAutoScanTimer) return;

  const scanAndSync = () => {
    if (campaignState.isRunning) return;
    const cards = scanPageForGroupCards();
    if (cards.length !== lastDetectedCount) {
      lastDetectedCount = cards.length;
      refreshDiscoveredGroupsInDock(cards);

      // If user is not currently typing in textarea or viewing list, safely refresh state
      const isFocused = shadowRoot?.activeElement?.id === 'agp-caption-input';
      if (!isFocused && !isGroupsListExpanded) {
        const controller = AutoJoinerController.getInstance();
        updateDockContent(controller.getState(), config);
      }
    }
  };

  searchAutoScanTimer = setInterval(scanAndSync, 1200);

  // Staggered early scans as Facebook React hydrates search feed
  setTimeout(scanAndSync, 300);
  setTimeout(scanAndSync, 800);
  setTimeout(scanAndSync, 1600);
  setTimeout(scanAndSync, 3000);

  // Window scroll event (debounced)
  let scrollDebounce: any = null;
  window.addEventListener('scroll', () => {
    if (scrollDebounce) clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(scanAndSync, 300);
  }, { passive: true });

  // DOM MutationObserver for infinite scroll & GraphQL insertions
  if (typeof MutationObserver !== 'undefined' && document.body) {
    if (searchPageObserver) searchPageObserver.disconnect();
    searchPageObserver = new MutationObserver(() => {
      if (scrollDebounce) clearTimeout(scrollDebounce);
      scrollDebounce = setTimeout(scanAndSync, 450);
    });
    searchPageObserver.observe(document.body, { childList: true, subtree: true });
  }
}

/**
 * Checks if background queue is already active when page loads.
 */
function checkInitialQueueStatus(config?: AutoJoinConfig) {
  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'GET_QUEUE_STATE' }, (resp) => {
        const qState = (resp as any)?.state || (resp as any)?.payload?.state;
        const qStats = (resp as any)?.stats || (resp as any)?.payload?.stats;
        if (resp?.success && qState?.isRunning) {
          campaignState.isRunning = true;
          campaignState.isPaused = Boolean(qState.isPaused);
          campaignState.status = qState.isPaused ? 'PAUSED' : 'RUNNING';
          campaignState.total = qStats?.total || 0;
          campaignState.completed = qStats?.completed || 0;
          campaignState.failed = qStats?.failed || 0;
          campaignState.skipped = qStats?.skipped || 0;
          campaignState.currentGroupName = qState.expectedGroupName || 'Facebook Group';
          campaignState.message = `Auto-posting in progress (${campaignState.completed}/${campaignState.total} done)...`;
          startCampaignPolling();
          const controller = AutoJoinerController.getInstance();
          updateDockContent(controller.getState(), config);
        }
      });
    }
  } catch (_) {}
}

/**
 * Starts continuous polling while posting campaign is executing.
 */
function startCampaignPolling() {
  if (campaignPollTimer) clearInterval(campaignPollTimer);

  campaignPollTimer = setInterval(() => {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ type: 'GET_QUEUE_STATE' }, (resp) => {
          if (chrome.runtime.lastError || !resp?.success) return;

          const qState = (resp as any)?.state || (resp as any)?.payload?.state;
          const qStats = (resp as any)?.stats || (resp as any)?.payload?.stats;

          if (!qState || !qStats) return;

          if (qState.isRunning) {
            campaignState.isRunning = true;
            campaignState.isPaused = Boolean(qState.isPaused);
            campaignState.status = qState.isPaused ? 'PAUSED' : 'RUNNING';
            campaignState.total = qStats.total || 0;
            campaignState.completed = qStats.completed || 0;
            campaignState.failed = qStats.failed || 0;
            campaignState.skipped = qStats.skipped || 0;
            campaignState.currentGroupName = qState.expectedGroupName || '';
            campaignState.message = campaignState.isPaused
              ? 'Campaign paused by user.'
              : `🚀 Posting to: "${campaignState.currentGroupName || 'Group'}" (${campaignState.completed}/${campaignState.total} done)...`;
          } else {
            // Queue completed or stopped
            if (campaignState.isRunning) {
              campaignState.isRunning = false;
              campaignState.isPaused = false;
              campaignState.status = 'COMPLETED';
              campaignState.completed = qStats.completed || campaignState.completed;
              campaignState.total = qStats.total || campaignState.total;
              campaignState.message = `🎉 Campaign Finished! Successfully posted to ${campaignState.completed} groups.`;
              clearInterval(campaignPollTimer);
              campaignPollTimer = null;
            }
          }

          const controller = AutoJoinerController.getInstance();
          updateDockContent(controller.getState());
        });
      }
    } catch (_) {
      if (campaignPollTimer) {
        clearInterval(campaignPollTimer);
        campaignPollTimer = null;
      }
    }
  }, 1000);
}

/**
 * Renders and attaches all event handlers inside the shadow DOM.
 */
function updateDockContent(state: AutoJoinState, initialConfig?: AutoJoinConfig) {
  if (!shadowRoot) return;

  const query = extractSearchQuery(window.location.href);
  const scannedCards = scanPageForGroupCards();
  const detectedGroupCount = scannedCards.length || state.totalFound;

  const isAutoJoinRunning = state.status === 'SEARCHING' || state.status === 'JOINING';
  const isCampaignRunning = campaignState.isRunning && !campaignState.isPaused;
  const isCampaignPaused = campaignState.isPaused;
  const isAnyRunning = isAutoJoinRunning || isCampaignRunning;

  // Status Color
  const statusColor = isCampaignRunning
    ? '#10b981'
    : isCampaignPaused
    ? '#f59e0b'
    : state.status === 'JOINING'
    ? '#10b981'
    : state.status === 'SEARCHING'
    ? '#3b82f6'
    : state.status === 'PAUSED'
    ? '#f59e0b'
    : campaignState.status === 'COMPLETED'
    ? '#10b981'
    : '#6366f1';

  // Minimized Floating Pill View
  if (isDockMinimized) {
    const summaryText = campaignState.isRunning
      ? `Posting: ${campaignState.completed}/${campaignState.total}`
      : isAutoJoinRunning
      ? `Joining: ${state.joinedCount}`
      : `Auto-Poster: ${detectedGroupCount} Groups`;

    shadowRoot.innerHTML = `
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .mini-badge {
          display: flex;
          align-items: center;
          gap: 9px;
          background: rgba(15, 23, 42, 0.96);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          padding: 8px 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.6), 0 0 15px rgba(99, 102, 241, 0.3);
          color: white;
          cursor: pointer;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .mini-badge:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 14px 35px rgba(0,0,0,0.7), 0 0 20px rgba(99, 102, 241, 0.4);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${statusColor};
          ${isAnyRunning ? 'animation: pulse 1.5s infinite;' : ''}
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      </style>
      <div id="agp-dock-expand" class="mini-badge">
        <div class="dot"></div>
        <span style="font-size: 13px; font-weight: 700; letter-spacing: -0.2px;">${summaryText}</span>
        <span style="font-size: 12px; color: #94a3b8; margin-left: 2px;">↗</span>
      </div>
    `;

    const expandEl = shadowRoot.getElementById('agp-dock-expand');
    if (expandEl) {
      expandEl.onclick = () => {
        isDockMinimized = false;
        updateDockContent(state, initialConfig);
      };
    }
    return;
  }

  // Full Expanded Dock Card View
  const percentCompleted =
    campaignState.total > 0
      ? Math.min(100, Math.round((campaignState.completed / campaignState.total) * 100))
      : 0;

  shadowRoot.innerHTML = `
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      
      .dock-card {
        width: 410px;
        max-width: calc(100vw - 32px);
        max-height: calc(100vh - 40px);
        overflow-y: auto;
        background: rgba(15, 23, 42, 0.96);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 20px;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(99, 102, 241, 0.25);
        color: #f8fafc;
        padding: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .dock-card::-webkit-scrollbar {
        width: 6px;
      }
      .dock-card::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
      }
      .dock-card::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;
      }
      .dock-card:hover {
        border-color: rgba(99, 102, 241, 0.45);
      }
      
      /* Header */
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;
        padding-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .title-group {
        display: flex;
        align-items: center;
        gap: 9px;
      }
      .badge-icon {
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #6366f1, #3b82f6);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 900;
        font-size: 16px;
        color: white;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
      }
      .title {
        font-size: 14px;
        font-weight: 800;
        letter-spacing: -0.2px;
        color: #ffffff;
      }
      .subtitle {
        font-size: 11px;
        color: #94a3b8;
        max-width: 190px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 3px 8px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        background: ${statusColor}22;
        color: ${statusColor};
        border: 1px solid ${statusColor}55;
      }
      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${statusColor};
        ${isAnyRunning ? 'animation: pulse 1.5s infinite;' : ''}
      }
      @keyframes pulse {
        0% { transform: scale(0.95); opacity: 0.8; }
        50% { transform: scale(1.3); opacity: 1; }
        100% { transform: scale(0.95); opacity: 0.8; }
      }
      .icon-btn {
        background: transparent;
        border: none;
        color: #64748b;
        cursor: pointer;
        font-size: 13px;
        padding: 4px 6px;
        border-radius: 6px;
        transition: all 0.15s;
      }
      .icon-btn:hover {
        color: #f1f5f9;
        background: rgba(255, 255, 255, 0.1);
      }

      /* Tabs */
      .tabs-nav {
        display: flex;
        background: rgba(0, 0, 0, 0.35);
        border-radius: 10px;
        padding: 3px;
        gap: 4px;
        margin-bottom: 12px;
        border: 1px solid rgba(255, 255, 255, 0.06);
      }
      .tab-btn {
        flex: 1;
        padding: 7px 10px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: #94a3b8;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: all 0.2s;
      }
      .tab-btn.active {
        background: #2563eb;
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(37, 99, 235, 0.4);
      }
      .tab-btn:hover:not(.active) {
        color: #f1f5f9;
        background: rgba(255, 255, 255, 0.05);
      }
      .hot-badge {
        font-size: 8px;
        font-weight: 800;
        background: #ef4444;
        color: white;
        padding: 1px 4px;
        border-radius: 4px;
      }

      /* Form Elements */
      .form-section {
        margin-bottom: 12px;
      }
      .label-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 6px;
      }
      .form-label {
        font-size: 11px;
        font-weight: 700;
        color: #cbd5e1;
        display: flex;
        align-items: center;
        gap: 5px;
      }
      .action-link {
        font-size: 10px;
        color: #818cf8;
        background: transparent;
        border: none;
        cursor: pointer;
        font-weight: 600;
        padding: 1px 4px;
      }
      .action-link:hover {
        color: #a5b4fc;
        text-decoration: underline;
      }
      .caption-input {
        width: 100%;
        min-height: 72px;
        max-height: 140px;
        resize: vertical;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 10px;
        padding: 8px 10px;
        font-size: 12px;
        line-height: 1.45;
        color: #f8fafc;
        font-family: inherit;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .caption-input:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
      }
      .caption-input::placeholder {
        color: #64748b;
      }
      .char-count {
        font-size: 10px;
        color: #64748b;
        text-align: right;
        margin-top: 3px;
      }

      /* Photos Preview Area */
      .photos-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        margin-top: 6px;
      }
      .photo-thumb-wrapper {
        position: relative;
        width: 58px;
        height: 58px;
        border-radius: 9px;
        overflow: visible;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: #1e293b;
      }
      .photo-thumb-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        display: block;
      }
      .photo-remove-btn {
        position: absolute;
        top: -6px;
        right: -6px;
        width: 18px;
        height: 18px;
        background: #ef4444;
        border: 1.5px solid #0f172a;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.4);
        transition: transform 0.15s;
      }
      .photo-remove-btn:hover {
        transform: scale(1.15);
        background: #dc2626;
      }
      .btn-add-photos {
        height: 58px;
        min-width: 90px;
        padding: 8px 12px;
        background: rgba(30, 41, 59, 0.7);
        border: 1px dashed rgba(255, 255, 255, 0.25);
        border-radius: 9px;
        color: #94a3b8;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        transition: all 0.2s;
      }
      .btn-add-photos:hover {
        background: rgba(59, 130, 246, 0.15);
        border-color: #3b82f6;
        color: #60a5fa;
      }

      /* Options Grid */
      .options-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-bottom: 12px;
      }
      .select-box {
        width: 100%;
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 6px 8px;
        font-size: 11px;
        color: #f1f5f9;
        font-family: inherit;
        outline: none;
        cursor: pointer;
      }
      .select-box:focus {
        border-color: #3b82f6;
      }

      /* Discovered Groups Accordion */
      .groups-preview-toggle {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(30, 41, 59, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 11px;
        font-weight: 600;
        color: #94a3b8;
        cursor: pointer;
        margin-bottom: 12px;
        transition: background 0.15s;
      }
      .groups-preview-toggle:hover {
        background: rgba(30, 41, 59, 0.8);
        color: #f1f5f9;
      }
      .groups-list-box {
        max-height: 120px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 8px;
        padding: 6px;
        margin-bottom: 12px;
      }
      .group-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 6px;
        border-radius: 5px;
        font-size: 11px;
        color: #e2e8f0;
      }
      .group-row:hover {
        background: rgba(255, 255, 255, 0.05);
      }
      .group-badge {
        font-size: 9px;
        padding: 1px 5px;
        border-radius: 4px;
        font-weight: 600;
      }

      /* Stats & Progress */
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 6px;
        margin-bottom: 10px;
        background: rgba(30, 41, 59, 0.65);
        padding: 8px 6px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.06);
      }
      .stat-item {
        text-align: center;
      }
      .stat-num {
        font-size: 14px;
        font-weight: 800;
        color: #f1f5f9;
        line-height: 1.2;
      }
      .stat-label {
        font-size: 9px;
        color: #94a3b8;
        text-transform: uppercase;
        font-weight: 600;
        margin-top: 2px;
      }
      .message-box {
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 10px;
        padding: 9px 12px;
        font-size: 11px;
        color: #cbd5e1;
        margin-bottom: 10px;
        min-height: 38px;
        display: flex;
        align-items: center;
        line-height: 1.35;
      }
      .progress-container {
        height: 6px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 12px;
      }
      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #3b82f6, #10b981);
        transition: width 0.4s ease;
      }

      /* Buttons */
      .btn-row {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
      }
      .btn {
        flex: 1;
        padding: 10px 14px;
        border: none;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        transition: all 0.2s;
      }
      .btn-post-primary {
        background: linear-gradient(135deg, #2563eb, #1d4ed8);
        color: white;
        box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
      }
      .btn-post-primary:hover {
        background: linear-gradient(135deg, #1d4ed8, #1e40af);
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(37, 99, 235, 0.5);
      }
      .btn-join-primary {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
      }
      .btn-join-primary:hover {
        background: linear-gradient(135deg, #059669, #047857);
      }
      .btn-pause {
        background: #f59e0b;
        color: #0f172a;
      }
      .btn-pause:hover {
        background: #d97706;
      }
      .btn-stop {
        background: #ef4444;
        color: white;
      }
      .btn-stop:hover {
        background: #dc2626;
      }

      /* Footer */
      .footer-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 8px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
      }
      .link-btn {
        background: transparent;
        border: none;
        color: #818cf8;
        font-size: 11px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: underline;
        padding: 2px 4px;
      }
      .link-btn:hover { color: #a5b4fc; }
    </style>

    <div class="dock-card">
      <!-- Header -->
      <div class="header">
        <div class="title-group">
          <div class="badge-icon">⚡</div>
          <div>
            <div class="title" style="display: flex; align-items: center; gap: 6px;">
              <span>Facebook Group Assistant</span>
              <span style="font-size: 9px; font-weight: 700; background: rgba(37, 99, 235, 0.2); color: #60a5fa; padding: 1px 5px; border-radius: 4px; border: 1px solid rgba(37, 99, 235, 0.4);">TURBO 🚀</span>
            </div>
            <div class="subtitle" title="${query ? query : 'Facebook Groups'}">
              ${query ? `Search: "${query}"` : 'Group Search Results'}
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
          <div class="status-pill">
            <div class="status-dot"></div>
            <span>${isCampaignRunning ? 'POSTING' : isCampaignPaused ? 'PAUSED' : isAutoJoinRunning ? 'JOINING' : state.status}</span>
          </div>
          <button id="agp-dock-min" class="icon-btn" title="Minimize">−</button>
          <button id="agp-dock-close" class="icon-btn" title="Dismiss">✕</button>
        </div>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="tabs-nav">
        <button id="tab-post" class="tab-btn ${activeTab === 'POST_AND_JOIN' ? 'active' : ''}">
          <span>🚀 Auto-Join & Post</span>
          <span class="hot-badge">NEW</span>
        </button>
        <button id="tab-join" class="tab-btn ${activeTab === 'JOIN_ONLY' ? 'active' : ''}">
          <span>⚡ Join Only</span>
        </button>
      </div>

      ${
        activeTab === 'POST_AND_JOIN'
          ? `
        <!-- ================= POST & JOIN MODE ================= -->
        <!-- Caption Section -->
        <div class="form-section">
          <div class="label-row">
            <label class="form-label">
              <span>📝 Product Caption (ক্যাপশন)</span>
            </label>
            ${
              draftCaption
                ? `<button id="btn-clear-caption" class="action-link">Clear</button>`
                : ''
            }
          </div>
          <textarea
            id="agp-caption-input"
            class="caption-input"
            placeholder="এখানে আপনার পণ্যের বিবরণ, দাম ও মোবাইল নাম্বার লিখুন... (Type or paste your product caption here)"
          >${draftCaption}</textarea>
          <div class="char-count">${draftCaption.length} chars</div>
        </div>

        <!-- Photos Section -->
        <div class="form-section">
          <div class="label-row">
            <label class="form-label">
              <span>📸 Product Photos (${draftPhotos.length} Added)</span>
            </label>
            ${
              draftPhotos.length > 0
                ? `<button id="btn-clear-photos" class="action-link">Remove All</button>`
                : ''
            }
          </div>
          <input
            type="file"
            id="agp-file-input"
            accept="image/*,video/*"
            multiple
            style="display: none;"
          />
          <div class="photos-container">
            ${draftPhotos
              .map(
                (photo, idx) => `
                <div class="photo-thumb-wrapper">
                  <img src="${photo}" class="photo-thumb-img" alt="Photo ${idx + 1}" />
                  <button class="photo-remove-btn" data-index="${idx}" title="Remove photo">✕</button>
                </div>
              `
              )
              .join('')}
            <button id="btn-trigger-upload" class="btn-add-photos" title="Add photos from your computer">
              <span style="font-size: 16px;">📷</span>
              <span>+ Add Photos</span>
            </button>
          </div>
        </div>

        <!-- Options: Targeting & Delay -->
        <div class="options-grid">
          <div>
            <div class="form-label" style="margin-bottom: 4px;">Target Groups</div>
            <select id="agp-select-target" class="select-box">
              <option value="0" ${targetGroupCount === 0 ? 'selected' : ''}>All Found (${detectedGroupCount})</option>
              <option value="5" ${targetGroupCount === 5 ? 'selected' : ''}>Top 5 Groups</option>
              <option value="10" ${targetGroupCount === 10 ? 'selected' : ''}>Top 10 Groups</option>
              <option value="20" ${targetGroupCount === 20 ? 'selected' : ''}>Top 20 Groups</option>
            </select>
          </div>
          <div>
            <div class="form-label" style="margin-bottom: 4px;">Pacing Delay</div>
            <select id="agp-select-delay" class="select-box">
              <option value="0" ${pacingDelaySec === 0 ? 'selected' : ''}>Turbo (0s Delay)</option>
              <option value="5" ${pacingDelaySec === 5 ? 'selected' : ''}>5 Sec (Recommended)</option>
              <option value="10" ${pacingDelaySec === 10 ? 'selected' : ''}>10 Seconds</option>
              <option value="20" ${pacingDelaySec === 20 ? 'selected' : ''}>20 Seconds</option>
              <option value="30" ${pacingDelaySec === 30 ? 'selected' : ''}>30 Seconds</option>
            </select>
          </div>
        </div>

        <!-- Discovered Groups Accordion -->
        <div id="btn-toggle-groups" class="groups-preview-toggle">
          <span>👥 Found on Search Page: <strong style="color: #60a5fa;">${detectedGroupCount} Groups</strong></span>
          <span>${isGroupsListExpanded ? '▲ Hide' : '▼ View List'}</span>
        </div>
        ${
          isGroupsListExpanded
            ? `
          <div class="groups-list-box">
            ${
              scannedCards.length > 0
                ? scannedCards
                    .map(
                      s => `
                  <div class="group-row">
                    <span style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${s.item.name}">
                      ${s.item.name}
                    </span>
                    <span class="group-badge" style="background: ${s.item.privacy === 'PUBLIC' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${s.item.privacy === 'PUBLIC' ? '#34d399' : '#fbbf24'};">
                      ${s.item.privacy}
                    </span>
                  </div>
                `
                    )
                    .join('')
                : `<div style="text-align: center; color: #64748b; font-size: 11px; padding: 10px;">Scrolling page to detect group cards...</div>`
            }
          </div>
        `
            : ''
        }

        <!-- Progress Bar when running -->
        ${
          campaignState.isRunning || campaignState.total > 0
            ? `
          <div class="progress-container">
            <div class="progress-bar" style="width: ${percentCompleted}%;"></div>
          </div>
        `
            : ''
        }

        <!-- Status Message Box -->
        <div class="message-box">
          ${campaignState.message}
        </div>

        <!-- Action Buttons -->
        <div class="btn-row">
          ${
            !campaignState.isRunning && !isCampaignPaused
              ? `<button id="btn-start-campaign" class="btn btn-post-primary">
                   <span>🚀</span> Start Join & Post (${targetGroupCount > 0 ? targetGroupCount : detectedGroupCount} Groups)
                 </button>`
              : campaignState.isRunning
              ? `<button id="btn-pause-campaign" class="btn btn-pause">⏸ Pause</button>
                 <button id="btn-stop-campaign" class="btn btn-stop">⏹ Stop</button>`
              : `<button id="btn-resume-campaign" class="btn btn-post-primary">▶ Resume</button>
                 <button id="btn-stop-campaign" class="btn btn-stop">⏹ Stop</button>`
          }
        </div>
        `
          : `
        <!-- ================= JOIN ONLY MODE ================= -->
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-num" style="color: #60a5fa;">${detectedGroupCount}</div>
            <div class="stat-label">Found</div>
          </div>
          <div class="stat-item">
            <div class="stat-num" style="color: #34d399;">${state.joinedCount}</div>
            <div class="stat-label">Joined</div>
          </div>
          <div class="stat-item">
            <div class="stat-num" style="color: #fbbf24;">${state.requestedCount}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-item">
            <div class="stat-num" style="color: #a78bfa;">${state.alreadyJoinedCount}</div>
            <div class="stat-label">Member</div>
          </div>
        </div>

        <div class="message-box">
          ${state.message || 'Ready to auto-join all groups on this search page and save them to your list.'}
        </div>

        <div class="btn-row">
          ${
            !isAutoJoinRunning && state.status !== 'PAUSED'
              ? `<button id="btn-start-join" class="btn btn-join-primary">
                   <span>▶</span> Auto-Join All Groups
                 </button>`
              : isAutoJoinRunning
              ? `<button id="btn-pause-join" class="btn btn-pause">⏸ Pause</button>
                 <button id="btn-stop-join" class="btn btn-stop">⏹ Stop</button>`
              : `<button id="btn-resume-join" class="btn btn-join-primary">▶ Resume</button>
                 <button id="btn-stop-join" class="btn btn-stop">⏹ Stop</button>`
          }
        </div>
        `
      }

      <!-- Footer Actions -->
      <div class="footer-actions">
        <span style="font-size: 10px; color: #64748b;">Groups auto-saved to database</span>
        <button id="btn-view-groups" class="link-btn">View My Groups / Queue ↗</button>
      </div>
    </div>
  `;

  // Attach Event Listeners
  attachDockEventListeners(state, initialConfig);
}

/**
 * Attaches DOM events inside the shadow root.
 */
function attachDockEventListeners(state: AutoJoinState, initialConfig?: AutoJoinConfig) {
  if (!shadowRoot) return;

  // Window Controls
  shadowRoot.getElementById('agp-dock-close')?.addEventListener('click', () => {
    if (autoJoinContainer) {
      autoJoinContainer.remove();
      autoJoinContainer = null;
      shadowRoot = null;
    }
  });

  shadowRoot.getElementById('agp-dock-min')?.addEventListener('click', () => {
    isDockMinimized = true;
    updateDockContent(state, initialConfig);
  });

  shadowRoot.getElementById('btn-view-groups')?.addEventListener('click', () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ type: 'OPEN_DASHBOARD' });
      }
    } catch (_) {}
  });

  // Tab Switchers
  shadowRoot.getElementById('tab-post')?.addEventListener('click', () => {
    activeTab = 'POST_AND_JOIN';
    updateDockContent(state, initialConfig);
  });

  shadowRoot.getElementById('tab-join')?.addEventListener('click', () => {
    activeTab = 'JOIN_ONLY';
    updateDockContent(state, initialConfig);
  });

  // Caption Input
  const captionEl = shadowRoot.getElementById('agp-caption-input') as HTMLTextAreaElement | null;
  if (captionEl) {
    captionEl.addEventListener('input', () => {
      draftCaption = captionEl.value;
      saveDraftToStorage();
      const countEl = shadowRoot?.querySelector('.char-count');
      if (countEl) countEl.textContent = `${draftCaption.length} chars`;
    });
  }

  shadowRoot.getElementById('btn-clear-caption')?.addEventListener('click', () => {
    draftCaption = '';
    saveDraftToStorage();
    updateDockContent(state, initialConfig);
  });

  // Photo Upload Trigger & File Input
  const fileInput = shadowRoot.getElementById('agp-file-input') as HTMLInputElement | null;
  shadowRoot.getElementById('btn-trigger-upload')?.addEventListener('click', () => {
    fileInput?.click();
  });

  if (fileInput) {
    fileInput.addEventListener('change', async () => {
      if (fileInput.files && fileInput.files.length > 0) {
        const newUrls: string[] = [];
        for (let i = 0; i < fileInput.files.length; i++) {
          try {
            const dataUrl = await fileToDataUrl(fileInput.files[i]);
            newUrls.push(dataUrl);
          } catch (err) {
            console.warn('[AGP:SearchPoster] File convert error:', err);
          }
        }
        draftPhotos = [...draftPhotos, ...newUrls];
        await saveDraftToStorage();
        updateDockContent(state, initialConfig);
      }
    });
  }

  // Remove individual photo
  shadowRoot.querySelectorAll('.photo-remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idxStr = (btn as HTMLElement).getAttribute('data-index');
      if (idxStr !== null) {
        const idx = parseInt(idxStr, 10);
        if (!isNaN(idx) && idx >= 0 && idx < draftPhotos.length) {
          draftPhotos.splice(idx, 1);
          saveDraftToStorage();
          updateDockContent(state, initialConfig);
        }
      }
    });
  });

  shadowRoot.getElementById('btn-clear-photos')?.addEventListener('click', () => {
    draftPhotos = [];
    saveDraftToStorage();
    updateDockContent(state, initialConfig);
  });

  // Targeting & Delay Selectors
  const targetSelect = shadowRoot.getElementById('agp-select-target') as HTMLSelectElement | null;
  if (targetSelect) {
    targetSelect.addEventListener('change', () => {
      targetGroupCount = parseInt(targetSelect.value, 10) || 0;
      saveDraftToStorage();
      updateDockContent(state, initialConfig);
    });
  }

  const delaySelect = shadowRoot.getElementById('agp-select-delay') as HTMLSelectElement | null;
  if (delaySelect) {
    delaySelect.addEventListener('change', () => {
      pacingDelaySec = parseInt(delaySelect.value, 10) || 0;
      saveDraftToStorage();
    });
  }

  // Toggle Groups Preview Accordion
  shadowRoot.getElementById('btn-toggle-groups')?.addEventListener('click', () => {
    isGroupsListExpanded = !isGroupsListExpanded;
    updateDockContent(state, initialConfig);
  });

  // Campaign Buttons
  shadowRoot.getElementById('btn-start-campaign')?.addEventListener('click', () => {
    launchPostCampaign(state, initialConfig);
  });

  shadowRoot.getElementById('btn-pause-campaign')?.addEventListener('click', () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ type: 'PAUSE_QUEUE' });
        campaignState.isPaused = true;
        campaignState.status = 'PAUSED';
        campaignState.message = 'Posting campaign paused.';
        updateDockContent(state, initialConfig);
      }
    } catch (_) {}
  });

  shadowRoot.getElementById('btn-resume-campaign')?.addEventListener('click', () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ type: 'RESUME_QUEUE' });
        campaignState.isPaused = false;
        campaignState.status = 'RUNNING';
        campaignState.message = 'Resuming campaign...';
        updateDockContent(state, initialConfig);
      }
    } catch (_) {}
  });

  shadowRoot.getElementById('btn-stop-campaign')?.addEventListener('click', () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ type: 'STOP_QUEUE' });
        campaignState.isRunning = false;
        campaignState.isPaused = false;
        campaignState.status = 'IDLE';
        campaignState.message = 'Campaign stopped.';
        if (campaignPollTimer) {
          clearInterval(campaignPollTimer);
          campaignPollTimer = null;
        }
        updateDockContent(state, initialConfig);
      }
    } catch (_) {}
  });

  // Auto-Join Mode Buttons
  shadowRoot.getElementById('btn-start-join')?.addEventListener('click', () => {
    const ctrl = AutoJoinerController.getInstance();
    ctrl.start(initialConfig || {
      searchUrl: window.location.href,
      delaySec: 0,
      maxGroups: 0,
      autoAnswerQuestions: true,
      defaultAnswer: 'Yes, I agree to the group rules and guidelines.',
      saveToGroups: true,
    });
  });

  shadowRoot.getElementById('btn-pause-join')?.addEventListener('click', () => {
    AutoJoinerController.getInstance().pause();
  });

  shadowRoot.getElementById('btn-resume-join')?.addEventListener('click', () => {
    AutoJoinerController.getInstance().resume();
  });

  shadowRoot.getElementById('btn-stop-join')?.addEventListener('click', () => {
    AutoJoinerController.getInstance().stop();
  });
}

/**
 * Orchestrates scanning groups, saving post & groups, and initiating background queue execution.
 */
async function launchPostCampaign(state: AutoJoinState, initialConfig?: AutoJoinConfig) {
  // Validate input
  if (!draftCaption.trim() && draftPhotos.length === 0) {
    campaignState.message = '⚠️ অনুগ্রহ করে পোস্টের ক্যাপশন অথবা অন্তত একটি ছবি যুক্ত করুন (Please add caption or photos).';
    updateDockContent(state, initialConfig);
    return;
  }

  campaignState.status = 'SCANNING';
  campaignState.message = '🔍 Scanning search results for Facebook groups...';
  updateDockContent(state, initialConfig);

  // Progressive scanning with auto-scroll up to the desired target count
  const targetDesired = targetGroupCount > 0 ? targetGroupCount : 10;
  let scanned = scanPageForGroupCards();
  let scrollAttempts = 0;

  while (scanned.length < targetDesired && scrollAttempts < 6) {
    scrollAttempts++;
    campaignState.message = `🔍 Scanning search results... Found ${scanned.length}/${targetDesired} groups...`;
    updateDockContent(state, initialConfig);
    window.scrollBy({ top: 1000, behavior: 'smooth' });
    await new Promise(r => setTimeout(r, 800));
    scanned = scanPageForGroupCards();
  }

  if (scanned.length === 0) {
    campaignState.status = 'ERROR';
    campaignState.message = '⚠️ কোনো ফেসবুক গ্রুপ পাওয়া যায়নি। পেজটি স্ক্রোল করুন অথবা সার্চ লিঙ্ক চেক করুন।';
    updateDockContent(state, initialConfig);
    return;
  }

  const targetCards = targetGroupCount > 0 ? scanned.slice(0, targetGroupCount) : scanned;

  campaignState.message = `Saving ${targetCards.length} groups to database...`;
  updateDockContent(state, initialConfig);

  // Save discovered groups to persistent storage
  const existingGroups = await getGroups();
  const existingMap = new Map(
    existingGroups.map(g => [g.groupId ? g.groupId.toLowerCase() : g.id.toLowerCase(), g])
  );

  const groupsToSave: Group[] = [];
  const groupIds: string[] = [];

  for (const s of targetCards) {
    const slugOrId = s.item.groupId || s.item.id;
    const cleanUrl = s.item.url || `https://www.facebook.com/groups/${encodeURIComponent(slugOrId)}/`;
    let grp = existingMap.get(slugOrId.toLowerCase());

    if (!grp) {
      grp = {
        id: generateId('grp'),
        groupId: slugOrId,
        name: s.item.name || 'Facebook Group',
        url: cleanUrl,
        category: 'Search Result',
        privacy: s.item.privacy,
        enabled: true,
        selected: true,
        status: 'READY',
        postCount: 0,
        verified: true,
        source: 'facebook-ui',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      groupsToSave.push(grp);
      existingMap.set(slugOrId.toLowerCase(), grp);
    }
    groupIds.push(grp.id);
  }

  const allMergedGroups = [...existingGroups, ...groupsToSave];
  if (groupsToSave.length > 0) {
    await setGroups(allMergedGroups);
  }

  // Create & save Post
  const postId = `search_post_${Date.now()}`;
  const newPost: Post = {
    id: postId,
    title: draftCaption.slice(0, 40) || 'Product Post',
    productName: draftCaption.slice(0, 30) || 'Product',
    caption: draftCaption,
    description: draftCaption,
    images: draftPhotos,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const existingPosts = await getPosts();
  await setPosts([newPost, ...existingPosts.filter(p => p.id !== postId)]);

  // Start background queue execution
  campaignState.isRunning = true;
  campaignState.isPaused = false;
  campaignState.status = 'RUNNING';
  campaignState.total = groupIds.length;
  campaignState.completed = 0;
  campaignState.failed = 0;
  campaignState.skipped = 0;
  campaignState.message = `🚀 Campaign started! Visiting & posting to ${groupIds.length} groups...`;
  updateDockContent(state, initialConfig);

  try {
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        {
          type: 'CREATE_AND_START_QUEUE',
          payload: {
            groupIds,
            postId,
            delaySec: pacingDelaySec,
            groups: allMergedGroups,
            post: newPost,
          },
        },
        (resp) => {
          if (resp?.success) {
            console.log('[AGP:SearchPoster] Campaign successfully queued.');
            startCampaignPolling();
          } else {
            campaignState.status = 'ERROR';
            campaignState.isRunning = false;
            campaignState.message = `Failed to start campaign: ${resp?.error || 'Unknown error'}`;
            updateDockContent(state, initialConfig);
          }
        }
      );
    }
  } catch (err) {
    campaignState.status = 'ERROR';
    campaignState.isRunning = false;
    campaignState.message = `Error starting campaign: ${String(err)}`;
    updateDockContent(state, initialConfig);
  }
}
