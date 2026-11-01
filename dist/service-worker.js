const Ae = {
  status: "IDLE",
  searchUrl: "",
  query: "",
  totalFound: 0,
  joinedCount: 0,
  requestedCount: 0,
  alreadyJoinedCount: 0,
  failedCount: 0,
  skippedCount: 0,
  currentIndex: 0,
  currentGroupName: "",
  countdownSec: 0,
  message: "Enter any Facebook search link to start auto-joining.",
  groups: []
}, M = {
  general: {
    extensionName: "AI Group Poster",
    theme: "dark",
    notificationsEnabled: !0,
    defaultLanguage: "Bangla"
  },
  queue: {
    autoOpenNextGroup: !0,
    requireConfirmation: !0,
    delayBetweenItemsSec: 0,
    maxItemsPerSession: 50
  },
  ai: {
    provider: "openai",
    endpoint: "https://api.openai.com/v1",
    apiKey: "",
    model: "gpt-4o-mini",
    temperature: 0.7,
    defaultLanguage: "Bangla",
    defaultStyle: "Marketplace"
  },
  facebook: {
    supportedDomains: ["facebook.com", "web.facebook.com", "m.facebook.com"],
    pageDetectionIntervalMs: 1500,
    helperDockEnabled: !0,
    helperDockCollapsedDefault: !1
  },
  webhook: {
    enabled: !1,
    endpoint: "",
    secret: ""
  },
  hasCompletedOnboarding: !1
}, pe = [
  {
    id: "tpl_marketplace_sale",
    name: "Standard Marketplace Sale",
    content: `🔥 {product_name} 🔥

💰 Price: {price} {old_price_tag}

📝 Details:
{description}

✨ Key Features:
{features}

📍 Location: {location}
🚚 Delivery: {delivery_info}
📞 Contact: {contact_info}

👉 {call_to_action}`,
    variables: ["product_name", "price", "old_price", "description", "features", "location", "delivery_info", "contact_info", "call_to_action"],
    isDefault: !0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "tpl_bike_vehicle",
    name: "Bike & Vehicle Sale",
    content: `🏍️ {product_name} For Sale

💵 Asking Price: {price}
📍 Location: {location}

📋 Condition & Description:
{description}

⚙️ Specifications:
{features}

📦 Delivery / Hand-to-Hand: {delivery_info}
📱 Call/WhatsApp: {contact_info}

{call_to_action}`,
    variables: ["product_name", "price", "description", "features", "location", "delivery_info", "contact_info", "call_to_action"],
    isDefault: !1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "tpl_minimal_quick",
    name: "Minimalist Quick Post",
    content: `{product_name}

Price: {price}
Location: {location}

{description}

Inbox for direct order!`,
    variables: ["product_name", "price", "location", "description"],
    isDefault: !1,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
], E = {
  GROUPS: "agp_groups",
  ACCOUNT_GROUPS: "agp_facebook_groups_by_account",
  POSTS: "agp_posts",
  TEMPLATES: "agp_templates",
  QUEUE: "agp_queue",
  QUEUE_STATE: "agp_queue_state",
  HISTORY: "agp_history",
  LOGS: "agp_logs",
  SETTINGS: "agp_settings",
  FACEBOOK_ACCOUNT: "agp_facebook_account",
  AUTO_JOIN_STATE: "agp_auto_join_state",
  AUTO_JOIN_CONFIG: "agp_auto_join_config"
}, fe = () => {
  var e;
  return typeof chrome < "u" && !!((e = chrome.storage) != null && e.local);
}, j = {};
async function P(e, t) {
  if (fe())
    return new Promise((a) => {
      chrome.storage.local.get([e], (n) => {
        if (chrome.runtime.lastError) {
          console.warn(`Storage get error for ${e}:`, chrome.runtime.lastError), a(j[e] !== void 0 ? j[e] : t);
          return;
        }
        n && n[e] !== void 0 ? a(n[e]) : a(t);
      });
    });
  try {
    if (typeof window < "u" && window.localStorage) {
      const a = window.localStorage.getItem(e);
      if (a !== null)
        return JSON.parse(a);
    }
  } catch (a) {
    console.warn("LocalStorage access failed:", a);
  }
  return j[e] !== void 0 ? j[e] : t;
}
async function v(e, t) {
  if (j[e] = t, fe())
    return new Promise((a, n) => {
      chrome.storage.local.set({ [e]: t }, () => {
        chrome.runtime.lastError ? n(chrome.runtime.lastError) : a();
      });
    });
  try {
    typeof window < "u" && window.localStorage && window.localStorage.setItem(e, JSON.stringify(t));
  } catch (a) {
    console.warn("LocalStorage set failed:", a);
  }
}
function we(e) {
  return e && e.trim().toLowerCase().replace(/[^a-z0-9_\u0980-\u09FF]/gi, "_") || "default_account";
}
async function ae() {
  return P(E.ACCOUNT_GROUPS, {});
}
let se = !1;
async function ce() {
  const e = await ae(), t = /* @__PURE__ */ new Map(), a = (r) => {
    if (!r || !r.id || Z(r)) return;
    const s = (r.groupId || r.url || r.id).toLowerCase();
    if (!t.has(s))
      t.set(s, { ...r });
    else {
      const c = t.get(s);
      r.name && (!c.name || r.name.length > c.name.length) && (c.name = r.name), r.imageUrl && !c.imageUrl && (c.imageUrl = r.imageUrl), r.privacy && r.privacy !== "UNKNOWN" && (c.privacy = r.privacy);
    }
  };
  for (const r of Object.keys(e)) {
    const s = e[r];
    s && Array.isArray(s.groups) && s.groups.forEach(a);
  }
  (await P(E.GROUPS, [])).forEach(a);
  const i = Array.from(t.values());
  return i.filter((r) => r.selected).length > 50 && (i.forEach((r) => {
    r.selected = !1;
  }), se || (se = !0, Se().catch(() => {
  }))), i;
}
async function Se() {
  var n;
  const e = await ae();
  let t = !1;
  for (const i of Object.keys(e))
    (n = e[i]) != null && n.groups && Array.isArray(e[i].groups) && (e[i].groups = e[i].groups.map((o) => ({ ...o, selected: !1 })), t = !0);
  t && await v(E.ACCOUNT_GROUPS, e);
  const a = await P(E.GROUPS, []);
  if (a.some((i) => i.selected)) {
    const i = a.map((o) => ({ ...o, selected: !1 }));
    await v(E.GROUPS, i);
  }
}
async function R(e) {
  if (e === "all")
    return ce();
  const t = await k(), a = we(e || (t == null ? void 0 : t.userId) || (t == null ? void 0 : t.name)), n = await ae();
  if (n[a] && Array.isArray(n[a].groups) && n[a].groups.length > 0) {
    const c = n[a].groups.filter((p) => !Z(p));
    if (c.length > 0)
      return c.filter((p) => p.selected).length > 50 && c.forEach((p) => {
        p.selected = !1;
      }), c;
  }
  const o = (await P(E.GROUPS, [])).filter((s) => !Z(s));
  if (o.length > 0)
    return o.filter((s) => s.selected).length > 50 && o.forEach((s) => {
      s.selected = !1;
    }), o;
  const r = await ce();
  return r.length > 0 ? r : [];
}
async function te(e, t) {
  const a = (e || []).filter((s) => !Z(s)), n = await k(), i = we(t || (n == null ? void 0 : n.userId) || (n == null ? void 0 : n.name)), o = await ae(), r = o[i] || {
    accountContext: i,
    accountInfo: n || { isLoggedIn: !0, name: "Facebook User", lastSyncedAt: Date.now() },
    groups: [],
    lastSyncedAt: Date.now()
  };
  o[i] = {
    ...r,
    groups: a,
    lastSyncedAt: Date.now()
  }, await v(E.ACCOUNT_GROUPS, o), await v(E.GROUPS, a);
}
function Z(e) {
  if (!e) return !0;
  const t = (e.name || "").trim().toLowerCase(), a = (e.url || "").trim().toLowerCase();
  if (t.startsWith("unread") || t.includes("commented on") || t.includes("also commented") || t.includes("likes your") || t.includes("liked your") || t.includes("reacted to") || t.includes("shared a post") || t.includes("shared your post") || t.includes("invited you") || t.includes("mentioned you") || t.includes("requested to join") || t.includes("মন্তব্য করেছেন") || t.includes("মতামত দিয়েছেন") || t.includes("লাইক দিয়েছেন") || t.includes("শেয়ার করেছেন") || a.includes("/permalink/") || a.includes("/posts/") || a.includes("/user/") || a.includes("/profile.php") || a.includes("/friends/") || a.includes("/people/") || a.includes("/photos/") || a.includes("/videos/") || a.includes("/events/") || a.includes("/files/") || a.includes("comment_id=") || a.includes("notif_id=") || a.includes("notif_t=") || a.includes("reply_comment_id="))
    return !0;
  const n = /* @__PURE__ */ new Set([
    "about",
    "about group",
    "feed",
    "discover",
    "create",
    "notifications",
    "search",
    "categories",
    "joins",
    "settings",
    "help",
    "privacy",
    "terms",
    "policies",
    "support",
    "messages",
    "marketplace"
  ]), i = t.replace(/\s*group\s*$/i, "").trim();
  return !!(n.has(t) || n.has(i) || e.groupId && n.has(e.groupId.toLowerCase()));
}
async function V() {
  return P(E.POSTS, []);
}
async function ge() {
  return P(E.TEMPLATES, pe);
}
async function $() {
  return P(E.QUEUE, []);
}
async function ne(e) {
  await v(E.QUEUE, e);
}
const Te = {
  isRunning: !1,
  isPaused: !1,
  currentItemId: null,
  activeTabId: null,
  sessionStartedAt: null,
  pacingDelayRemaining: 0
};
async function A() {
  return P(E.QUEUE_STATE, Te);
}
async function O(e) {
  await v(E.QUEUE_STATE, e);
}
async function Ce() {
  return P(E.HISTORY, []);
}
async function Pe(e) {
  await v(E.HISTORY, e);
}
async function me(e) {
  const t = await Ce();
  t.unshift(e), t.length > 500 && (t.length = 500), await Pe(t);
}
async function De() {
  return P(E.LOGS, []);
}
async function ve(e) {
  await v(E.LOGS, e);
}
async function Oe(e) {
  const t = await De();
  t.unshift(e), t.length > 300 && (t.length = 300), await ve(t);
}
async function J() {
  const e = await P(E.SETTINGS, M);
  return {
    ...M,
    ...e,
    general: { ...M.general, ...(e == null ? void 0 : e.general) || {} },
    queue: { ...M.queue, ...(e == null ? void 0 : e.queue) || {} },
    ai: { ...M.ai, ...(e == null ? void 0 : e.ai) || {} },
    facebook: { ...M.facebook, ...(e == null ? void 0 : e.facebook) || {} },
    webhook: { ...M.webhook, ...(e == null ? void 0 : e.webhook) || {} }
  };
}
async function he(e) {
  const t = await J(), a = {
    ...t,
    ...e,
    general: { ...t.general, ...e.general || {} },
    queue: { ...t.queue, ...e.queue || {} },
    ai: { ...t.ai, ...e.ai || {} },
    facebook: { ...t.facebook, ...e.facebook || {} },
    webhook: { ...t.webhook, ...e.webhook || {} }
  };
  return await v(E.SETTINGS, a), a;
}
async function k() {
  return P(E.FACEBOOK_ACCOUNT, null);
}
async function ee(e) {
  await v(E.FACEBOOK_ACCOUNT, e);
}
async function Ue() {
  return P(E.AUTO_JOIN_STATE, Ae);
}
async function ue(e) {
  await v(E.AUTO_JOIN_STATE, e);
}
async function Ge(e) {
  await v(E.AUTO_JOIN_CONFIG, e);
}
function X(e = "id") {
  const t = Math.random().toString(36).substring(2, 9), a = Date.now().toString(36);
  return `${e}_${a}_${t}`;
}
function q(e) {
  if (!e) return "";
  if (!e.includes("{") || !e.includes("|")) return e;
  let t = e, a = 0;
  const n = /\{([^{}]+)\}/g;
  for (; a < 10 && n.test(t); )
    a++, t = t.replace(n, (i, o) => {
      if (o.includes("|")) {
        const r = o.split("|").map((s) => s.trim()).filter(Boolean);
        if (r.length > 0)
          return r[Math.floor(Math.random() * r.length)];
      }
      return i;
    });
  return t = t.replace(/\{([^{}\r\n]+?)(?=[.,!?\r\n]|$)/g, (i, o) => o.includes("|") ? o.split("|").map((s) => s.trim()).filter(Boolean)[0] || "" : i), t;
}
function ke(e) {
  if (!e) return "https://www.facebook.com/search/groups/?q=";
  const t = e.trim();
  if (t.startsWith("http://") || t.startsWith("https://"))
    try {
      const a = new URL(t);
      if (a.hostname.includes("facebook.com") || a.hostname.includes("fb.com")) {
        if (a.pathname.includes("/search/groups"))
          return t;
        const n = a.searchParams.get("q");
        return n ? `https://www.facebook.com/search/groups/?q=${encodeURIComponent(n)}` : t;
      }
    } catch {
    }
  return t.includes("facebook.com/search/groups") || t.includes("fb.com/search/groups") ? `https://${t.replace(/^https?:\/\//, "")}` : `https://www.facebook.com/search/groups/?q=${encodeURIComponent(t)}`;
}
class Ne extends Error {
  constructor(t, a, n) {
    super(n || `Invalid queue transition from ${t} to ${a}`), this.from = t, this.to = a, this.name = "QueueTransitionError";
  }
}
const Re = {
  PENDING: ["READY", "IN_PROGRESS", "SKIPPED", "FAILED", "POSTED"],
  READY: ["IN_PROGRESS", "SKIPPED", "PENDING", "FAILED", "POSTED"],
  IN_PROGRESS: ["WAITING_FOR_USER", "FAILED", "SKIPPED", "READY", "POSTED"],
  WAITING_FOR_USER: ["POSTED", "SKIPPED", "FAILED", "READY", "IN_PROGRESS"],
  POSTED: ["READY"],
  // Can reset/retry to ready
  SKIPPED: ["READY", "PENDING"],
  // Can un-skip or retry
  FAILED: ["READY", "PENDING", "SKIPPED"]
  // Can retry
};
function Le(e, t) {
  if (e === t) return !0;
  const a = Re[e];
  return !!(a && a.includes(t));
}
function Me(e, t, a) {
  if (!Le(e.status, t))
    throw new Ne(e.status, t);
  const n = Date.now(), i = {
    ...e,
    status: t
  };
  return t === "IN_PROGRESS" && !e.startedAt && (i.startedAt = n), (t === "POSTED" || t === "SKIPPED" || t === "FAILED") && (i.completedAt = n), t === "FAILED" ? (i.errorMessage = "Operation failed", i.retryCount = (e.retryCount || 0) + 1) : t === "READY" && e.status === "FAILED" && (i.errorMessage = void 0), i;
}
class Fe {
  async writeLog(t, a, n, i) {
    const o = {
      id: X("log"),
      timestamp: Date.now(),
      level: t,
      source: a,
      message: n,
      details: i
    }, r = `[AGP:${a.toUpperCase()}][${t}]`;
    t === "ERROR" ? console.error(r, n, i || "") : t === "WARNING" ? console.warn(r, n, i || "") : console.log(r, n, i || "");
    try {
      await Oe(o);
    } catch (s) {
      console.warn("Failed to persist log entry:", s);
    }
    return o;
  }
  info(t, a, n) {
    return this.writeLog("INFO", t, a, n);
  }
  success(t, a, n) {
    return this.writeLog("SUCCESS", t, a, n);
  }
  warning(t, a, n) {
    return this.writeLog("WARNING", t, a, n);
  }
  error(t, a, n) {
    return this.writeLog("ERROR", t, a, n);
  }
}
const S = new Fe();
function qe(e) {
  const t = {
    total: e.length,
    pending: 0,
    ready: 0,
    inProgress: 0,
    waitingForUser: 0,
    posted: 0,
    skipped: 0,
    failed: 0
  };
  return e.forEach((a) => {
    switch (a.status) {
      case "PENDING":
        t.pending++;
        break;
      case "READY":
        t.ready++;
        break;
      case "IN_PROGRESS":
        t.inProgress++;
        break;
      case "WAITING_FOR_USER":
        t.waitingForUser++;
        break;
      case "POSTED":
        t.posted++;
        break;
      case "SKIPPED":
        t.skipped++;
        break;
      case "FAILED":
        t.failed++;
        break;
    }
  }), t;
}
async function We(e, t, a = "READY", n, i) {
  const [o, r] = await Promise.all([R(), V()]), s = n && n.length > 0 ? n : o, c = i || r.find((g) => g.id === t);
  let p = 0;
  const f = e.map((g) => {
    p++;
    const u = s.find(
      (d) => d.id === g || d.groupId && d.groupId.toLowerCase() === g.toLowerCase() || d.url && d.url.includes(g)
    );
    let h = u == null ? void 0 : u.url;
    return h || (g.startsWith("http") ? h = g : !g.startsWith("grp_") && !g.startsWith("queue_") ? h = `https://www.facebook.com/groups/${g}/` : h = ""), {
      id: X("queue"),
      groupId: g,
      groupName: u ? u.name : "Facebook Group",
      groupUrl: h,
      postId: t,
      caption: (c == null ? void 0 : c.caption) || (c == null ? void 0 : c.description) || void 0,
      media: void 0,
      // Lean: post.images will be used directly to avoid gigabytes of duplicate base64
      status: a,
      order: p,
      createdAt: Date.now()
    };
  });
  return await ne(f), await S.info("queue", `Created clean posting queue for ${f.length} groups`), f;
}
function Ie(e) {
  const t = e.find((a) => a.status === "READY");
  return t || e.find((a) => a.status === "PENDING") || null;
}
async function oe(e, t, a) {
  const n = await $(), i = n.findIndex((r) => r.id === e);
  if (i === -1)
    throw new Error(`Queue item ${e} not found`);
  const o = Me(n[i], t);
  return n[i] = o, await ne(n), { queue: n, updatedItem: o };
}
async function $e(e, t) {
  const { queue: a, updatedItem: n } = await oe(e, "POSTED"), [i, o] = await Promise.all([R(), V()]), r = i.find((f) => f.id === n.groupId), s = o.find((f) => f.id === n.postId), c = n.startedAt ? Math.max(1, Math.round((Date.now() - n.startedAt) / 1e3)) : void 0, p = {
    id: X("hist"),
    queueItemId: n.id,
    groupId: n.groupId,
    groupName: r ? r.name : "Unknown Group",
    groupUrl: r ? r.url : "",
    postId: n.postId,
    postTitle: s ? s.title : "Untitled Post",
    productName: s ? s.productName : "",
    status: "POSTED",
    postedAt: Date.now(),
    notes: "User confirmed posting on Facebook",
    durationSeconds: c
  };
  return await me(p), r && (r.postCount = (r.postCount || 0) + 1, r.lastPostedAt = Date.now(), r.status = "POSTED", await te(i)), await S.success("queue", `Post marked as POSTED for group: ${r ? r.name : n.groupId}`), n;
}
async function ie(e, t = "User skipped") {
  const { updatedItem: a } = await oe(e, "SKIPPED"), [n, i] = await Promise.all([R(), V()]), o = n.find((c) => c.id === a.groupId), r = i.find((c) => c.id === a.postId), s = {
    id: X("hist"),
    queueItemId: a.id,
    groupId: a.groupId,
    groupName: o ? o.name : "Unknown Group",
    groupUrl: o ? o.url : "",
    postId: a.postId,
    postTitle: r ? r.title : "Untitled Post",
    productName: r ? r.productName : "",
    status: "SKIPPED",
    postedAt: Date.now(),
    notes: t
  };
  return await me(s), await S.info("queue", `Post marked as SKIPPED for group: ${o ? o.name : a.groupId}`), a;
}
function xe(e, t) {
  return {
    product_name: e.productName || "",
    title: e.title || "",
    price: e.price || "",
    old_price: e.oldPrice || "",
    old_price_tag: e.oldPrice ? `(Regular: ${e.oldPrice})` : "",
    description: e.description || "",
    features: e.features || "",
    location: e.location || "",
    delivery_info: e.deliveryInfo || "",
    contact_info: e.contactInfo || "",
    call_to_action: e.callToAction || "",
    caption: e.caption || ""
  };
}
function Qe(e, t) {
  if (!e) return "";
  const a = e.replace(/\{([a-zA-Z0-9_-]+)\}/g, (i, o) => {
    const r = o.toLowerCase();
    return r in t && t[r] !== void 0 ? t[r] : "";
  });
  return q(a).split(`
`).filter((i) => {
    const o = i.trim();
    return o ? !/^(💰\s*Price:\s*|📍\s*Location:\s*|🚚\s*Delivery:\s*|📞\s*Contact:\s*|✨\s*Key Features:\s*|📝\s*Details:\s*|👉\s*|📋\s*Condition.*:\s*|⚙️\s*Specifications:\s*|📦\s*Delivery.*:\s*|📱\s*Call.*:\s*|💵\s*Asking Price:\s*)$/i.test(
      o
    ) : !0;
  }).join(`
`).replace(/\n{3,}/g, `

`).trim();
}
function Be(e, t) {
  if (e.caption && !t)
    return q(e.caption);
  if (t) {
    const i = xe(e), o = Qe(t, i);
    if (o.trim()) return q(o);
  }
  if (e.caption && e.caption.trim())
    return q(e.caption.trim());
  const a = [], n = e.productName || e.title;
  if (n && n !== "Facebook Group Listing" && n !== "Untitled Post" && a.push(n), e.price && e.price.trim()) {
    const i = e.oldPrice ? `Price: ${e.price} (Prev: ${e.oldPrice})` : `Price: ${e.price}`;
    a.push(i);
  }
  return e.description && e.description.trim() && a.push(e.description.trim()), e.features && e.features.trim() && a.push(`Features:
${e.features.trim()}`), e.location && e.location.trim() && a.push(`Location: ${e.location.trim()}`), e.deliveryInfo && e.deliveryInfo.trim() && a.push(`Delivery: ${e.deliveryInfo.trim()}`), e.contactInfo && e.contactInfo.trim() && a.push(`Contact: ${e.contactInfo.trim()}`), e.callToAction && e.callToAction.trim() && a.push(e.callToAction.trim()), a.join(`

`).trim();
}
function Ke(e) {
  if (!e || typeof e != "string") return e || "";
  const t = e.trim();
  if (t.length < 30) return e;
  const a = t.length, n = Math.floor(a / 2);
  for (let o = -15; o <= 15; o++) {
    const r = n + o;
    if (r > 15 && r < a - 15) {
      const s = t.slice(0, r).trim(), c = t.slice(r).trim();
      if (s.length >= 15 && s === c)
        return s;
    }
  }
  const i = t.split(`
`).filter((o) => o.trim().length > 0);
  if (i.length >= 4) {
    const o = Math.floor(i.length / 2), r = i.slice(0, o).join(`
`).trim(), s = i.slice(o).join(`
`).trim();
    if (r.length >= 25 && r === s)
      return r;
  }
  return e;
}
async function B(e, t) {
  try {
    const a = await J();
    if (!a.webhook.enabled || !a.webhook.endpoint)
      return;
    const n = {
      "Content-Type": "application/json",
      "User-Agent": "AIGroupPoster-Extension/1.0"
    };
    a.webhook.secret && (n["x-agp-secret"] = a.webhook.secret);
    const i = {
      event: e,
      timestamp: Date.now(),
      payload: t
    };
    fetch(a.webhook.endpoint, {
      method: "POST",
      headers: n,
      body: JSON.stringify(i)
    }).catch((o) => {
      S.warning("queue", `Webhook dispatch to ${a.webhook.endpoint} failed: ${o}`);
    });
  } catch (a) {
    console.warn("Webhook error:", a);
  }
}
function Ye(e, t) {
  if (!e || !e.trim())
    return t ? t.split(/[-_.]+/).filter(Boolean).map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ") : "Facebook Group";
  let a = e.trim();
  return a = a.replace(/^(?:Visit|Open|View|গ্রুপ দেখুন|দেখুন)\s+/i, ""), a = a.replace(/\s*(?:Last active|You last visited|last visited|active)\s+[^\n]+/i, ""), a = a.replace(/\s*(?:গত|আগে|মিনিট আগে|ঘণ্টা আগে|দিন আগে)[^\n]*/i, ""), a = a.replace(/\s*·\s*(?:Public group|Private group|পাবলিক গ্রুপ|প্রাইভেট গ্রুপ).*$/i, ""), a = a.replace(/\s*·\s*\d+.*members.*$/i, ""), a = a.replace(/\s*·\s*[০-৯\d]+.*সদস্য.*$/i, ""), a = a.replace(/\s*·\s*[^\n]+/i, ""), (a.toLowerCase() === "visit" || a.toLowerCase() === "group" || a.toLowerCase() === "view group") && t ? t.split(/[-_.]+/).filter(Boolean).map((n) => n.charAt(0).toUpperCase() + n.slice(1)).join(" ") : a.trim() || "Facebook Group";
}
const re = "agp_discovery_progress";
function Ve() {
  return {
    candidateCount: 0,
    verifiedCount: 0,
    duplicatesRemoved: 0,
    rejectedCount: 0,
    scrollIterations: 0,
    mutationEvents: 0,
    targetCount: null,
    targetCountStatus: "UNAVAILABLE",
    completionReason: null,
    scanDurationMs: 0,
    lastNewGroupTimestamp: null
  };
}
const le = {
  state: "NOT_CONNECTED",
  foundCount: 0,
  importedCount: 0,
  duplicateCount: 0,
  errorCount: 0,
  message: 'Click "Sync Facebook Groups" to discover all joined groups.',
  debugMetrics: Ve()
};
async function de() {
  var e;
  return typeof chrome < "u" && ((e = chrome.storage) != null && e.local) ? new Promise((t) => {
    chrome.storage.local.get([re], (a) => {
      t(a[re] || le);
    });
  }) : le;
}
async function F(e) {
  var t;
  typeof chrome < "u" && ((t = chrome.storage) != null && t.local) && await chrome.storage.local.set({ [re]: e });
}
async function Ee(e, t) {
  var b;
  const a = (t == null ? void 0 : t.accountContext) || ((b = await k()) == null ? void 0 : b.name) || "default_account", n = await R(a), i = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), s = (l) => l.trim().toLowerCase().replace(/\s+/g, " ");
  n.forEach((l) => {
    l.groupId && i.set(l.groupId.toLowerCase(), l), l.url && o.set(l.url.toLowerCase().replace(/\/$/, ""), l), l.name && r.set(s(l.name), l);
  });
  let c = 0, p = 0;
  const f = Date.now(), g = [], u = /* @__PURE__ */ new Set();
  for (const l of e) {
    if (Z(l)) continue;
    const C = (l.groupId || "").toLowerCase(), y = (l.url || "").toLowerCase().replace(/\/$/, ""), U = s(l.name || "");
    let _ = (C ? i.get(C) : void 0) || (y ? o.get(y) : void 0) || (U && U.length >= 3 ? r.get(U) : void 0);
    const I = Ye(l.name || "", l.groupId);
    if (_)
      p++, u.add(_.id), I && (!_.name || _.name.includes("·") || _.name.length < I.length) && (_.name = I), l.imageUrl && !_.imageUrl && (_.imageUrl = l.imageUrl), l.privacy && l.privacy !== "UNKNOWN" && (_.privacy = l.privacy), _.verified = !0, _.source = "facebook-ui", _.accountContext = a, _.discoveredAt = f, _.updatedAt = f;
    else {
      c++;
      const T = l.groupId ? `grp_${l.groupId.replace(/[^a-zA-Z0-9_-]/g, "")}` : X("grp"), Q = l.url.startsWith("http") ? l.url : `https://www.facebook.com/groups/${l.groupId}/`, G = {
        id: T,
        name: I,
        url: Q,
        groupId: l.groupId,
        privacy: l.privacy || "UNKNOWN",
        imageUrl: l.imageUrl,
        category: "Discovered",
        enabled: !0,
        selected: !1,
        // Do NOT auto-select by default; user explicitly picks groups
        status: "READY",
        postCount: 0,
        verified: !0,
        source: "facebook-ui",
        accountContext: a,
        discoveredAt: f,
        createdAt: f,
        updatedAt: f
      };
      g.push(G), C && i.set(C, G), y && o.set(y, G), U && r.set(U, G), u.add(G.id);
    }
  }
  let h;
  if ((t == null ? void 0 : t.syncMode) === "exact") {
    const l = (y) => y.source === "manual" || y.category && y.category !== "Discovered", C = n.filter((y) => u.has(y.id) || l(y));
    h = [...g, ...C];
  } else
    h = [...g, ...n];
  const d = [], w = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Set();
  for (const l of h) {
    const C = l.url.toLowerCase().replace(/\/$/, "");
    !w.has(l.id) && !m.has(C) && (w.add(l.id), m.add(C), d.push(l));
  }
  return await te(d, a), await S.info(
    "dashboard",
    `Group discovery merged (${(t == null ? void 0 : t.syncMode) || "merge"}): ${c} imported, ${p} duplicates, total ${d.length}`
  ), {
    imported: c,
    duplicates: p,
    totalStored: d.length,
    verifiedCount: d.filter((l) => l.verified).length
  };
}
console.log("[AGP:Background] Service Worker starting with Group Discovery...");
chrome.runtime.onInstalled.addListener(async (e) => {
  console.log("[AGP:Background] Extension installed/updated:", e.reason);
  try {
    const t = await J();
    t ? t.queue && t.queue.delayBetweenItemsSec > 3 && (t.queue.delayBetweenItemsSec = 0, await he(t)) : await chrome.storage.local.set({ agp_settings: M }), await _e();
    const a = await ge();
    (!a || a.length === 0) && await chrome.storage.local.set({ agp_templates: pe }), await S.info("background", `AI Group Poster installed/updated (${e.reason})`);
  } catch (t) {
    console.error("Error during onInstalled initialization:", t);
  }
});
async function _e() {
  try {
    const e = await $();
    let t = !1;
    const a = e.map((n) => n.media && n.media.length > 0 ? (t = !0, { ...n, media: void 0 }) : n);
    if (t || e.length > 100) {
      const n = a.filter((i) => i.status === "READY" || i.status === "IN_PROGRESS");
      await chrome.storage.local.set({ agp_queue: n }), console.log("[AGP:Background] Pruned storage bloat from agp_queue.");
    }
  } catch (e) {
    console.warn("[AGP:Background] Clean storage bloat error:", e);
  }
}
_e();
async function x(e, t) {
  try {
    if (!(await J()).general.notificationsEnabled) return;
    chrome.notifications && chrome.notifications.create({
      type: "basic",
      iconUrl: chrome.runtime.getURL("icons/icon48.png"),
      title: e,
      message: t,
      priority: 1
    });
  } catch (a) {
    console.warn("Could not show notification:", a);
  }
}
async function Je(e) {
  let t = e;
  for (; t > 0; ) {
    const n = await A();
    if (!n.isRunning || n.isPaused)
      break;
    await O({ ...n, pacingDelayRemaining: t }), await new Promise((i) => setTimeout(i, 1e3)), t--;
  }
  const a = await A();
  await O({ ...a, pacingDelayRemaining: 0 });
}
let H = null, z = null;
async function L() {
  if (H) return H;
  try {
    const e = await chrome.storage.local.get("agp_active_posting_window_id");
    e != null && e.agp_active_posting_window_id && (H = e.agp_active_posting_window_id);
  } catch {
  }
  return H;
}
async function K(e) {
  H = e;
  try {
    e ? await chrome.storage.local.set({ agp_active_posting_window_id: e }) : await chrome.storage.local.remove("agp_active_posting_window_id");
  } catch {
  }
}
async function Y() {
  if (z) return z;
  try {
    const e = await chrome.storage.local.get("agp_active_posting_tab_id");
    e != null && e.agp_active_posting_tab_id && (z = e.agp_active_posting_tab_id);
  } catch {
  }
  return z;
}
async function D(e) {
  z = e;
  try {
    e ? await chrome.storage.local.set({ agp_active_posting_tab_id: e }) : await chrome.storage.local.remove("agp_active_posting_tab_id");
  } catch {
  }
}
async function N() {
  var d;
  const e = await $(), t = Ie(e);
  if (!t) {
    const w = await L(), m = await Y();
    if (w) {
      try {
        await chrome.windows.remove(w);
      } catch {
      }
      await K(null), await D(null);
    } else if (m) {
      try {
        await chrome.tabs.remove(m);
      } catch {
      }
      await D(null);
    }
    const b = await A();
    await O({
      ...b,
      isRunning: !1,
      isPaused: !1,
      currentItemId: null,
      expectedGroupId: null,
      expectedGroupName: null,
      expectedGroupUrl: null,
      pacingDelayRemaining: 0
    }), await x("Queue Completed", "All eligible items in the posting queue have been processed."), await S.success("queue", "Queue session completed successfully"), await B("QUEUE_COMPLETED", { totalProcessed: e.length });
    return;
  }
  const [a, n] = await Promise.all([R(), V()]);
  let i = a.find(
    (w) => w.id === t.groupId || w.groupId && t.groupId && w.groupId.toLowerCase() === t.groupId.toLowerCase() || w.url && t.groupId && w.url.includes(t.groupId)
  ), o = t.groupUrl || (i == null ? void 0 : i.url) || "";
  if (!o && t.groupId && !t.groupId.startsWith("grp_") && !t.groupId.startsWith("queue_") && (o = t.groupId.startsWith("http") ? t.groupId : `https://www.facebook.com/groups/${t.groupId}/`), !o || o.includes("/groups/grp_") || !o.includes("facebook.com")) {
    console.warn(`[AGP:Worker] Stale/invalid group URL: "${o}" for item ${t.id}. Skipping...`), await ie(t.id), await N();
    return;
  }
  const r = i || {
    id: t.groupId,
    name: t.groupName || "Facebook Group",
    url: o,
    groupId: t.groupId,
    category: "General",
    enabled: !0,
    status: "READY",
    postCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  r.url = o;
  let s = n.find((w) => w.id === t.postId) || n[n.length - 1] || n[0];
  s || (s = {
    id: t.postId || "post_default",
    title: "Facebook Group Listing",
    productName: "Facebook Group Listing",
    caption: t.caption || "",
    description: t.caption || "",
    images: t.media || [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  }), await oe(t.id, "IN_PROGRESS");
  let c, p = !1;
  const f = await L();
  if (f)
    try {
      const w = await chrome.windows.get(f, { populate: !0 });
      w && w.id && (p = !0);
    } catch {
      p = !1, await K(null), await D(null);
    }
  const g = await L();
  if (p && g) {
    const w = await Y();
    if (w)
      try {
        await chrome.tabs.update(w, { url: r.url, active: !0 }), c = w, chrome.tabs.sendMessage(w, { type: "AGP_NAVIGATE_TO_GROUP", url: r.url }).catch(() => {
        });
        try {
          await chrome.windows.update(g, { focused: !0 });
        } catch {
        }
      } catch {
        await D(null);
      }
    if (!c)
      try {
        const m = await chrome.tabs.create({
          windowId: g,
          url: r.url,
          active: !0
        });
        c = m.id, await D(m.id ?? null);
      } catch (m) {
        console.warn("[AGP:Worker] Failed to create tab inside automation window:", m);
      }
  }
  const u = await L();
  if (!c || !u)
    try {
      if (chrome.windows && chrome.windows.create) {
        const w = await chrome.windows.create({
          url: r.url,
          type: "popup",
          width: 960,
          height: 720,
          top: 60,
          left: 60,
          focused: !0
        });
        await K(w.id ?? null), w.tabs && w.tabs.length > 0 ? c = w.tabs[0].id : w.id && (c = (d = (await chrome.tabs.query({ windowId: w.id }))[0]) == null ? void 0 : d.id), await D(c ?? null);
      }
    } catch (w) {
      console.warn("[AGP:Worker] Popup window creation not supported (mobile Kiwi/Android fallback):", w);
    }
  if (!c)
    try {
      c = (await chrome.tabs.create({ url: r.url, active: !0 })).id, await D(c ?? null);
    } catch (w) {
      console.error("[AGP:Worker] Failed to create group tab:", w);
    }
  const h = await A();
  await O({
    ...h,
    isRunning: !0,
    isPaused: !1,
    currentItemId: t.id,
    activeTabId: c ?? null,
    expectedGroupId: r.groupId || r.id,
    expectedGroupName: r.name,
    expectedGroupUrl: r.url,
    currentGroupMatch: !0
  }), S.info("queue", `Opening group: ${r.name} (${r.url})`).catch(() => {
  }), x("Group Opened", `Review your prepared post for: ${r.name}`).catch(() => {
  }), B("POST_READY", { groupId: r.id, postId: s.id, groupName: r.name }).catch(() => {
  });
}
let W = null;
async function je() {
  var n, i, o;
  const e = {
    state: "DISCOVERING",
    foundCount: 0,
    importedCount: 0,
    duplicateCount: 0,
    errorCount: 0,
    outcome: "PARTIAL",
    message: "Opening Facebook sync window...",
    lastDiscoveredAt: Date.now()
  };
  await F(e);
  let t = null, a = null;
  try {
    const r = "https://www.facebook.com/groups/joins/?nav_source=tab";
    try {
      if (chrome.windows && chrome.windows.create) {
        const u = await chrome.windows.create({
          url: r,
          type: "popup",
          width: 500,
          height: 680,
          top: 80,
          left: 80,
          focused: !0
        });
        t = u.id ?? null, W = t, u.tabs && u.tabs.length > 0 ? a = u.tabs[0].id ?? null : t && (a = ((n = (await chrome.tabs.query({ windowId: t }))[0]) == null ? void 0 : n.id) ?? null);
      }
    } catch (u) {
      console.warn("[AGP:Worker] Popup creation failed, falling back to tab (mobile/Kiwi):", u);
    }
    if (a || (a = (await chrome.tabs.create({ url: r, active: !0 })).id ?? null), !a)
      throw new Error("Failed to resolve Facebook tab for group sync.");
    console.log(`[AGP:Worker] Facebook popup window created (Win #${t}, Tab #${a})`);
    const s = Date.now();
    for (; Date.now() - s < 15e3; ) {
      try {
        if ((await chrome.tabs.get(a)).status === "complete") break;
      } catch {
      }
      await new Promise((u) => setTimeout(u, 200));
    }
    if (await new Promise((u) => setTimeout(u, 400)), !await new Promise((u) => {
      chrome.tabs.sendMessage(a, { type: "CHECK_FACEBOOK_SESSION" }, (h) => {
        u(!chrome.runtime.lastError && (h == null ? void 0 : h.success));
      });
    }) && chrome.scripting)
      try {
        await chrome.scripting.executeScript({
          target: { tabId: a },
          files: ["facebook-content.js"]
        }), await new Promise((u) => setTimeout(u, 200));
      } catch (u) {
        console.warn("[AGP:Worker] Script injection warning:", u);
      }
    await F({
      state: "DISCOVERING",
      foundCount: 0,
      importedCount: 0,
      duplicateCount: 0,
      errorCount: 0,
      outcome: "PARTIAL",
      message: "Scanning Facebook joined groups...",
      lastDiscoveredAt: Date.now()
    });
    const p = await new Promise((u) => {
      chrome.tabs.sendMessage(a, { type: "START_GROUP_DISCOVERY" }, (h) => {
        chrome.runtime.lastError ? u({ success: !1, error: chrome.runtime.lastError.message }) : u(h || { success: !1, error: "No response from content script" });
      });
    });
    if (t) {
      try {
        await chrome.windows.remove(t);
      } catch (u) {
        console.warn("[AGP:Worker] Popup window auto-close note:", u);
      }
      W = null;
    }
    if (p != null && p.success && p.payload) {
      const u = p.payload, h = u.groups || [], d = u.profile, w = (d == null ? void 0 : d.userId) || (d == null ? void 0 : d.name) || void 0, m = await k(), b = ((d == null ? void 0 : d.name) || (m == null ? void 0 : m.name) || "").trim();
      m != null && m.name && (d != null && d.name) && m.name.trim().toLowerCase() !== d.name.trim().toLowerCase() && console.log(`[AGP:Worker] Account changed from "${m.name}" to "${d.name}". Isolated storage.`);
      const l = await Ee(h, {
        syncMode: "merge",
        accountContext: w
      }), C = {
        isLoggedIn: !!(d != null && d.isLoggedIn || d != null && d.name),
        name: b || "Facebook User",
        profileUrl: (d == null ? void 0 : d.profileUrl) || (m == null ? void 0 : m.profileUrl) || "https://www.facebook.com",
        avatarUrl: (d == null ? void 0 : d.avatarUrl) || (m == null ? void 0 : m.avatarUrl) || "",
        userId: (d == null ? void 0 : d.userId) || (m == null ? void 0 : m.userId) || "",
        totalGroupsCount: l.totalStored,
        lastSyncedAt: Date.now()
      };
      await ee(C);
      const y = u.outcome || (u.isPartial ? "PARTIAL" : "COMPLETE"), U = u.completionReason || (y === "COMPLETE" ? "TARGET_REACHED" : "STAGNANT_TIMEOUT");
      let _ = "";
      y === "COMPLETE" ? _ = `${l.totalStored} verified groups found — scan complete.` : _ = `${l.totalStored} verified groups found — Facebook did not expose the complete list.`;
      const I = {
        state: y === "COMPLETE" ? "DISCOVERY_COMPLETE" : "DISCOVERY_PARTIAL",
        foundCount: u.totalFoundOnPage || l.totalStored,
        importedCount: l.imported,
        duplicateCount: l.duplicates,
        errorCount: 0,
        outcome: y,
        completionReason: U,
        targetCount: ((i = u.debugMetrics) == null ? void 0 : i.targetCount) ?? null,
        targetCountStatus: ((o = u.debugMetrics) == null ? void 0 : o.targetCountStatus) ?? "UNAVAILABLE",
        debugMetrics: u.debugMetrics,
        message: _,
        lastDiscoveredAt: Date.now()
      };
      return await F(I), y === "COMPLETE" ? (await x("Facebook Groups Synced", _), await S.success("dashboard", _)) : (await x("Facebook Groups Synced (Partial)", _), await S.info("dashboard", _)), I;
    }
    const g = {
      state: "DISCOVERY_FAILED",
      foundCount: 0,
      importedCount: 0,
      duplicateCount: 0,
      errorCount: 1,
      outcome: "FAILED",
      completionReason: "NO_JOINED_GROUP_INTERFACE",
      message: (p == null ? void 0 : p.error) || "Facebook group discovery failed.",
      lastDiscoveredAt: Date.now()
    };
    return await F(g), g;
  } catch (r) {
    if (t) {
      try {
        await chrome.windows.remove(t);
      } catch {
      }
      W = null;
    }
    const c = {
      state: "DISCOVERY_FAILED",
      foundCount: 0,
      importedCount: 0,
      duplicateCount: 0,
      errorCount: 1,
      outcome: "FAILED",
      completionReason: "NO_JOINED_GROUP_INTERFACE",
      message: `Discovery error: ${r instanceof Error ? r.message : String(r)}`,
      lastDiscoveredAt: Date.now()
    };
    return await F(c), c;
  }
}
chrome.runtime.onMessage.addListener((e, t, a) => ((async () => {
  var n, i;
  try {
    switch (e.type) {
      case "START_GROUP_DISCOVERY": {
        const o = await je();
        a({ success: !0, progress: o });
        break;
      }
      case "CANCEL_GROUP_DISCOVERY": {
        if (W) {
          try {
            await chrome.windows.remove(W);
          } catch {
          }
          W = null;
        }
        await F({
          state: "DISCOVERY_PARTIAL",
          foundCount: 0,
          importedCount: 0,
          duplicateCount: 0,
          errorCount: 0,
          outcome: "CANCELLED",
          completionReason: "USER_CANCELLED",
          message: "Discovery cancelled by user.",
          lastDiscoveredAt: Date.now()
        }), a({ success: !0 });
        break;
      }
      case "GET_DISCOVERY_STATUS": {
        const o = await de();
        a({ success: !0, progress: o });
        break;
      }
      case "GROUP_BATCH_DISCOVERED": {
        const o = e.payload;
        if (o && o.liveGroups && Array.isArray(o.liveGroups)) {
          try {
            await Ee(o.liveGroups, { syncMode: "merge" });
          } catch (r) {
            console.warn("[AGP:Worker] Live batch merge warning:", r);
          }
          await F({
            state: "DISCOVERING",
            foundCount: o.verifiedCount || o.liveGroups.length,
            importedCount: o.verifiedCount || o.liveGroups.length,
            duplicateCount: o.duplicatesRemoved || 0,
            errorCount: 0,
            outcome: "PARTIAL",
            debugMetrics: o.debugMetrics,
            message: `Scanning Facebook Groups... ${o.verifiedCount || o.liveGroups.length} verified groups discovered`,
            lastDiscoveredAt: Date.now()
          });
        }
        a({ success: !0 });
        break;
      }
      case "GROUP_DISCOVERY_PROGRESS": {
        const o = e.payload;
        o && typeof o.foundCount == "number" && await F({
          state: "DISCOVERING",
          foundCount: o.foundCount,
          importedCount: o.foundCount,
          duplicateCount: 0,
          errorCount: 0,
          outcome: "PARTIAL",
          debugMetrics: o.debugMetrics,
          message: o.status || `Scanning Facebook Groups... ${o.foundCount} verified groups discovered`,
          lastDiscoveredAt: Date.now()
        }), a({ success: !0 });
        break;
      }
      case "GET_QUEUE_STATE": {
        const [o, r] = await Promise.all([$(), A()]), s = qe(o);
        a({ success: !0, queue: o, state: r, stats: s });
        break;
      }
      case "DETECT_FB_SESSION": {
        const r = (await chrome.tabs.query({})).find((s) => s.url && s.url.includes("facebook.com"));
        if (r && r.id)
          return await (async () => {
            chrome.tabs.sendMessage(r.id, { type: "GET_FACEBOOK_USER_INFO" }, async (c) => {
              const p = await R();
              if (chrome.runtime.lastError || !c) {
                if (chrome.scripting && r.id)
                  try {
                    await chrome.scripting.executeScript({
                      target: { tabId: r.id },
                      files: ["facebook-content.js"]
                    }), setTimeout(() => {
                      chrome.tabs.sendMessage(r.id, { type: "GET_FACEBOOK_USER_INFO" }, async (g) => {
                        if (g && g.profile && g.profile.isLoggedIn) {
                          const u = {
                            isLoggedIn: !0,
                            name: g.profile.name,
                            profileUrl: g.profile.profileUrl,
                            avatarUrl: g.profile.avatarUrl,
                            userId: g.profile.userId,
                            totalGroupsCount: p.length,
                            lastSyncedAt: Date.now()
                          };
                          await ee(u), a({ success: !0, account: u });
                        } else {
                          const u = await k();
                          a({ success: !0, account: u });
                        }
                      });
                    }, 400);
                    return;
                  } catch {
                  }
                const f = await k();
                a({ success: !0, account: f });
                return;
              }
              if (c && c.profile && c.profile.isLoggedIn) {
                const f = {
                  isLoggedIn: !0,
                  name: c.profile.name,
                  profileUrl: c.profile.profileUrl,
                  avatarUrl: c.profile.avatarUrl,
                  userId: c.profile.userId,
                  totalGroupsCount: p.length,
                  lastSyncedAt: Date.now()
                };
                await ee(f), a({ success: !0, account: f });
              } else {
                const f = await k();
                a({ success: !0, account: f });
              }
            });
          })(), !0;
        {
          const s = await k();
          a({ success: !0, account: s });
        }
        break;
      }
      case "FB_USER_PROFILE_DETECTED": {
        const o = e.payload;
        if (o && o.name) {
          const r = await k();
          await ee({
            isLoggedIn: !0,
            name: o.name,
            profileUrl: o.profileUrl,
            avatarUrl: o.avatarUrl,
            userId: o.userId,
            totalGroupsCount: (r == null ? void 0 : r.totalGroupsCount) || 0,
            lastSyncedAt: Date.now()
          });
        }
        a({ success: !0 });
        break;
      }
      case "START_QUEUE": {
        const o = await A();
        await O({
          ...o,
          isRunning: !0,
          isPaused: !1,
          sessionStartedAt: Date.now()
        }), await S.info("queue", "Queue execution started"), await B("QUEUE_STARTED", {}), await N(), a({ success: !0 });
        break;
      }
      case "PAUSE_QUEUE": {
        const o = await A();
        await O({ ...o, isPaused: !0 }), await S.info("queue", "Queue execution paused"), await x("Queue Paused", "Posting queue has been paused by user."), a({ success: !0 });
        break;
      }
      case "RESUME_QUEUE": {
        const o = await A();
        await O({ ...o, isPaused: !1, isRunning: !0 }), await S.info("queue", "Queue execution resumed"), await N(), a({ success: !0 });
        break;
      }
      case "CREATE_AND_START_QUEUE": {
        const o = e.payload;
        if (o && Array.isArray(o.groupIds) && o.postId) {
          const r = await J(), s = typeof o.delaySec == "number" && o.delaySec >= 0 ? o.delaySec : 0;
          await he({
            queue: { ...r.queue, delayBetweenItemsSec: s }
          });
          const c = await L();
          if (c)
            try {
              await chrome.windows.remove(c);
            } catch {
            }
          if (await K(null), await D(null), o.groups && o.groups.length > 0)
            try {
              const f = await R(), g = new Map(f.map((u) => [u.groupId ? u.groupId.toLowerCase() : u.id.toLowerCase(), u]));
              for (const u of o.groups) {
                const h = u.groupId ? u.groupId.toLowerCase() : u.id.toLowerCase();
                g.has(h) || (f.push(u), g.set(h, u));
              }
              await te(f);
            } catch (f) {
              console.warn("[AGP:Worker] Error syncing groups in CREATE_AND_START_QUEUE:", f);
            }
          if (o.post)
            try {
              const f = await V();
              await setPosts([o.post, ...f.filter((g) => g.id !== o.post.id)]);
            } catch (f) {
              console.warn("[AGP:Worker] Error syncing post in CREATE_AND_START_QUEUE:", f);
            }
          await We(o.groupIds, o.postId, "READY", o.groups, o.post);
          const p = await A();
          await O({
            ...p,
            isRunning: !0,
            isPaused: !1,
            activeTabId: null,
            sessionStartedAt: Date.now()
          }), await S.info("queue", `Sequential posting queue created for ${o.groupIds.length} groups`), await B("QUEUE_STARTED", { count: o.groupIds.length }), a({ success: !0, count: o.groupIds.length }), N().catch((f) => {
            console.error("[AGP:Worker] Error executing first queue item:", f);
          });
        } else
          a({ success: !1, error: "Invalid payload for CREATE_AND_START_QUEUE" });
        break;
      }
      case "STOP_QUEUE": {
        const o = await L(), r = await Y();
        if (o) {
          try {
            await chrome.windows.remove(o);
          } catch {
          }
          await K(null), await D(null);
        } else if (r) {
          try {
            await chrome.tabs.remove(r);
          } catch {
          }
          await D(null);
        }
        const s = await A();
        await O({
          ...s,
          isRunning: !1,
          isPaused: !1,
          currentItemId: null,
          expectedGroupId: null,
          expectedGroupName: null,
          expectedGroupUrl: null,
          pacingDelayRemaining: 0
        }), await S.info("queue", "Queue execution stopped by user"), a({ success: !0 });
        break;
      }
      case "MARK_AS_POSTED": {
        const o = await A(), r = e.payload ? e.payload.itemId : o.currentItemId;
        if (!r) {
          a({ success: !1, error: "No active item to mark as posted" });
          return;
        }
        await $e(r), x("Post Completed", "Group marked as posted.").catch(() => {
        }), B("POST_MARKED_POSTED", { itemId: r }).catch(() => {
        });
        const s = await J();
        o.isPaused || (await O({ ...o, isRunning: !0 }), s.queue.delayBetweenItemsSec > 0 && await Je(s.queue.delayBetweenItemsSec), await N()), a({ success: !0 });
        break;
      }
      case "SKIP_CURRENT_ITEM": {
        const o = await A(), r = e.payload, s = (r == null ? void 0 : r.itemId) || o.currentItemId;
        if (!s) {
          a({ success: !1, error: "No active item to skip" });
          return;
        }
        const c = (r == null ? void 0 : r.reason) || "Auto-skipped (posting unavailable or wrong group)";
        await ie(s, c), await B("POST_SKIPPED", { itemId: s, reason: c }), o.isPaused || (await O({ ...o, isRunning: !0 }), await N()), a({ success: !0 });
        break;
      }
      case "UPDATE_QUEUE_ITEM_CAPTION": {
        const o = e.payload;
        if (o != null && o.itemId && o.caption !== void 0) {
          const s = (await $()).map((c) => c.id === o.itemId ? { ...c, caption: o.caption } : c);
          await ne(s);
        }
        a({ success: !0 });
        break;
      }
      case "FB_PAGE_DETECTED": {
        const o = await A();
        if (o.currentItemId)
          try {
            await oe(o.currentItemId, "IN_PROGRESS");
          } catch {
          }
        a({ success: !0 });
        break;
      }
      case "GET_ACTIVE_POST_FOR_TAB": {
        const o = await L(), r = await Y(), s = await A();
        if (!!!(t.tab && (t.tab.id === r || o && t.tab.windowId === o || t.tab.id === s.activeTabId))) {
          a({ success: !0, payload: null, isUserTab: !0 });
          return;
        }
        const [p, f, g, u, h] = await Promise.all([
          $(),
          A(),
          R(),
          V(),
          ge()
        ]);
        let d = f.currentItemId && p.find((I) => I.id === f.currentItemId) || null;
        const w = ((n = t.tab) == null ? void 0 : n.url) || ((i = e.payload) == null ? void 0 : i.url) || "";
        if (!d && w) {
          const I = g.find((T) => w.includes(T.groupId || "") || T.url && w.includes(T.url));
          I && (d = p.find((T) => T.groupId === I.id && (T.status === "READY" || T.status === "IN_PROGRESS" || T.status === "WAITING_FOR_USER")) || null);
        }
        if (!d) {
          a({ success: !0, payload: null });
          return;
        }
        const m = g.find((I) => I.id === d.groupId) || null, b = u.find((I) => I.id === d.postId) || null;
        let l = "";
        if (d.caption)
          l = q(d.caption);
        else if (b != null && b.caption)
          l = q(b.caption);
        else if (b != null && b.description)
          l = q(b.description);
        else if (b) {
          const I = b.templateId ? h.find((T) => T.id === b.templateId) : void 0;
          l = q(Be(b, I == null ? void 0 : I.content));
        }
        l = Ke(l);
        let C = !0;
        if (m && w)
          if (!!(t.tab && (t.tab.id === s.activeTabId || t.tab.id === r)))
            C = !0;
          else {
            const T = (m.groupId || "").replace(/^grp_/, "").toLowerCase().trim(), Q = (m.url || "").toLowerCase().replace(/^https?:\/\/(www\.|m\.|web\.)?/, "").replace(/\/$/, ""), G = w.toLowerCase().replace(/^https?:\/\/(www\.|m\.|web\.)?/, "").replace(/\/$/, ""), be = T ? G.includes(T) : !1, ye = Q ? G.includes(Q) || Q.includes(G) : !1;
            (T || Q) && (C = !!(be || ye));
          }
        const y = p.findIndex((I) => I.id === d.id) + 1, U = p.filter((I) => I.status === "POSTED").length, _ = {
          queueItem: d,
          group: m,
          post: b,
          caption: l,
          formattedPost: l,
          media: d.media || (b == null ? void 0 : b.images) || [],
          queueIndex: y > 0 ? y : 1,
          totalQueueItems: p.length,
          postedCount: U,
          isGroupMatch: C,
          expectedGroupName: m ? m.name : "Expected Group",
          expectedGroupUrl: m ? m.url : ""
        };
        a({ success: !0, payload: _ });
        break;
      }
      case "OPEN_DASHBOARD": {
        const o = chrome.runtime.getURL("src/pages/dashboard/index.html"), r = await chrome.tabs.query({ url: o });
        r.length > 0 && r[0].id ? await chrome.tabs.update(r[0].id, { active: !0 }) : await chrome.tabs.create({ url: o, active: !0 }), a({ success: !0 });
        break;
      }
      case "FOCUS_POSTING_TAB":
      case "FOCUS_ACTIVE_POSTING_TAB": {
        const o = await L(), r = await Y();
        if (o)
          try {
            await chrome.windows.update(o, { focused: !0 });
          } catch {
          }
        if (r)
          try {
            await chrome.tabs.update(r, { active: !0 });
            const s = await chrome.tabs.get(r);
            s.windowId && await chrome.windows.update(s.windowId, { focused: !0 });
          } catch {
          }
        a({ success: !0 });
        break;
      }
      case "GET_DEBUG_METRICS": {
        const o = await de();
        a({ success: !0, debugMetrics: o.debugMetrics || null });
        break;
      }
      /* ================= AUTO-JOINER HANDLERS ================= */
      case "START_AUTO_JOIN": {
        const o = e.payload || {}, r = ke(o.searchUrl || ""), s = {
          searchUrl: r,
          delaySec: typeof o.delaySec == "number" ? Math.max(0, o.delaySec) : 0,
          maxGroups: typeof o.maxGroups == "number" ? o.maxGroups : 0,
          autoAnswerQuestions: o.autoAnswerQuestions !== !1,
          defaultAnswer: o.defaultAnswer || "Yes, I agree to the group rules and guidelines.",
          saveToGroups: o.saveToGroups !== !1,
          selectedCategory: o.selectedCategory || "Auto Joined"
        };
        await Ge(s), await ue({
          status: "SEARCHING",
          searchUrl: r,
          query: "",
          totalFound: 0,
          joinedCount: 0,
          requestedCount: 0,
          alreadyJoinedCount: 0,
          failedCount: 0,
          skippedCount: 0,
          currentIndex: 0,
          currentGroupName: "",
          countdownSec: 0,
          message: "Navigating to Facebook search page...",
          groups: [],
          startedAt: Date.now()
        }), await chrome.storage.local.set({
          agp_pending_auto_join: {
            active: !0,
            config: s,
            requestedAt: Date.now()
          }
        });
        const c = await chrome.tabs.query({ url: ["*://*.facebook.com/*", "*://facebook.com/*"] });
        let p = c.find((f) => f.url && f.url.includes("/search"));
        if (!p && c.length > 0 && (p = c[0]), p && p.id) {
          if (await chrome.tabs.update(p.id, { url: r, active: !0 }), p.windowId)
            try {
              await chrome.windows.update(p.windowId, { focused: !0 });
            } catch {
            }
        } else
          p = await chrome.tabs.create({ url: r, active: !0 });
        await S.info("background", `Started Auto-Join on: ${r}`), a({ success: !0, tabId: p == null ? void 0 : p.id, searchUrl: r });
        break;
      }
      case "PAUSE_AUTO_JOIN": {
        const o = await chrome.tabs.query({ url: ["*://*.facebook.com/*", "*://facebook.com/*"] });
        for (const r of o)
          r.id && chrome.tabs.sendMessage(r.id, { type: "PAUSE_AUTO_JOIN" }).catch(() => {
          });
        a({ success: !0 });
        break;
      }
      case "RESUME_AUTO_JOIN": {
        const o = await chrome.tabs.query({ url: ["*://*.facebook.com/*", "*://facebook.com/*"] });
        for (const r of o)
          r.id && chrome.tabs.sendMessage(r.id, { type: "RESUME_AUTO_JOIN" }).catch(() => {
          });
        a({ success: !0 });
        break;
      }
      case "STOP_AUTO_JOIN": {
        await chrome.storage.local.remove("agp_pending_auto_join");
        const o = await chrome.tabs.query({ url: ["*://*.facebook.com/*", "*://facebook.com/*"] });
        for (const r of o)
          r.id && chrome.tabs.sendMessage(r.id, { type: "STOP_AUTO_JOIN" }).catch(() => {
          });
        a({ success: !0 });
        break;
      }
      case "GET_AUTO_JOIN_STATE": {
        const o = await Ue();
        a({ success: !0, state: o });
        break;
      }
      case "AUTO_JOIN_PROGRESS": {
        const o = e.payload;
        o && await ue(o), a({ success: !0 });
        break;
      }
      case "AUTO_JOIN_SAVE_GROUPS": {
        const o = e.payload;
        if (o && o.group) {
          const r = await R();
          if (!r.some(
            (c) => {
              var p;
              return c.groupId && c.groupId.toLowerCase() === ((p = o.group.groupId) == null ? void 0 : p.toLowerCase()) || c.url && o.group.url && c.url.toLowerCase() === o.group.url.toLowerCase();
            }
          )) {
            const c = [...r, o.group];
            await te(c), await S.success("background", `Auto-joined group saved: "${o.group.name}" (Ready for posting)`), x("Facebook Group Added", `"${o.group.name}" is now saved and ready for posting.`);
          }
        }
        a({ success: !0 });
        break;
      }
      case "KEEPALIVE_PING": {
        a({ success: !0, timestamp: Date.now() });
        break;
      }
      default:
        a({ success: !1, error: "Unknown message type" });
    }
  } catch (o) {
    const r = o instanceof Error ? o.message : String(o);
    console.error("[AGP:Background] Handler error:", r), a({ success: !1, error: r });
  }
})(), !0));
chrome.windows.onRemoved.addListener(async (e) => {
  const t = await L();
  if (e === t) {
    console.log("[AGP:Worker] Dedicated posting automation window closed. Keeping queue active without auto-pausing."), await K(null), await D(null);
    const a = await A();
    a.isRunning && !a.isPaused && (console.log("[AGP:Worker] Queue is running; continuing next queue item..."), await N());
  } else e === W && (console.log("[AGP:Worker] Dedicated discovery window closed."), W = null);
});
chrome.tabs.onRemoved.addListener(async (e) => {
  const t = await Y();
  e === t && (console.log("[AGP:Worker] Posting tab closed. Clearing tab reference without auto-pausing."), await D(null));
});
try {
  chrome.alarms.create("AGP_QUEUE_WATCHDOG", { periodInMinutes: 0.25 });
} catch {
}
chrome.alarms.onAlarm.addListener(async (e) => {
  if (e.name === "AGP_QUEUE_WATCHDOG")
    try {
      const t = await A();
      if (t.isRunning && !t.isPaused) {
        const a = await $();
        if (Ie(a)) {
          const i = t.currentItemId ? a.find((o) => o.id === t.currentItemId) : null;
          i && i.startedAt && Date.now() - i.startedAt > 45e3 ? (console.warn(`[AGP:Watchdog] Item ${i.id} stalled for >45s. Auto-skipping to keep queue flowing...`), await ie(i.id, "Watchdog auto-recovery: Response took too long"), await N()) : t.currentItemId || (console.log("[AGP:Watchdog] Queue is active. Triggering next queue item..."), await N());
        }
      }
    } catch (t) {
      console.warn("[AGP:Watchdog] Watchdog check error:", t);
    }
});
