var xo=Object.defineProperty;var vo=(ae,Q,ce)=>Q in ae?xo(ae,Q,{enumerable:!0,configurable:!0,writable:!0,value:ce}):ae[Q]=ce;var ie=(ae,Q,ce)=>vo(ae,typeof Q!="symbol"?Q+"":Q,ce);(function(){"use strict";function ae(t){const e=[];if(!t||typeof t!="string")return{valid:!1,errors:["URL is required"]};const n=t.trim();if(!n)return{valid:!1,errors:["URL cannot be empty"]};let o=n;/^https?:\/\//i.test(o)||(o="https://"+o);let r;try{r=new URL(o)}catch{return{valid:!1,errors:["Invalid URL format"]}}const i=["facebook.com","www.facebook.com","web.facebook.com","m.facebook.com"],c=r.hostname.toLowerCase();i.some(g=>c===g||c.endsWith("."+g))||e.push("URL must be a Facebook domain (e.g. facebook.com, web.facebook.com)");const a=r.pathname.split("/").filter(Boolean),l=a.indexOf("groups");if(l===-1||l>=a.length-1)return e.push("URL must point directly to a Facebook group (e.g. /groups/group_name)"),{valid:!1,errors:e};const p=decodeURIComponent(a[l+1]);if(!p||["feed","discover","joins","about","settings","notifications","search","categories","create","help","privacy","support"].includes(p.toLowerCase()))return e.push("URL must point to a specific group, not a feed or discovery page"),{valid:!1,errors:e};const m=a.slice(l+2).map(g=>g.toLowerCase()),d=["permalink","posts","user","photos","videos","events","files","stories"];if(m.some(g=>d.includes(g)))return e.push("URL points to an individual post or permalink inside a group, not the group itself"),{valid:!1,errors:e};if(r.searchParams.has("comment_id")||r.searchParams.has("notif_id")||r.searchParams.has("notif_t"))return e.push("URL is a notification or comment permalink, not a group page"),{valid:!1,errors:e};const f=`https://www.facebook.com/groups/${p}/`;return{valid:e.length===0,errors:e,cleanUrl:f,groupId:p}}const Q={META_OG_TITLE:'meta[property="og:title"]',HEADER_H1:'h1[dir="auto"], h1 span'};function ce(){if(typeof window>"u")return{isGroupPage:!1,groupIdOrSlug:"",groupName:"",canonicalUrl:"",isReady:!1};const t=window.location.href,e=ae(t);if(!e.valid||!e.groupId)return{isGroupPage:!1,groupIdOrSlug:"",groupName:"",canonicalUrl:t,isReady:!1};let n="";const o=document.querySelector(Q.META_OG_TITLE);if(o&&o.content&&(n=o.content.replace(/\s*\|\s*Facebook.*$/i,"").trim()),!n){const i=document.querySelector(Q.HEADER_H1);i&&i.innerText&&(n=i.innerText.trim())}!n&&document.title&&(n=document.title.replace(/\s*\|\s*Facebook.*$/i,"").trim()),n||(n=e.groupId.replace(/[-_.]+/g," "),n=n.charAt(0).toUpperCase()+n.slice(1));const r=document.readyState==="interactive"||document.readyState==="complete";return{isGroupPage:!0,groupIdOrSlug:e.groupId,groupName:n,canonicalUrl:e.cleanUrl||t,isReady:r}}const tt=new Set(["feed","discover","create","notifications","search","categories","joins","member-requests","expert_badge","settings","about","events","media","files","chats","manage","canvas","support","buy_sell_discussion","permalink","user","profile.php","hashtag","messages","marketplace","stories","reels","watch","gaming","members","photos","videos","posts"]),Se=new Set(["view group","visit","open","view","join","group","groups","view all","see all","see more","গ্রুপ দেখুন","দেখুন","সব দেখুন","যোগ দিন","গ্রুপে যান","আরও দেখুন"]);function jt(t){const e={"০":"0","১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9"};return t.replace(/[০-৯]/g,n=>e[n]||n)}function qt(t){if(typeof document>"u")return{count:null,status:"UNAVAILABLE",rawText:""};const n=Array.from(document.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, div, p')),o=[/(?:All groups you['’]?ve joined|Groups you['’]?ve joined)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/(?:আপনার যোগ দেওয়া সমস্ত গ্রুপ|আপনার যোগ দেওয়া সব গ্রুপ|আপনি যেসব গ্রুপে যোগ দিয়েছেন|যোগ দেওয়া সমস্ত গ্রুপ|যোগ দেওয়া সব গ্রুপ|যোগ দেওয়া গ্রুপ|সব গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/^All groups you['’]?ve joined\s*[:\-•]?\s*([0-9,kKmM\u09E6-\u09EF.]+)$/i],r=[/(?:Joined Groups|Your Groups|আমার গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/(?:Groups|গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i],i=c=>{const s=jt(c).replace(/,/g,"").trim().toLowerCase();if(s.endsWith("k")){const l=parseFloat(s.replace("k",""));return isNaN(l)?null:Math.round(l*1e3)}if(s.endsWith("m")){const l=parseFloat(s.replace("m",""));return isNaN(l)?null:Math.round(l*1e6)}const a=parseInt(s,10);return isNaN(a)?null:a};for(const c of n){const s=(c.textContent||"").trim();if(!(s.length>120||s.length<3))for(const a of o){const l=s.match(a);if(l&&l[1]){const p=i(l[1]);if(p!==null&&p>0)return{count:p,status:"CONFIRMED",rawText:s}}}}for(const c of n){const s=(c.textContent||"").trim();if(!(s.length>80||s.length<3))for(const a of r){const l=s.match(a);if(l&&l[1]){const p=i(l[1]);if(p!==null&&p>0)return{count:p,status:"UNCERTAIN",rawText:s}}}}return{count:null,status:"UNAVAILABLE",rawText:""}}function Ft(t=document){const e=["end of results","no more groups to show","you’ve reached the end","you've reached the end","সব গ্রুপ দেখানো হয়েছে","ফলাফলের সমাপ্তি"],n=t.querySelectorAll('div[role="status"], span[dir="auto"], div, p');for(const o of n){const r=(o.textContent||"").trim().toLowerCase();if(!(r.length>100||r.length<5)){for(const i of e)if(r.includes(i))return!0}}return!1}function ke(t){if(!t)return"";let e=t.trim();return e=e.replace(/^(?:Visit group|Visit|Open group|Open|View group|View|গ্রুপ দেখুন|দেখুন|গ্রুপে যান)\s*/i,""),e=e.replace(/\s*(?:Last active|You last visited|last visited|active)\s+[^\n]+/i,""),e=e.replace(/\s*(?:গত|আগে|মিনিট আগে|ঘণ্টা আগে|দিন আগে)[^\n]*/i,""),e=e.replace(/\s*·\s*(?:Public group|Private group|পাবলিক গ্রুপ|প্রাইভেট গ্রুপ).*$/i,""),e=e.replace(/\s*·\s*\d+.*members.*$/i,""),e=e.replace(/\s*·\s*[০-৯\d]+.*সদস্য.*$/i,""),e=e.replace(/\s*·\s*[^\n]+/i,""),e.trim()}function zt(t){var u,m;const e=d=>({valid:!1,reason:d,name:"",url:"",groupId:"",privacy:"UNKNOWN"}),n=t.href||t.getAttribute("href")||"";if(!n||!n.includes("/groups/"))return e("Not a group link");if(n.includes("/permalink/")||n.includes("/posts/")||n.includes("/photos/")||n.includes("/videos/")||n.includes("comment_id=")||n.includes("notif_id="))return e("Post or photo permalink, not a group home");let o="";try{const f=new URL(n,"https://www.facebook.com").pathname.split("/").filter(Boolean),g=f.indexOf("groups");if(g!==-1&&f[g+1]){const b=f[g+1];try{o=decodeURIComponent(b)}catch{o=b}if(f.length>g+2){const x=f[g+2].toLowerCase();if(["posts","permalink","photos","videos","user","media"].includes(x))return e("Post or photo permalink, not a group home")}}}catch{return e("Malformed URL")}if(!o||tt.has(o.toLowerCase()))return e("Non-group system path");if(t.closest('[aria-label*="Notification" i], [aria-label*="বিজ্ঞপ্তি" i], [data-pagelet*="Notification" i]'))return e("Inside notification flyout");let r=t.closest('div[role="listitem"], div[role="article"], div[role="gridcell"], li, div[role="row"]');if(!r){let d=t.parentElement;for(let f=0;f<7&&d&&d!==document.body;f++){const g=(d.textContent||"").toLowerCase(),b=d.querySelectorAll?d.querySelectorAll('a[href*="/groups/"]').length:0;if(b>=1&&b<=5&&(g.includes("view group")||g.includes("visited")||g.includes("last active")||g.includes("গ্রুপ দেখুন"))){r=d;break}d=d.parentElement}r||(r=((u=t.parentElement)==null?void 0:u.parentElement)||t.parentElement)}if(r){const d=(r.textContent||"").toLowerCase();if(d.includes("sponsored")||d.includes("বিজ্ঞাপন")||r.querySelector('[aria-label*="Sponsored" i], [aria-label*="বিজ্ঞাপন" i]'))return e("Sponsored advertisement");if((r.querySelectorAll?Array.from(r.querySelectorAll('a[href*="/groups/"]')):[]).length<=4){if(d.includes("requested to join")||d.includes("অনুরোধ পাঠানো হয়েছে")||d.includes("answer questions")||d.includes("update responses")||d.includes("suggested for you")||d.includes("আপনার জন্য প্রস্তাবিত")||d.includes("suggested groups")||d.includes("প্রস্তাবিত গ্রুপ"))return e("Unjoined or suggested group");if(r.querySelectorAll){const b=Array.from(r.querySelectorAll('button, [role="button"]'));for(const x of b){const h=(x.textContent||x.getAttribute("aria-label")||"").trim().toLowerCase();if((h==="join"||h==="join group"||h==="যোগ দিন"||h==="গ্রুপে যোগ দিন"||h==="request to join")&&!d.includes("view group")&&!d.includes("গ্রুপ দেখুন")&&!d.includes("visited")&&!d.includes("last active"))return e("Card has Join button, not joined")}}}}let i="";const c=(t.getAttribute("aria-label")||"").trim();if(c&&c.length>=2&&!Se.has(c.toLowerCase())&&(i=ke(c)),!i){const d=(t.textContent||t.innerText||"").trim(),f=ke(d);f&&f.length>=2&&!Se.has(f.toLowerCase())&&(i=f)}if(!i){const d=Array.from(t.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, span'));for(const f of d){const g=ke((f.textContent||"").trim()),b=g.toLowerCase();if(g.length>=2&&!Se.has(b)&&!b.includes("last active")&&!b.includes("you last visited")&&!b.includes("members")&&!b.includes("সদস্য")&&!b.includes("ago")){i=g;break}}}if(!i&&r){const d=r.querySelector('h1, h2, h3, h4, [role="heading"]');if(d&&d.textContent){const f=ke(d.textContent.trim());f.length>=2&&!Se.has(f.toLowerCase())&&(i=f)}}if(!i&&r){const d=Array.from(r.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, a[href*="/groups/"] > span, a[href*="/groups/"], div[dir="auto"]'));for(const f of d){if(f===t)continue;const g=ke((f.textContent||"").trim()),b=g.toLowerCase();if(g.length>=2&&g.length<200&&!Se.has(b)&&!b.includes("view group")&&!b.includes("you last visited")&&!b.includes("last active")&&!b.includes("members")&&!b.includes("সদস্য")&&!b.includes("hours ago")&&!b.includes("minutes ago")&&!b.includes("days ago")&&!b.includes("weeks ago")&&!b.includes("ঘণ্টা আগে")&&!b.includes("দিন আগে")&&!b.includes("সপ্তাহ আগে")&&!/^\d+\s*(hours?|minutes?|days?|weeks?)\s*ago$/i.test(b)){i=g;break}}}i||(i=o.split(/[-_.]+/).filter(Boolean).map(d=>d.charAt(0).toUpperCase()+d.slice(1)).join(" "));let s="";const a=r!=null&&r.querySelector?r.querySelector("img, image")||t.querySelector("img, image"):null;a&&(s=a.getAttribute("src")||a.getAttribute("href")||((m=a.href)==null?void 0:m.baseVal)||"",(s.includes("/rsrc.php/")||s.includes("spacer")||s.includes("1x1"))&&(s=""));let l="UNKNOWN";const p=d=>{const f=(d||"").toLowerCase();return f.includes("public group")||f.includes("পাবলিক গ্রুপ")||f.includes("public")||f.includes("পাবলিক")?"PUBLIC":f.includes("private group")||f.includes("প্রাইভেট গ্রুপ")||f.includes("private")||f.includes("প্রাইভেট")?"PRIVATE":"UNKNOWN"};if(r){const d=p(r.textContent||"");if(d!=="UNKNOWN")l=d;else if(r.querySelectorAll){const f=Array.from(r.querySelectorAll("span, div, p"));for(const g of f){const b=p(g.textContent||"");if(b!=="UNKNOWN"){l=b;break}}}}return l==="UNKNOWN"&&(l=p(t.textContent||"")),{valid:!0,name:i,url:`https://www.facebook.com/groups/${o}/`,groupId:o,imageUrl:s,privacy:l}}function De(){if(typeof document>"u")return!1;const t=typeof window<"u"?window.location.href:"";if(t.includes("/login")||t.includes("/recover")||t.includes("/checkpoint"))return!1;const e=document.body&&(document.body.innerText||document.body.textContent)||"";return e.includes("What's on your mind")||e.includes("আপনার মনে কী আছে")||e.includes("কী ভাবছেন")||e.includes("Professional dashboard")||e.includes("Ads Manager")||e.includes("Meta Business Suite")?!0:!!document.querySelector('[role="navigation"], [data-pagelet="LeftRail"], [aria-label="Facebook"], input[placeholder*="Search" i], [aria-label*="profile" i], [aria-label*="Account" i], a[href*="/me/"], a[href*="/groups/"]')||!!(document.cookie&&document.cookie.includes("c_user"))}function Pe(){var s,a;if(typeof document>"u")return{isLoggedIn:!1,name:"",profileUrl:""};let t="",e="",n="",o="";if(document.body){const p=(document.body.innerText||document.body.textContent||"").match(/(?:What['’]s on your mind|আপনার মনে কী আছে|কী ভাবছেন)[,?\s]+([^?!\n]+?)(?:\?|$)/i);if(p&&p[1]){const u=p[1].trim().replace(/[?,!]+$/,"").trim();u.length>=2&&u.length<=50&&!u.toLowerCase().includes("facebook")&&(t=u)}}const r=Array.from(document.querySelectorAll('a[href*="/me/"], a[href*="facebook.com/profile"], [role="navigation"] a[href]'));for(const l of r){const p=l.getAttribute("href")||l.href||"",u=l.querySelector('span[dir="auto"], span, strong, h1'),m=(u?u.textContent:l.innerText||l.textContent||"").trim();if(m&&m.length>=2&&m.length<=35&&!["Home","Friends","Feeds","Groups","Watch","Marketplace","Memories","Saved","Video","Settings","Meta AI","Professional dashboard","Ads Manager","Ad Center","Meta Business Suite","See more","See all","Facebook","Menu","Notifications"].includes(m)){t||(t=m),!e&&p&&(e=p);const f=l.querySelector("image, img");if(f&&!n&&(n=f.getAttribute("src")||((s=f.href)==null?void 0:s.baseVal)||""),t)break}}const i=document.querySelector('[aria-label="Your profile" i], [aria-label*="Your profile" i], [aria-label*="Account Controls" i], [aria-label*="আপনার প্রোফাইল" i]');if(i&&!n){const l=i.querySelector("image, img");l&&(n=l.getAttribute("src")||((a=l.href)==null?void 0:a.baseVal)||"")}try{const l=Array.from(document.querySelectorAll("script"));for(const p of l){const u=p.textContent||"";if(u.includes('"NAME":')||u.includes('"USER_ID":')||u.includes('"short_name":')){const m=u.match(/"NAME":\s*"([^"]+)"/)||u.match(/"short_name":\s*"([^"]+)"/);if(m&&m[1]&&!t)try{t=JSON.parse(`"${m[1]}"`)}catch{t=m[1]}const d=u.match(/"USER_ID":\s*"(\d+)"/);if(d&&d[1]&&!o&&(o=d[1]),t)break}}}catch{}if(!o&&document.cookie){const l=document.cookie.match(/c_user=(\d+)/);l&&(o=l[1])}const c=De()||!!(t||o);return{isLoggedIn:c,name:t||(c?"Facebook User":""),profileUrl:e||"https://www.facebook.com",avatarUrl:n,userId:o}}function Jt(t){if(typeof document>"u")return[];const e=new Map,n=Date.now();try{const o=Array.from(document.querySelectorAll("script"));for(const r of o){const i=r.textContent||"";if(i.length<40)continue;const c=[/"__typename"\s*:\s*"Group"[\s\S]{0,500}?"id"\s*:\s*"(\d+)"[\s\S]{0,500}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,/"__typename"\s*:\s*"Group"[\s\S]{0,500}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,500}?"id"\s*:\s*"(\d+)"/g,/"node"\s*:\s*\{[\s\S]{0,120}?"__typename"\s*:\s*"Group"[\s\S]{0,350}?"id"\s*:\s*"(\d+)"[\s\S]{0,350}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,/"node"\s*:\s*\{[\s\S]{0,120}?"__typename"\s*:\s*"Group"[\s\S]{0,350}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,350}?"id"\s*:\s*"(\d+)"/g,/\{"id"\s*:\s*"(\d+)"[\s\S]{0,300}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,300}?(?:"__typename"\s*:\s*"Group"|url"\s*:\s*"https:[^"]*?\/groups\/[^"]+?")/g,/\{"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,300}?"id"\s*:\s*"(\d+)"[\s\S]{0,300}?(?:"__typename"\s*:\s*"Group"|url"\s*:\s*"https:[^"]*?\/groups\/[^"]+?")/g];for(const s of c){let a;for(;(a=s.exec(i))!==null;){let l="",p="";if(/^\d+$/.test(a[1])?(l=a[1],p=a[2]):/^\d+$/.test(a[2])&&(l=a[2],p=a[1]),l&&p){p=p.trim();try{p=p.replace(/\\u[\dA-Fa-f]{4}/g,m=>String.fromCharCode(parseInt(m.replace("\\u",""),16)))}catch{}const u=i.slice(Math.max(0,a.index-350),Math.min(i.length,a.index+600));if(u.includes('"__typename":"User"')||u.includes('"__typename":"Actor"')||u.includes('"__typename":"Story"')||u.includes('"__typename":"Comment"')||u.includes('"__typename":"Page"')||t&&p.toLowerCase()===t.toLowerCase())continue;if(p.length>=2&&!e.has(l)){let m="";const f=i.slice(Math.max(0,a.index-500),Math.min(i.length,a.index+1e3)).match(/"(?:uri|url|cover_photo|image)"\s*:\s*\{[^}]*"uri"\s*:\s*"([^"]+)"/);if(f&&f[1]){let g=f[1];try{g=g.replace(/\\u[\dA-Fa-f]{4}/g,b=>String.fromCharCode(parseInt(b.replace("\\u",""),16)))}catch{}!g.includes("/rsrc.php/")&&!g.includes("1x1")&&(m=g.replace(/\\\//g,"/"))}e.set(l,{name:yt(p,l),url:`https://www.facebook.com/groups/${l}/`,groupId:l,privacy:"UNKNOWN",imageUrl:m,verified:!0,source:"facebook-ui",accountContext:t,discoveredAt:n})}}}}}}catch(o){console.warn("[AGP:Discovery] Script tags extraction warning:",o)}return Array.from(e.values())}function ot(t){if(typeof document>"u")return{items:[],rejectedCount:0};const e=new Map;let n=0;const o=Date.now(),r=Jt(t);for(const c of r)e.set(c.groupId.toLowerCase(),c);const i=Array.from(document.querySelectorAll('a[href*="/groups/"]'));for(const c of i){const s=zt(c);if(!s.valid||!s.name||!s.url||!s.groupId){n++;continue}const a=s.groupId.toLowerCase(),l=e.get(a);l?(!l.imageUrl&&s.imageUrl&&(l.imageUrl=s.imageUrl),s.name&&l.name.length<s.name.length&&(l.name=s.name),s.privacy!=="UNKNOWN"&&(l.privacy=s.privacy)):e.set(a,{name:s.name,url:s.url,groupId:s.groupId,privacy:s.privacy,imageUrl:s.imageUrl,verified:!0,source:"facebook-ui",accountContext:t,discoveredAt:o})}return{items:Array.from(e.values()),rejectedCount:n}}function mt(){if(typeof document>"u")return 0;let t=0;const e=Array.from(document.querySelectorAll('div[role="button"], button, span[dir="auto"], [role="navigation"] [role="button"], [data-pagelet="LeftRail"] [role="button"]'));for(const n of e){const o=(n.textContent||n.getAttribute("aria-label")||"").trim().toLowerCase();if(o==="see more"||o==="আরও দেখুন"||o==="see all"||o==="সব দেখুন"||o==="see all groups"||o==="সব গ্রুপ দেখুন"||o==="view more")try{(n.closest('[role="button"], button')||n).click(),t++}catch{}}return t}async function ht(t={}){var h,A,E,L,_,S;const e=t.maxRounds||350,n=t.stagnantLimit||35,o=t.scrollDelayMs!==void 0?t.scrollDelayMs:250,r=t.accountContext,i=Date.now(),c=De(),s=new Map;let a=0,l=0,p=0,u=0;const m=qt(),d=m.count,f=m.status;console.log(`[AGP:Engine] Discovery started. Target count: ${d??"N/A"} (Status: ${f})`);const g=T=>({candidateCount:s.size+l,verifiedCount:s.size,duplicatesRemoved:a,rejectedCount:l,scrollIterations:u,mutationEvents:p,targetCount:d,targetCountStatus:f,completionReason:T,scanDurationMs:Date.now()-i,lastNewGroupTimestamp:s.size>0?Date.now():null}),b=T=>{let q=0;for(const R of T){const Y=R.groupId.toLowerCase();s.has(Y)?a++:(s.set(Y,R),q++)}return q};let x=null;typeof MutationObserver<"u"&&typeof document<"u"&&(x=new MutationObserver(T=>{p+=T.length}),x.observe(document.body||document.documentElement,{childList:!0,subtree:!0}));try{try{mt()}catch{}const T=ot(r);if(l+=T.rejectedCount,b(T.items)>0&&t.onBatchDiscovered)try{await t.onBatchDiscovered(Array.from(s.values()),s.size,g(null))}catch{}if(t.onProgress){const Z=d?`Found ${s.size} of ${d} groups...`:`Found ${s.size} groups...`;t.onProgress(s.size,Z,d,g(null))}if(f==="CONFIRMED"&&d!==null&&s.size>=d){const Z=g("TARGET_REACHED");return console.log(`[AGP:Engine] Target count of ${d} confirmed on initial scan.`),{isLoggedIn:c,groups:Array.from(s.values()),totalFound:s.size,targetCount:d,isPartial:!1,outcome:"COMPLETE",completionReason:"TARGET_REACHED",debugMetrics:Z}}let R=0,Y="PARTIAL",ne="STAGNANT_TIMEOUT";for(let Z=0;Z<e;Z++){if(u++,t.shouldStop&&t.shouldStop()){console.log("[AGP:Engine] Progressive scan stopped by user request."),Y=s.size>0?"COMPLETE":"PARTIAL",ne="USER_CANCELLED";break}if(Z%3===0)try{mt()}catch{}const H=Array.from(document.querySelectorAll('a[href*="/groups/"]'));if(H.length>0){const O=H[H.length-1];try{O.scrollIntoView({block:"end",inline:"nearest",behavior:"auto"})}catch{}}const Ae=document.querySelector('[role="main"], [data-pagelet*="Group"]');if(Ae&&Ae.lastElementChild)try{Ae.lastElementChild.scrollIntoView({block:"end",behavior:"auto"})}catch{}const Ee=Math.max(((h=document.documentElement)==null?void 0:h.scrollHeight)||0,((A=document.scrollingElement)==null?void 0:A.scrollHeight)||0,((E=document.body)==null?void 0:E.scrollHeight)||0);window.scrollTo(0,Ee),document.scrollingElement&&(document.scrollingElement.scrollTop=Ee),document.documentElement&&(document.documentElement.scrollTop=Ee);const G=Array.from(document.querySelectorAll("div, main, section"));for(const O of G)if(O.scrollHeight>O.clientHeight+80){const Oe=window.getComputedStyle(O);(Oe.overflowY==="auto"||Oe.overflowY==="scroll")&&(O.scrollTop=O.scrollHeight,O.dispatchEvent(new Event("scroll",{bubbles:!0})))}window.dispatchEvent(new Event("scroll",{bubbles:!0}));try{window.dispatchEvent(new WheelEvent("wheel",{deltaY:2500,bubbles:!0})),(L=document.body)==null||L.dispatchEvent(new KeyboardEvent("keydown",{key:"PageDown",code:"PageDown",bubbles:!0}))}catch{}await new Promise(O=>setTimeout(O,o));const z=ot(r);if(l+=z.rejectedCount,b(z.items)>0){if(R=0,t.onBatchDiscovered)try{await t.onBatchDiscovered(Array.from(s.values()),s.size,g(null))}catch{}if(t.onProgress){const O=d?`Scanning Facebook Groups... ${s.size} of ${d} discovered`:`Scanning Facebook Groups... ${s.size} groups discovered`;t.onProgress(s.size,O,d,g(null))}if(f==="CONFIRMED"&&d!==null&&s.size>=d){console.log(`[AGP:Engine] Target count reached: ${s.size} >= ${d}.`),Y="COMPLETE",ne="TARGET_REACHED";break}}else{if(R++,Ft()){console.log("[AGP:Engine] Explicit end-of-list indicator detected."),Y="COMPLETE",ne="LIST_END";break}if(window.scrollBy(0,-600),H.length>5&&((_=H[Math.max(0,H.length-6)])==null||_.scrollIntoView({block:"center",behavior:"instant"})),await new Promise(O=>setTimeout(O,300)),window.scrollBy(0,1200),H.length>0&&((S=H[H.length-1])==null||S.scrollIntoView({block:"end",behavior:"smooth"})),f==="CONFIRMED"&&d!==null&&s.size<d&&R<45){window.scrollBy(0,-1e3),await new Promise(O=>setTimeout(O,350)),window.scrollBy(0,2500);continue}if(R>=n){console.log(`[AGP:Engine] Scan complete/stagnant after ${R} attempts. Total verified: ${s.size}`),Y="PARTIAL",ne="STAGNANT_TIMEOUT";break}}}try{window.scrollTo({top:0,behavior:"smooth"})}catch{}const Ze=Y!=="COMPLETE",et=g(ne);return{isLoggedIn:c,groups:Array.from(s.values()),totalFound:s.size,targetCount:d,isPartial:Ze,outcome:Y,completionReason:ne,debugMetrics:et}}finally{x&&x.disconnect()}}function yt(t,e){if(!t||!t.trim())return e?e.split(/[-_.]+/).filter(Boolean).map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" "):"Facebook Group";let n=t.trim();return n=n.replace(/^(?:Visit|Open|View|গ্রুপ দেখুন|দেখুন)\s+/i,""),n=n.replace(/\s*(?:Last active|You last visited|last visited|active)\s+[^\n]+/i,""),n=n.replace(/\s*(?:গত|আগে|মিনিট আগে|ঘণ্টা আগে|দিন আগে)[^\n]*/i,""),n=n.replace(/\s*·\s*(?:Public group|Private group|পাবলিক গ্রুপ|প্রাইভেট গ্রুপ).*$/i,""),n=n.replace(/\s*·\s*\d+.*members.*$/i,""),n=n.replace(/\s*·\s*[০-৯\d]+.*সদস্য.*$/i,""),n=n.replace(/\s*·\s*[^\n]+/i,""),(n.toLowerCase()==="visit"||n.toLowerCase()==="group"||n.toLowerCase()==="view group")&&e?e.split(/[-_.]+/).filter(Boolean).map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" "):n.trim()||"Facebook Group"}function Be(t="id"){const e=Math.random().toString(36).substring(2,9),n=Date.now().toString(36);return`${t}_${n}_${e}`}function nt(t){if(!t)return"";if(!t.includes("{")||!t.includes("|"))return t;let e=t,n=0;const o=/\{([^{}]+)\}/g;for(;n<10&&o.test(e);)n++,e=e.replace(o,(r,i)=>{if(i.includes("|")){const c=i.split("|").map(s=>s.trim()).filter(Boolean);if(c.length>0)return c[Math.floor(Math.random()*c.length)]}return r});return e=e.replace(/\{([^{}\r\n]+?)(?=[.,!?\r\n]|$)/g,(r,i)=>i.includes("|")?i.split("|").map(s=>s.trim()).filter(Boolean)[0]||"":r),e}const wt={status:"IDLE",searchUrl:"",query:"",totalFound:0,joinedCount:0,requestedCount:0,alreadyJoinedCount:0,failedCount:0,skippedCount:0,currentIndex:0,currentGroupName:"",countdownSec:0,message:"Enter any Facebook search link to start auto-joining.",groups:[]},J={GROUPS:"agp_groups",ACCOUNT_GROUPS:"agp_facebook_groups_by_account",POSTS:"agp_posts",LOGS:"agp_logs",FACEBOOK_ACCOUNT:"agp_facebook_account"},xt=()=>{var t;return typeof chrome<"u"&&!!((t=chrome.storage)!=null&&t.local)},Ce={};async function le(t,e){if(xt())return new Promise(n=>{chrome.storage.local.get([t],o=>{if(chrome.runtime.lastError){console.warn(`Storage get error for ${t}:`,chrome.runtime.lastError),n(Ce[t]!==void 0?Ce[t]:e);return}o&&o[t]!==void 0?n(o[t]):n(e)})});try{if(typeof window<"u"&&window.localStorage){const n=window.localStorage.getItem(t);if(n!==null)return JSON.parse(n)}}catch(n){console.warn("LocalStorage access failed:",n)}return Ce[t]!==void 0?Ce[t]:e}async function fe(t,e){if(Ce[t]=e,xt())return new Promise((n,o)=>{chrome.storage.local.set({[t]:e},()=>{chrome.runtime.lastError?o(chrome.runtime.lastError):n()})});try{typeof window<"u"&&window.localStorage&&window.localStorage.setItem(t,JSON.stringify(e))}catch(n){console.warn("LocalStorage set failed:",n)}}function vt(t){return t&&t.trim().toLowerCase().replace(/[^a-z0-9_\u0980-\u09FF]/gi,"_")||"default_account"}async function je(){return le(J.ACCOUNT_GROUPS,{})}let At=!1;async function Et(){const t=await je(),e=new Map,n=c=>{if(!c||!c.id||Ie(c))return;const s=(c.groupId||c.url||c.id).toLowerCase();if(!e.has(s))e.set(s,{...c});else{const a=e.get(s);c.name&&(!a.name||c.name.length>a.name.length)&&(a.name=c.name),c.imageUrl&&!a.imageUrl&&(a.imageUrl=c.imageUrl),c.privacy&&c.privacy!=="UNKNOWN"&&(a.privacy=c.privacy)}};for(const c of Object.keys(t)){const s=t[c];s&&Array.isArray(s.groups)&&s.groups.forEach(n)}(await le(J.GROUPS,[])).forEach(n);const r=Array.from(e.values());return r.filter(c=>c.selected).length>50&&(r.forEach(c=>{c.selected=!1}),At||(At=!0,Wt().catch(()=>{}))),r}async function Wt(){var o;const t=await je();let e=!1;for(const r of Object.keys(t))(o=t[r])!=null&&o.groups&&Array.isArray(t[r].groups)&&(t[r].groups=t[r].groups.map(i=>({...i,selected:!1})),e=!0);e&&await fe(J.ACCOUNT_GROUPS,t);const n=await le(J.GROUPS,[]);if(n.some(r=>r.selected)){const r=n.map(i=>({...i,selected:!1}));await fe(J.GROUPS,r)}}async function rt(t){if(t==="all")return Et();const e=await it(),n=vt(t||(e==null?void 0:e.userId)||(e==null?void 0:e.name)),o=await je();if(o[n]&&Array.isArray(o[n].groups)&&o[n].groups.length>0){const a=o[n].groups.filter(l=>!Ie(l));if(a.length>0)return a.filter(l=>l.selected).length>50&&a.forEach(l=>{l.selected=!1}),a}const i=(await le(J.GROUPS,[])).filter(s=>!Ie(s));if(i.length>0)return i.filter(s=>s.selected).length>50&&i.forEach(s=>{s.selected=!1}),i;const c=await Et();return c.length>0?c:[]}async function st(t,e){const n=(t||[]).filter(s=>!Ie(s)),o=await it(),r=vt(e||(o==null?void 0:o.userId)||(o==null?void 0:o.name)),i=await je(),c=i[r]||{accountContext:r,accountInfo:o||{isLoggedIn:!0,name:"Facebook User",lastSyncedAt:Date.now()},groups:[],lastSyncedAt:Date.now()};i[r]={...c,groups:n,lastSyncedAt:Date.now()},await fe(J.ACCOUNT_GROUPS,i),await fe(J.GROUPS,n)}function Ie(t){if(!t)return!0;const e=(t.name||"").trim().toLowerCase(),n=(t.url||"").trim().toLowerCase();if(e.startsWith("unread")||e.includes("commented on")||e.includes("also commented")||e.includes("likes your")||e.includes("liked your")||e.includes("reacted to")||e.includes("shared a post")||e.includes("shared your post")||e.includes("invited you")||e.includes("mentioned you")||e.includes("requested to join")||e.includes("মন্তব্য করেছেন")||e.includes("মতামত দিয়েছেন")||e.includes("লাইক দিয়েছেন")||e.includes("শেয়ার করেছেন")||n.includes("/permalink/")||n.includes("/posts/")||n.includes("/user/")||n.includes("/profile.php")||n.includes("/friends/")||n.includes("/people/")||n.includes("/photos/")||n.includes("/videos/")||n.includes("/events/")||n.includes("/files/")||n.includes("comment_id=")||n.includes("notif_id=")||n.includes("notif_t=")||n.includes("reply_comment_id="))return!0;const o=new Set(["about","about group","feed","discover","create","notifications","search","categories","joins","settings","help","privacy","terms","policies","support","messages","marketplace"]),r=e.replace(/\s*group\s*$/i,"").trim();return!!(o.has(e)||o.has(r)||t.groupId&&o.has(t.groupId.toLowerCase()))}async function Vt(){return le(J.POSTS,[])}async function Yt(t){await fe(J.POSTS,t)}async function Ht(){return le(J.LOGS,[])}async function Kt(t){await fe(J.LOGS,t)}async function Qt(t){const e=await Ht();e.unshift(t),e.length>300&&(e.length=300),await Kt(e)}async function it(){return le(J.FACEBOOK_ACCOUNT,null)}class Xt{async writeLog(e,n,o,r){const i={id:Be("log"),timestamp:Date.now(),level:e,source:n,message:o,details:r},c=`[AGP:${n.toUpperCase()}][${e}]`;e==="ERROR"?console.error(c,o,r||""):e==="WARNING"?console.warn(c,o,r||""):console.log(c,o,r||"");try{await Qt(i)}catch(s){console.warn("Failed to persist log entry:",s)}return i}info(e,n,o){return this.writeLog("INFO",e,n,o)}success(e,n,o){return this.writeLog("SUCCESS",e,n,o)}warning(e,n,o){return this.writeLog("WARNING",e,n,o)}error(e,n,o){return this.writeLog("ERROR",e,n,o)}}const Zt=new Xt;async function qe(t,e){var x;const n=(e==null?void 0:e.accountContext)||((x=await it())==null?void 0:x.name)||"default_account",o=await rt(n),r=new Map,i=new Map,c=new Map,s=h=>h.trim().toLowerCase().replace(/\s+/g," ");o.forEach(h=>{h.groupId&&r.set(h.groupId.toLowerCase(),h),h.url&&i.set(h.url.toLowerCase().replace(/\/$/,""),h),h.name&&c.set(s(h.name),h)});let a=0,l=0;const p=Date.now(),u=[],m=new Set;for(const h of t){if(Ie(h))continue;const A=(h.groupId||"").toLowerCase(),E=(h.url||"").toLowerCase().replace(/\/$/,""),L=s(h.name||"");let _=(A?r.get(A):void 0)||(E?i.get(E):void 0)||(L&&L.length>=3?c.get(L):void 0);const S=yt(h.name||"",h.groupId);if(_)l++,m.add(_.id),S&&(!_.name||_.name.includes("·")||_.name.length<S.length)&&(_.name=S),h.imageUrl&&!_.imageUrl&&(_.imageUrl=h.imageUrl),h.privacy&&h.privacy!=="UNKNOWN"&&(_.privacy=h.privacy),_.verified=!0,_.source="facebook-ui",_.accountContext=n,_.discoveredAt=p,_.updatedAt=p;else{a++;const T=h.groupId?`grp_${h.groupId.replace(/[^a-zA-Z0-9_-]/g,"")}`:Be("grp"),q=h.url.startsWith("http")?h.url:`https://www.facebook.com/groups/${h.groupId}/`,R={id:T,name:S,url:q,groupId:h.groupId,privacy:h.privacy||"UNKNOWN",imageUrl:h.imageUrl,category:"Discovered",enabled:!0,selected:!1,status:"READY",postCount:0,verified:!0,source:"facebook-ui",accountContext:n,discoveredAt:p,createdAt:p,updatedAt:p};u.push(R),A&&r.set(A,R),E&&i.set(E,R),L&&c.set(L,R),m.add(R.id)}}let d;if((e==null?void 0:e.syncMode)==="exact"){const h=E=>E.source==="manual"||E.category&&E.category!=="Discovered",A=o.filter(E=>m.has(E.id)||h(E));d=[...u,...A]}else d=[...u,...o];const f=[],g=new Set,b=new Set;for(const h of d){const A=h.url.toLowerCase().replace(/\/$/,"");!g.has(h.id)&&!b.has(A)&&(g.add(h.id),b.add(A),f.push(h))}return await st(f,n),await Zt.info("dashboard",`Group discovery merged (${(e==null?void 0:e.syncMode)||"merge"}): ${a} imported, ${l} duplicates, total ${f.length}`),{imported:a,duplicates:l,totalStored:f.length,verifiedCount:f.filter(h=>h.verified).length}}function at(t){if(!t)return"<p><br></p>";const e=t.split(`
`),n=[];let o=!1,r=[],i=!1,c=[],s=!1,a=[];const l=()=>{o&&r.length>0&&(n.push("<ul>"+r.map(d=>`<li>${d}</li>`).join("")+"</ul>"),r=[],o=!1)},p=()=>{i&&c.length>0&&(n.push("<ol>"+c.map(d=>`<li>${d}</li>`).join("")+"</ol>"),c=[],i=!1)},u=()=>{s&&a.length>0&&(n.push("<blockquote>"+a.map(d=>`<p>${d}</p>`).join("")+"</blockquote>"),a=[],s=!1)},m=()=>{l(),p(),u()};for(let d=0;d<e.length;d++){const f=e[d],g=f.trim();if(!g){m(),n.push("<p><br></p>");continue}const x=g.match(/^<h1\b[^>]*>(.*?)<\/h1>$/i)||g.match(/^#\s+(.+)$/)||g.match(/^h1:\s*(.+)$/i);if(x){m(),n.push(`<h1>${be(x[1])}</h1>`);continue}const A=g.match(/^<h[23]\b[^>]*>(.*?)<\/h[23]>$/i)||g.match(/^##\s+(.+)$/)||g.match(/^###\s+(.+)$/)||g.match(/^h[23]:\s*(.+)$/i);if(A){m(),n.push(`<h2>${be(A[1])}</h2>`);continue}const L=g.match(/^<blockquote\b[^>]*>(.*?)<\/blockquote>$/i)||g.match(/^>\s*(.+)$/)||g.match(/^[❝❞]\s*(.+?)[❝❞]?$/);if(L){l(),p(),s=!0,a.push(be(L[1]));continue}const _=g.match(/^(\d+)[\.\)]\s+(.*)$/);if(_){l(),u(),i=!0,c.push(be(_[2]));continue}const T=g.match(/^<li\b[^>]*>(.*?)<\/li>$/i)||g.match(/^[•✓✔➤➔★⭐◆❖]\s*(.*)$/)||g.match(/^[\-*–—]\s+(.*)$/);if(T){p(),u(),o=!0,r.push(be(T[1]));continue}m(),n.push(`<p>${be(f)}</p>`)}return m(),n.join("")}function be(t){if(!t)return"";let e=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");return e=e.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em style="font-style: italic;">$1</em></strong>'),e=e.replace(/___(.+?)___/g,'<strong><em style="font-style: italic;">$1</em></strong>'),e=e.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),e=e.replace(/__(.+?)__/g,"<strong>$1</strong>"),e=e.replace(/\*([^*\n]+?)\*/g,'<em style="font-style: italic;">$1</em>'),e=e.replace(/_([^_\n]+?)_/g,'<em style="font-style: italic;">$1</em>'),e=e.replace(/~~(.+?)~~/g,"<s>$1</s>"),e=e.replace(/`([^`\n]+?)`/g,"<code>$1</code>"),e=e.replace(/&lt;(\/?)strong&gt;/gi,"<$1strong>").replace(/&lt;(\/?)b&gt;/gi,"<$1strong>").replace(/&lt;(\/?)em&gt;/gi,"<$1em>").replace(/&lt;(\/?)i&gt;/gi,"<$1em>").replace(/&lt;(\/?)s&gt;/gi,"<$1s>").replace(/&lt;(\/?)del&gt;/gi,"<$1s>").replace(/&lt;(\/?)u&gt;/gi,"<$1u>").replace(/&lt;(\/?)code&gt;/gi,"<$1code>").replace(/&lt;br\s*\/?&gt;/gi,"<br>"),e}function eo(t){if(!t||typeof t!="string")return t||"";const e=t.trim();if(e.length<30)return t;const n=e.length,o=Math.floor(n/2);for(let i=-15;i<=15;i++){const c=o+i;if(c>15&&c<n-15){const s=e.slice(0,c).trim(),a=e.slice(c).trim();if(s.length>=15&&s===a)return s}}const r=e.split(`
`).filter(i=>i.trim().length>0);if(r.length>=4){const i=Math.floor(r.length/2),c=r.slice(0,i).join(`
`).trim(),s=r.slice(i).join(`
`).trim();if(c.length>=25&&c===s)return c}return t}function St(t){try{const n=new URL(t.startsWith("http")?t:`https://${t}`).searchParams.get("q");return n?decodeURIComponent(n.replace(/\+/g," ")):""}catch{return""}}function to(){if(typeof window>"u")return!1;const t=window.location.href.toLowerCase();return(t.includes("facebook.com")||t.includes("fb.com"))&&t.includes("/search")}function Fe(t){var a;if(!t)return!1;const e=t.tagName.toLowerCase(),n=t.getAttribute("role")||"",o=e==="button"||n==="button"||e==="a"||t.getAttribute("tabindex")!==null,r=(t.innerText||t.textContent||"").trim().toLowerCase(),i=(t.getAttribute("aria-label")||"").trim().toLowerCase(),c=(((a=t.querySelector("[aria-label]"))==null?void 0:a.getAttribute("aria-label"))||"").trim().toLowerCase(),s=`${r} | ${i} | ${c}`.toLowerCase();return s.includes("joined")||s.includes("view group")||s.includes("edit membership")||s.includes("যোগ দিয়েছেন")||s.includes("যুক্ত হয়েছেন")||s.includes("গ্রুপ দেখুন")||s.includes("requested")||s.includes("pending")||s.includes("cancel request")||s.includes("অনুরোধ পাঠানো")||s.includes("অনুরোধ করা হয়েছে")||s.includes("share")||s.includes("শেয়ার")||s.includes("message")||s.includes("মেসেজ")||s.includes("close")||s.includes("menu")||s.includes("search")||s.includes("notifications")?!1:!!(r==="join"||r==="join group"||r==="+ join"||r==="+ join group"||r==="request to join"||r==="answer questions"||r==="যোগ দিন"||r==="+ যোগ দিন"||r==="গ্রুপে যোগ দিন"||r==="যুক্ত হোন"||r==="+ যুক্ত হোন"||r==="গ্রুপে যুক্ত হোন"||r==="যোগ দেওয়ার অনুরোধ"||r==="যোগ দেয়ার অনুরোধ"||i==="join"||i==="join group"||i.includes("join group")||i.includes("request to join")||i.includes("যোগ দিন")||i.includes("যুক্ত হোন")||i.includes("অনুরোধ")||o&&(r.startsWith("join ")||r.endsWith(" join")||r.includes("join group")||r.includes("যোগ দিন")||r.includes("যুক্ত হোন")||r.includes("join")&&r.length<=16))}function ze(t){if(!t)return!1;const e=(t.innerText||t.textContent||"").trim().toLowerCase(),n=(t.getAttribute("aria-label")||"").trim().toLowerCase(),o=`${e} ${n}`.toLowerCase();return o.includes("joined")||o.includes("view group")||o.includes("edit membership")||o.includes("যোগ দিয়েছেন")||o.includes("যুক্ত হয়েছেন")||o.includes("গ্রুপ দেখুন")}function Je(t){if(!t)return!1;const e=(t.innerText||t.textContent||"").trim().toLowerCase(),n=(t.getAttribute("aria-label")||"").trim().toLowerCase(),o=`${e} ${n}`.toLowerCase();return o.includes("requested")||o.includes("pending")||o.includes("cancel request")||o.includes("অনুরোধ পাঠানো")||o.includes("অনুরোধ করা হয়েছে")}function re(t){if(!t||typeof t!="string"||t.includes("/permalink/")||t.includes("/posts/")||t.includes("/photos/")||t.includes("/videos/")||t.includes("/user/")||t.includes("comment_id=")||t.includes("notif_id="))return null;const e=t.match(/(?:facebook\.com|fb\.com)?\/groups\/([^/?#]+)/i);if(!e||!e[1])return null;try{const n=decodeURIComponent(e[1]).trim().toLowerCase();return!n||tt.has(n)?null:n}catch{const n=e[1].trim().toLowerCase();return!n||tt.has(n)?null:n}}function ct(t,e,n){let o="";const r=t.querySelector('span[dir="auto"], strong, h1, h2, h3, h4');if(r&&r.textContent&&r.textContent.trim().length>=2&&(o=r.textContent.trim()),!o){const c=(t.getAttribute("aria-label")||"").trim();c&&c.length>=2&&!c.toLowerCase().includes("view group")&&!c.toLowerCase().includes("গ্রুপ দেখুন")&&(o=c)}if(!o&&t.textContent&&(o=t.textContent.trim()),!o||o.length<2){const c=e.querySelector('h1, h2, h3, h4, [role="heading"], strong');o=((c==null?void 0:c.textContent)||"").trim()}o=o.split(`
`)[0].trim();const i=o.toLowerCase();return(i==="join"||i==="যোগ দিন"||i==="view group"||i==="গ্রুপ দেখুন"||i==="visit"||i==="joined")&&(o=""),(!o||o.length<2)&&(o=n.split(/[-_.]+/).map(c=>c.charAt(0).toUpperCase()+c.slice(1)).join(" ")),o}function lt(t){const e=(t.innerText||t.textContent||"").toLowerCase();return e.includes("public")||e.includes("পাবলিক")?"PUBLIC":e.includes("private")||e.includes("প্রাইভেট")?"PRIVATE":"UNKNOWN"}function dt(t){const e=(t.innerText||"").split(`
`).map(n=>n.trim()).filter(Boolean);for(const n of e){const o=n.toLowerCase();if((o.includes("member")||o.includes("সদস্য")||o.includes("post")||o.includes("পোস্ট"))&&(o.includes("public")||o.includes("private")||o.includes("পাবলিক")||o.includes("প্রাইভেট")||/\d/.test(n)))return n}return""}function me(){if(typeof document>"u")return[];const t=[],e=new Set,n=Array.from(document.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"], [aria-label*="Join" i], [aria-label*="যোগ" i], [aria-label*="যুক্ত" i]'));for(const i of n){if(!Fe(i))continue;let c=i.parentElement,s=null,a=null;for(let f=0;f<25&&c&&c!==document.body;f++){const g=Array.from(c.querySelectorAll('a[href*="/groups/"]')).filter(b=>{const x=b.href||b.getAttribute("href")||"";return!!re(x)});if(g.length>0){const b=new Set(g.map(x=>re(x.href||x.getAttribute("href")||"")).filter(Boolean));if(b.size===1)s=g[0],a=c;else if(b.size>1)break}c=c.parentElement}if(!s)continue;const l=re(s.href||s.getAttribute("href")||"");if(!l||e.has(l))continue;e.add(l);const p=a||i.closest('div[role="feed"] > div')||i.parentElement||i,u=ct(s,p,l),m=lt(p),d=dt(p);t.push({cardElement:p,item:{id:l,groupId:l,name:u,url:`https://www.facebook.com/groups/${encodeURIComponent(l)}/`,privacy:m,membersText:d||void 0,status:"READY_TO_JOIN"},joinButton:i})}const o=Array.from(document.querySelectorAll('a[href*="/groups/"]'));for(const i of o){const c=re(i.href||i.getAttribute("href")||"");if(!c||e.has(c))continue;let s=i.parentElement,a=null,l=null,p="READY_TO_JOIN";for(let f=0;f<25&&s&&s!==document.body;f++){const g=Array.from(s.querySelectorAll('a[href*="/groups/"]')).filter(h=>{const A=h.href||h.getAttribute("href")||"";return!!re(A)});if(new Set(g.map(h=>re(h.href||h.getAttribute("href")||"")).filter(Boolean)).size>1)break;a=s;const x=Array.from(s.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"], [aria-label]'));for(const h of x){if(ze(h)){p="ALREADY_JOINED",l=null;break}if(Je(h)){p="REQUESTED",l=null;break}if(Fe(h)){p="READY_TO_JOIN",l=h;break}}if(l||p!=="READY_TO_JOIN")break;s=s.parentElement}if(a||(a=i.closest('div[role="feed"] > div')||i.closest('div[role="article"]')||i.parentElement||i),p==="READY_TO_JOIN"&&!l&&a){const f=Array.from(a.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const g of f)if(!ze(g)&&!Je(g)){const b=(g.innerText||g.textContent||g.getAttribute("aria-label")||"").trim().toLowerCase();if(b&&!b.includes("more")&&!b.includes("menu")&&!b.includes("share")&&!b.includes("close")){l=g;break}}}e.add(c);const u=ct(i,a,c),m=lt(a),d=dt(a);t.push({cardElement:a,item:{id:c,groupId:c,name:u,url:`https://www.facebook.com/groups/${encodeURIComponent(c)}/`,privacy:m,membersText:d||void 0,status:p},joinButton:l})}const r=Array.from(document.querySelectorAll('div[role="feed"] > div, div[role="main"] div[role="article"], div[data-pagelet*="GroupSearchResult"]'));for(const i of r){const c=Array.from(i.querySelectorAll('a[href*="/groups/"]')).filter(b=>!!re(b.href||b.getAttribute("href")||""));if(c.length===0)continue;const s=Array.from(new Set(c.map(b=>re(b.href||b.getAttribute("href")||"")).filter(Boolean)));if(s.length!==1)continue;const a=s[0];if(e.has(a))continue;e.add(a);const l=c[0],p=ct(l,i,a),u=lt(i),m=dt(i);let d=null,f="READY_TO_JOIN";const g=Array.from(i.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const b of g){if(ze(b)){f="ALREADY_JOINED";break}if(Je(b)){f="REQUESTED";break}if(Fe(b)){f="READY_TO_JOIN",d=b;break}}t.push({cardElement:i,item:{id:a,groupId:a,name:p,url:`https://www.facebook.com/groups/${encodeURIComponent(a)}/`,privacy:u,membersText:m||void 0,status:f},joinButton:d})}return t}function _e(t){if(!t)return;try{t.scrollIntoView({behavior:"auto",block:"center"})}catch{}t.focus();const e=t.closest('div[role="button"], button, a[role="button"]')||t;e.focus();const n={bubbles:!0,cancelable:!0,view:window};if(e.dispatchEvent(new PointerEvent("pointerdown",n)),e.dispatchEvent(new MouseEvent("mousedown",n)),e.dispatchEvent(new PointerEvent("pointerup",n)),e.dispatchEvent(new MouseEvent("mouseup",n)),e.click(),e!==t)try{t.dispatchEvent(new MouseEvent("click",n)),t.click()}catch{}}async function oo(t){let e=document.querySelector('div[role="dialog"]');if((!e||e.offsetParent===null&&e.getBoundingClientRect().height<=50)&&(await new Promise(s=>setTimeout(s,30)),e=document.querySelector('div[role="dialog"]')),!e||e.offsetParent===null&&e.getBoundingClientRect().height<=50)return!1;console.log("[AGP:AutoJoiner] Membership questions modal detected. Fast auto-answering...");const n=Array.from(e.querySelectorAll('input[type="checkbox"], div[role="checkbox"]'));for(const s of n)(s instanceof HTMLInputElement?s.checked:s.getAttribute("aria-checked")==="true")||_e(s);const o=Array.from(e.querySelectorAll('input[type="radio"], div[role="radio"]'));o.length>0&&(o.some(a=>a instanceof HTMLInputElement?a.checked:a.getAttribute("aria-checked")==="true")||_e(o[0]));const r=Array.from(e.querySelectorAll('textarea, input[type="text"]'));for(const s of r)(!s.value||s.value.trim()==="")&&(s.focus(),s.value=t||"Yes, I agree to the group rules and guidelines.",s.dispatchEvent(new Event("input",{bubbles:!0})),s.dispatchEvent(new Event("change",{bubbles:!0})));const i=Array.from(e.querySelectorAll('button, div[role="button"]'));for(const s of i){const a=(s.innerText||s.textContent||s.getAttribute("aria-label")||"").trim().toLowerCase();if(a==="submit"||a==="জমা দিন"||a==="send"||a==="confirm"||a==="next"||a==="পরবর্তী"||a==="done"||a==="অনুরোধ পাঠান"||a.includes("submit")||a.includes("জমা")){_e(s),await new Promise(l=>setTimeout(l,15));break}}const c=document.querySelector('div[role="dialog"]');if(c){const s=Array.from(c.querySelectorAll('button, div[role="button"]'));for(const a of s){const l=(a.innerText||a.textContent||a.getAttribute("aria-label")||"").trim().toLowerCase();if(l==="submit"||l==="জমা দিন"||l==="done"||l.includes("submit")){_e(a),await new Promise(p=>setTimeout(p,15));break}}}return!0}const pe=class pe{constructor(){ie(this,"state",{...wt});ie(this,"config",{searchUrl:"",delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0});ie(this,"isRunning",!1);ie(this,"isPaused",!1);ie(this,"shouldStop",!1);ie(this,"onProgressCallbacks",[])}static getInstance(){return pe.instance||(pe.instance=new pe),pe.instance}subscribe(e){this.onProgressCallbacks.push(e)}getState(){return{...this.state}}broadcastState(){var e;for(const n of this.onProgressCallbacks)try{n(this.state)}catch{}try{typeof chrome<"u"&&((e=chrome.runtime)!=null&&e.sendMessage)&&chrome.runtime.sendMessage({type:"AUTO_JOIN_PROGRESS",payload:this.state})}catch{}}pause(){this.isRunning&&!this.isPaused&&(this.isPaused=!0,this.state.status="PAUSED",this.state.message="Auto-Join paused by user.",this.broadcastState())}resume(){this.isRunning&&this.isPaused&&(this.isPaused=!1,this.state.status="JOINING",this.state.message="Resuming group auto-joining...",this.broadcastState())}stop(){this.shouldStop=!0,this.isRunning=!1,this.isPaused=!1,this.state.status="STOPPED",this.state.message="Auto-Join stopped by user.",this.broadcastState()}async start(e){if(this.isRunning)return console.warn("[AGP:AutoJoiner] Already running."),this.state;this.config={...this.config,...e,delaySec:typeof e.delaySec=="number"?e.delaySec:0},this.isRunning=!0,this.isPaused=!1,this.shouldStop=!1;const n=St(window.location.href);this.state={...wt,status:"SEARCHING",searchUrl:window.location.href,query:n,message:`Scanning Facebook group search results for "${n}"...`,startedAt:Date.now()},this.broadcastState();try{let o=0;const r=new Set;for(;!this.shouldStop;){for(;this.isPaused&&!this.shouldStop;)await new Promise(s=>setTimeout(s,500));if(this.shouldStop)break;const i=me();if(this.state.groups=i.map(s=>s.item),this.state.totalFound=i.length,this.state.alreadyJoinedCount=i.filter(s=>s.item.status==="ALREADY_JOINED").length,this.state.requestedCount=i.filter(s=>s.item.status==="REQUESTED").length,this.state.joinedCount=i.filter(s=>s.item.status==="JOINED").length,this.config.saveToGroups)for(const s of i)s.item.status==="ALREADY_JOINED"&&!r.has(s.item.groupId)&&(r.add(s.item.groupId),await this.saveGroupToDatabase(s.item));const c=i.find(s=>s.item.status==="READY_TO_JOIN"&&!r.has(s.item.groupId));if(c){o=0;const{cardElement:s,item:a}=c;let l=c.joinButton;if(!l&&s){const p=Array.from(s.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const u of p)if(Fe(u)){l=u;break}if(!l){for(const u of p)if(!ze(u)&&!Je(u)){const m=(u.innerText||u.textContent||u.getAttribute("aria-label")||"").toLowerCase();if(!m.includes("more")&&!m.includes("menu")&&!m.includes("share")&&!m.includes("close")){l=u;break}}}}if(r.add(a.groupId),this.config.maxGroups>0&&this.state.joinedCount+this.state.requestedCount>=this.config.maxGroups){this.state.message=`Reached target limit of ${this.config.maxGroups} groups.`;break}if(l){this.state.status="JOINING",this.state.currentGroupName=a.name,a.status="JOINING",this.state.message=`Joining: "${a.name}"...`,this.broadcastState();try{s.scrollIntoView({behavior:"auto",block:"nearest"}),s.style.outline="3px solid #10b981",s.style.boxShadow="0 0 15px rgba(16, 185, 129, 0.45)",s.style.borderRadius="8px"}catch{}try{console.log(`[AGP:AutoJoiner] Triggering instant click on Join button for: "${a.name}"`),_e(l),this.config.autoAnswerQuestions&&await oo(this.config.defaultAnswer),a.status="JOINED",a.joinedAt=Date.now(),this.state.joinedCount++,this.config.saveToGroups&&await this.saveGroupToDatabase(a),this.state.message=`Joined "${a.name}" (${a.status})`,this.broadcastState()}catch(u){console.error("[AGP:AutoJoiner] Join error on",a.name,u),a.status="FAILED",a.error=String(u),this.state.failedCount++,this.broadcastState()}finally{try{s.style.outline="2px solid rgba(16, 185, 129, 0.35)",s.style.boxShadow="none"}catch{}}const p=typeof this.config.delaySec=="number"?this.config.delaySec:0;if(p<=0)this.state.countdownSec=0,await new Promise(u=>setTimeout(u,30));else{for(let u=p;u>0&&!this.shouldStop;u--){for(;this.isPaused&&!this.shouldStop;)await new Promise(m=>setTimeout(m,200));if(this.shouldStop)break;this.state.countdownSec=u,this.state.message=`Waiting ${u}s before next group...`,this.broadcastState(),await new Promise(m=>setTimeout(m,1e3))}this.state.countdownSec=0}}}else{this.state.message="Loading more Facebook groups on this page...",this.broadcastState();const s=document.body.scrollHeight;if(window.scrollBy({top:1800,behavior:"auto"}),window.dispatchEvent(new Event("scroll",{bubbles:!0})),await new Promise(p=>setTimeout(p,120)),!me().some(p=>p.item.status==="READY_TO_JOIN"&&!r.has(p.item.groupId))&&document.body.scrollHeight===s){if(o++,o>=3)break}else o=0}}this.shouldStop||(this.state.status="COMPLETED",this.state.message=`Auto-join complete! Joined ${this.state.joinedCount} groups, requested ${this.state.requestedCount} groups.`)}catch(o){console.error("[AGP:AutoJoiner] Execution error:",o),this.state.status="ERROR",this.state.message=`Error: ${(o==null?void 0:o.message)||String(o)}`}finally{this.isRunning=!1,this.isPaused=!1,this.state.finishedAt=Date.now(),this.broadcastState()}return this.state}async saveGroupToDatabase(e){var n;try{const o=await rt();if(!o.some(i=>i.groupId&&i.groupId.toLowerCase()===e.groupId.toLowerCase()||i.url&&i.url.toLowerCase().includes(e.groupId.toLowerCase()))){const i={id:Be(),name:e.name,url:e.url,groupId:e.groupId,privacy:e.privacy,category:this.config.selectedCategory||"Auto Joined",enabled:!0,selected:!1,status:"READY",postCount:0,verified:!0,source:"facebook-ui",createdAt:Date.now(),updatedAt:Date.now()};await st([...o,i]),console.log(`[AGP:AutoJoiner] Saved "${e.name}" (${e.groupId}) to My Facebook Groups database.`);try{typeof chrome<"u"&&((n=chrome.runtime)!=null&&n.sendMessage)&&chrome.runtime.sendMessage({type:"AUTO_JOIN_SAVE_GROUPS",payload:{group:i}})}catch{}}}catch(o){console.warn("[AGP:AutoJoiner] Save to database error:",o)}}};ie(pe,"instance");let U=pe,ee=null,v=null,W="",V=[],isUploadingMedia=!1,Te="POST_AND_JOIN",B=0,te=5,Ge=!1,ut=!1,kt=!1,y={isRunning:!1,isPaused:!1,status:"IDLE",message:"Ready to auto-join and post to Facebook groups from this search page.",total:0,completed:0,skipped:0,failed:0,currentGroupName:""},K=null;let showLivePreview=!1;const SMALL_CAPS_MAP={a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",f:"ғ",g:"ɢ",h:"ʜ",i:"ɪ",j:"ᴊ",k:"ᴋ",l:"ʟ",m:"ᴍ",n:"ɴ",o:"ᴏ",p:"ᴘ",q:"ǫ",r:"ʀ",s:"s",t:"ᴛ",u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",y:"ʏ",z:"ᴢ"},REVERSE_SMALL_CAPS={"ᴀ":"a","ʙ":"b","ᴄ":"c","ᴅ":"d","ᴇ":"e","ғ":"f","ɢ":"g","ʜ":"h","ɪ":"i","ᴊ":"j","ᴋ":"k","ʟ":"l","ᴍ":"m","ɴ":"n","ᴏ":"o","ᴘ":"p","ǫ":"q","ʀ":"r","ᴛ":"t","ᴜ":"u","ᴠ":"v","ᴡ":"w","ʏ":"y","ᴢ":"z"};function normalizeStyledChar(t){if(REVERSE_SMALL_CAPS[t])return REVERSE_SMALL_CAPS[t];const e=t.codePointAt(0);if(!e)return t;if(e===8462)return"h";if(e===8492)return"B";if(e===8496)return"E";if(e===8497)return"F";if(e===8459)return"H";if(e===8464)return"I";if(e===8466)return"L";if(e===8499)return"M";if(e===8475)return"R";if(e===8495)return"e";if(e===8458)return"g";if(e===8500)return"o";if(e===8493)return"C";if(e===8460)return"H";if(e===8465)return"I";if(e===8476)return"R";if(e===8488)return"Z";if(e===8450)return"C";if(e===8461)return"H";if(e===8469)return"N";if(e===8473)return"P";if(e===8474)return"Q";if(e===8477)return"R";if(e===8484)return"Z";if(e>=119808&&e<=119833)return String.fromCharCode(65+(e-119808));if(e>=119834&&e<=119859)return String.fromCharCode(97+(e-119834));if(e>=119860&&e<=119885)return String.fromCharCode(65+(e-119860));if(e>=119886&&e<=119911)return String.fromCharCode(97+(e-119886));if(e>=119912&&e<=119937)return String.fromCharCode(65+(e-119912));if(e>=119938&&e<=119963)return String.fromCharCode(97+(e-119938));if(e>=119964&&e<=119989)return String.fromCharCode(65+(e-119964));if(e>=119990&&e<=120015)return String.fromCharCode(97+(e-119990));if(e>=120016&&e<=120041)return String.fromCharCode(65+(e-120016));if(e>=120042&&e<=120067)return String.fromCharCode(97+(e-120042));if(e>=120068&&e<=120093)return String.fromCharCode(65+(e-120068));if(e>=120094&&e<=120119)return String.fromCharCode(97+(e-120094));if(e>=120120&&e<=120145)return String.fromCharCode(65+(e-120120));if(e>=120146&&e<=120171)return String.fromCharCode(97+(e-120146));if(e>=120172&&e<=120197)return String.fromCharCode(65+(e-120172));if(e>=120198&&e<=120223)return String.fromCharCode(97+(e-120198));if(e>=120224&&e<=120249)return String.fromCharCode(65+(e-120224));if(e>=120250&&e<=120275)return String.fromCharCode(97+(e-120250));if(e>=120276&&e<=120301)return String.fromCharCode(65+(e-120276));if(e>=120302&&e<=120327)return String.fromCharCode(97+(e-120302));if(e>=120328&&e<=120353)return String.fromCharCode(65+(e-120328));if(e>=120354&&e<=120379)return String.fromCharCode(97+(e-120354));if(e>=120380&&e<=120405)return String.fromCharCode(65+(e-120380));if(e>=120406&&e<=120431)return String.fromCharCode(97+(e-120406));if(e>=9398&&e<=9423)return String.fromCharCode(65+(e-9398));if(e>=9424&&e<=9449)return String.fromCharCode(97+(e-9424));if(e>=127312&&e<=127337)return String.fromCharCode(65+(e-127312));if(e>=127280&&e<=127305)return String.fromCharCode(65+(e-127280));if(e>=127344&&e<=127369)return String.fromCharCode(65+(e-127344));if(e>=120782&&e<=120791)return String.fromCharCode(48+(e-120782));if(e>=120792&&e<=120801)return String.fromCharCode(48+(e-120792));if(e>=120812&&e<=120821)return String.fromCharCode(48+(e-120812));if(e>=120822&&e<=120831)return String.fromCharCode(48+(e-120822));if(e===9450)return"0";if(e>=9312&&e<=9320)return String.fromCharCode(49+(e-9312));if(e===9471)return"0";if(e>=10122&&e<=10130)return String.fromCharCode(49+(e-10122));return t}function toNormalText(t){if(!t)return"";const e=t.replace(/[\u0336\u0335\u0332]/g,"");let n="";for(const o of e)n+=normalizeStyledChar(o);return n}function transformChar(t,e){const n=t.charCodeAt(0);if(e==="normal")return normalizeStyledChar(t);if(e==="small-caps"){const o=t.toLowerCase();return SMALL_CAPS_MAP[o]||t}if(n>=65&&n<=90){const o=n-65;switch(e){case"sans-italic":return String.fromCodePoint(120328+o);case"sans-bold":return String.fromCodePoint(120276+o);case"sans-bold-italic":return String.fromCodePoint(120380+o);case"serif-bold":return String.fromCodePoint(119808+o);case"serif-italic":return String.fromCodePoint(119860+o);case"monospace":return String.fromCodePoint(120432+o);case"script":{const r={66:8492,69:8496,70:8497,72:8459,73:8464,76:8466,77:8499,82:8475};return String.fromCodePoint(r[n]||119964+o)}case"bold-script":return String.fromCodePoint(120016+o);case"fraktur":{const r={67:8493,72:8460,73:8465,82:8476,90:8488};return String.fromCodePoint(r[n]||120068+o)}case"bold-fraktur":return String.fromCodePoint(120120+o);case"double-struck":{const r={67:8450,72:8461,78:8469,80:8473,81:8474,82:8477,90:8484};return String.fromCodePoint(r[n]||120172+o)}case"bubble":return String.fromCodePoint(9398+o);case"bubble-black":return String.fromCodePoint(127312+o);case"square":return String.fromCodePoint(127280+o);case"square-black":return String.fromCodePoint(127344+o)}}if(n>=97&&n<=122){const o=n-97;switch(e){case"sans-italic":return String.fromCodePoint(120354+o);case"sans-bold":return String.fromCodePoint(120302+o);case"sans-bold-italic":return String.fromCodePoint(120406+o);case"serif-bold":return String.fromCodePoint(119834+o);case"serif-italic":return t==="h"?"\u210E":String.fromCodePoint(119886+o);case"monospace":return String.fromCodePoint(120458+o);case"script":{const r={101:8495,103:8458,111:8500};return String.fromCodePoint(r[n]||119990+o)}case"bold-script":return String.fromCodePoint(120042+o);case"fraktur":return String.fromCodePoint(120094+o);case"bold-fraktur":return String.fromCodePoint(120146+o);case"double-struck":return String.fromCodePoint(120198+o);case"bubble":return String.fromCodePoint(9424+o);case"bubble-black":return String.fromCodePoint(127312+o);case"square":return String.fromCodePoint(127280+o);case"square-black":return String.fromCodePoint(127344+o)}}if(n>=48&&n<=57){const o=n-48;switch(e){case"sans-bold":case"sans-bold-italic":return String.fromCodePoint(120812+o);case"serif-bold":return String.fromCodePoint(120782+o);case"monospace":return String.fromCodePoint(120822+o);case"double-struck":return String.fromCodePoint(120792+o);case"bubble":return o===0?"⓪":String.fromCodePoint(9312+o-1);case"bubble-black":return o===0?"⓿":String.fromCodePoint(10122+o-1);default:return t}}return t}function applyTextStyle(t,e){if(!t)return"";if(e==="normal")return toNormalText(t);if(e==="strikethrough"){const n=t.replace(/[\u0336\u0335]/g,"");return n.split("").map(o=>o==="\n"||o==="\r"||o===" "?o:o+"\u0336").join("")}let n="";const o=toNormalText(t);for(const r of o)n+=transformChar(r,e);return n}function applyBold(t){if(!t)return"****";const e=t.trim();return e.startsWith("**")&&e.endsWith("**")&&e.length>=4?e.slice(2,-2):`**${t}**`}function applyItalic(t){if(!t)return"**";const e=t.trim();return e.startsWith("*")&&e.endsWith("*")&&e.length>=2&&!e.startsWith("**")?e.slice(1,-1):`*${t}*`}function applyHeading(t,e=1){const n=e===1?"# ":"## ";if(!t||!t.trim())return n;return t.split("\n").map(o=>{const r=o.trim();return r?r.startsWith("## ")?e===1?"# "+r.slice(3):r:r.startsWith("# ")?e===2?"## "+r.slice(2):r:n+r:o}).join("\n")}function applyBulletList(t){if(!t)return"  • ";return t.split("\n").map(e=>{const n=e.trim();if(!n)return e;const o=n.replace(/^([•*\-–—✓✔➤➔★⭐◆❖]|\d+[\.\)])\s*/,"");return"  • "+o}).join("\n")}function applyNumberedList(t){if(!t)return"  1. ";return t.split("\n").map((e,n)=>{const o=e.trim();if(!o)return e;const r=o.replace(/^([•*\-–—✓✔➤➔★⭐◆❖]|\d+[\.\)])\s*/,"");return`  ${n+1}. `+r}).join("\n")}function applyBlockquote(t){if(!t)return"> ";return t.split("\n").map(e=>{const n=e.trim();return n?n.startsWith("> ")?n:`> ${n}`:e}).join("\n")}function autoBeautifyCaption(t){if(!t||!t.trim())return t;const e=toNormalText(t).split("\n"),n=[];let o=!1;for(let r=0;r<e.length;r++){const i=e[r],c=i.trim();if(!c){n.push("");continue}if(!o){o=!0,n.push(applyTextStyle(c,"sans-italic"));continue}if(/^(model|brand|device|item|condition|color|varient|variant)\s*[:=]/i.test(c)){const a=c.match(/^([^:=]+[:=]\s*)(.*)$/);if(a){n.push(applyTextStyle(a[1],"sans-italic")+a[2]);continue}}const s=/^[•*\-–—✓✔➤➔★⭐◆❖]/.test(c)||/^(ram|rom|storage|camera|battery|display|processor|condition|screen|charger|box|accessories|sound|sim|official|unofficial|phone|fast)/i.test(c)||!c.includes(".")&&c.length<40&&!c.toLowerCase().includes("exchange")&&!c.toLowerCase().includes("price");if(s&&!c.toLowerCase().includes("exchange")&&!c.toLowerCase().includes("inbox")){n.push("  • "+c.replace(/^[•*\-–—✓✔➤➔★⭐◆❖\s]+/,""));continue}if(c.toLowerCase().includes("exchange")||c.toLowerCase().includes("price")||c.toLowerCase().includes("inbox")||c.toLowerCase().includes("call")||c.toLowerCase().includes("contact")||c.toLowerCase().includes("location")){n.push(applyTextStyle(c,"sans-italic"));continue}n.push(i)}return n.join("\n")}function htmlToStyledText(t){if(!t||!t.trim())return"";if(typeof DOMParser<"u")try{const e=new DOMParser().parseFromString(t,"text/html");if(e&&e.body){const n=o=>{if(o.nodeType===Node.TEXT_NODE)return o.textContent||"";if(o.nodeType!==Node.ELEMENT_NODE)return"";const r=o,i=r.tagName.toLowerCase();if(i==="br")return"\n";let c="";r.childNodes.forEach(l=>{c+=n(l)});const s=(r.getAttribute("style")||"").toLowerCase(),a=i==="strong"||i==="b"||s.includes("font-weight: bold")||s.includes("font-weight:bold")||s.includes("700")||s.includes("800"),l=i==="em"||i==="i"||s.includes("italic"),p=i==="s"||i==="strike"||i==="del"||s.includes("line-through");if(!c.trim())return c;let u=c;return a&&(!u.trim().startsWith("**")||!u.trim().endsWith("**"))&&(u=`**${u.trim()}**`),l&&(!u.trim().startsWith("*")||!u.trim().endsWith("*"))&&(u=`*${u.trim()}*`),p&&(!u.trim().startsWith("~~")||!u.trim().endsWith("~~"))&&(u=`~~${u.trim()}~~`),u},o=[],r=i=>{if(i.nodeType===Node.TEXT_NODE){const c=(i.textContent||"").trim();c&&o.push(c);return}if(i.nodeType!==Node.ELEMENT_NODE)return;const c=i,s=c.tagName.toLowerCase();if(s==="h1"){const a=n(c).trim();a&&o.push(`# ${a}`);return}if(s==="h2"||s==="h3"||s==="h4"){const a=n(c).trim();a&&o.push(`## ${a}`);return}if(s==="blockquote"){const a=n(c).trim();a&&a.split("\n").forEach(l=>{l.trim()&&o.push(`> ${l.trim()}`)});return}if(s==="ul"){c.querySelectorAll(":scope > li, li").forEach(l=>{const p=n(l).trim();p&&o.push(`  • ${p}`)});return}if(s==="ol"){c.querySelectorAll(":scope > li, li").forEach((l,p)=>{const u=n(l).trim();u&&o.push(`  ${p+1}. ${u}`)});return}if(s==="p"||s==="div"){if(Array.from(c.children).some(p=>/^(h[1-6]|p|div|ul|ol|blockquote)$/i.test(p.tagName))){c.childNodes.forEach(p=>r(p));return}const a=n(c).trim();a?o.push(a):(c.querySelector("br")||c.innerHTML.includes("<br>"))&&o.push("");return}c.childNodes.forEach(a=>r(a))};if(e.body.childNodes.forEach(i=>r(i)),o.length>0)return o.join("\n")}}catch{}return t.replace(/<[^>]+>/g,"").trim()}const SALES_SNIPPETS=[{id:"price-cut",name:"Price Cut (ডিসকাউন্ট মূল্য)",icon:"💰",content:"💰 Regular Price: ̶২̶,̶৫̶০̶০̶ ৳  ➔  Offer Price: {price}"},{id:"cod-delivery",name:"Cash on Delivery (ক্যাশ অন ডেলিভারি)",icon:"🚚",content:"🚚 সারা বাংলাদেশে ক্যাশ অন হোম ডেলিভারি (প্রোডাক্ট দেখে পেমেন্ট করার সুবিধা)!"},{id:"location",name:"Location (ঠিকানা / লোকেশন)",icon:"📍",content:"📍 Location: {location}"},{id:"contact-whatsapp",name:"Phone / WhatsApp (কল ও হোয়াটসঅ্যাপ)",icon:"📞",content:"📞 Call / WhatsApp: {contact_info}"},{id:"condition-fresh",name:"100% Fresh Condition (কন্ডিশন)",icon:"⚡",content:"⚡ Condition: ১০০% ফুল ফ্রেশ, কোনো স্ক্র্যাচ বা সমস্যা নেই।"},{id:"warranty",name:"Warranty / Replacement (ওয়ারেন্টি)",icon:"🎁",content:"🎁 ৭ দিনের রিপ্লেসমেন্ট এবং ১ বছরের ফ্রি সার্ভিস ওয়ারেন্টি!"},{id:"urgency-stock",name:"Limited Stock (সীমিত স্টক সতর্কতা)",icon:"🚨",content:"🚨 Limited Stock Available! অফার শেষ হওয়ার আগেই দ্রুত অর্ডার করুন!"},{id:"inbox-cta",name:"Inbox CTA (ইনবক্স আহ্বান)",icon:"💬",content:"👉 অর্ডার করতে অথবা যেকোনো তথ্যের জন্য এখনই ইনবক্স করুন!"},{id:"exchange-offer",name:"Exchange Offer (এক্সচেঞ্জ অফার)",icon:"🔄",content:"🔄 যেকোনো ব্যবহৃত ফোন/ডিভাইসের সাথে এক্সচেঞ্জ পসিবল (শর্ত প্রযোজ্য)।"}],DECORATIVE_DIVIDERS=[{name:"Double Line (সমান লাইন)",value:"══════════════════════════════"},{name:"Thick Line (মোটা লাইন)",value:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"},{name:"Thin Line (চিকন লাইন)",value:"──────────────────────────────"},{name:"Star Sparkle (তারকা বর্ডার)",value:"•┈┈┈••✦••┈┈┈••✦••┈┈┈••✦••┈┈┈•"},{name:"Flower Border (ফুলের বর্ডার)",value:"✿════════════════════════════✿"},{name:"Block Blocks (বক্স প্যাটার্ন)",value:"▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄"},{name:"Dashed Dots (ডট লাইন)",value:"┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈"},{name:"Double Arrow Star (স্টার অ্যারো)",value:"»»————-　★　————-««"}];function showDockToast(t){if(!v)return;const e=v.getElementById("agp-dock-toast");e&&e.remove();const n=document.createElement("div");n.id="agp-dock-toast",n.textContent=t,n.style.cssText="position: absolute; top: 14px; left: 50%; transform: translateX(-50%); background: rgba(15, 23, 42, 0.95); border: 1px solid #3b82f6; color: #ffffff; font-size: 11px; font-weight: 700; padding: 6px 14px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); z-index: 1000; pointer-events: none; animation: fadeInOut 2.2s forwards;",v.appendChild(n),setTimeout(()=>n.remove(),2200)}function renderPreviewCaptionHtml(t){if(!t||!t.trim())return'<span style="color: #94a3b8; font-style: italic;">পোস্টের কোনো ক্যাপশন লেখা হয়নি। উপরে টুলবার দিয়ে ডিজাইন করুন অথবা টেক্সট পেস্ট করুন...</span>';const e=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),n=i=>{let c=e(i);return c=c.replace(/\*\*(.+?)\*\*/g,'<strong style="font-weight: 800; color: #ffffff;">$1</strong>'),c=c.replace(/\*([^*\n]+?)\*/g,'<em style="font-style: italic; color: #f1f5f9;">$1</em>'),c=c.replace(/~~(.+?)~~/g,'<s style="color: #94a3b8;">$1</s>'),c=c.replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g,'<u style="text-decoration: underline;">$1</u>'),c=c.replace(/`([^`\n]+?)`/g,'<code style="background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 3px; font-family: monospace;">$1</code>'),c},o=t.split("\n"),r=[];for(let i=0;i<o.length;i++){const c=o[i],s=c.trim();if(!s){r.push('<div style="height: 8px;"></div>');continue}if(s.startsWith("# ")){r.push(`<h1 style="font-size: 15px; font-weight: 800; color: #60a5fa; margin: 4px 0 2px 0; line-height: 1.3;">${n(s.replace(/^#\s*/,""))}</h1>`);continue}if(s.startsWith("## ")||s.startsWith("### ")){r.push(`<h2 style="font-size: 13px; font-weight: 700; color: #93c5fd; margin: 3px 0 2px 0; line-height: 1.3;">${n(s.replace(/^#{2,3}\s*/,""))}</h2>`);continue}if(s.startsWith("> ")||s.startsWith("❝")){const a=s.replace(/^>\s*/,"").replace(/^[❝❞]\s*/,"");r.push(`<blockquote style="border-left: 3px solid #3b82f6; background: rgba(59, 130, 246, 0.12); padding: 4px 8px; margin: 4px 0; border-radius: 0 4px 4px 0; font-size: 11px; color: #e2e8f0;">${n(a)}</blockquote>`);continue}if(/^[•✓✔➤➔★⭐◆❖]/.test(s)||/^[\-*–—]\s+/.test(s)){const a=s.match(/^([•✓✔➤➔★⭐◆❖\-*–—]+)\s*(.*)$/),l=a?a[1]:"•",p=a?a[2]:s;r.push(`<div style="display: flex; align-items: flex-start; gap: 6px; padding-left: 4px; font-size: 11.5px; line-height: 1.4; color: #f1f5f9;"><span style="color: #60a5fa; font-weight: bold; flex-shrink: 0;">${e(l)}</span><span>${n(p)}</span></div>`);continue}if(/^(\d+)[\.\)]\s+/.test(s)){const a=s.match(/^(\d+)[\.\)]\s+(.*)$/),l=a?a[1]:"1",p=a?a[2]:s;r.push(`<div style="display: flex; align-items: flex-start; gap: 6px; padding-left: 4px; font-size: 11.5px; line-height: 1.4; color: #f1f5f9;"><span style="color: #93c5fd; font-weight: bold; flex-shrink: 0;">${e(l)}.</span><span>${n(p)}</span></div>`);continue}r.push(`<div style="font-size: 11.5px; line-height: 1.45; color: #e2e8f0;">${n(c)}</div>`)}return r.join("")}function isVideoMedia(t){return!(!t||typeof t!="string")&&(t.startsWith("data:video")||t.includes("video/")||t.startsWith("blob:")||/\.(mp4|mov|webm|m4v|mkv|avi)($|\?)/i.test(t))}function no(t){return new Promise(e=>{const isVid=t.type.startsWith("video/")||/\.(mp4|mov|webm|m4v|mkv|avi|3gp|flv)$/i.test(t.name);if(isVid){const o=new FileReader;o.onload=r=>{var i;let res=((i=r.target)==null?void 0:i.result)||"";if(res&&(res.startsWith("data:application/octet-stream")||res.startsWith("data:;base64"))){let mime="video/mp4";/\.webm$/i.test(t.name)?mime="video/webm":/\.mov$/i.test(t.name)?mime="video/quicktime":/\.mkv$/i.test(t.name)&&(mime="video/x-matroska"),res=res.replace(/^data:[^;]*;base64/,`data:${mime};base64`)}return e(res)},o.onerror=()=>e(""),o.readAsDataURL(t);return}const n=new FileReader;n.onload=o=>{var c;const r=((c=o.target)==null?void 0:c.result)||"";if(!r)return e("");const i=new Image;i.onload=()=>{let s=i.width,a=i.height;const l=1280;(s>l||a>l)&&(s>a?(a=Math.round(a*l/s),s=l):(s=Math.round(s*l/a),a=l));const p=document.createElement("canvas");p.width=s,p.height=a;const u=p.getContext("2d");u?(u.drawImage(i,0,0,s,a),e(p.toDataURL("image/jpeg",.82))):e(r)},i.onerror=()=>e(r),i.src=r},n.onerror=()=>e(""),n.readAsDataURL(t)})}async function de(){var t;try{typeof chrome<"u"&&((t=chrome.storage)!=null&&t.local)&&await chrome.storage.local.set({agp_search_poster_caption:W,agp_search_poster_photos:V,agp_search_poster_delay:te,agp_search_poster_target:B})}catch(e){console.warn("[AGP:SearchPoster] Failed to save draft to storage:",e)}}async function ro(){var t;if(!kt){kt=!0;try{if(typeof chrome<"u"&&((t=chrome.storage)!=null&&t.local)){const e=await chrome.storage.local.get(["agp_search_poster_caption","agp_search_poster_photos","agp_search_poster_delay","agp_search_poster_target"]);typeof(e==null?void 0:e.agp_search_poster_caption)=="string"&&(W=e.agp_search_poster_caption),Array.isArray(e==null?void 0:e.agp_search_poster_photos)&&(V=e.agp_search_poster_photos),typeof(e==null?void 0:e.agp_search_poster_delay)=="number"&&(te=e.agp_search_poster_delay),typeof(e==null?void 0:e.agp_search_poster_target)=="number"&&(B=e.agp_search_poster_target)}}catch(e){console.warn("[AGP:SearchPoster] Failed to load draft from storage:",e)}}}async function pt(t){if(typeof document>"u")return;await ro();const e=U.getInstance(),n=e.getState();ee||(ee=document.createElement("div"),ee.id="agp-auto-joiner-root",ee.style.cssText=`
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483646;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    `,v=ee.attachShadow({mode:"open"}),document.body.appendChild(ee),e.subscribe(o=>{P(o,t)}),ao(t)),P(n,t),io(t)}let Pt=null,Ct=-1,We=null;function so(t){if(!v)return;const e=t.length,n=v.getElementById("btn-toggle-groups");if(n){const s=n.querySelector("strong");s&&(s.textContent=`${e} Groups`)}const o=v.querySelector('#agp-select-target option[value="0"]');o&&(o.textContent=`All Found (${e})`);const r=v.getElementById("btn-start-campaign");if(r&&!y.isRunning){const s=B>0?B:e;r.innerHTML=`<span>🚀</span> Start Join & Post (${s} Groups)`}const i=v.querySelector(".groups-list-box");i&&(t.length>0?i.innerHTML=t.map(s=>`
        <div class="group-row">
          <span style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${s.item.name}">
            ${s.item.name}
          </span>
          <span class="group-badge" style="background: ${s.item.privacy==="PUBLIC"?"rgba(16, 185, 129, 0.2)":"rgba(245, 158, 11, 0.2)"}; color: ${s.item.privacy==="PUBLIC"?"#34d399":"#fbbf24"};">
            ${s.item.privacy}
          </span>
        </div>
      `).join(""):i.innerHTML='<div style="text-align: center; color: #64748b; font-size: 11px; padding: 10px;">Scrolling page to detect group cards...</div>');const c=v.querySelector(".stats-grid .stat-item:first-child .stat-num");c&&(c.textContent=String(e))}function io(t){if(Pt)return;const e=()=>{var r;if(y.isRunning)return;const o=me();if(o.length!==Ct&&(Ct=o.length,so(o),!(((r=v==null?void 0:v.activeElement)==null?void 0:r.id)==="agp-caption-input")&&!Ge)){const c=U.getInstance();P(c.getState(),t)}};Pt=setInterval(e,1200),setTimeout(e,300),setTimeout(e,800),setTimeout(e,1600),setTimeout(e,3e3);let n=null;window.addEventListener("scroll",()=>{n&&clearTimeout(n),n=setTimeout(e,300)},{passive:!0}),typeof MutationObserver<"u"&&document.body&&(We&&We.disconnect(),We=new MutationObserver(()=>{n&&clearTimeout(n),n=setTimeout(e,450)}),We.observe(document.body,{childList:!0,subtree:!0}))}function ao(t){var e;try{typeof chrome<"u"&&((e=chrome.runtime)!=null&&e.sendMessage)&&chrome.runtime.sendMessage({type:"GET_QUEUE_STATE"},n=>{var i,c;const o=(n==null?void 0:n.state)||((i=n==null?void 0:n.payload)==null?void 0:i.state),r=(n==null?void 0:n.stats)||((c=n==null?void 0:n.payload)==null?void 0:c.stats);if(n!=null&&n.success&&(o!=null&&o.isRunning)){y.isRunning=!0,y.isPaused=!!o.isPaused,y.status=o.isPaused?"PAUSED":"RUNNING",y.total=(r==null?void 0:r.total)||0,y.completed=(r==null?void 0:r.completed)||0,y.failed=(r==null?void 0:r.failed)||0,y.skipped=(r==null?void 0:r.skipped)||0,y.currentGroupName=o.expectedGroupName||"Facebook Group",y.message=`Auto-posting in progress (${y.completed}/${y.total} done)...`,It();const s=U.getInstance();P(s.getState(),t)}})}catch{}}function It(){K&&clearInterval(K),K=setInterval(()=>{var t;try{typeof chrome<"u"&&((t=chrome.runtime)!=null&&t.sendMessage)&&chrome.runtime.sendMessage({type:"GET_QUEUE_STATE"},e=>{var i,c;if(chrome.runtime.lastError||!(e!=null&&e.success))return;const n=(e==null?void 0:e.state)||((i=e==null?void 0:e.payload)==null?void 0:i.state),o=(e==null?void 0:e.stats)||((c=e==null?void 0:e.payload)==null?void 0:c.stats);if(!n||!o)return;n.isRunning?(y.isRunning=!0,y.isPaused=!!n.isPaused,y.status=n.isPaused?"PAUSED":"RUNNING",y.total=o.total||0,y.completed=o.completed||0,y.failed=o.failed||0,y.skipped=o.skipped||0,y.currentGroupName=n.expectedGroupName||"",y.message=y.isPaused?"Campaign paused by user.":`🚀 Posting to: "${y.currentGroupName||"Group"}" (${y.completed}/${y.total} done)...`):y.isRunning&&(y.isRunning=!1,y.isPaused=!1,y.status="COMPLETED",y.completed=o.completed||y.completed,y.total=o.total||y.total,y.message=`🎉 Campaign Finished! Successfully posted to ${y.completed} groups.`,clearInterval(K),K=null);const r=U.getInstance();P(r.getState())})}catch{K&&(clearInterval(K),K=null)}},1e3)}function P(t,e){if(!v)return;const n=St(window.location.href),o=me(),r=o.length||t.totalFound,i=t.status==="SEARCHING"||t.status==="JOINING",c=y.isRunning&&!y.isPaused,s=y.isPaused,a=i||c,l=c?"#10b981":s?"#f59e0b":t.status==="JOINING"?"#10b981":t.status==="SEARCHING"?"#3b82f6":t.status==="PAUSED"?"#f59e0b":y.status==="COMPLETED"?"#10b981":"#6366f1";if(ut){const u=y.isRunning?`Posting: ${y.completed}/${y.total}`:i?`Joining: ${t.joinedCount}`:`Auto-Poster: ${r} Groups`;v.innerHTML=`
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
          background: ${l};
          ${a?"animation: pulse 1.5s infinite;":""}
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      </style>
      <div id="agp-dock-expand" class="mini-badge">
        <div class="dot"></div>
        <span style="font-size: 13px; font-weight: 700; letter-spacing: -0.2px;">${u}</span>
        <span style="font-size: 12px; color: #94a3b8; margin-left: 2px;">↗</span>
      </div>
    `;const m=v.getElementById("agp-dock-expand");m&&(m.onclick=()=>{ut=!1,P(t,e)});return}const p=y.total>0?Math.min(100,Math.round(y.completed/y.total*100)):0;v.innerHTML=`
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
        background: ${l}22;
        color: ${l};
        border: 1px solid ${l}55;
      }
      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${l};
        ${a?"animation: pulse 1.5s infinite;":""}
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

      /* Design Toolbar */
      .design-toolbar {
        background: rgba(30, 41, 59, 0.7);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-bottom: none;
        border-radius: 10px 10px 0 0;
        padding: 6px;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .toolbar-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 4px;
      }
      .tb-btn {
        background: rgba(15, 23, 42, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 5px;
        color: #f1f5f9;
        font-size: 11px;
        font-weight: 700;
        padding: 2.5px 7px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
        user-select: none;
      }
      .tb-btn:hover {
        background: rgba(59, 130, 246, 0.3);
        border-color: #3b82f6;
        color: #ffffff;
      }
      .tb-btn:active {
        transform: scale(0.96);
      }
      .tb-btn.active {
        background: #2563eb;
        border-color: #3b82f6;
        color: white;
      }
      .tb-btn-auto {
        background: rgba(245, 158, 11, 0.18);
        border-color: rgba(245, 158, 11, 0.4);
        color: #fbbf24;
      }
      .tb-btn-auto:hover {
        background: rgba(245, 158, 11, 0.35);
        border-color: #f59e0b;
        color: #ffffff;
      }
      .tb-select {
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 5px;
        color: #cbd5e1;
        font-size: 10.5px;
        font-weight: 600;
        padding: 2.5px 5px;
        outline: none;
        cursor: pointer;
      }
      .tb-select:focus {
        border-color: #3b82f6;
      }
      .tb-select-sales {
        color: #34d399;
      }
      .fb-preview-card {
        background: #18191a;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 10px;
        padding: 10px 12px;
        margin-top: 8px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      }
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -6px); }
        15% { opacity: 1; transform: translate(-50%, 0); }
        80% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -6px); }
      }

      .caption-input {
        width: 100%;
        min-height: 72px;
        max-height: 140px;
        resize: vertical;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 0 0 10px 10px;
        border-top: none;
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

      /* Photos & Videos Preview Area */
      .photos-container {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        margin-top: 6px;
        padding: 6px;
        border-radius: 10px;
        background: rgba(15, 23, 42, 0.4);
        border: 1px dashed rgba(255, 255, 255, 0.12);
        transition: border-color 0.2s, background-color 0.2s;
      }
      .photos-container.drag-over {
        border-color: #3b82f6;
        background: rgba(59, 130, 246, 0.15);
      }
      .photo-thumb-wrapper {
        position: relative;
        width: 62px;
        height: 62px;
        border-radius: 9px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: #0f172a;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .photo-thumb-wrapper.is-video {
        border-color: rgba(16, 185, 129, 0.5);
        box-shadow: 0 0 8px rgba(16, 185, 129, 0.25);
      }
      .photo-thumb-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        display: block;
      }
      .photo-thumb-video {
        background: #020617;
        pointer-events: none;
      }
      .media-video-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        padding-bottom: 3px;
        background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%);
        pointer-events: none;
      }
      .media-video-badge {
        background: rgba(16, 185, 129, 0.95);
        color: #ffffff;
        font-size: 8px;
        font-weight: 800;
        padding: 1px 4px;
        border-radius: 3px;
        letter-spacing: 0.3px;
        display: inline-flex;
        align-items: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.6);
      }
      .media-index-pill {
        position: absolute;
        top: 2px;
        left: 2px;
        background: rgba(0, 0, 0, 0.75);
        color: #f8fafc;
        font-size: 8px;
        font-weight: 700;
        padding: 1px 4px;
        border-radius: 3px;
        pointer-events: none;
        z-index: 2;
      }
      .photo-remove-btn {
        position: absolute;
        top: 2px;
        right: 2px;
        width: 17px;
        height: 17px;
        background: #ef4444;
        border: 1px solid #0f172a;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.4);
        transition: transform 0.15s, background-color 0.15s;
        z-index: 5;
      }
      .photo-remove-btn:hover {
        transform: scale(1.18);
        background: #dc2626;
      }
      .btn-add-photos {
        min-height: 62px;
        padding: 6px 12px;
        background: rgba(30, 41, 59, 0.75);
        border: 1px dashed rgba(255, 255, 255, 0.3);
        border-radius: 9px;
        color: #94a3b8;
        font-size: 11px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2px;
        transition: all 0.2s;
      }
      .btn-add-photos:hover {
        background: rgba(59, 130, 246, 0.2);
        border-color: #3b82f6;
        color: #60a5fa;
      }
      .media-uploading-card {
        width: 62px;
        height: 62px;
        border-radius: 9px;
        border: 1px dashed #3b82f6;
        background: rgba(59, 130, 246, 0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        color: #60a5fa;
        font-size: 9px;
        font-weight: 700;
      }
      .media-spinner {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(96, 165, 250, 0.3);
        border-top-color: #60a5fa;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
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
            <div class="subtitle" title="${n||"Facebook Groups"}">
              ${n?`Search: "${n}"`:"Group Search Results"}
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
          <div class="status-pill">
            <div class="status-dot"></div>
            <span>${c?"POSTING":s?"PAUSED":i?"JOINING":t.status}</span>
          </div>
          <button id="agp-dock-min" class="icon-btn" title="Minimize">−</button>
          <button id="agp-dock-close" class="icon-btn" title="Dismiss">✕</button>
        </div>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="tabs-nav">
        <button id="tab-post" class="tab-btn ${Te==="POST_AND_JOIN"?"active":""}">
          <span>🚀 Auto-Join & Post</span>
          <span class="hot-badge">NEW</span>
        </button>
        <button id="tab-join" class="tab-btn ${Te==="JOIN_ONLY"?"active":""}">
          <span>⚡ Join Only</span>
        </button>
      </div>

      ${Te==="POST_AND_JOIN"?`
        <!-- ================= POST & JOIN MODE ================= -->
        <!-- Caption Section -->
        <div class="form-section">
          <div class="label-row">
            <label class="form-label">
              <span>📝 Post Caption / Description *</span>
            </label>
            <div style="display: flex; align-items: center; gap: 8px;">
              ${W?'<button id="btn-clear-caption" class="action-link">Clear</button>':""}
              <span class="char-count" style="margin-top: 0;">${W.length} chars</span>
            </div>
          </div>

          <!-- Design Toolbar -->
          <div class="design-toolbar">
            <!-- Row 1: Facebook Text Formatting Tools -->
            <div class="toolbar-row">
              <button type="button" id="tb-h1" class="tb-btn" title="Heading 1 (বড় শিরোনাম - H1)">H1</button>
              <button type="button" id="tb-h2" class="tb-btn" title="Heading 2 (মাঝারি শিরোনাম - H2)">H2</button>
              <button type="button" id="tb-bold" class="tb-btn" title="Bold font (**text** - Works for Bengali, English, Emojis)"><strong>𝐁</strong> Bold</button>
              <button type="button" id="tb-italic" class="tb-btn" title="Italic font (*text*)"><em style="font-style: italic; font-family: serif;">𝘐</em> Italic</button>
              <button type="button" id="tb-strike" class="tb-btn" title="Strikethrough / কাটা দাগ (মূল্য ছাড়ে: ̶২̶,̶৫̶০̶০̶ ৳)" style="text-decoration: line-through;">S</button>
              <button type="button" id="tb-bullets" class="tb-btn" title="Bullet list (বুলেট পয়েন্ট)"><span style="color: #60a5fa; margin-right: 2px;">•</span> Bullets</button>
              <button type="button" id="tb-numbers" class="tb-btn" title="Numbered list (১. ২. ৩. নাম্বারিং)">1. List</button>
              <button type="button" id="tb-quote" class="tb-btn" title="Blockquote (কোটেশন)">❞ Quote</button>
              <select id="tb-select-style" class="tb-select" title="More Unicode Font Styles">
                <option value="" disabled selected>🔤 Style</option>
                <option value="sans-bold">𝘀𝗮𝗹𝗲 (Sans Bold)</option>
                <option value="sans-italic">𝘴𝘢𝘭𝘦 (Sans Italic)</option>
                <option value="sans-bold-italic">𝙨𝙖𝙡𝙚 (Bold Italic)</option>
                <option value="serif-bold">𝐬𝐚ｌ𝗲 (Serif Bold)</option>
                <option value="serif-italic">𝑠𝑎ｌｅ (Serif Italic)</option>
                <option value="script">𝓈𝒶𝓁ℯ (Cursive Script)</option>
                <option value="bold-script">𝓼𝓪𝓵𝓮 (Bold Script)</option>
                <option value="fraktur">𝔰𝔞𝔩𝔢 (Gothic Fraktur)</option>
                <option value="bold-fraktur">𝖌𝖔𝖙𝖍𝖎𝖌 (Bold Gothic)</option>
                <option value="double-struck">𝕕𝕠𝕦𝕓𝕝𝕖 (Double Struck)</option>
                <option value="bubble">ⓑⓤⓑⓑⓛⓔ (Bubble)</option>
                <option value="bubble-black">🅑🅤🅑🅑🅛🅔 (Black Bubble)</option>
                <option value="square">🅂🅀🅄🄰🅁🄴 (Square)</option>
                <option value="square-black">🅰🅱🅲 (Black Square)</option>
                <option value="small-caps">ѕᴍᴀʟʟ ᴄᴀᴘs (Small Caps)</option>
                <option value="monospace">𝚜𝚊ｌ𝚎 (Monospace)</option>
                <option value="normal">sale (Clear Style)</option>
              </select>
            </div>

            <!-- Row 2: Sales Tags, Dividers, Auto-Design & Live Preview -->
            <div class="toolbar-row" style="justify-content: space-between; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 4px;">
              <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 4px;">
                <button type="button" id="tb-auto-design" class="tb-btn tb-btn-auto" title="১-ক্লিকে অটো-ডিজাইন (Italic Title, Spec Bullets & Condition Notes)">
                  <span>✨ Auto-Design</span>
                </button>
                <select id="tb-select-sales" class="tb-select tb-select-sales" title="Insert Sales Elements (Price, Delivery, WhatsApp, Warranty)">
                  <option value="" disabled selected>🏷️ 1-Click Sales Tags</option>
                  ${SALES_SNIPPETS.map(s => `<option value="${s.id}">${s.icon} ${s.name}</option>`).join("")}
                </select>
                <select id="tb-select-borders" class="tb-select" title="Insert Decorative Borders">
                  <option value="" disabled selected>➖ Borders</option>
                  ${DECORATIVE_DIVIDERS.map(d => `<option value="${d.value}">${d.name}</option>`).join("")}
                </select>
              </div>
              <button type="button" id="tb-btn-preview" class="tb-btn ${showLivePreview ? 'active' : ''}" title="Toggle Live Facebook Post Preview">
                <span>${showLivePreview ? '👁️ Hide' : '👁️ FB Preview'}</span>
              </button>
            </div>
          </div>

          <textarea
            id="agp-caption-input"
            class="caption-input"
            placeholder="What are you posting? Write your full listing caption, details, price, phone number...&#10;&#10;Use H1, H2, Bold, Italic, Bullets, Sales Tags above to design your caption!"
          >${W}</textarea>

          <!-- Live Facebook Post Preview Card -->
          ${
            showLivePreview
              ? `
            <div class="fb-preview-card" id="agp-preview-card">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: flex; align-items: center; justify-content: center; font-size: 15px;">👤</div>
                  <div>
                    <div style="font-size: 12px; font-weight: 700; color: #ffffff;">Your Facebook Profile</div>
                    <div style="font-size: 10px; color: #94a3b8; display: flex; align-items: center; gap: 4px;">
                      <span>Just now</span>
                      <span>·</span>
                      <span>👥 Public Group</span>
                    </div>
                  </div>
                </div>
                <span style="font-size: 9px; font-weight: 700; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); padding: 2px 6px; border-radius: 12px;">FB PREVIEW</span>
              </div>
              <div id="agp-preview-body" style="word-break: break-word;">
                ${renderPreviewCaptionHtml(W)}
              </div>
              ${
                V.length > 0
                  ? `
                <div style="margin-top: 8px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #000; max-height: 120px; display: flex; align-items: center; justify-content: center;">
                  ${
                    isVideoMedia(V[0])
                      ? `<video src="${V[0]}#t=0.1" style="max-height: 120px; width: 100%; object-fit: cover;" muted></video>`
                      : `<img src="${V[0]}" style="max-height: 120px; width: 100%; object-fit: cover;" alt="Preview" />`
                  }
                </div>
                `
                  : ''
              }
              <div style="display: flex; align-items: center; justify-content: space-around; margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #94a3b8; font-weight: 600;">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>↗ Share</span>
              </div>
            </div>
            `
              : ''
          }
        </div>

        <!-- Photos & Videos Section -->
        ${(()=>{const pCount=V.filter(u=>!isVideoMedia(u)).length,vCount=V.filter(u=>isVideoMedia(u)).length,lbl=pCount>0&&vCount>0?`${pCount} Photos + ${vCount} Video${vCount>1?"s":""}`:vCount>0?`${vCount} Video${vCount>1?"s":""}`:pCount>0?`${pCount} Photo${pCount>1?"s":""}`:"0 Media";return`
        <div class="form-section">
          <div class="label-row">
            <label class="form-label">
              <span>📸🎥 Product Photos & Videos (${lbl} Added)</span>
            </label>
            ${V.length>0?'<button id="btn-clear-photos" class="action-link">Remove All</button>':""}
          </div>
          <input
            type="file"
            id="agp-file-input"
            accept="image/*,video/*,.mp4,.mov,.webm,.m4v,.mkv"
            multiple
            style="display: none;"
          />
          <div class="photos-container" id="agp-media-container">
            ${V.map((u,m)=>{const isVid=isVideoMedia(u);return`
                <div class="photo-thumb-wrapper ${isVid?"is-video":""}" title="${isVid?"Video":"Photo"} #${m+1}">
                  ${isVid?`<video src="${u}#t=0.1" class="photo-thumb-img photo-thumb-video" muted playsinline preload="metadata" onloadedmetadata="this.currentTime=0.1"></video><div class="media-video-overlay"><span class="media-video-badge">▶ VIDEO</span></div>`:`<img src="${u}" class="photo-thumb-img" alt="Photo ${m+1}" />`}
                  <span class="media-index-pill">#${m+1}</span>
                  <button class="photo-remove-btn" data-index="${m}" title="Remove">✕</button>
                </div>
              `}).join("")}
            ${isUploadingMedia?'<div class="media-uploading-card"><div class="media-spinner"></div><span>Uploading...</span></div>':""}
            <button id="btn-trigger-upload" class="btn-add-photos" title="Add photos and videos together (ছবি ও ভিডিও একসাথে যোগ করুন)">
              <div style="font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                <span>📷</span><span style="font-size: 11px; opacity: 0.7;">+</span><span>🎥</span>
              </div>
              <span style="font-weight: 700; color: #f1f5f9;">+ Add Photos/Video</span>
              <span style="font-size: 9px; color: #94a3b8; font-weight: normal;">(ছবি ও ভিডিও একসাথে)</span>
            </button>
          </div>
        </div>`})()}

        <!-- Options: Targeting & Delay -->
        <div class="options-grid">
          <div>
            <div class="form-label" style="margin-bottom: 4px;">Target Groups</div>
            <select id="agp-select-target" class="select-box">
              <option value="0" ${B===0?"selected":""}>All Found (${r})</option>
              <option value="5" ${B===5?"selected":""}>Top 5 Groups</option>
              <option value="10" ${B===10?"selected":""}>Top 10 Groups</option>
              <option value="20" ${B===20?"selected":""}>Top 20 Groups</option>
            </select>
          </div>
          <div>
            <div class="form-label" style="margin-bottom: 4px;">Pacing Delay</div>
            <select id="agp-select-delay" class="select-box">
              <option value="0" ${te===0?"selected":""}>Turbo (0s Delay)</option>
              <option value="5" ${te===5?"selected":""}>5 Sec (Recommended)</option>
              <option value="10" ${te===10?"selected":""}>10 Seconds</option>
              <option value="20" ${te===20?"selected":""}>20 Seconds</option>
              <option value="30" ${te===30?"selected":""}>30 Seconds</option>
            </select>
          </div>
        </div>

        <!-- Discovered Groups Accordion -->
        <div id="btn-toggle-groups" class="groups-preview-toggle">
          <span>👥 Found on Search Page: <strong style="color: #60a5fa;">${r} Groups</strong></span>
          <span>${Ge?"▲ Hide":"▼ View List"}</span>
        </div>
        ${Ge?`
          <div class="groups-list-box">
            ${o.length>0?o.map(u=>`
                  <div class="group-row">
                    <span style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${u.item.name}">
                      ${u.item.name}
                    </span>
                    <span class="group-badge" style="background: ${u.item.privacy==="PUBLIC"?"rgba(16, 185, 129, 0.2)":"rgba(245, 158, 11, 0.2)"}; color: ${u.item.privacy==="PUBLIC"?"#34d399":"#fbbf24"};">
                      ${u.item.privacy}
                    </span>
                  </div>
                `).join(""):'<div style="text-align: center; color: #64748b; font-size: 11px; padding: 10px;">Scrolling page to detect group cards...</div>'}
          </div>
        `:""}

        <!-- Progress Bar when running -->
        ${y.isRunning||y.total>0?`
          <div class="progress-container">
            <div class="progress-bar" style="width: ${p}%;"></div>
          </div>
        `:""}

        <!-- Status Message Box -->
        <div class="message-box">
          ${y.message}
        </div>

        <!-- Action Buttons -->
        <div class="btn-row">
          ${!y.isRunning&&!s?`<button id="btn-start-campaign" class="btn btn-post-primary">
                   <span>🚀</span> Start Join & Post (${B>0?B:r} Groups)
                 </button>`:y.isRunning?`<button id="btn-pause-campaign" class="btn btn-pause">⏸ Pause</button>
                 <button id="btn-stop-campaign" class="btn btn-stop">⏹ Stop</button>`:`<button id="btn-resume-campaign" class="btn btn-post-primary">▶ Resume</button>
                 <button id="btn-stop-campaign" class="btn btn-stop">⏹ Stop</button>`}
        </div>
        `:`
        <!-- ================= JOIN ONLY MODE ================= -->
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-num" style="color: #60a5fa;">${r}</div>
            <div class="stat-label">Found</div>
          </div>
          <div class="stat-item">
            <div class="stat-num" style="color: #34d399;">${t.joinedCount}</div>
            <div class="stat-label">Joined</div>
          </div>
          <div class="stat-item">
            <div class="stat-num" style="color: #fbbf24;">${t.requestedCount}</div>
            <div class="stat-label">Pending</div>
          </div>
          <div class="stat-item">
            <div class="stat-num" style="color: #a78bfa;">${t.alreadyJoinedCount}</div>
            <div class="stat-label">Member</div>
          </div>
        </div>

        <div class="message-box">
          ${t.message||"Ready to auto-join all groups on this search page and save them to your list."}
        </div>

        <div class="btn-row">
          ${!i&&t.status!=="PAUSED"?`<button id="btn-start-join" class="btn btn-join-primary">
                   <span>▶</span> Auto-Join All Groups
                 </button>`:i?`<button id="btn-pause-join" class="btn btn-pause">⏸ Pause</button>
                 <button id="btn-stop-join" class="btn btn-stop">⏹ Stop</button>`:`<button id="btn-resume-join" class="btn btn-join-primary">▶ Resume</button>
                 <button id="btn-stop-join" class="btn btn-stop">⏹ Stop</button>`}
        </div>
        `}

      <!-- Footer Actions -->
      <div class="footer-actions">
        <span style="font-size: 10px; color: #64748b;">Groups auto-saved to database</span>
        <button id="btn-view-groups" class="link-btn">View My Groups / Queue ↗</button>
      </div>
    </div>
  `,co(t,e)}function co(t,e){var c,s,a,l,p,u,m,d,f,g,b,x,h,A,E,L,_;if(!v)return;(c=v.getElementById("agp-dock-close"))==null||c.addEventListener("click",()=>{ee&&(ee.remove(),ee=null,v=null)}),(s=v.getElementById("agp-dock-min"))==null||s.addEventListener("click",()=>{ut=!0,P(t,e)}),(a=v.getElementById("btn-view-groups"))==null||a.addEventListener("click",()=>{var S;try{typeof chrome<"u"&&((S=chrome.runtime)!=null&&S.sendMessage)&&chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})}catch{}}),(l=v.getElementById("tab-post"))==null||l.addEventListener("click",()=>{Te="POST_AND_JOIN",P(t,e)}),(p=v.getElementById("tab-join"))==null||p.addEventListener("click",()=>{Te="JOIN_ONLY",P(t,e)});const n=v.getElementById("agp-caption-input");
if(n){
  n.addEventListener("input",()=>{
    W=n.value,de();
    const S=v==null?void 0:v.querySelector(".char-count");
    S&&(S.textContent=`${W.length} chars`);
    const pb=v==null?void 0:v.getElementById("agp-preview-body");
    pb&&(pb.innerHTML=renderPreviewCaptionHtml(W));
  });
  n.addEventListener("paste",S=>{
    var T;
    const q=(T=S.clipboardData)==null?void 0:T.getData("text/html");
    if(q&&(q.match(/<(h[1-6]|b|strong|i|em|s|u|ul|ol|li|blockquote)[\s>]/i)||q.includes("data-lexical"))){
      S.preventDefault();
      const R=htmlToStyledText(q),start=n.selectionStart,end=n.selectionEnd;
      W=n.value.substring(0,start)+R+n.value.substring(end);
      n.value=W,de(),n.focus(),n.setSelectionRange(start+R.length,start+R.length);
      showDockToast("📋 Styled text pasted with full design!");
      const cnt=v==null?void 0:v.querySelector(".char-count");
      cnt&&(cnt.textContent=`${W.length} chars`);
      const pb=v==null?void 0:v.getElementById("agp-preview-body");
      pb&&(pb.innerHTML=renderPreviewCaptionHtml(W));
    }
  });
}
const applyTextTransform=(fn,defaultEmptyText)=>{
  if(!n)return;
  const start=n.selectionStart,end=n.selectionEnd;
  if(start!==end){
    const selected=n.value.substring(start,end),replaced=fn(selected);
    W=n.value.substring(0,start)+replaced+n.value.substring(end);
    n.value=W,de(),n.focus(),n.setSelectionRange(start,start+replaced.length);
  }else if(defaultEmptyText!==undefined){
    W=n.value.substring(0,start)+defaultEmptyText+n.value.substring(end);
    n.value=W,de(),n.focus();
    const mid=start+Math.floor(defaultEmptyText.length/2);
    n.setSelectionRange(mid,mid);
  }else if(W.trim()){
    W=fn(W),n.value=W,de(),n.focus();
  }
  const cnt=v==null?void 0:v.querySelector(".char-count");
  cnt&&(cnt.textContent=`${W.length} chars`);
  const pb=v==null?void 0:v.getElementById("agp-preview-body");
  pb&&(pb.innerHTML=renderPreviewCaptionHtml(W));
};
v.getElementById("tb-h1")?.addEventListener("click",()=>{
  if(!n)return;
  const start=n.selectionStart,end=n.selectionEnd;
  if(start!==end)applyTextTransform(txt=>applyHeading(txt,1));
  else{
    const before=n.value.substring(0,start),after=n.value.substring(end);
    const lastNl=before.lastIndexOf("\n"),nextNl=after.indexOf("\n");
    const lineStart=lastNl===-1?0:lastNl+1,lineEnd=nextNl===-1?n.value.length:start+nextNl;
    const curLine=n.value.substring(lineStart,lineEnd),headLine=applyHeading(curLine,1);
    W=n.value.substring(0,lineStart)+headLine+n.value.substring(lineEnd);
    n.value=W,de(),n.focus();
  }
  showDockToast("🏷️ Heading 1 (H1)");
  const cnt=v==null?void 0:v.querySelector(".char-count");
  cnt&&(cnt.textContent=`${W.length} chars`);
  const pb=v==null?void 0:v.getElementById("agp-preview-body");
  pb&&(pb.innerHTML=renderPreviewCaptionHtml(W));
});
v.getElementById("tb-h2")?.addEventListener("click",()=>{
  if(!n)return;
  const start=n.selectionStart,end=n.selectionEnd;
  if(start!==end)applyTextTransform(txt=>applyHeading(txt,2));
  else{
    const before=n.value.substring(0,start),after=n.value.substring(end);
    const lastNl=before.lastIndexOf("\n"),nextNl=after.indexOf("\n");
    const lineStart=lastNl===-1?0:lastNl+1,lineEnd=nextNl===-1?n.value.length:start+nextNl;
    const curLine=n.value.substring(lineStart,lineEnd),headLine=applyHeading(curLine,2);
    W=n.value.substring(0,lineStart)+headLine+n.value.substring(lineEnd);
    n.value=W,de(),n.focus();
  }
  showDockToast("🏷️ Heading 2 (H2)");
  const cnt=v==null?void 0:v.querySelector(".char-count");
  cnt&&(cnt.textContent=`${W.length} chars`);
  const pb=v==null?void 0:v.getElementById("agp-preview-body");
  pb&&(pb.innerHTML=renderPreviewCaptionHtml(W));
});
v.getElementById("tb-bold")?.addEventListener("click",()=>{applyTextTransform(txt=>applyBold(txt),"****"),showDockToast("𝐁 Bold (**text**)")});
v.getElementById("tb-italic")?.addEventListener("click",()=>{applyTextTransform(txt=>applyItalic(txt),"**"),showDockToast("𝘐 Italic (*text*)")});
v.getElementById("tb-strike")?.addEventListener("click",()=>{applyTextTransform(txt=>applyTextStyle(txt,"strikethrough")),showDockToast("Strikethrough / কাটা দাগ")});
v.getElementById("tb-bullets")?.addEventListener("click",()=>{applyTextTransform(txt=>applyBulletList(txt),"\n  • "),showDockToast("• Bullets")});
v.getElementById("tb-numbers")?.addEventListener("click",()=>{applyTextTransform(txt=>applyNumberedList(txt),"\n  1. "),showDockToast("1. Numbered List")});
v.getElementById("tb-quote")?.addEventListener("click",()=>{applyTextTransform(txt=>applyBlockquote(txt),"\n> "),showDockToast("❞ Quote")});
const stSel=v.getElementById("tb-select-style");
stSel?.addEventListener("change",()=>{if(stSel.value){applyTextTransform(txt=>applyTextStyle(txt,stSel.value)),showDockToast(`Applied ${stSel.value}!`),stSel.value=""}});
v.getElementById("tb-auto-design")?.addEventListener("click",()=>{
  if(!W.trim()){showDockToast("⚠️ আগে ক্যাপশন লিখুন (Type caption first)");return}
  W=autoBeautifyCaption(W),n&&(n.value=W),de(),showDockToast("✨ 1-Click Auto-Design Applied!");
  const cnt=v==null?void 0:v.querySelector(".char-count");
  cnt&&(cnt.textContent=`${W.length} chars`);
  const pb=v==null?void 0:v.getElementById("agp-preview-body");
  pb&&(pb.innerHTML=renderPreviewCaptionHtml(W));
});
const slSel=v.getElementById("tb-select-sales");
slSel?.addEventListener("change",()=>{
  if(slSel.value&&n){
    const snip=SALES_SNIPPETS.find(s=>s.id===slSel.value);
    if(snip){
      const ins=snip.content.replace("{price}","১,৫০০ ৳").replace("{location}","ঢাকা / সারা বাংলাদেশ").replace("{contact_info}","ইনবক্স করুন / 017xxxxxxxx");
      const start=n.selectionStart,end=n.selectionEnd,before=n.value.substring(0,start),after=n.value.substring(end);
      const sepBefore=before.length===0||before.endsWith("\n\n")?"":before.endsWith("\n")?"\n":"\n\n";
      W=before+sepBefore+ins+"\n"+after,n.value=W,de(),showDockToast(`Inserted ${snip.name}!`),n.focus(),n.setSelectionRange(start+sepBefore.length+ins.length+1,start+sepBefore.length+ins.length+1);
      const cnt=v==null?void 0:v.querySelector(".char-count");
      cnt&&(cnt.textContent=`${W.length} chars`);
      const pb=v==null?void 0:v.getElementById("agp-preview-body");
      pb&&(pb.innerHTML=renderPreviewCaptionHtml(W));
    }
    slSel.value="";
  }
});
const bdSel=v.getElementById("tb-select-borders");
bdSel?.addEventListener("change",()=>{
  if(bdSel.value&&n){
    const d=bdSel.value,start=n.selectionStart,end=n.selectionEnd,before=n.value.substring(0,start),after=n.value.substring(end);
    const sepBefore=before.length===0||before.endsWith("\n")?"":"\n",sepAfter=after.startsWith("\n")?"":"\n";
    W=before+sepBefore+d+sepAfter+after,n.value=W,de(),showDockToast("➖ Border inserted!"),n.focus(),n.setSelectionRange(start+sepBefore.length+d.length+sepAfter.length,start+sepBefore.length+d.length+sepAfter.length);
    const cnt=v==null?void 0:v.querySelector(".char-count");
    cnt&&(cnt.textContent=`${W.length} chars`);
    const pb=v==null?void 0:v.getElementById("agp-preview-body");
    pb&&(pb.innerHTML=renderPreviewCaptionHtml(W));
    bdSel.value="";
  }
});
v.getElementById("tb-btn-preview")?.addEventListener("click",()=>{showLivePreview=!showLivePreview,P(t,e)});
(u=v.getElementById("btn-clear-caption"))==null||u.addEventListener("click",()=>{W="",de(),P(t,e)});const o=v.getElementById("agp-file-input");(m=v.getElementById("btn-trigger-upload"))==null||m.addEventListener("click",()=>{o==null||o.click()}),o&&o.addEventListener("change",async()=>{if(o.files&&o.files.length>0){isUploadingMedia=!0,P(t,e);const S=[];for(let T=0;T<o.files.length;T++)try{const q=await no(o.files[T]);q&&S.push(q)}catch(q){console.warn("[AGP:SearchPoster] File convert error:",q)}V=[...V,...S],await de(),isUploadingMedia=!1,o.value="",P(t,e)}});const medDrop=v.getElementById("agp-media-container");medDrop&&(medDrop.addEventListener("dragover",S=>{S.preventDefault(),medDrop.classList.add("drag-over")}),medDrop.addEventListener("dragleave",S=>{S.preventDefault(),medDrop.classList.remove("drag-over")}),medDrop.addEventListener("drop",async S=>{var T;if(S.preventDefault(),medDrop.classList.remove("drag-over"),(T=S.dataTransfer)!=null&&T.files&&S.dataTransfer.files.length>0){isUploadingMedia=!0,P(t,e);const q=[];for(let R=0;R<S.dataTransfer.files.length;R++)try{const Y=await no(S.dataTransfer.files[R]);Y&&q.push(Y)}catch(Y){console.warn("[AGP:SearchPoster] Drop file convert error:",Y)}V=[...V,...q],await de(),isUploadingMedia=!1,P(t,e)}}));v.querySelectorAll(".photo-remove-btn").forEach(S=>{S.addEventListener("click",T=>{T.stopPropagation();const q=S.getAttribute("data-index");if(q!==null){const R=parseInt(q,10);!isNaN(R)&&R>=0&&R<V.length&&(V.splice(R,1),de(),P(t,e))}})}),(d=v.getElementById("btn-clear-photos"))==null||d.addEventListener("click",()=>{V=[],de(),P(t,e)});const r=v.getElementById("agp-select-target");r&&r.addEventListener("change",()=>{B=parseInt(r.value,10)||0,de(),P(t,e)});const i=v.getElementById("agp-select-delay");i&&i.addEventListener("change",()=>{te=parseInt(i.value,10)||0,de()}),(f=v.getElementById("btn-toggle-groups"))==null||f.addEventListener("click",()=>{Ge=!Ge,P(t,e)}),(g=v.getElementById("btn-start-campaign"))==null||g.addEventListener("click",()=>{lo(t,e)}),(b=v.getElementById("btn-pause-campaign"))==null||b.addEventListener("click",()=>{var S;try{typeof chrome<"u"&&((S=chrome.runtime)!=null&&S.sendMessage)&&(chrome.runtime.sendMessage({type:"PAUSE_QUEUE"}),y.isPaused=!0,y.status="PAUSED",y.message="Posting campaign paused.",P(t,e))}catch{}}),(x=v.getElementById("btn-resume-campaign"))==null||x.addEventListener("click",()=>{var S;try{typeof chrome<"u"&&((S=chrome.runtime)!=null&&S.sendMessage)&&(chrome.runtime.sendMessage({type:"RESUME_QUEUE"}),y.isPaused=!1,y.status="RUNNING",y.message="Resuming campaign...",P(t,e))}catch{}}),(h=v.getElementById("btn-stop-campaign"))==null||h.addEventListener("click",()=>{var S;try{typeof chrome<"u"&&((S=chrome.runtime)!=null&&S.sendMessage)&&(chrome.runtime.sendMessage({type:"STOP_QUEUE"}),y.isRunning=!1,y.isPaused=!1,y.status="IDLE",y.message="Campaign stopped.",K&&(clearInterval(K),K=null),P(t,e))}catch{}}),(A=v.getElementById("btn-start-join"))==null||A.addEventListener("click",()=>{U.getInstance().start(e||{searchUrl:window.location.href,delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0})}),(E=v.getElementById("btn-pause-join"))==null||E.addEventListener("click",()=>{U.getInstance().pause()}),(L=v.getElementById("btn-resume-join"))==null||L.addEventListener("click",()=>{U.getInstance().resume()}),(_=v.getElementById("btn-stop-join"))==null||_.addEventListener("click",()=>{U.getInstance().stop()})}async function lo(t,e){var f;if(!W.trim()&&V.length===0){y.message="⚠️ অনুগ্রহ করে পোস্টের ক্যাপশন অথবা অন্তত একটি ছবি/ভিডিও যুক্ত করুন (Please add caption, photos or video).",P(t,e);return}y.status="SCANNING",y.message="🔍 Scanning search results for Facebook groups...",P(t,e);const n=B>0?B:10;let o=me(),r=0;for(;o.length<n&&r<6;)r++,y.message=`🔍 Scanning search results... Found ${o.length}/${n} groups...`,P(t,e),window.scrollBy({top:1e3,behavior:"smooth"}),await new Promise(g=>setTimeout(g,800)),o=me();if(o.length===0){y.status="ERROR",y.message="⚠️ কোনো ফেসবুক গ্রুপ পাওয়া যায়নি। পেজটি স্ক্রোল করুন অথবা সার্চ লিঙ্ক চেক করুন।",P(t,e);return}const i=B>0?o.slice(0,B):o;y.message=`Saving ${i.length} groups to database...`,P(t,e);const c=await rt(),s=new Map(c.map(g=>[g.groupId?g.groupId.toLowerCase():g.id.toLowerCase(),g])),a=[],l=[];for(const g of i){const b=g.item.groupId||g.item.id,x=g.item.url||`https://www.facebook.com/groups/${encodeURIComponent(b)}/`;let h=s.get(b.toLowerCase());h||(h={id:Be("grp"),groupId:b,name:g.item.name||"Facebook Group",url:x,category:"Search Result",privacy:g.item.privacy,enabled:!0,selected:!0,status:"READY",postCount:0,verified:!0,source:"facebook-ui",createdAt:Date.now(),updatedAt:Date.now()},a.push(h),s.set(b.toLowerCase(),h)),l.push(h.id)}const p=[...c,...a];a.length>0&&await st(p);const u=`search_post_${Date.now()}`,m={id:u,title:W.slice(0,40)||"Product Post",productName:W.slice(0,30)||"Product",caption:W,description:W,images:V,createdAt:Date.now(),updatedAt:Date.now()},d=await Vt();await Yt([m,...d.filter(g=>g.id!==u)]),y.isRunning=!0,y.isPaused=!1,y.status="RUNNING",y.total=l.length,y.completed=0,y.failed=0,y.skipped=0,y.message=`🚀 Campaign started! Visiting & posting to ${l.length} groups...`,P(t,e);try{typeof chrome<"u"&&((f=chrome.runtime)!=null&&f.sendMessage)&&chrome.runtime.sendMessage({type:"CREATE_AND_START_QUEUE",payload:{groupIds:l,postId:u,delaySec:te,groups:p,post:m}},g=>{g!=null&&g.success?(console.log("[AGP:SearchPoster] Campaign successfully queued."),It()):(y.status="ERROR",y.isRunning=!1,y.message=`Failed to start campaign: ${(g==null?void 0:g.error)||"Unknown error"}`,P(t,e))})}catch(g){y.status="ERROR",y.isRunning=!1,y.message=`Error starting campaign: ${String(g)}`,P(t,e)}}console.log("[AGP:Content] Facebook Assistant Content Script initialized.");let se=null,k=null,w=null,ue=!1,Ve=!1,he=null,Ye=!1;function gt(){M&&(clearInterval(M),M=null),j=!1,oe=!0,Ye=!0;try{chrome.runtime.sendMessage({type:"STOP_QUEUE"})}catch{}se&&(se.remove(),se=null,k=null),C("🛑 Auto-Posting বন্ধ করা হয়েছে (Stopped & Closed)")}async function uo(t){try{return await navigator.clipboard.writeText(t),!0}catch{const n=document.createElement("textarea");n.value=t,document.body.appendChild(n),n.select();const o=document.execCommand("copy");return document.body.removeChild(n),o}}async function _t(t,e){try{if(navigator.clipboard&&window.ClipboardItem){const n=new Blob([t],{type:"text/plain"}),o=new Blob([e],{type:"text/html"});return await navigator.clipboard.write([new window.ClipboardItem({"text/plain":n,"text/html":o})]),!0}}catch{}try{const n=r=>{var i,c;r.preventDefault(),(i=r.clipboardData)==null||i.setData("text/plain",t),(c=r.clipboardData)==null||c.setData("text/html",e)};document.addEventListener("copy",n);const o=document.execCommand("copy");if(document.removeEventListener("copy",n),o)return!0}catch{}return uo(t)}function C(t,e=!1){if(k){const n=k.getElementById("agp-toast");n&&n.remove();const o=document.createElement("div");o.id="agp-toast",o.innerText=t,o.style.cssText=`
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: ${e?"#ef4444":"#10b981"};
      color: #ffffff;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 9999px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.4);
      z-index: 1000;
      pointer-events: none;
      animation: fadeInOut 2.2s ease forwards;
    `,k.appendChild(o),setTimeout(()=>o.remove(),2400);return}if(typeof document<"u"&&document.body){const n=document.getElementById("agp-global-toast");n&&n.remove();const o=document.createElement("div");o.id="agp-global-toast",o.innerText=t,o.style.cssText=`
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${e?"#ef4444":"#10b981"};
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
    `,document.body.appendChild(o),requestAnimationFrame(()=>{o.style.opacity="1",o.style.transform="translateY(0)"}),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateY(-10px)",setTimeout(()=>o.remove(),400)},3e3)}}let j=!1,$="Preparing auto-post...",M=null,oe=!1;const N=t=>new Promise(e=>setTimeout(e,t));async function po(t,e="media_1"){try{if(!t||typeof t!="string")return null;let n="image/jpeg",o=null;if(t.startsWith("data:")||t.startsWith("blob:")||t.startsWith("http://")||t.startsWith("https://"))try{const p=await fetch(t);(p.ok||t.startsWith("data:")||t.startsWith("blob:"))&&(o=await p.blob(),o&&o.size>0&&(n=(o.type||"").toLowerCase()||"image/jpeg"))}catch(p){console.warn("[AGP:AutoPost] fetch blob parsing failed, falling back to manual decode:",p)}if(!o||o.size===0){let p=t;if(t.startsWith("data:")){const u=t.indexOf(",");if(u!==-1){const m=t.slice(0,u);p=t.slice(u+1);const d=m.match(/:(.*?);/);n=d?d[1].toLowerCase():"image/jpeg"}}try{const u=atob(p.trim().replace(/\s/g,"")),m=new Uint8Array(u.length);for(let d=0;d<u.length;d++)m[d]=u.charCodeAt(d);if(m.length===0)return null;m.length>8&&m[4]===102&&m[5]===116&&m[6]===121&&m[7]===112&&(n="video/mp4"),o=new Blob([m.buffer],{type:n})}catch(u){return console.warn("[AGP:AutoPost] base64 decode failed:",u),null}}if(!o||o.size===0)return null;const r=n.startsWith("video/");let i="jpg";n.includes("video/mp4")||n.includes("mp4")?i="mp4":n.includes("video/webm")||n.includes("webm")?i="webm":n.includes("video/quicktime")||n.includes("mov")?i="mov":n.includes("video/x-m4v")||n.includes("m4v")?i="m4v":n.includes("video/mkv")||n.includes("matroska")?i="mkv":r?i="mp4":n.includes("png")?i="png":n.includes("webp")?i="webp":n.includes("gif")&&(i="gif");const c=Date.now(),s=e.replace(/\D/g,"")||"1",l=`${r?"VID":"IMG"}_${c}_${s}.${i}`;return new File([o],l,{type:n,lastModified:c})}catch(n){return console.warn("[AGP:AutoPost] mediaToFile error:",n),null}}function F(t){if(!t)return!1;if(t.offsetParent!==null)return!0;try{const e=window.getComputedStyle(t);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0")return!1;const n=t.getBoundingClientRect();return n.width>0&&n.height>0}catch{return!1}}function ye(){const t=Array.from(document.querySelectorAll('[data-pagelet="GroupInlineComposer"], [data-pagelet="FeedInlineComposer"], [data-pagelet="GroupComposer"], [data-pagelet*="Composer" i]'));for(const n of t){if(n.closest('[role="article"], [data-pagelet*="FeedUnit"], [data-pagelet*="Comment"], form'))continue;const o=n.querySelector('[role="button"]');if(o&&F(o))return o}const e=Array.from(document.querySelectorAll('[role="main"] [role="button"], [role="button"]'));for(const n of e){if(n.closest('[role="article"], [data-pagelet*="FeedUnit"], [data-pagelet*="Comment"], form'))continue;const o=(n.getAttribute("aria-label")||"").toLowerCase(),r=(n.textContent||"").trim().toLowerCase();if((o.includes("create a public post")||o.includes("write something")||o.includes("create a post")||o.includes("কিছু লিখুন")||o.includes("পোস্ট তৈরি করুন")||o.includes("একটি পাবলিক পোস্ট")||o.includes("আপনার মনে কী আছে")||o.includes("কী ভাবছেন")||o.includes("write discussion")||o.includes("start discussion")||r==="create a public post..."||r==="write something..."||r==="create a post..."||r==="create post"||r==="write discussion"||r==="discussion"||r.includes("কিছু লিখুন")||r.includes("পোস্ট তৈরি করুন")||r.includes("পাবলিক পোস্ট")||r.includes("আপনার মনে কী আছে")||r.includes("কী ভাবছেন")||r.includes("আলোচনা"))&&F(n))return n}return null}function we(){const t=Array.from(document.querySelectorAll('[role="dialog"]'));for(const e of t)if(F(e)){if(e.closest('[role="article"]')||e.querySelector('[data-pagelet*="ChatTab"], [aria-label*="Messenger" i]'))continue;const n=(e.textContent||"").toLowerCase(),o=(e.getAttribute("aria-label")||"").toLowerCase();if(o.includes("create post")||o.includes("create a public post")||o.includes("পোস্ট তৈরি করুন")||n.includes("create post")||n.includes("create a public post")||n.includes("add to your post")||n.includes("পোস্ট তৈরি করুন")||n.includes("আপনার পোস্টে যোগ করুন")||!!e.querySelector('[aria-label*="Add to your post" i], [aria-label*="আপনার পোস্টে যোগ করুন" i], [aria-label*="Photo/video" i]'))return e}return null}function Le(){const t=(document.body?document.body.innerText:"").toLowerCase(),e=(document.title||"").toLowerCase();return window.location.href.toLowerCase().includes("/groups/grp_")||t.includes("this content isn't available right now")||t.includes("this content isn't available")||t.includes("content isn't available right now")||t.includes("the link you followed may be broken")||t.includes("page may have been removed")||t.includes("এই কন্টেন্টটি এখন উপলব্ধ নয়")||t.includes("এই লিঙ্কটি হয়তো ত্রুটিপূর্ণ")||e.includes("page not found")||e.includes("content not found")||!!document.querySelector('[role="main"] [aria-label*="Go to Feed" i], [role="main"] a[href="/"][role="button"]')}async function go(){if(Le())return null;let t=we();if(t)return t;let e=ye();if(!e){const o=Date.now();for(;Date.now()-o<3500;){if(t=we(),t)return t;if(e=ye(),e)break;await N(10)}}if(!e)return console.log("[AGP:AutoPost] Composer trigger not found on page."),null;if(e.scrollIntoView({behavior:"instant",block:"center"}),e.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0,cancelable:!0})),e.click(),t=we(),t)return t;const n=Date.now();for(;Date.now()-n<3500;){if(t=we(),t)return t;await N(10)}return null}async function Tt(t,e){if(!e||!e.trim())return!0;const n=eo(nt(e)).replace(/\r\n/g,`
`).replace(/\r/g,`
`),o=n.split(`
`);_t(n.trim(),at(n)).catch(()=>{});let r=null;const i=Date.now(),c=['div[role="textbox"][contenteditable="true"]','div[data-lexical-editor="true"][contenteditable="true"]','div[contenteditable="true"]:not([aria-label*="comment" i]):not([aria-label*="মন্তব্য" i])','div[data-editor="true"]','div[aria-label*="Create a public post" i][contenteditable="true"]','div[aria-label*="Write something" i][contenteditable="true"]','div[aria-label*="কিছু লিখুন" i][contenteditable="true"]','div[aria-label*="পাবলিক পোস্ট" i][contenteditable="true"]','div[aria-placeholder*="Create a public post" i]','div[aria-placeholder*="Write something" i]'];for(;Date.now()-i<4e3;){for(const b of c){const x=t.querySelector(b)||document.querySelector(`[role="dialog"] ${b}`);if(x&&F(x)){r=x;break}}if(r)break;await N(10)}if(!r)return console.warn("[AGP:AutoPost] Create post editor not found inside modal."),!1;const s=(r.textContent||"").trim(),a=n.trim().slice(0,30);if(s.length>=n.trim().length*.7&&(!a||s.includes(a)))return console.log("[AGP:AutoPost] Editor already contains caption. Skipping duplicate injection."),!0;r.scrollIntoView({behavior:"instant",block:"center"}),window.focus(),r.focus();const l={bubbles:!0,cancelable:!0,view:window};r.dispatchEvent(new PointerEvent("pointerdown",l)),r.dispatchEvent(new MouseEvent("mousedown",l)),r.dispatchEvent(new PointerEvent("pointerup",l)),r.dispatchEvent(new MouseEvent("mouseup",l)),r.dispatchEvent(new MouseEvent("click",l)),r.dispatchEvent(new FocusEvent("focus",{bubbles:!1})),r.dispatchEvent(new FocusEvent("focusin",{bubbles:!0}));try{const b="agp_inj_"+Date.now()+"_"+Math.random().toString(36).slice(2,7),x=new Promise(A=>{const E=L=>{L.data&&L.data.type==="AGP_MAIN_INJECT_CAPTION_RESPONSE"&&L.data.messageId===b&&(window.removeEventListener("message",E),A(!!L.data.success))};window.addEventListener("message",E),setTimeout(()=>{window.removeEventListener("message",E),A(!1)},250)});if(window.postMessage({type:"AGP_MAIN_INJECT_CAPTION",messageId:b,caption:n},"*"),await x&&(console.log("[AGP:AutoPost] MAIN world injection succeeded with exact layout!"),(r.textContent||"").trim().length>0))return!0}catch(b){console.warn("[AGP:AutoPost] MAIN world bridge error, using direct content injection:",b)}const p=(r.textContent||"").trim();if(p.length>=n.trim().length*.7&&(!a||p.includes(a)))return console.log("[AGP:AutoPost] Editor already populated by bridge. Skipping fallback Strategy 2."),!0;const u=window.getSelection();if(u){const b=document.createRange();b.selectNodeContents(r),u.removeAllRanges(),u.addRange(b),r.dispatchEvent(new InputEvent("beforeinput",{bubbles:!0,cancelable:!0,inputType:"deleteContentBackward"}))}document.execCommand("selectAll",!1),document.execCommand("delete",!1),await N(10);const m=r.querySelector("p")||r;if(m.dispatchEvent(new MouseEvent("mousedown",l)),m.dispatchEvent(new MouseEvent("mouseup",l)),m.click(),u){const b=document.createRange();m.childNodes.length>0?(b.setStart(m,0),b.setEnd(m,m.childNodes.length)):b.selectNodeContents(m),b.collapse(!0),u.removeAllRanges(),u.addRange(b)}document.dispatchEvent(new Event("selectionchange"));let d=!1;const f=at(n);try{const b=new DataTransfer;b.setData("text/plain",n),b.setData("text/html",f);const x=new ClipboardEvent("paste",{bubbles:!0,cancelable:!0,clipboardData:b});r.dispatchEvent(x),await N(20);let h=(r.textContent||"").trim();if((!h||h.length<5)&&(r.dispatchEvent(new InputEvent("beforeinput",{bubbles:!0,cancelable:!0,inputType:"insertFromPaste",dataTransfer:b})),await N(15),h=(r.textContent||"").trim()),!h||h.length<5)try{document.execCommand("insertHTML",!1,f),await N(15),h=(r.textContent||"").trim()}catch{}const A=r.querySelectorAll("p, h1, h2, h3, ul, ol, li, blockquote"),E=r.querySelectorAll("h1, h2, ul, ol, blockquote").length>0;h.length>0&&(!n.includes(`
`)||A.length>1||E||h.length>=n.trim().length*.4)&&(console.log("[AGP:AutoPost] Direct Native Paste event succeeded. Block count:",A.length),d=!0)}catch(b){console.warn("[AGP:AutoPost] Native paste event error:",b)}if(!d)try{console.log("[AGP:AutoPost] Trying Strategy 3: Line-by-line Enter keystrokes with non-collapsing spacing..."),document.execCommand("selectAll",!1),document.execCommand("delete",!1),await N(10);for(let x=0;x<o.length;x++){const h=o[x],A=x===o.length-1;h.length>0?document.execCommand("insertText",!1,h):document.execCommand("insertText",!1," "),A||(r.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0,cancelable:!0})),r.dispatchEvent(new InputEvent("beforeinput",{inputType:"insertParagraph",bubbles:!0,cancelable:!0})),document.execCommand("insertParagraph",!1),r.dispatchEvent(new InputEvent("input",{inputType:"insertParagraph",bubbles:!0})),r.dispatchEvent(new KeyboardEvent("keyup",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0})))}await N(15),(r.textContent||"").trim().length>0&&(console.log("[AGP:AutoPost] Strategy 3 succeeded."),d=!0)}catch(b){console.warn("[AGP:AutoPost] Strategy 3 error:",b)}return r.dispatchEvent(new Event("input",{bubbles:!0})),r.dispatchEvent(new Event("change",{bubbles:!0})),document.dispatchEvent(new Event("selectionchange")),await N(15),(r.textContent||"").trim().length>0}function fo(t){const e=t.querySelector('[aria-label*="Photo/video" i], [aria-label*="Photo / video" i], [aria-label*="Add photo" i], [aria-label*="Add Photos" i], [aria-label*="Add photos or videos" i], [aria-label*="Add video" i], [aria-label*="Add Photos/videos" i], [aria-label*="ফটো/ভিডিও" i], [aria-label*="Photo" i], [aria-label*="Video" i], [aria-label*="ছবি/ভিডিও" i], [aria-label*="ছবি" i], [aria-label*="ভিডিও" i], div[aria-label*="Photo" i], div[aria-label*="Video" i], div[aria-label*="ফটো" i], div[aria-label*="ভিডিও" i]');if(e&&F(e))return e;const n=Array.from(t.querySelectorAll('[role="button"], button, div[tabindex="0"]'));for(const r of n){const i=(r.getAttribute("aria-label")||"").toLowerCase();if((i.includes("photo")||i.includes("video")||i.includes("image")||i.includes("ফটো")||i.includes("ছবি")||i.includes("ভিডিও"))&&F(r))return r}const o=Array.from(t.querySelectorAll("span, div, p"));for(const r of o){const i=(r.textContent||"").trim().toLowerCase();if(i==="add to your post"||i==="আপনার পোস্টে যোগ করুন"||i.includes("add to your post")){const c=r.closest("div"),s=(c==null?void 0:c.parentElement)||c,a=s==null?void 0:s.querySelector('[role="button"], img, svg');if(a&&F(a))return a.closest('[role="button"]')||a}}return null}function Gt(t){return t.querySelector('input[type="file"][accept*="video"]')||t.querySelector('input[type="file"][accept*="image"]')||t.querySelector('input[type="file"]')||document.querySelector('[role="dialog"] input[type="file"]')||document.querySelector('input[type="file"]')}function xe(t){var n;const e=(t.textContent||"").toLowerCase();if(e.includes("your file can't be uploaded")||e.includes("file can't be uploaded")||e.includes("আপলোড করা যাবে না")||e.includes("আপলোড করা যায়নি")||e.includes("couldn't be uploaded")||e.includes("error uploading")){const o=Array.from(t.querySelectorAll("span, div, p")).find(r=>{const i=(r.textContent||"").toLowerCase();return i.includes("your file can't be uploaded")||i.includes("file can't be uploaded")||i.includes("আপলোড করা যাবে না")||i.includes("আপলোড করা যায়নি")||i.includes("couldn't be uploaded")});return((n=o==null?void 0:o.textContent)==null?void 0:n.trim())||"Your file can't be uploaded"}return null}async function bo(t,e){if(!e||e.length===0)return!0;e.some(a=>a.includes("video")||a.includes(".mp4")||a.includes(".mov")||a.includes(".webm"));let n=Gt(t);if(!n){const a=fo(t);if(a){a.scrollIntoView({behavior:"instant",block:"center"}),a.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0})),a.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0,cancelable:!0})),a.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,cancelable:!0})),a.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0,cancelable:!0})),a.click();const l=Date.now();for(;Date.now()-l<2500&&(n=Gt(t),!n);)await N(20)}}if(!n)return console.warn("[AGP:AutoPost] File input not found inside create post modal."),!1;const o=new DataTransfer,r=await Promise.all(e.map((a,l)=>po(a,`media_${l+1}`)));for(const a of r)a&&a.size>0&&(o.items.add(a),console.log(`[AGP:AutoPost] Prepared media file: ${a.name} (${a.type}, ${a.size} bytes)`));if(o.files.length===0)return console.warn("[AGP:AutoPost] No valid non-empty files prepared from mediaList."),!1;n.files=o.files;const i=n._valueTracker;i&&i.setValue(""),n.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0})),n.dispatchEvent(new Event("input",{bubbles:!0,cancelable:!0}));const hasVid=e.some(a=>a.includes("video")||a.includes(".mp4")||a.includes(".mov")||a.includes(".webm")||a.includes("data:video")),c=hasVid?12e3:4e3,s=Date.now();for(;Date.now()-s<c;){const a=xe(t);if(a)return console.warn("[AGP:AutoPost] Facebook upload error detected:",a),!1;if(!!t.querySelector('video, img[src*="blob:"], img[src*="data:"], img[src*="fbcdn.net"], div[aria-label*="Video" i], div[aria-label*="Photo" i], div[data-pagelet*="MediaViewer"], div[aria-label*="Edit" i], button[aria-label*="Edit" i], div[aria-label*="Remove" i], div[role="button"][aria-label*="Edit" i]')){console.log("[AGP:AutoPost] Media preview mounted immediately in composer.");break}await N(10)}return!xe(t)}function Lt(t,e){return t.includes("joined")||t.includes("যোগ দিয়েছেন")||t.includes("মেম্বার")||t.includes("member")||t.includes("leave group")||t.includes("গ্রুপ ত্যাগ")||e.includes("joined")||e.includes("যোগ দিয়েছেন")||e.includes("member")}function ve(){const t=['[aria-label*="Join group" i]','[aria-label*="Join Group" i]','[aria-label*="গ্রুপে যোগ দিন" i]','[aria-label*="যোগ দিন" i]','[aria-label*="গ্রুপে যুক্ত হন" i]','[aria-label*="Request to join" i]','[aria-label*="Request to Join" i]','[aria-label*="গ্রুপে যোগ দেওয়ার অনুরোধ" i]','[aria-label*="যোগ দেওয়ার অনুরোধ" i]','[aria-label*="গ্রুপে যোগদানের অনুরোধ" i]','div[role="button"][aria-label*="Join" i]','div[role="button"][aria-label*="যোগ" i]','button[aria-label*="Join" i]','button[aria-label*="যোগ" i]'];for(const n of t){const o=document.querySelector(n);if(o&&F(o)){const r=(o.innerText||o.textContent||"").trim().toLowerCase(),i=(o.getAttribute("aria-label")||"").toLowerCase();if(!Lt(r,i))return o}}const e=Array.from(document.querySelectorAll('div[role="main"] [role="button"], div[role="main"] button, div[role="region"] [role="button"], [role="banner"] [role="button"], div[role="button"], button'));for(const n of e){if(!F(n))continue;const o=(n.innerText||n.textContent||"").trim().toLowerCase(),r=(n.getAttribute("aria-label")||"").toLowerCase();if(!Lt(o,r)&&(o==="join group"||o==="join"||o==="গ্রুপে যোগ দিন"||o==="যোগ দিন"||o==="গ্রুপে যুক্ত হন"||o==="request to join"||o==="request to join group"||o==="যোগ দেওয়ার অনুরোধ"||o==="যোগ দেওয়ার অনুরোধ জানান"||o.includes("join group")||o.includes("গ্রুপে যোগ দিন")))return n}return null}function ft(){const t=!!ve(),e=!!ye();return t&&!e}async function $t(){const t=ve();if(!t)return{success:!1,isInstantMember:!1,reason:"Join button not found"};console.log("[AGP:AutoJoin] Found Join button. Executing automatic join click..."),$="⚡ Auto-joining group (গ্রুপে যোগ দেওয়া হচ্ছে)...",I(),C("⚡ Auto-joining group...",!0),t.scrollIntoView({behavior:"instant",block:"center"}),await N(10);const e={bubbles:!0,cancelable:!0,view:window};t.dispatchEvent(new PointerEvent("pointerdown",e)),t.dispatchEvent(new MouseEvent("mousedown",e)),t.dispatchEvent(new PointerEvent("pointerup",e)),t.dispatchEvent(new MouseEvent("mouseup",e)),t.click();const n=Date.now();let o=null;for(;Date.now()-n<350&&(o=document.querySelector('div[role="dialog"]'),!(o&&F(o)));){const a=ye();if(a&&F(a))break;await N(15)}if(o&&F(o)){console.log("[AGP:AutoJoin] Rules agreement or membership question dialog detected. Handling...");const a=Array.from(o.querySelectorAll('input[type="checkbox"], div[role="checkbox"]'));for(const u of a)u.getAttribute("aria-checked")==="true"||u.checked||u.click();const l=Array.from(o.querySelectorAll('textarea, input[type="text"]'));for(const u of l)(!u.value||!u.value.trim())&&(u.value="Agree",u.dispatchEvent(new Event("input",{bubbles:!0})),u.dispatchEvent(new Event("change",{bubbles:!0})));const p=Array.from(o.querySelectorAll('button, [role="button"], input[type="submit"]')).find(u=>{const m=(u.innerText||u.textContent||u.getAttribute("aria-label")||"").trim().toLowerCase();return m==="submit"||m==="send"||m==="agree"||m==="confirm"||m==="সাবমিট"||m==="জমা দিন"||m==="সম্মতি দিচ্ছি"||m.includes("submit")||m.includes("সাবমিট")});if(p&&F(p)){console.log("[AGP:AutoJoin] Clicking modal submit button..."),p.click();const u=Date.now();for(;Date.now()-u<600&&document.querySelector('div[role="dialog"]');)await N(20)}}const r=Date.now();for(;Date.now()-r<3500;){let a=ye();if(a&&F(a))return console.log("[AGP:AutoJoin] Instant membership granted! Composer available."),C("✅ Joined group! Post box ready.",!0),{success:!0,isInstantMember:!0,reason:"Instant member"};Date.now()-r>1e3&&window.scrollY<200&&window.scrollBy({top:300,behavior:"instant"}),await N(25)}const i=(document.body?document.body.innerText:"").toLowerCase();return i.includes("requested")||i.includes("pending")||i.includes("অনুরোধ করা হয়েছে")||i.includes("cancel request")||i.includes("অনুরোধ বাতিল")?(console.log("[AGP:AutoJoin] Join request sent (Pending admin approval)."),{success:!0,isInstantMember:!1,reason:"Join request pending admin approval"}):ye()?{success:!0,isInstantMember:!0,reason:"Instant member"}:ve()?{success:!0,isInstantMember:!1,reason:"Join submitted"}:(console.log("[AGP:AutoJoin] Join button disappeared. Group is joined, proceeding to post..."),{success:!0,isInstantMember:!0,reason:"Instant member"})}function Mt(){if(Le())return{forbidden:!0,reason:"Group unavailable or broken link"};const t=(document.body?document.body.innerText:"").toLowerCase();return t.includes("only admins can post")||t.includes("শুধুমাত্র অ্যাডমিনরা এই গ্রুপে পোস্ট করতে পারবেন")||t.includes("শুধুমাত্র অ্যাডমিনরা পোস্ট করতে পারবেন")||t.includes("posting is paused for this group")||t.includes("posting is turned off")||t.includes("এই গ্রুপের জন্য পোস্ট করা সাময়িকভাবে বন্ধ আছে")||t.includes("posting in this group has been paused")?{forbidden:!0,reason:"Posting is paused or admin-only in this group"}:t.includes("you can't post to this group")||t.includes("you've been temporarily blocked")||t.includes("you have been muted")||t.includes("আপনার অ্যাকাউন্ট সাময়িকভাবে ব্লক করা হয়েছে")||t.includes("আপনাকে এই গ্রুপে পোস্ট করা থেকে সাময়িকভাবে নিষিদ্ধ করা হয়েছে")?{forbidden:!0,reason:"Account restricted or muted in this group"}:{forbidden:!1,reason:""}}let Rt=!1;async function D(t){if(!(Rt||!(w!=null&&w.queueItem))){Rt=!0,j=!1,M&&(clearInterval(M),M=null);try{window.onbeforeunload=null}catch{}console.warn(`[AGP:AutoPost] Auto-skipping group: ${t}`),$=`⚡ Auto-skipping: ${t}...`,I(),C(`⚡ Auto-skipping: ${t}...`,!0),await N(200),chrome.runtime.sendMessage({type:"SKIP_CURRENT_ITEM",payload:{itemId:w.queueItem.id,reason:t}})}}async function mo(t,e=15e3){const n=Date.now();let lastUp=0;for(;Date.now()-n<e;){const o=[t,...Array.from(document.querySelectorAll('[role="dialog"]'))];for(const r of o){const i=Array.from(r.querySelectorAll('[role="button"], button'));for(const c of i){const s=(c.getAttribute("aria-label")||"").toLowerCase().trim(),a=(c.textContent||"").toLowerCase().trim(),l=c.getAttribute("aria-disabled")==="true"||c.disabled||c.classList.contains("aria-disabled")||c.classList.contains("disabled");if((s==="post"||s==="publish"||s==="submit"||s==="submit for review"||s==="পোস্ট"||s==="সাবমিট"||s==="পোস্ট করুন"||s==="সাবমিট করুন"||s.includes("post to group")||s.includes("গ্রুপে পোস্ট")||s.includes("submit for review")||s.includes("রিভিউ")||a==="post"||a==="পোস্ট"||a==="publish"||a==="submit"||a==="submit for review"||a==="পোস্ট করুন"||a==="সাবমিট"||a==="সাবমিট করুন"||a==="post to group"||a==="পাবলিশ"||a.includes("submit for review")||a.includes("রিভিউয়ের জন্য সাবমিট"))&&!l)return c.scrollIntoView({behavior:"instant",block:"center"}),c.style.outline="3px solid #10b981",c.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0})),c.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0,cancelable:!0})),c.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,cancelable:!0})),c.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0,cancelable:!0})),c.click(),!0}}Date.now()-lastUp>2500&&(lastUp=Date.now(),Math.round((Date.now()-n)/1e3)>=4&&($=`⚡ Step 4/4: Media processing & uploading (${Math.round((Date.now()-n)/1e3)}s)...`,I())),await N(20)}return!1}async function He(){if(j||!w||!w.queueItem)return;if(Le()){await D("Group unavailable on Facebook");return}if(!w.isGroupMatch){await D("Wrong group URL detected");return}if(ft()||ve()){j=!0,$="⚡ Step 0/4: Auto-joining group (গ্রুপে যোগ দেওয়া হচ্ছে)...",I(),C("⚡ Auto-joining group...",!0);const e=await $t();if(e.isInstantMember)console.log("[AGP:AutoPost] Successfully auto-joined group! Proceeding with post immediately..."),$="⚡ Joined! Step 1/4: Opening Post Box...",I(),C("✅ Joined! Now opening post box...",!0);else{$=`⚡ ${e.reason}. Advancing to next group...`,I(),C(`⚡ ${e.reason}`,!0),await N(100),await D(e.reason);return}}const t=Mt();if(t.forbidden){await D(t.reason);return}j=!0,$="⚡ Step 1/4: Opening Post Box...",I();try{const e=await go();if(!e){if(Le()){await D("Group unavailable on Facebook");return}await D("Could not open Facebook post box");return}$="⚡ Step 2/4: Typing caption...",I();const n=w.caption||w.formattedPost||"";n&&n.trim()&&(await Tt(e,n)||(console.warn("[AGP:AutoPost] Caption injection check returned false, but clipboard has caption. Proceeding to photos..."),C("⚠️ Caption in clipboard (Ctrl+V ready)")));const o=w.media||[],r=o.some(d=>d.includes("video")||d.includes(".mp4")||d.includes(".mov")||d.includes(".webm")||d.includes("data:video")),photoCnt=o.filter(d=>!d.includes("video")&&!d.includes(".mp4")&&!d.includes(".mov")&&!d.includes(".webm")&&!d.includes("data:video")).length,vidCnt=o.length-photoCnt;let medLbl=`${o.length} files`;photoCnt>0&&vidCnt>0?medLbl=`${photoCnt} photos + ${vidCnt} video`:vidCnt>0?medLbl=`${vidCnt} video`:medLbl=`${photoCnt} photos`;if(o.length>0&&($=`⚡ Step 3/4: Attaching ${medLbl}...`,I(),!await bo(e,o))){const f=xe(e);if(f){console.warn("[AGP:AutoPost] Upload rejected by Facebook:",f),$=`❌ Upload failed: ${f}`,I(),await D(`Media rejected by Facebook: ${f}`);return}console.warn("[AGP:AutoPost] Media attachment warning - continuing post workflow")}if($=r?"⚡ Step 4/4: Video uploading & submitting post... (ভিডিও আপলোড হচ্ছে)":"⚡ Step 4/4: Submitting post...",I(),!await mo(e,r?9e4:2e4)){const d=xe(e);d?await D(`Facebook upload error: ${d}`):await D("Post button disabled or timed out");return}$="⚡ Post submitted! Shifting to next group...",I();const s=Date.now();let a=!1;const l=r?25e3:3500;for(;Date.now()-s<l;){const d=we();if(!d){console.log("[AGP:AutoPost] Composer dialog closed cleanly. Post submitted successfully!"),a=!0;break}const f=xe(d);if(f){console.warn("[AGP:AutoPost] Post aborted due to Facebook file error:",f),$=`❌ Upload error: ${f}`,I(),await D(`Facebook upload error: ${f}`);return}const g=Array.from(document.querySelectorAll('[role="dialog"]'));for(const b of g){const x=(b.textContent||"").toLowerCase();if(x.includes("pending")||x.includes("approval")||x.includes("admin")||x.includes("অনুমোদনের অপেক্ষায়")||x.includes("অনুমোদন")||x.includes("সাবমিট করা হয়েছে")||x.includes("আপনার পোস্টটি জমা দেওয়া হয়েছে")){const h=Array.from(b.querySelectorAll('[role="button"], button')).find(A=>{const E=(A.textContent||"").toLowerCase().trim();return E==="done"||E==="ok"||E==="ঠিক আছে"||E==="close"||E==="বন্ধ করুন"||E==="got it"});if(h){h.click(),a=!0;break}}}if(a)break;await N(10)}if(!a){const d=we();if(d){const f=xe(d);if(f){console.warn("[AGP:AutoPost] Facebook upload error remained:",f),$=`❌ Upload failed: ${f}`,I(),await D(`Facebook upload error: ${f}`);return}if(!!d.querySelector('[aria-disabled="true"], button[disabled]')){console.warn("[AGP:AutoPost] Post button remained disabled after wait"),$="❌ Post button stayed disabled",I(),await D("Post button disabled or upload blocked by Facebook");return}}}try{window.onbeforeunload=null}catch{}$="⚡ Post submitted! Moving to next group...",I();const p=w.queueIndex,u=w.totalQueueItems,m=(w.postedCount||p-1)+1;C(`⚡ Auto-Posted to Group #${p}! (${m}/${u} done)`),chrome.runtime.sendMessage({type:"MARK_AS_POSTED",payload:{itemId:w.queueItem.id}})}catch(e){const n=e instanceof Error?e.message:String(e);console.log("[AGP:AutoPost] Routine caught error, auto-skipping:",n),await D(n||"Posting failed")}}function ho(){if(oe||j||!(w!=null&&w.queueItem))return;if(Le()){$="⚡ Group unavailable on Facebook. Auto-skipping...",I(),setTimeout(()=>{D("Group unavailable on Facebook")},10);return}if(!w.isGroupMatch){$="⚡ Wrong group detected. Auto-skipping to next group...",I(),C("⚠️ Wrong group detected. Auto-skipping...",!0),setTimeout(()=>{oe||D("Wrong group URL detected")},20);return}if(ft()||ve()){$="⚡ Not joined: Auto-joining group...",I(),C("⚡ Auto-joining group...",!0),M&&clearInterval(M),M=null,setTimeout(()=>{!oe&&!j&&He()},0);return}const t=Mt();if(t.forbidden){$=`⚡ Cannot post: ${t.reason}. Auto-skipping...`,I(),setTimeout(()=>{D(t.reason)},20);return}$="⚡ Instant Auto-Posting in progress...",I(),M&&clearInterval(M),M=null,setTimeout(()=>{!oe&&!j&&He()},0)}function I(){var f,g,b,x,h,A,E,L,_,S,T,q,R,Y,ne,Ze,et,Z,H,Ae,Ee;if(Ye||!k)return;const t=ce(),e=Pe();if(!t.isGroupPage){const G=!!(he!=null&&he.isRunning),z=!!(he!=null&&he.isPaused),ge=0,O=0,Oe=0;k.innerHTML=`
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

      ${ue?`
        <div class="launcher-pill" id="agp-launcher-btn" title="Click to open AI Group Poster Assistant">
          <div class="badge-logo">AI</div>
          <span class="launcher-title">AI Group Poster</span>
          ${G?`
            <span class="status-pill running">
              <span class="pulse-dot"></span>
              Auto-Posting (${ge}/${O})
            </span>
          `:z?`
            <span class="status-pill paused">⏸️ Paused</span>
          `:`
            <span class="status-pill ready">⚡ Turbo Ready</span>
          `}
          <span style="font-size: 12px; color: #94a3b8;">▲</span>
          <button class="launcher-close-btn" id="agp-launcher-close" title="Stop & Close (ডাইরেক্ট অফ)">✕</button>
        </div>
      `:`
        <div class="panel-root">
          <div class="panel-header">
            <div class="header-title">
              <div class="badge-logo">AI</div>
              <span>AI GROUP POSTER</span>
              ${G?'<span class="status-pill running"><span class="pulse-dot"></span> Auto-Posting</span>':z?'<span class="status-pill paused">⏸️ Paused</span>':'<span class="status-pill ready">⚡ Ready</span>'}
            </div>
            <div class="header-actions">
              <button class="icon-btn" id="agp-toggle-btn" title="Minimize">▼ Minimize</button>
              <button class="close-btn" id="agp-close-btn" title="Stop & Close (ডাইরেক্ট অফ)">✕</button>
            </div>
          </div>

          <div class="panel-body">
            ${G?`
              <div class="progress-container">
                <div class="progress-label">
                  <span>Posting: <strong>${ge} of ${O}</strong> Groups</span>
                  <span>${Oe}%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: ${Oe}%"></div>
                </div>
              </div>

              <div class="info-card">
                <div class="info-card-row">
                  <span>Current Group:</span>
                  <strong>Active Group</strong>
                </div>
                <div class="info-card-row">
                  <span>Speed:</span>
                  <span style="color: #34d399; font-weight: 700;">⚡ Instant (Turbo)</span>
                </div>
              </div>

              

              <button class="action-btn" id="btn-pause-queue" style="width: 100%; margin-bottom: 8px;">
                ⏸️ Pause Auto-Posting
              </button>
            `:`
              <div class="info-card">
                <div class="info-card-row">
                  <span>Logged in as:</span>
                  <strong>${e.name||"Facebook User"}</strong>
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

              ${z?`
                <button class="primary-btn" id="btn-resume-queue">
                  ▶️ Resume Auto-Posting Queue
                </button>
              `:`
                <button class="primary-btn" id="btn-open-dashboard">
                  📊 Open Full Dashboard
                </button>
              `}

              <div class="button-grid">
                <button class="action-btn" id="btn-sync-groups">🔄 Sync Groups</button>
                <button class="action-btn" id="btn-start-queue">🤖 Start Queue</button>
              </div>
            `}

            ${G?`
              <button class="action-btn" id="btn-open-dashboard" style="width: 100%;">
                Open Full Dashboard ↗
              </button>
            `:""}
          </div>
        </div>
      `}
    `,(f=k.getElementById("agp-launcher-btn"))==null||f.addEventListener("click",Ue=>{var Bt;(Bt=Ue.target)!=null&&Bt.closest("#agp-launcher-close")||(ue=!1,I())}),(g=k.getElementById("agp-toggle-btn"))==null||g.addEventListener("click",()=>{ue=!0,I()}),(b=k.getElementById("agp-close-btn"))==null||b.addEventListener("click",Ue=>{Ue.stopPropagation(),gt()}),(x=k.getElementById("agp-launcher-close"))==null||x.addEventListener("click",Ue=>{Ue.stopPropagation(),gt()}),(h=k.getElementById("btn-focus-tab"))==null||h.addEventListener("click",()=>{}),(A=k.getElementById("btn-pause-queue"))==null||A.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"PAUSE_QUEUE"},()=>{C("Auto-posting paused"),$e()})}),(E=k.getElementById("btn-resume-queue"))==null||E.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"RESUME_QUEUE"},()=>{C("Resuming auto-posting..."),$e()})}),(L=k.getElementById("btn-start-queue"))==null||L.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"START_QUEUE"},()=>{C("Starting auto-posting queue..."),$e()})}),(_=k.getElementById("btn-sync-groups"))==null||_.addEventListener("click",()=>{window.location.href="https://www.facebook.com/groups/joins/?nav_source=tab"}),(S=k.getElementById("btn-open-dashboard"))==null||S.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})});return}const n=w==null?void 0:w.group,o=w==null?void 0:w.post,r=(w==null?void 0:w.queueIndex)||1,i=(w==null?void 0:w.totalQueueItems)||1,c=(w==null?void 0:w.postedCount)??Math.max(0,r-1),s=i>0?Math.round(c/i*100):0,a=(w==null?void 0:w.formattedPost)||(o==null?void 0:o.description)||"",l=(w==null?void 0:w.caption)||(o==null?void 0:o.caption)||(o==null?void 0:o.description)||"",p=w!=null&&w.media?w.media.length:o!=null&&o.images?o.images.length:0,u=w?w.isGroupMatch:!0,m=(w==null?void 0:w.expectedGroupName)||(n==null?void 0:n.name)||"Expected Group",d=t.groupName||"Current Page";k.innerHTML=`
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
        display: ${ue?"none":"block"};
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
        max-height: ${Ve?"160px":"55px"};
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
            ${ue?"▲ Expand":"▼ Minimize"}
          </button>
          <button class="icon-btn close-btn" id="agp-close-btn" title="Stop & Close (ডাইরেক্ট অফ)">✕</button>
        </div>
      </div>

      <div class="panel-body">
        ${u?"":`
          <div class="warning-box">
            <strong>⚠️ Wrong Group Detected!</strong><br/>
            Expected: <strong>${m}</strong><br/>
            Current page: <em>${d}</em><br/>
            <span style="font-size: 11px; color: #fca5a5;">Auto-skipping to next group...</span>
          </div>
        `}

        <div class="progress-container">
          <div class="progress-label">
            <span>Posted: <strong>${c} of ${i}</strong> Groups</span>
            <span>${s}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${s}%"></div>
          </div>
        </div>

        <div class="autopost-box">
          <div class="autopost-header">
            <span class="pulse-dot"></span>
            <span>${j?"Auto-Posting in Progress":oe?"Auto-Pilot Paused":"Auto-Pilot Running"}</span>
          </div>
          <div class="autopost-status-text">${$}</div>
        </div>

        <div class="meta-row">
          <span class="group-name" title="${m}">${m}</span>
          <span class="queue-badge">Queue ${r} / ${i}</span>
        </div>

        <div class="post-card">
          <div class="post-title">${(o==null?void 0:o.productName)||(o==null?void 0:o.title)||"Prepared Listing"}</div>
          ${p>0?((o==null?void 0:o.images)||(w==null?void 0:w.media)||[]).some(G=>G.includes("video")||G.includes("data:video")||G.endsWith(".mp4")||G.endsWith(".webm")||G.endsWith(".mov"))?`<div class="media-badge" style="background:#065f46;color:#6ee7b7;border:1px solid #059669;">🎬 Video Attached (${p})</div>`:`<div class="media-badge">📷 ${p} Photos attached</div>`:""}
          <div class="post-preview">${l||a||"No prepared caption."}</div>
        </div>

        <button class="auto-btn ${j?"running":""}" id="btn-auto-post">
          ${j?"⏸️ Pause Auto-Posting":"🤖 Auto-Post Now"}
        </button>

        ${ft()||ve()?`<button class="action-btn" id="btn-auto-join" style="background:#2563eb;color:#ffffff;font-weight:700;margin-top:6px;width:100%;justify-content:center;box-shadow:0 2px 4px rgba(37,99,235,0.3);">
                ➕ Auto-Join Group (গ্রুপে যোগ দিন)
              </button>`:""}

        <button class="action-btn primary-btn" id="btn-mark-posted">
          ✅ Mark Posted & Next Group
        </button>

        <div class="button-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
          <button class="action-btn" id="btn-toggle-caption">
            ${Ve?"Collapse":"👁️ View"}
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
  `,(T=k.getElementById("agp-toggle-btn"))==null||T.addEventListener("click",()=>{ue=!ue,I()}),(q=k.getElementById("agp-close-btn"))==null||q.addEventListener("click",G=>{G.stopPropagation(),gt()}),(R=k.getElementById("btn-auto-post"))==null||R.addEventListener("click",()=>{j?(oe=!0,j=!1,$="Auto-posting paused by user",M&&clearInterval(M),C("Auto-posting paused"),I()):(oe=!1,M&&clearInterval(M),He())}),(Y=k.getElementById("btn-auto-join"))==null||Y.addEventListener("click",async()=>{const G=k==null?void 0:k.getElementById("btn-auto-join");G&&(G.textContent="⏳ Joining..."),(await $t()).isInstantMember&&He()}),(ne=k.getElementById("btn-toggle-caption"))==null||ne.addEventListener("click",()=>{Ve=!Ve,I()}),(Ze=k.getElementById("btn-copy-caption"))==null||Ze.addEventListener("click",async()=>{const z=nt(l||a).replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),ge=at(z);await _t(z,ge)&&C("📋 Caption & Design copied (Ctrl+V ready)!")}),(et=k.getElementById("btn-paste-caption"))==null||et.addEventListener("click",async()=>{const z=nt(l||a).replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),ge=document.querySelector('[role="dialog"]')||document.body;C("✨ Pasting caption with exact styling..."),await Tt(ge,z)?C("✅ Caption pasted with exact design!"):C("⚠️ Click inside post box and press Ctrl+V",!0)}),(Z=k.getElementById("btn-mark-posted"))==null||Z.addEventListener("click",()=>{var G;M&&clearInterval(M);try{window.onbeforeunload=null}catch{}chrome.runtime.sendMessage({type:"MARK_AS_POSTED",payload:{itemId:(G=w==null?void 0:w.queueItem)==null?void 0:G.id}},()=>{C("Marked as Posted! Moving to next group...")})}),(H=k.getElementById("btn-skip"))==null||H.addEventListener("click",()=>{var G;M&&clearInterval(M);try{window.onbeforeunload=null}catch{}chrome.runtime.sendMessage({type:"SKIP_CURRENT_ITEM",payload:{itemId:(G=w==null?void 0:w.queueItem)==null?void 0:G.id,reason:"Skipped by user"}},()=>{C("Skipped group. Moving to next...")})}),(Ae=k.getElementById("btn-pause"))==null||Ae.addEventListener("click",()=>{M&&clearInterval(M),oe=!0,j=!1,chrome.runtime.sendMessage({type:"PAUSE_QUEUE"},()=>{C("Posting Session Paused")})}),(Ee=k.getElementById("btn-open-dashboard"))==null||Ee.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})})}function yo(){Ye||(se||(se=document.createElement("div"),se.id="ai-group-poster-dock-root",document.body.appendChild(se),k=se.attachShadow({mode:"open"})),I())}function $e(){var n;if(Ye)return;const t=ce(),e=Pe();e.isLoggedIn&&chrome.runtime.sendMessage({type:"FB_USER_PROFILE_DETECTED",payload:e}),t.isGroupPage?(chrome.runtime.sendMessage({type:"FB_PAGE_DETECTED",payload:{url:t.canonicalUrl,groupIdOrSlug:t.groupIdOrSlug,pageTitle:t.groupName}}),chrome.runtime.sendMessage({type:"GET_ACTIVE_POST_FOR_TAB",payload:{url:t.canonicalUrl}},o=>{chrome.runtime.lastError||o!=null&&o.isUserTab||o&&o.payload&&(w=o.payload,yo(),w&&w.queueItem&&ho())})):to()&&(console.log("[AGP:Content] Facebook Group Search Page detected."),pt(),typeof chrome<"u"&&((n=chrome.storage)!=null&&n.local)&&chrome.storage.local.get(["agp_pending_auto_join","agp_auto_join_config"],o=>{const r=o==null?void 0:o.agp_pending_auto_join,i=o==null?void 0:o.agp_auto_join_config;if(r&&r.active&&Date.now()-(r.requestedAt||0)<9e4){console.log("[AGP:Content] Detected pending Auto-Join request. Starting auto-joiner..."),chrome.storage.local.remove("agp_pending_auto_join");const c=r.config||i||{searchUrl:window.location.href,delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0};pt(c),setTimeout(()=>{U.getInstance().start(c)},1500)}}))}let Me=!1;function Nt(t=0,e){if(typeof document>"u"||!document.body)return;Me=!1;const n=document.getElementById("agp-sync-window-overlay");n&&n.remove();const o=document.createElement("div");o.id="agp-sync-window-overlay",o.innerHTML=`
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981;"></span>
        <span style="font-weight: 800; font-size: 14px; color: #ffffff; letter-spacing: -0.2px;">
          Syncing Facebook Groups
        </span>
      </div>
      <div id="agp-sync-counter-badge" style="background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.4); color: #34d399; font-weight: 700; font-size: 11px; padding: 2px 8px; border-radius: 9999px;">
        ${t} Found
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
        Save & Finish Now (<span id="agp-sync-btn-count">${t}</span>)
      </button>
      <button id="agp-sync-cancel-btn" type="button" style="background: rgba(255,255,255,0.08); color: #cbd5e1; font-weight: 600; font-size: 12px; padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); cursor: pointer;">
        Cancel
      </button>
    </div>
  `,o.style.cssText=`
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
  `,document.body.appendChild(o);const r=document.getElementById("agp-sync-finish-btn");r&&(r.onclick=()=>{Me=!0,r.innerHTML="<span>Saving...</span>",r.style.opacity="0.7",r.style.pointerEvents="none"});const i=document.getElementById("agp-sync-cancel-btn");i&&(i.onclick=()=>{Me=!0,Re()})}function Ke(t,e){const n=document.getElementById("agp-sync-counter-badge");n&&(n.innerText=e?`${t} / ${e} Found`:`${t} Found`);const o=document.getElementById("agp-sync-btn-count");o&&(o.innerText=String(t));const r=document.getElementById("agp-sync-status-text");r&&t>0&&(r.innerText=`Found ${t} groups. Scrolling for more...`)}function Re(){const t=document.getElementById("agp-sync-window-overlay");t&&t.remove()}let Qe=null;chrome.runtime.onMessage.addListener((t,e,n)=>{if(t.type==="START_GROUP_DISCOVERY")return(async()=>{try{console.log("[AGP:Content] Starting deep group discovery scan on current Facebook page...");const o=Pe(),r=o.userId||o.name||void 0;Nt(),Ot();const i=await ht({maxRounds:350,stagnantLimit:35,scrollDelayMs:300,accountContext:r,shouldStop:()=>Me,onBatchDiscovered:async(l,p,u)=>{Qe=u;const m=Xe(),d=[...l];for(const f of m)d.find(g=>g.groupId.toLowerCase()===f.groupId.toLowerCase())||d.push(f);Ke(d.length);try{chrome.runtime.sendMessage({type:"GROUP_BATCH_DISCOVERED",payload:{liveGroups:d,verifiedCount:d.length,duplicatesRemoved:(u==null?void 0:u.duplicatesRemoved)||0,debugMetrics:u}})}catch{}try{await qe(d,{syncMode:"merge",accountContext:r})}catch(f){console.warn("[AGP:Content] Progressive batch merge error:",f)}},onProgress:(l,p,u,m)=>{Qe=m;const d=X.size,f=Math.max(l,d);Ke(f,u);try{chrome.runtime.sendMessage({type:"GROUP_DISCOVERY_PROGRESS",payload:{foundCount:f,status:p,targetCount:u,debugMetrics:m}})}catch{}}}),c=Xe();if(c.length>0)try{await qe(c,{syncMode:"merge",accountContext:r})}catch{}const s=[...i.groups];for(const l of c)s.find(p=>p.groupId.toLowerCase()===l.groupId.toLowerCase())||s.push(l);const a=Math.max(i.totalFound,s.length);Qe=i.debugMetrics,Re(),n({success:!0,payload:{groups:s,sourceUrl:window.location.href,isLoggedIn:i.isLoggedIn,totalFoundOnPage:a,profile:o,outcome:i.outcome,completionReason:i.completionReason,isPartial:i.isPartial,debugMetrics:i.debugMetrics}})}catch(o){Re();const r=o instanceof Error?o.message:String(o);n({success:!1,error:r})}})(),!0;if(t.type==="CANCEL_GROUP_DISCOVERY")return Re(),C("AI Group Poster: Discovery cancelled.",!0),n({success:!0}),!1;if(t.type==="GET_DEBUG_METRICS")return n({success:!0,debugMetrics:Qe}),!1;if(t.type==="CHECK_FACEBOOK_SESSION"){const o=De(),r=Pe();return n({success:!0,isLoggedIn:o,profile:r,currentUrl:window.location.href}),!1}if(t.type==="GET_FACEBOOK_USER_INFO")return(async()=>{try{const o=De(),r=Pe();let c=ot(r.userId||r.name||void 0).items;n({success:!0,isLoggedIn:o,profile:r,groups:c,totalGroups:c.length,currentUrl:window.location.href})}catch(o){const r=o instanceof Error?o.message:String(o);n({success:!1,error:r})}})(),!0;if(t.type==="START_AUTO_JOIN"||t.type==="AUTO_JOIN_START_ON_PAGE")return(async()=>{try{const o=t.payload||{},r={...o,delaySec:typeof o.delaySec=="number"?o.delaySec:0};pt(r);const i=await U.getInstance().start(r);n({success:!0,state:i})}catch(o){const r=o instanceof Error?o.message:String(o);n({success:!1,error:r})}})(),!0;if(t.type==="PAUSE_AUTO_JOIN"||t.type==="AUTO_JOIN_PAUSE_ON_PAGE")return U.getInstance().pause(),n({success:!0}),!1;if(t.type==="RESUME_AUTO_JOIN"||t.type==="AUTO_JOIN_RESUME_ON_PAGE")return U.getInstance().resume(),n({success:!0}),!1;if(t.type==="STOP_AUTO_JOIN"||t.type==="AUTO_JOIN_STOP_ON_PAGE")return U.getInstance().stop(),n({success:!0}),!1;if(t.type==="GET_AUTO_JOIN_STATE"){const o=U.getInstance().getState();return n({success:!0,state:o}),!1}});let bt=!1,X=new Map;function Ot(){if(typeof window>"u"||window.__agpFetchIntercepted)return;window.__agpFetchIntercepted=!0;const t=window.fetch;window.fetch=async function(...e){var o;const n=await t.apply(this,e);try{const r=typeof e[0]=="string"?e[0]:((o=e[0])==null?void 0:o.url)||"";(r.includes("/api/graphql")||r.includes("graphql"))&&n.clone().text().then(c=>{c.includes("Group")&&(c.includes("/groups/")||c.includes('__typename":"Group"'))&&wo(c)}).catch(()=>{})}catch{}return n},console.log("[AGP:Content] GraphQL response interceptor installed")}function wo(t){try{const e=/"__typename"\s*:\s*"Group"[^}]*?"id"\s*:\s*"(\d+)"[^}]*?"name"\s*:\s*"([^"]+)"/g;let n;for(;(n=e.exec(t))!==null;){const r=n[1],i=n[2].trim();r&&i&&i.length>=2&&X.set(r,{name:i,id:r})}const o=/"node"\s*:\s*\{\s*"__typename"\s*:\s*"Group"\s*,\s*"id"\s*:\s*"(\d+)"\s*,\s*"name"\s*:\s*"([^"]+)"/g;for(;(n=o.exec(t))!==null;){const r=n[1],i=n[2].trim();r&&i&&i.length>=2&&X.set(r,{name:i,id:r})}X.size>0&&console.log(`[AGP:Content] GraphQL interceptor: total ${X.size} groups captured`)}catch{}}function Xe(){const t=[];for(const[e,n]of X)t.push({name:n.name,url:`https://www.facebook.com/groups/${e}/`,groupId:e,privacy:"UNKNOWN",imageUrl:n.imageUrl});return t}async function Ut(){const t=window.location.href.toLowerCase();if((t.includes("/groups/joins")||t.includes("category=membership"))&&!bt){bt=!0,console.log("[AGP:Content] Detected Your Groups page (/groups/joins/)! Starting full auto-scan of all joined groups..."),C("AI Group Poster: Auto-scanning your joined groups..."),Ot(),Nt(0);try{const e=await ht({maxRounds:350,stagnantLimit:35,scrollDelayMs:300,shouldStop:()=>Me,onBatchDiscovered:async(r,i)=>{const c=Xe(),s=[...r];for(const a of c)s.find(l=>l.groupId===a.groupId)||s.push(a);Ke(s.length);try{await qe(s,{syncMode:"merge"})}catch(a){console.warn("[AGP:Content] Batch save err:",a)}},onProgress:(r,i,c)=>{const s=X.size,a=Math.max(r,s);Ke(a,c),C(`AI Group Poster: Found ${a}${c?` / ${c}`:""} groups...`);try{chrome.runtime.sendMessage({type:"GROUP_DISCOVERY_PROGRESS",payload:{foundCount:a,status:i,targetCount:c}})}catch{}}}),n=Xe();if(n.length>0)try{await qe(n,{syncMode:"merge"}),console.log(`[AGP:Content] Final merge: added ${n.length} intercepted groups`)}catch{}const o=Math.max(e.totalFound,X.size);C(`AI Group Poster: Sync complete! Found ${o} groups.`)}catch(e){console.warn("[AGP:Content] Auto-scan err:",e)}finally{bt=!1,setTimeout(Re,1500)}}}window.addEventListener("message",t=>{if(!(t.source!==window||!t.data)){if(t.data.type==="AGP_MAIN_GRAPHQL_GROUPS"&&Array.isArray(t.data.groups)){for(const e of t.data.groups)e.id&&e.name&&X.set(e.id,{name:e.name,id:e.id});console.log(`[AGP:Content] Intercepted ${X.size} groups from MAIN world GraphQL`)}t.data.type==="AGP_MAIN_URL_CHANGED"&&Ne()}}),chrome.runtime.onMessage.addListener(t=>{t&&t.type==="AGP_NAVIGATE_TO_GROUP"&&Ne()}),$e(),setTimeout(Ut,100);let Dt=window.location.href;function Ne(){window.location.href!==Dt&&(Dt=window.location.href,$e(),setTimeout(Ut,100))}window.addEventListener("popstate",Ne,{passive:!0}),window.addEventListener("hashchange",Ne,{passive:!0}),setInterval(Ne,1e3),setInterval(()=>{if(j||w&&w.queueItem)try{chrome.runtime.sendMessage({type:"KEEPALIVE_PING"},()=>{chrome.runtime.lastError})}catch{}},1e4)})();
