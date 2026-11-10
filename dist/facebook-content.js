var tn=Object.defineProperty;var on=(Ae,pe,ke)=>pe in Ae?tn(Ae,pe,{enumerable:!0,configurable:!0,writable:!0,value:ke}):Ae[pe]=ke;var Se=(Ae,pe,ke)=>on(Ae,typeof pe!="symbol"?pe+"":pe,ke);(function(){"use strict";function Ae(t){const e=[];if(!t||typeof t!="string")return{valid:!1,errors:["URL is required"]};const o=t.trim();if(!o)return{valid:!1,errors:["URL cannot be empty"]};let n=o;/^https?:\/\//i.test(n)||(n="https://"+n);let r;try{r=new URL(n)}catch{return{valid:!1,errors:["Invalid URL format"]}}const i=["facebook.com","www.facebook.com","web.facebook.com","m.facebook.com"],a=r.hostname.toLowerCase();i.some(f=>a===f||a.endsWith("."+f))||e.push("URL must be a Facebook domain (e.g. facebook.com, web.facebook.com)");const c=r.pathname.split("/").filter(Boolean),l=c.indexOf("groups");if(l===-1||l>=c.length-1)return e.push("URL must point directly to a Facebook group (e.g. /groups/group_name)"),{valid:!1,errors:e};const u=decodeURIComponent(c[l+1]);if(!u||["feed","discover","joins","about","settings","notifications","search","categories","create","help","privacy","support"].includes(u.toLowerCase()))return e.push("URL must point to a specific group, not a feed or discovery page"),{valid:!1,errors:e};const b=c.slice(l+2).map(f=>f.toLowerCase()),p=["permalink","posts","user","photos","videos","events","files","stories"];if(b.some(f=>p.includes(f)))return e.push("URL points to an individual post or permalink inside a group, not the group itself"),{valid:!1,errors:e};if(r.searchParams.has("comment_id")||r.searchParams.has("notif_id")||r.searchParams.has("notif_t"))return e.push("URL is a notification or comment permalink, not a group page"),{valid:!1,errors:e};const g=`https://www.facebook.com/groups/${u}/`;return{valid:e.length===0,errors:e,cleanUrl:g,groupId:u}}const pe={META_OG_TITLE:'meta[property="og:title"]',HEADER_H1:'h1[dir="auto"], h1 span'};function ke(){if(typeof window>"u")return{isGroupPage:!1,groupIdOrSlug:"",groupName:"",canonicalUrl:"",isReady:!1};const t=window.location.href,e=Ae(t);if(!e.valid||!e.groupId)return{isGroupPage:!1,groupIdOrSlug:"",groupName:"",canonicalUrl:t,isReady:!1};let o="";const n=document.querySelector(pe.META_OG_TITLE);if(n&&n.content&&(o=n.content.replace(/\s*\|\s*Facebook.*$/i,"").trim()),!o){const i=document.querySelector(pe.HEADER_H1);i&&i.innerText&&(o=i.innerText.trim())}!o&&document.title&&(o=document.title.replace(/\s*\|\s*Facebook.*$/i,"").trim()),o||(o=e.groupId.replace(/[-_.]+/g," "),o=o.charAt(0).toUpperCase()+o.slice(1));const r=document.readyState==="interactive"||document.readyState==="complete";return{isGroupPage:!0,groupIdOrSlug:e.groupId,groupName:o,canonicalUrl:e.cleanUrl||t,isReady:r}}const mt=new Set(["feed","discover","create","notifications","search","categories","joins","member-requests","expert_badge","settings","about","events","media","files","chats","manage","canvas","support","buy_sell_discussion","permalink","user","profile.php","hashtag","messages","marketplace","stories","reels","watch","gaming","members","photos","videos","posts"]),Ue=new Set(["view group","visit","open","view","join","group","groups","view all","see all","see more","গ্রুপ দেখুন","দেখুন","সব দেখুন","যোগ দিন","গ্রুপে যান","আরও দেখুন"]);function fo(t){const e={"০":"0","১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9"};return t.replace(/[০-৯]/g,o=>e[o]||o)}function go(t){if(typeof document>"u")return{count:null,status:"UNAVAILABLE",rawText:""};const o=Array.from(document.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, div, p')),n=[/(?:All groups you['’]?ve joined|Groups you['’]?ve joined)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/(?:আপনার যোগ দেওয়া সমস্ত গ্রুপ|আপনার যোগ দেওয়া সব গ্রুপ|আপনি যেসব গ্রুপে যোগ দিয়েছেন|যোগ দেওয়া সমস্ত গ্রুপ|যোগ দেওয়া সব গ্রুপ|যোগ দেওয়া গ্রুপ|সব গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/^All groups you['’]?ve joined\s*[:\-•]?\s*([0-9,kKmM\u09E6-\u09EF.]+)$/i],r=[/(?:Joined Groups|Your Groups|আমার গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/(?:Groups|গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i],i=a=>{const s=fo(a).replace(/,/g,"").trim().toLowerCase();if(s.endsWith("k")){const l=parseFloat(s.replace("k",""));return isNaN(l)?null:Math.round(l*1e3)}if(s.endsWith("m")){const l=parseFloat(s.replace("m",""));return isNaN(l)?null:Math.round(l*1e6)}const c=parseInt(s,10);return isNaN(c)?null:c};for(const a of o){const s=(a.textContent||"").trim();if(!(s.length>120||s.length<3))for(const c of n){const l=s.match(c);if(l&&l[1]){const u=i(l[1]);if(u!==null&&u>0)return{count:u,status:"CONFIRMED",rawText:s}}}}for(const a of o){const s=(a.textContent||"").trim();if(!(s.length>80||s.length<3))for(const c of r){const l=s.match(c);if(l&&l[1]){const u=i(l[1]);if(u!==null&&u>0)return{count:u,status:"UNCERTAIN",rawText:s}}}}return{count:null,status:"UNAVAILABLE",rawText:""}}function bo(t=document){const e=["end of results","no more groups to show","you’ve reached the end","you've reached the end","সব গ্রুপ দেখানো হয়েছে","ফলাফলের সমাপ্তি"],o=t.querySelectorAll('div[role="status"], span[dir="auto"], div, p');for(const n of o){const r=(n.textContent||"").trim().toLowerCase();if(!(r.length>100||r.length<5)){for(const i of e)if(r.includes(i))return!0}}return!1}function Re(t){if(!t)return"";let e=t.trim();return e=e.replace(/^(?:Visit group|Visit|Open group|Open|View group|View|গ্রুপ দেখুন|দেখুন|গ্রুপে যান)\s*/i,""),e=e.replace(/\s*(?:Last active|You last visited|last visited|active)\s+[^\n]+/i,""),e=e.replace(/\s*(?:গত|আগে|মিনিট আগে|ঘণ্টা আগে|দিন আগে)[^\n]*/i,""),e=e.replace(/\s*·\s*(?:Public group|Private group|পাবলিক গ্রুপ|প্রাইভেট গ্রুপ).*$/i,""),e=e.replace(/\s*·\s*\d+.*members.*$/i,""),e=e.replace(/\s*·\s*[০-৯\d]+.*সদস্য.*$/i,""),e=e.replace(/\s*·\s*[^\n]+/i,""),e.trim()}function mo(t){var d,b;const e=p=>({valid:!1,reason:p,name:"",url:"",groupId:"",privacy:"UNKNOWN"}),o=t.href||t.getAttribute("href")||"";if(!o||!o.includes("/groups/"))return e("Not a group link");if(o.includes("/permalink/")||o.includes("/posts/")||o.includes("/photos/")||o.includes("/videos/")||o.includes("comment_id=")||o.includes("notif_id="))return e("Post or photo permalink, not a group home");let n="";try{const g=new URL(o,"https://www.facebook.com").pathname.split("/").filter(Boolean),f=g.indexOf("groups");if(f!==-1&&g[f+1]){const m=g[f+1];try{n=decodeURIComponent(m)}catch{n=m}if(g.length>f+2){const A=g[f+2].toLowerCase();if(["posts","permalink","photos","videos","user","media"].includes(A))return e("Post or photo permalink, not a group home")}}}catch{return e("Malformed URL")}if(!n||mt.has(n.toLowerCase()))return e("Non-group system path");if(t.closest('[aria-label*="Notification" i], [aria-label*="বিজ্ঞপ্তি" i], [data-pagelet*="Notification" i]'))return e("Inside notification flyout");let r=t.closest('div[role="listitem"], div[role="article"], div[role="gridcell"], li, div[role="row"]');if(!r){let p=t.parentElement;for(let g=0;g<7&&p&&p!==document.body;g++){const f=(p.textContent||"").toLowerCase(),m=p.querySelectorAll?p.querySelectorAll('a[href*="/groups/"]').length:0;if(m>=1&&m<=5&&(f.includes("view group")||f.includes("visited")||f.includes("last active")||f.includes("গ্রুপ দেখুন"))){r=p;break}p=p.parentElement}r||(r=((d=t.parentElement)==null?void 0:d.parentElement)||t.parentElement)}if(r){const p=(r.textContent||"").toLowerCase();if(p.includes("sponsored")||p.includes("বিজ্ঞাপন")||r.querySelector('[aria-label*="Sponsored" i], [aria-label*="বিজ্ঞাপন" i]'))return e("Sponsored advertisement");if((r.querySelectorAll?Array.from(r.querySelectorAll('a[href*="/groups/"]')):[]).length<=4){if(p.includes("requested to join")||p.includes("অনুরোধ পাঠানো হয়েছে")||p.includes("answer questions")||p.includes("update responses")||p.includes("suggested for you")||p.includes("আপনার জন্য প্রস্তাবিত")||p.includes("suggested groups")||p.includes("প্রস্তাবিত গ্রুপ"))return e("Unjoined or suggested group");if(r.querySelectorAll){const m=Array.from(r.querySelectorAll('button, [role="button"]'));for(const A of m){const y=(A.textContent||A.getAttribute("aria-label")||"").trim().toLowerCase();if((y==="join"||y==="join group"||y==="যোগ দিন"||y==="গ্রুপে যোগ দিন"||y==="request to join")&&!p.includes("view group")&&!p.includes("গ্রুপ দেখুন")&&!p.includes("visited")&&!p.includes("last active"))return e("Card has Join button, not joined")}}}}let i="";const a=(t.getAttribute("aria-label")||"").trim();if(a&&a.length>=2&&!Ue.has(a.toLowerCase())&&(i=Re(a)),!i){const p=(t.textContent||t.innerText||"").trim(),g=Re(p);g&&g.length>=2&&!Ue.has(g.toLowerCase())&&(i=g)}if(!i){const p=Array.from(t.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, span'));for(const g of p){const f=Re((g.textContent||"").trim()),m=f.toLowerCase();if(f.length>=2&&!Ue.has(m)&&!m.includes("last active")&&!m.includes("you last visited")&&!m.includes("members")&&!m.includes("সদস্য")&&!m.includes("ago")){i=f;break}}}if(!i&&r){const p=r.querySelector('h1, h2, h3, h4, [role="heading"]');if(p&&p.textContent){const g=Re(p.textContent.trim());g.length>=2&&!Ue.has(g.toLowerCase())&&(i=g)}}if(!i&&r){const p=Array.from(r.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, a[href*="/groups/"] > span, a[href*="/groups/"], div[dir="auto"]'));for(const g of p){if(g===t)continue;const f=Re((g.textContent||"").trim()),m=f.toLowerCase();if(f.length>=2&&f.length<200&&!Ue.has(m)&&!m.includes("view group")&&!m.includes("you last visited")&&!m.includes("last active")&&!m.includes("members")&&!m.includes("সদস্য")&&!m.includes("hours ago")&&!m.includes("minutes ago")&&!m.includes("days ago")&&!m.includes("weeks ago")&&!m.includes("ঘণ্টা আগে")&&!m.includes("দিন আগে")&&!m.includes("সপ্তাহ আগে")&&!/^\d+\s*(hours?|minutes?|days?|weeks?)\s*ago$/i.test(m)){i=f;break}}}i||(i=n.split(/[-_.]+/).filter(Boolean).map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join(" "));let s="";const c=r!=null&&r.querySelector?r.querySelector("img, image")||t.querySelector("img, image"):null;c&&(s=c.getAttribute("src")||c.getAttribute("href")||((b=c.href)==null?void 0:b.baseVal)||"",(s.includes("/rsrc.php/")||s.includes("spacer")||s.includes("1x1"))&&(s=""));let l="UNKNOWN";const u=p=>{const g=(p||"").toLowerCase();return g.includes("public group")||g.includes("পাবলিক গ্রুপ")||g.includes("public")||g.includes("পাবলিক")?"PUBLIC":g.includes("private group")||g.includes("প্রাইভেট গ্রুপ")||g.includes("private")||g.includes("প্রাইভেট")?"PRIVATE":"UNKNOWN"};if(r){const p=u(r.textContent||"");if(p!=="UNKNOWN")l=p;else if(r.querySelectorAll){const g=Array.from(r.querySelectorAll("span, div, p"));for(const f of g){const m=u(f.textContent||"");if(m!=="UNKNOWN"){l=m;break}}}}return l==="UNKNOWN"&&(l=u(t.textContent||"")),{valid:!0,name:i,url:`https://www.facebook.com/groups/${n}/`,groupId:n,imageUrl:s,privacy:l}}function tt(){if(typeof document>"u")return!1;const t=typeof window<"u"?window.location.href:"";if(t.includes("/login")||t.includes("/recover")||t.includes("/checkpoint"))return!1;const e=document.body&&(document.body.innerText||document.body.textContent)||"";return e.includes("What's on your mind")||e.includes("আপনার মনে কী আছে")||e.includes("কী ভাবছেন")||e.includes("Professional dashboard")||e.includes("Ads Manager")||e.includes("Meta Business Suite")?!0:!!document.querySelector('[role="navigation"], [data-pagelet="LeftRail"], [aria-label="Facebook"], input[placeholder*="Search" i], [aria-label*="profile" i], [aria-label*="Account" i], a[href*="/me/"], a[href*="/groups/"]')||!!(document.cookie&&document.cookie.includes("c_user"))}function qe(){var s,c;if(typeof document>"u")return{isLoggedIn:!1,name:"",profileUrl:""};let t="",e="",o="",n="";if(document.body){const u=(document.body.innerText||document.body.textContent||"").match(/(?:What['’]s on your mind|আপনার মনে কী আছে|কী ভাবছেন)[,?\s]+([^?!\n]+?)(?:\?|$)/i);if(u&&u[1]){const d=u[1].trim().replace(/[?,!]+$/,"").trim();d.length>=2&&d.length<=50&&!d.toLowerCase().includes("facebook")&&(t=d)}}const r=Array.from(document.querySelectorAll('a[href*="/me/"], a[href*="facebook.com/profile"], [role="navigation"] a[href]'));for(const l of r){const u=l.getAttribute("href")||l.href||"",d=l.querySelector('span[dir="auto"], span, strong, h1'),b=(d?d.textContent:l.innerText||l.textContent||"").trim();if(b&&b.length>=2&&b.length<=35&&!["Home","Friends","Feeds","Groups","Watch","Marketplace","Memories","Saved","Video","Settings","Meta AI","Professional dashboard","Ads Manager","Ad Center","Meta Business Suite","See more","See all","Facebook","Menu","Notifications"].includes(b)){t||(t=b),!e&&u&&(e=u);const g=l.querySelector("image, img");if(g&&!o&&(o=g.getAttribute("src")||((s=g.href)==null?void 0:s.baseVal)||""),t)break}}const i=document.querySelector('[aria-label="Your profile" i], [aria-label*="Your profile" i], [aria-label*="Account Controls" i], [aria-label*="আপনার প্রোফাইল" i]');if(i&&!o){const l=i.querySelector("image, img");l&&(o=l.getAttribute("src")||((c=l.href)==null?void 0:c.baseVal)||"")}try{const l=Array.from(document.querySelectorAll("script"));for(const u of l){const d=u.textContent||"";if(d.includes('"NAME":')||d.includes('"USER_ID":')||d.includes('"short_name":')){const b=d.match(/"NAME":\s*"([^"]+)"/)||d.match(/"short_name":\s*"([^"]+)"/);if(b&&b[1]&&!t)try{t=JSON.parse(`"${b[1]}"`)}catch{t=b[1]}const p=d.match(/"USER_ID":\s*"(\d+)"/);if(p&&p[1]&&!n&&(n=p[1]),t)break}}}catch{}if(!n&&document.cookie){const l=document.cookie.match(/c_user=(\d+)/);l&&(n=l[1])}const a=tt()||!!(t||n);return{isLoggedIn:a,name:t||(a?"Facebook User":""),profileUrl:e||"https://www.facebook.com",avatarUrl:o,userId:n}}function ho(t){if(typeof document>"u")return[];const e=new Map,o=Date.now();try{const n=Array.from(document.querySelectorAll("script"));for(const r of n){const i=r.textContent||"";if(i.length<40)continue;const a=[/"__typename"\s*:\s*"Group"[\s\S]{0,500}?"id"\s*:\s*"(\d+)"[\s\S]{0,500}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,/"__typename"\s*:\s*"Group"[\s\S]{0,500}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,500}?"id"\s*:\s*"(\d+)"/g,/"node"\s*:\s*\{[\s\S]{0,120}?"__typename"\s*:\s*"Group"[\s\S]{0,350}?"id"\s*:\s*"(\d+)"[\s\S]{0,350}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,/"node"\s*:\s*\{[\s\S]{0,120}?"__typename"\s*:\s*"Group"[\s\S]{0,350}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,350}?"id"\s*:\s*"(\d+)"/g,/\{"id"\s*:\s*"(\d+)"[\s\S]{0,300}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,300}?(?:"__typename"\s*:\s*"Group"|url"\s*:\s*"https:[^"]*?\/groups\/[^"]+?")/g,/\{"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,300}?"id"\s*:\s*"(\d+)"[\s\S]{0,300}?(?:"__typename"\s*:\s*"Group"|url"\s*:\s*"https:[^"]*?\/groups\/[^"]+?")/g];for(const s of a){let c;for(;(c=s.exec(i))!==null;){let l="",u="";if(/^\d+$/.test(c[1])?(l=c[1],u=c[2]):/^\d+$/.test(c[2])&&(l=c[2],u=c[1]),l&&u){u=u.trim();try{u=u.replace(/\\u[\dA-Fa-f]{4}/g,b=>String.fromCharCode(parseInt(b.replace("\\u",""),16)))}catch{}const d=i.slice(Math.max(0,c.index-350),Math.min(i.length,c.index+600));if(d.includes('"__typename":"User"')||d.includes('"__typename":"Actor"')||d.includes('"__typename":"Story"')||d.includes('"__typename":"Comment"')||d.includes('"__typename":"Page"')||t&&u.toLowerCase()===t.toLowerCase())continue;if(u.length>=2&&!e.has(l)){let b="";const g=i.slice(Math.max(0,c.index-500),Math.min(i.length,c.index+1e3)).match(/"(?:uri|url|cover_photo|image)"\s*:\s*\{[^}]*"uri"\s*:\s*"([^"]+)"/);if(g&&g[1]){let f=g[1];try{f=f.replace(/\\u[\dA-Fa-f]{4}/g,m=>String.fromCharCode(parseInt(m.replace("\\u",""),16)))}catch{}!f.includes("/rsrc.php/")&&!f.includes("1x1")&&(b=f.replace(/\\\//g,"/"))}e.set(l,{name:Bt(u,l),url:`https://www.facebook.com/groups/${l}/`,groupId:l,privacy:"UNKNOWN",imageUrl:b,verified:!0,source:"facebook-ui",accountContext:t,discoveredAt:o})}}}}}}catch(n){console.warn("[AGP:Discovery] Script tags extraction warning:",n)}return Array.from(e.values())}function ht(t){if(typeof document>"u")return{items:[],rejectedCount:0};const e=new Map;let o=0;const n=Date.now(),r=ho(t);for(const a of r)e.set(a.groupId.toLowerCase(),a);const i=Array.from(document.querySelectorAll('a[href*="/groups/"]'));for(const a of i){const s=mo(a);if(!s.valid||!s.name||!s.url||!s.groupId){o++;continue}const c=s.groupId.toLowerCase(),l=e.get(c);l?(!l.imageUrl&&s.imageUrl&&(l.imageUrl=s.imageUrl),s.name&&l.name.length<s.name.length&&(l.name=s.name),s.privacy!=="UNKNOWN"&&(l.privacy=s.privacy)):e.set(c,{name:s.name,url:s.url,groupId:s.groupId,privacy:s.privacy,imageUrl:s.imageUrl,verified:!0,source:"facebook-ui",accountContext:t,discoveredAt:n})}return{items:Array.from(e.values()),rejectedCount:o}}function Mt(){if(typeof document>"u")return 0;let t=0;const e=Array.from(document.querySelectorAll('div[role="button"], button, span[dir="auto"], [role="navigation"] [role="button"], [data-pagelet="LeftRail"] [role="button"]'));for(const o of e){const n=(o.textContent||o.getAttribute("aria-label")||"").trim().toLowerCase();if(n==="see more"||n==="আরও দেখুন"||n==="see all"||n==="সব দেখুন"||n==="see all groups"||n==="সব গ্রুপ দেখুন"||n==="view more")try{(o.closest('[role="button"], button')||o).click(),t++}catch{}}return t}async function Nt(t={}){var y,E,L,N,I,oe;const e=t.maxRounds||350,o=t.stagnantLimit||35,n=t.scrollDelayMs!==void 0?t.scrollDelayMs:250,r=t.accountContext,i=Date.now(),a=tt(),s=new Map;let c=0,l=0,u=0,d=0;const b=go(),p=b.count,g=b.status;console.log(`[AGP:Engine] Discovery started. Target count: ${p??"N/A"} (Status: ${g})`);const f=z=>({candidateCount:s.size+l,verifiedCount:s.size,duplicatesRemoved:c,rejectedCount:l,scrollIterations:d,mutationEvents:u,targetCount:p,targetCountStatus:g,completionReason:z,scanDurationMs:Date.now()-i,lastNewGroupTimestamp:s.size>0?Date.now():null}),m=z=>{let de=0;for(const R of z){const Z=R.groupId.toLowerCase();s.has(Z)?c++:(s.set(Z,R),de++)}return de};let A=null;typeof MutationObserver<"u"&&typeof document<"u"&&(A=new MutationObserver(z=>{u+=z.length}),A.observe(document.body||document.documentElement,{childList:!0,subtree:!0}));try{try{Mt()}catch{}const z=ht(r);if(l+=z.rejectedCount,m(z.items)>0&&t.onBatchDiscovered)try{await t.onBatchDiscovered(Array.from(s.values()),s.size,f(null))}catch{}if(t.onProgress){const se=p?`Found ${s.size} of ${p} groups...`:`Found ${s.size} groups...`;t.onProgress(s.size,se,p,f(null))}if(g==="CONFIRMED"&&p!==null&&s.size>=p){const se=f("TARGET_REACHED");return console.log(`[AGP:Engine] Target count of ${p} confirmed on initial scan.`),{isLoggedIn:a,groups:Array.from(s.values()),totalFound:s.size,targetCount:p,isPartial:!1,outcome:"COMPLETE",completionReason:"TARGET_REACHED",debugMetrics:se}}let R=0,Z="PARTIAL",ae="STAGNANT_TIMEOUT";for(let se=0;se<e;se++){if(d++,t.shouldStop&&t.shouldStop()){console.log("[AGP:Engine] Progressive scan stopped by user request."),Z=s.size>0?"COMPLETE":"PARTIAL",ae="USER_CANCELLED";break}if(se%3===0)try{Mt()}catch{}const ee=Array.from(document.querySelectorAll('a[href*="/groups/"]'));if(ee.length>0){const x=ee[ee.length-1];try{x.scrollIntoView({block:"end",inline:"nearest",behavior:"auto"})}catch{}}const xe=document.querySelector('[role="main"], [data-pagelet*="Group"]');if(xe&&xe.lastElementChild)try{xe.lastElementChild.scrollIntoView({block:"end",behavior:"auto"})}catch{}const ve=Math.max(((y=document.documentElement)==null?void 0:y.scrollHeight)||0,((E=document.scrollingElement)==null?void 0:E.scrollHeight)||0,((L=document.body)==null?void 0:L.scrollHeight)||0);window.scrollTo(0,ve),document.scrollingElement&&(document.scrollingElement.scrollTop=ve),document.documentElement&&(document.documentElement.scrollTop=ve);const $=Array.from(document.querySelectorAll("div, main, section"));for(const x of $)if(x.scrollHeight>x.clientHeight+80){const k=window.getComputedStyle(x);(k.overflowY==="auto"||k.overflowY==="scroll")&&(x.scrollTop=x.scrollHeight,x.dispatchEvent(new Event("scroll",{bubbles:!0})))}window.dispatchEvent(new Event("scroll",{bubbles:!0}));try{window.dispatchEvent(new WheelEvent("wheel",{deltaY:2500,bubbles:!0})),(N=document.body)==null||N.dispatchEvent(new KeyboardEvent("keydown",{key:"PageDown",code:"PageDown",bubbles:!0}))}catch{}await new Promise(x=>setTimeout(x,n));const H=ht(r);if(l+=H.rejectedCount,m(H.items)>0){if(R=0,t.onBatchDiscovered)try{await t.onBatchDiscovered(Array.from(s.values()),s.size,f(null))}catch{}if(t.onProgress){const x=p?`Scanning Facebook Groups... ${s.size} of ${p} discovered`:`Scanning Facebook Groups... ${s.size} groups discovered`;t.onProgress(s.size,x,p,f(null))}if(g==="CONFIRMED"&&p!==null&&s.size>=p){console.log(`[AGP:Engine] Target count reached: ${s.size} >= ${p}.`),Z="COMPLETE",ae="TARGET_REACHED";break}}else{if(R++,bo()){console.log("[AGP:Engine] Explicit end-of-list indicator detected."),Z="COMPLETE",ae="LIST_END";break}if(window.scrollBy(0,-600),ee.length>5&&((I=ee[Math.max(0,ee.length-6)])==null||I.scrollIntoView({block:"center",behavior:"instant"})),await new Promise(x=>setTimeout(x,300)),window.scrollBy(0,1200),ee.length>0&&((oe=ee[ee.length-1])==null||oe.scrollIntoView({block:"end",behavior:"smooth"})),g==="CONFIRMED"&&p!==null&&s.size<p&&R<45){window.scrollBy(0,-1e3),await new Promise(x=>setTimeout(x,350)),window.scrollBy(0,2500);continue}if(R>=o){console.log(`[AGP:Engine] Scan complete/stagnant after ${R} attempts. Total verified: ${s.size}`),Z="PARTIAL",ae="STAGNANT_TIMEOUT";break}}}try{window.scrollTo({top:0,behavior:"smooth"})}catch{}const _e=Z!=="COMPLETE",Le=f(ae);return{isLoggedIn:a,groups:Array.from(s.values()),totalFound:s.size,targetCount:p,isPartial:_e,outcome:Z,completionReason:ae,debugMetrics:Le}}finally{A&&A.disconnect()}}function Bt(t,e){if(!t||!t.trim())return e?e.split(/[-_.]+/).filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" "):"Facebook Group";let o=t.trim();return o=o.replace(/^(?:Visit|Open|View|গ্রুপ দেখুন|দেখুন)\s+/i,""),o=o.replace(/\s*(?:Last active|You last visited|last visited|active)\s+[^\n]+/i,""),o=o.replace(/\s*(?:গত|আগে|মিনিট আগে|ঘণ্টা আগে|দিন আগে)[^\n]*/i,""),o=o.replace(/\s*·\s*(?:Public group|Private group|পাবলিক গ্রুপ|প্রাইভেট গ্রুপ).*$/i,""),o=o.replace(/\s*·\s*\d+.*members.*$/i,""),o=o.replace(/\s*·\s*[০-৯\d]+.*সদস্য.*$/i,""),o=o.replace(/\s*·\s*[^\n]+/i,""),(o.toLowerCase()==="visit"||o.toLowerCase()==="group"||o.toLowerCase()==="view group")&&e?e.split(/[-_.]+/).filter(Boolean).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join(" "):o.trim()||"Facebook Group"}function yt(t="id"){const e=Math.random().toString(36).substring(2,9),o=Date.now().toString(36);return`${t}_${o}_${e}`}function xt(t){if(!t)return"";if(!t.includes("{")||!t.includes("|"))return t;let e=t,o=0;const n=/\{([^{}]+)\}/g;for(;o<10&&n.test(e);)o++,e=e.replace(n,(r,i)=>{if(i.includes("|")){const a=i.split("|").map(s=>s.trim()).filter(Boolean);if(a.length>0)return a[Math.floor(Math.random()*a.length)]}return r});return e=e.replace(/\{([^{}\r\n]+?)(?=[.,!?\r\n]|$)/g,(r,i)=>i.includes("|")?i.split("|").map(s=>s.trim()).filter(Boolean)[0]||"":r),e}const Ot={status:"IDLE",searchUrl:"",query:"",totalFound:0,joinedCount:0,requestedCount:0,alreadyJoinedCount:0,failedCount:0,skippedCount:0,currentIndex:0,currentGroupName:"",countdownSec:0,message:"Enter any Facebook search link to start auto-joining.",groups:[]},ie={GROUPS:"agp_groups",ACCOUNT_GROUPS:"agp_facebook_groups_by_account",POSTS:"agp_posts",LOGS:"agp_logs",FACEBOOK_ACCOUNT:"agp_facebook_account"},Dt=()=>{var t;return typeof chrome<"u"&&!!((t=chrome.storage)!=null&&t.local)},je={};async function Ce(t,e){if(Dt())return new Promise(o=>{chrome.storage.local.get([t],n=>{if(chrome.runtime.lastError){console.warn(`Storage get error for ${t}:`,chrome.runtime.lastError),o(je[t]!==void 0?je[t]:e);return}n&&n[t]!==void 0?o(n[t]):o(e)})});try{if(typeof window<"u"&&window.localStorage){const o=window.localStorage.getItem(t);if(o!==null)return JSON.parse(o)}}catch(o){console.warn("LocalStorage access failed:",o)}return je[t]!==void 0?je[t]:e}async function Te(t,e){if(je[t]=e,Dt())return new Promise((o,n)=>{chrome.storage.local.set({[t]:e},()=>{chrome.runtime.lastError?n(chrome.runtime.lastError):o()})});try{typeof window<"u"&&window.localStorage&&window.localStorage.setItem(t,JSON.stringify(e))}catch(o){console.warn("LocalStorage set failed:",o)}}function Ut(t){return t&&t.trim().toLowerCase().replace(/[^a-z0-9_\u0980-\u09FF]/gi,"_")||"default_account"}async function ot(){return Ce(ie.ACCOUNT_GROUPS,{})}let Rt=!1;async function qt(){const t=await ot(),e=new Map,o=a=>{if(!a||!a.id||Fe(a))return;const s=(a.groupId||a.url||a.id).toLowerCase();if(!e.has(s))e.set(s,{...a});else{const c=e.get(s);a.name&&(!c.name||a.name.length>c.name.length)&&(c.name=a.name),a.imageUrl&&!c.imageUrl&&(c.imageUrl=a.imageUrl),a.privacy&&a.privacy!=="UNKNOWN"&&(c.privacy=a.privacy)}};for(const a of Object.keys(t)){const s=t[a];s&&Array.isArray(s.groups)&&s.groups.forEach(o)}(await Ce(ie.GROUPS,[])).forEach(o);const r=Array.from(e.values());return r.filter(a=>a.selected).length>50&&(r.forEach(a=>{a.selected=!1}),Rt||(Rt=!0,yo().catch(()=>{}))),r}async function yo(){var n;const t=await ot();let e=!1;for(const r of Object.keys(t))(n=t[r])!=null&&n.groups&&Array.isArray(t[r].groups)&&(t[r].groups=t[r].groups.map(i=>({...i,selected:!1})),e=!0);e&&await Te(ie.ACCOUNT_GROUPS,t);const o=await Ce(ie.GROUPS,[]);if(o.some(r=>r.selected)){const r=o.map(i=>({...i,selected:!1}));await Te(ie.GROUPS,r)}}async function vt(t){if(t==="all")return qt();const e=await Et(),o=Ut(t||(e==null?void 0:e.userId)||(e==null?void 0:e.name)),n=await ot();if(n[o]&&Array.isArray(n[o].groups)&&n[o].groups.length>0){const c=n[o].groups.filter(l=>!Fe(l));if(c.length>0)return c.filter(l=>l.selected).length>50&&c.forEach(l=>{l.selected=!1}),c}const i=(await Ce(ie.GROUPS,[])).filter(s=>!Fe(s));if(i.length>0)return i.filter(s=>s.selected).length>50&&i.forEach(s=>{s.selected=!1}),i;const a=await qt();return a.length>0?a:[]}async function wt(t,e){const o=(t||[]).filter(s=>!Fe(s)),n=await Et(),r=Ut(e||(n==null?void 0:n.userId)||(n==null?void 0:n.name)),i=await ot(),a=i[r]||{accountContext:r,accountInfo:n||{isLoggedIn:!0,name:"Facebook User",lastSyncedAt:Date.now()},groups:[],lastSyncedAt:Date.now()};i[r]={...a,groups:o,lastSyncedAt:Date.now()},await Te(ie.ACCOUNT_GROUPS,i),await Te(ie.GROUPS,o)}function Fe(t){if(!t)return!0;const e=(t.name||"").trim().toLowerCase(),o=(t.url||"").trim().toLowerCase();if(e.startsWith("unread")||e.includes("commented on")||e.includes("also commented")||e.includes("likes your")||e.includes("liked your")||e.includes("reacted to")||e.includes("shared a post")||e.includes("shared your post")||e.includes("invited you")||e.includes("mentioned you")||e.includes("requested to join")||e.includes("মন্তব্য করেছেন")||e.includes("মতামত দিয়েছেন")||e.includes("লাইক দিয়েছেন")||e.includes("শেয়ার করেছেন")||o.includes("/permalink/")||o.includes("/posts/")||o.includes("/user/")||o.includes("/profile.php")||o.includes("/friends/")||o.includes("/people/")||o.includes("/photos/")||o.includes("/videos/")||o.includes("/events/")||o.includes("/files/")||o.includes("comment_id=")||o.includes("notif_id=")||o.includes("notif_t=")||o.includes("reply_comment_id="))return!0;const n=new Set(["about","about group","feed","discover","create","notifications","search","categories","joins","settings","help","privacy","terms","policies","support","messages","marketplace"]),r=e.replace(/\s*group\s*$/i,"").trim();return!!(n.has(e)||n.has(r)||t.groupId&&n.has(t.groupId.toLowerCase()))}async function xo(){return Ce(ie.POSTS,[])}async function vo(t){await Te(ie.POSTS,t)}async function wo(){return Ce(ie.LOGS,[])}async function Eo(t){await Te(ie.LOGS,t)}async function So(t){const e=await wo();e.unshift(t),e.length>300&&(e.length=300),await Eo(e)}async function Et(){return Ce(ie.FACEBOOK_ACCOUNT,null)}class Ao{async writeLog(e,o,n,r){const i={id:yt("log"),timestamp:Date.now(),level:e,source:o,message:n,details:r},a=`[AGP:${o.toUpperCase()}][${e}]`;e==="ERROR"?console.error(a,n,r||""):e==="WARNING"?console.warn(a,n,r||""):console.log(a,n,r||"");try{await So(i)}catch(s){console.warn("Failed to persist log entry:",s)}return i}info(e,o,n){return this.writeLog("INFO",e,o,n)}success(e,o,n){return this.writeLog("SUCCESS",e,o,n)}warning(e,o,n){return this.writeLog("WARNING",e,o,n)}error(e,o,n){return this.writeLog("ERROR",e,o,n)}}const ko=new Ao;async function nt(t,e){var A;const o=(e==null?void 0:e.accountContext)||((A=await Et())==null?void 0:A.name)||"default_account",n=await vt(o),r=new Map,i=new Map,a=new Map,s=y=>y.trim().toLowerCase().replace(/\s+/g," ");n.forEach(y=>{y.groupId&&r.set(y.groupId.toLowerCase(),y),y.url&&i.set(y.url.toLowerCase().replace(/\/$/,""),y),y.name&&a.set(s(y.name),y)});let c=0,l=0;const u=Date.now(),d=[],b=new Set;for(const y of t){if(Fe(y))continue;const E=(y.groupId||"").toLowerCase(),L=(y.url||"").toLowerCase().replace(/\/$/,""),N=s(y.name||"");let I=(E?r.get(E):void 0)||(L?i.get(L):void 0)||(N&&N.length>=3?a.get(N):void 0);const oe=Bt(y.name||"",y.groupId);if(I)l++,b.add(I.id),oe&&(!I.name||I.name.includes("·")||I.name.length<oe.length)&&(I.name=oe),y.imageUrl&&!I.imageUrl&&(I.imageUrl=y.imageUrl),y.privacy&&y.privacy!=="UNKNOWN"&&(I.privacy=y.privacy),I.verified=!0,I.source="facebook-ui",I.accountContext=o,I.discoveredAt=u,I.updatedAt=u;else{c++;const z=y.groupId?`grp_${y.groupId.replace(/[^a-zA-Z0-9_-]/g,"")}`:yt("grp"),de=y.url.startsWith("http")?y.url:`https://www.facebook.com/groups/${y.groupId}/`,R={id:z,name:oe,url:de,groupId:y.groupId,privacy:y.privacy||"UNKNOWN",imageUrl:y.imageUrl,category:"Discovered",enabled:!0,selected:!1,status:"READY",postCount:0,verified:!0,source:"facebook-ui",accountContext:o,discoveredAt:u,createdAt:u,updatedAt:u};d.push(R),E&&r.set(E,R),L&&i.set(L,R),N&&a.set(N,R),b.add(R.id)}}let p;if((e==null?void 0:e.syncMode)==="exact"){const y=L=>L.source==="manual"||L.category&&L.category!=="Discovered",E=n.filter(L=>b.has(L.id)||y(L));p=[...d,...E]}else p=[...d,...n];const g=[],f=new Set,m=new Set;for(const y of p){const E=y.url.toLowerCase().replace(/\/$/,"");!f.has(y.id)&&!m.has(E)&&(f.add(y.id),m.add(E),g.push(y))}return await wt(g,o),await ko.info("dashboard",`Group discovery merged (${(e==null?void 0:e.syncMode)||"merge"}): ${c} imported, ${l} duplicates, total ${g.length}`),{imported:c,duplicates:l,totalStored:g.length,verifiedCount:g.filter(y=>y.verified).length}}const Co={a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",f:"ғ",g:"ɢ",h:"ʜ",i:"ɪ",j:"ᴊ",k:"ᴋ",l:"ʟ",m:"ᴍ",n:"ɴ",o:"ᴏ",p:"ᴘ",q:"ǫ",r:"ʀ",s:"s",t:"ᴛ",u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",y:"ʏ",z:"ᴢ"},jt={"ᴀ":"a",ʙ:"b","ᴄ":"c","ᴅ":"d","ᴇ":"e",ғ:"f",ɢ:"g",ʜ:"h",ɪ:"i","ᴊ":"j","ᴋ":"k",ʟ:"l","ᴍ":"m",ɴ:"n","ᴏ":"o","ᴘ":"p",ǫ:"q",ʀ:"r","ᴛ":"t","ᴜ":"u","ᴠ":"v","ᴡ":"w",ʏ:"y","ᴢ":"z"};function Po(t,e){const o=t.charCodeAt(0);if(e==="normal")return Ft(t);if(e==="small-caps"){const n=t.toLowerCase();return Co[n]||t}if(o>=65&&o<=90){const n=o-65;switch(e){case"sans-italic":return String.fromCodePoint(120328+n);case"sans-bold":return String.fromCodePoint(120276+n);case"sans-bold-italic":return String.fromCodePoint(120380+n);case"serif-bold":return String.fromCodePoint(119808+n);case"serif-italic":return String.fromCodePoint(119860+n);case"monospace":return String.fromCodePoint(120432+n);case"script":{const r={66:8492,69:8496,70:8497,72:8459,73:8464,76:8466,77:8499,82:8475};return String.fromCodePoint(r[o]||119964+n)}case"bold-script":return String.fromCodePoint(120016+n);case"fraktur":{const r={67:8493,72:8460,73:8465,82:8476,90:8488};return String.fromCodePoint(r[o]||120068+n)}case"bold-fraktur":return String.fromCodePoint(120172+n);case"double-struck":{const r={67:8450,72:8461,78:8469,80:8473,81:8474,82:8477,90:8484};return String.fromCodePoint(r[o]||120120+n)}case"bubble":return String.fromCodePoint(9398+n);case"bubble-black":return String.fromCodePoint(127312+n);case"square":return String.fromCodePoint(127280+n);case"square-black":return String.fromCodePoint(127344+n)}}if(o>=97&&o<=122){const n=o-97;switch(e){case"sans-italic":return String.fromCodePoint(120354+n);case"sans-bold":return String.fromCodePoint(120302+n);case"sans-bold-italic":return String.fromCodePoint(120406+n);case"serif-bold":return String.fromCodePoint(119834+n);case"serif-italic":return t==="h"?"ℎ":String.fromCodePoint(119886+n);case"monospace":return String.fromCodePoint(120458+n);case"script":{const r={101:8495,103:8458,111:8500};return String.fromCodePoint(r[o]||119990+n)}case"bold-script":return String.fromCodePoint(120042+n);case"fraktur":return String.fromCodePoint(120094+n);case"bold-fraktur":return String.fromCodePoint(120198+n);case"double-struck":return String.fromCodePoint(120146+n);case"bubble":return String.fromCodePoint(9424+n);case"bubble-black":return String.fromCodePoint(127312+n);case"square":return String.fromCodePoint(127280+n);case"square-black":return String.fromCodePoint(127344+n)}}if(o>=48&&o<=57){const n=o-48;switch(e){case"sans-bold":case"sans-bold-italic":return String.fromCodePoint(120812+n);case"serif-bold":return String.fromCodePoint(120782+n);case"monospace":return String.fromCodePoint(120822+n);case"double-struck":return String.fromCodePoint(120792+n);case"bubble":return n===0?"⓪":String.fromCodePoint(9312+(n-1));case"bubble-black":return n===0?"⓿":String.fromCodePoint(10122+(n-1));default:return t}}return t}function Ft(t){if(jt[t])return jt[t];const e=t.codePointAt(0);return e?e===8462?"h":e===8492?"B":e===8496?"E":e===8497?"F":e===8459?"H":e===8464?"I":e===8466?"L":e===8499?"M":e===8475?"R":e===8495?"e":e===8458?"g":e===8500?"o":e===8493?"C":e===8460?"H":e===8465?"I":e===8476?"R":e===8488?"Z":e===8450?"C":e===8461?"H":e===8469?"N":e===8473?"P":e===8474?"Q":e===8477?"R":e===8484?"Z":e>=119808&&e<=119833?String.fromCharCode(65+(e-119808)):e>=119834&&e<=119859?String.fromCharCode(97+(e-119834)):e>=119860&&e<=119885?String.fromCharCode(65+(e-119860)):e>=119886&&e<=119911?String.fromCharCode(97+(e-119886)):e>=119912&&e<=119937?String.fromCharCode(65+(e-119912)):e>=119938&&e<=119963?String.fromCharCode(97+(e-119938)):e>=119964&&e<=119989?String.fromCharCode(65+(e-119964)):e>=119990&&e<=120015?String.fromCharCode(97+(e-119990)):e>=120016&&e<=120041?String.fromCharCode(65+(e-120016)):e>=120042&&e<=120067?String.fromCharCode(97+(e-120042)):e>=120068&&e<=120093?String.fromCharCode(65+(e-120068)):e>=120094&&e<=120119?String.fromCharCode(97+(e-120094)):e>=120172&&e<=120197?String.fromCharCode(65+(e-120172)):e>=120198&&e<=120223?String.fromCharCode(97+(e-120198)):e>=120120&&e<=120145?String.fromCharCode(65+(e-120120)):e>=120146&&e<=120171?String.fromCharCode(97+(e-120146)):e>=120276&&e<=120301?String.fromCharCode(65+(e-120276)):e>=120302&&e<=120327?String.fromCharCode(97+(e-120302)):e>=120328&&e<=120353?String.fromCharCode(65+(e-120328)):e>=120354&&e<=120379?String.fromCharCode(97+(e-120354)):e>=120380&&e<=120405?String.fromCharCode(65+(e-120380)):e>=120406&&e<=120431?String.fromCharCode(97+(e-120406)):e>=120432&&e<=120457?String.fromCharCode(65+(e-120432)):e>=120458&&e<=120483?String.fromCharCode(97+(e-120458)):e>=9398&&e<=9423?String.fromCharCode(65+(e-9398)):e>=9424&&e<=9449?String.fromCharCode(97+(e-9424)):e>=127312&&e<=127337?String.fromCharCode(65+(e-127312)):e>=127280&&e<=127305?String.fromCharCode(65+(e-127280)):e>=127344&&e<=127369?String.fromCharCode(65+(e-127344)):e>=120782&&e<=120791?String.fromCharCode(48+(e-120782)):e>=120792&&e<=120801?String.fromCharCode(48+(e-120792)):e>=120812&&e<=120821?String.fromCharCode(48+(e-120812)):e>=120822&&e<=120831?String.fromCharCode(48+(e-120822)):e===9450?"0":e>=9312&&e<=9320?String.fromCharCode(49+(e-9312)):e===9471?"0":e>=10122&&e<=10130?String.fromCharCode(49+(e-10122)):t:t}function $e(t){if(!t)return"";const e=t.replace(/[\u0336\u0335\u0332]/g,"");let o="";for(const n of e)o+=Ft(n);return o}function le(t,e){if(!t)return"";if(e==="normal")return $e(t);if(e==="strikethrough")return t.replace(/[\u0336\u0335]/g,"").split("").map(i=>i===`
`||i==="\r"||i===" "?i:i+"̶").join("");if(e==="underline")return t.replace(/\u0332/g,"").split("").map(i=>i===`
`||i==="\r"||i===" "?i:i+"̲").join("");if(e==="uppercase")return $e(t).toUpperCase();if(e==="lowercase")return $e(t).toLowerCase();if(e==="titlecase")return $e(t).replace(/\b\w+/g,i=>i.charAt(0).toUpperCase()+i.slice(1).toLowerCase());let o="";const n=$e(t);for(const r of n)o+=Po(r,e);return o}function Io(t){return zt(t,"bullet")}function zt(t,e){const o=r=>{switch(e){case"bullet":return"  • ";case"check":return"  ✓ ";case"arrow":return"  ➤ ";case"star":return"  ★ ";case"diamond":return"  ❖ ";case"number":return`  ${r+1}. `}};return t?t.split(`
`).map((r,i)=>{const a=r.trim();if(!a)return r;const s=a.replace(/^([•*\-–—✓✔➤➔★⭐◆❖]|\d+[\.\)])\s*/,"");return o(i)+s}).join(`
`):o(0)}function rt(t,e=1){const o=e===1?"# ":"## ";return!t||!t.trim()?o:t.split(`
`).map(r=>{const i=r.trim();return i?i.startsWith("## ")?e===1?"# "+i.slice(3):i:i.startsWith("# ")?e===2?"## "+i.slice(2):i:o+i:r}).join(`
`)}function _o(t){if(!t)return"****";const e=t.trim();return e.startsWith("**")&&e.endsWith("**")&&e.length>=4?e.slice(2,-2):`**${t}**`}function Lo(t){if(!t)return"**";const e=t.trim();return e.startsWith("*")&&e.endsWith("*")&&e.length>=2&&!e.startsWith("**")?e.slice(1,-1):`*${t}*`}function To(t){return!t||!t.trim()?"  1. ":zt(t,"number")}function $o(t){return!t||!t.trim()?"> ":t.split(`
`).map(o=>{const n=o.trim();return n?n.startsWith("> ")?n:`> ${n}`:o}).join(`
`)}function Go(t){if(!t||!t.trim())return t;const o=$e(t).split(`
`),n=[];let r=!1;for(let i=0;i<o.length;i++){const a=o[i],s=a.trim();if(!s){n.push("");continue}if(!r){r=!0,n.push(le(s,"sans-italic"));continue}if(/^(model|brand|device|item|condition|color|varient|variant)\s*[:=]/i.test(s)){const l=s.match(/^([^:=]+[:=]\s*)(.*)$/);if(l){const u=le(l[1],"sans-italic"),d=l[2];n.push(u+d);continue}}if((/^[•*\-–—✓✔➤➔★⭐◆❖]/.test(s)||/^(ram|rom|storage|storege|camera|battery|display|processor|chipset|condition|screen|charger|box|accessories|sound|sim|dual|official|unofficial|gaming|phone|fast)/i.test(s)||!s.includes(".")&&s.length<40&&!s.toLowerCase().includes("exchange")&&!s.toLowerCase().includes("price"))&&!s.toLowerCase().includes("exchange")&&!s.toLowerCase().includes("inbox")){const l=s.replace(/^[•*\-–—✓✔➤➔★⭐◆❖\s]+/,"");n.push("  • "+l);continue}if(s.toLowerCase().includes("exchange")||s.toLowerCase().includes("price")||s.toLowerCase().includes("inbox")||s.toLowerCase().includes("call")||s.toLowerCase().includes("contact")||s.toLowerCase().includes("location")){n.push(le(s,"sans-italic"));continue}n.push(a)}return n.join(`
`)}function St(t){if(!t)return"<p><br></p>";const e=t.split(`
`),o=[];let n=!1,r=[],i=!1,a=[],s=!1,c=[];const l=()=>{n&&r.length>0&&(o.push("<ul>"+r.map(p=>`<li>${p}</li>`).join("")+"</ul>"),r=[],n=!1)},u=()=>{i&&a.length>0&&(o.push("<ol>"+a.map(p=>`<li>${p}</li>`).join("")+"</ol>"),a=[],i=!1)},d=()=>{s&&c.length>0&&(o.push("<blockquote>"+c.map(p=>`<p>${p}</p>`).join("")+"</blockquote>"),c=[],s=!1)},b=()=>{l(),u(),d()};for(let p=0;p<e.length;p++){const g=e[p],f=g.trim();if(!f){b(),o.push("<p><br></p>");continue}const A=f.match(/^<h1\b[^>]*>(.*?)<\/h1>$/i)||f.match(/^#\s+(.+)$/)||f.match(/^h1:\s*(.+)$/i);if(A){b(),o.push(`<h1>${Ge(A[1])}</h1>`);continue}const E=f.match(/^<h[23]\b[^>]*>(.*?)<\/h[23]>$/i)||f.match(/^##\s+(.+)$/)||f.match(/^###\s+(.+)$/)||f.match(/^h[23]:\s*(.+)$/i);if(E){b(),o.push(`<h2>${Ge(E[1])}</h2>`);continue}const N=f.match(/^<blockquote\b[^>]*>(.*?)<\/blockquote>$/i)||f.match(/^>\s*(.+)$/)||f.match(/^[❝❞]\s*(.+?)[❝❞]?$/);if(N){l(),u(),s=!0,c.push(Ge(N[1]));continue}const I=f.match(/^(\d+)[\.\)]\s+(.*)$/);if(I){l(),d(),i=!0,a.push(Ge(I[2]));continue}const z=f.match(/^<li\b[^>]*>(.*?)<\/li>$/i)||f.match(/^[•✓✔➤➔★⭐◆❖]\s*(.*)$/)||f.match(/^[\-*–—]\s+(.*)$/);if(z){u(),d(),n=!0,r.push(Ge(z[1]));continue}b(),o.push(`<p>${Ge(g)}</p>`)}return b(),o.join("")}function Ge(t){if(!t)return"";let e=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");return e=e.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em style="font-style: italic;">$1</em></strong>'),e=e.replace(/___(.+?)___/g,'<strong><em style="font-style: italic;">$1</em></strong>'),e=e.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),e=e.replace(/__(.+?)__/g,"<strong>$1</strong>"),e=e.replace(/\*([^*\n]+?)\*/g,'<em style="font-style: italic;">$1</em>'),e=e.replace(/_([^_\n]+?)_/g,'<em style="font-style: italic;">$1</em>'),e=e.replace(/~~(.+?)~~/g,"<s>$1</s>"),e=e.replace(/`([^`\n]+?)`/g,"<code>$1</code>"),e=e.replace(/&lt;(\/?)strong&gt;/gi,"<$1strong>").replace(/&lt;(\/?)b&gt;/gi,"<$1strong>").replace(/&lt;(\/?)em&gt;/gi,"<$1em>").replace(/&lt;(\/?)i&gt;/gi,"<$1em>").replace(/&lt;(\/?)s&gt;/gi,"<$1s>").replace(/&lt;(\/?)del&gt;/gi,"<$1s>").replace(/&lt;(\/?)u&gt;/gi,"<$1u>").replace(/&lt;(\/?)code&gt;/gi,"<$1code>").replace(/&lt;br\s*\/?&gt;/gi,"<br>"),e}function Mo(t,e){if(!t||!t.trim())return"";const o=/<(h[1-6]|blockquote|ol)[\s>]/i.test(t)||/data-lexical/i.test(t)||/[\u0980-\u09FF]/.test(t)||(e==null?void 0:e.mode)==="markdown";if(typeof DOMParser<"u")try{const i=new DOMParser().parseFromString(t,"text/html");if(i&&i.body){if(!o&&(e==null?void 0:e.mode)!=="markdown"){i.querySelectorAll('i, em, span[style*="italic"]').forEach(u=>{const d=u.textContent||"";d.trim()&&(u.textContent=le(d,"sans-italic"))}),i.querySelectorAll('b, strong, span[style*="bold"], span[style*="700"]').forEach(u=>{const d=u.textContent||"";d.trim()&&(u.textContent=le(d,"sans-bold"))}),i.querySelectorAll('s, strike, del, span[style*="line-through"]').forEach(u=>{const d=u.textContent||"";d.trim()&&(u.textContent=le(d,"strikethrough"))}),i.querySelectorAll('u, ins, span[style*="underline"]').forEach(u=>{const d=u.textContent||"";d.trim()&&(u.textContent=le(d,"underline"))}),i.querySelectorAll("li").forEach(u=>{const d=(u.textContent||"").trim();u.textContent="  • "+d+`
`}),i.querySelectorAll("br").forEach(u=>u.replaceWith(`
`)),i.querySelectorAll("p, div").forEach(u=>{u.appendChild(document.createTextNode(`
`))});const l=(i.body.textContent||"").trim();if(l.length>0)return l.replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).trim()}const a=l=>{if(l.nodeType===Node.TEXT_NODE)return l.textContent||"";if(l.nodeType!==Node.ELEMENT_NODE)return"";const u=l,d=u.tagName.toLowerCase();if(d==="br")return`
`;let b="";u.childNodes.forEach(E=>{b+=a(E)});const p=(u.getAttribute("style")||"").toLowerCase(),g=d==="strong"||d==="b"||p.includes("font-weight: bold")||p.includes("font-weight:bold")||p.includes("font-weight: 700")||p.includes("font-weight:700")||p.includes("font-weight: 800")||p.includes("font-weight: 900"),f=d==="em"||d==="i"||p.includes("font-style: italic")||p.includes("font-style:italic"),m=d==="s"||d==="strike"||d==="del"||p.includes("line-through"),A=d==="u"||d==="ins"||p.includes("underline");if(!b.trim())return b;let y=b;if(g){const E=y.trim();(!E.startsWith("**")||!E.endsWith("**"))&&(y=`**${E}**`)}if(f){const E=y.trim();(!E.startsWith("*")||!E.endsWith("*"))&&(y=`*${E}*`)}if(m){const E=y.trim();(!E.startsWith("~~")||!E.endsWith("~~"))&&(y=`~~${E}~~`)}return A&&(y=`<u>${y.trim()}</u>`),d==="code"&&(y=`\`${y.trim()}\``),y},s=[],c=l=>{if(l.nodeType===Node.TEXT_NODE){const b=(l.textContent||"").trim();b&&s.push(b);return}if(l.nodeType!==Node.ELEMENT_NODE)return;const u=l,d=u.tagName.toLowerCase();if(d==="h1"){const b=a(u).trim();b&&s.push(`# ${b}`);return}if(d==="h2"){const b=a(u).trim();b&&s.push(`## ${b}`);return}if(d==="h3"||d==="h4"||d==="h5"||d==="h6"){const b=a(u).trim();b&&s.push(`## ${b}`);return}if(d==="blockquote"){const b=a(u).trim();b&&b.split(`
`).forEach(p=>{const g=p.trim();g&&s.push(`> ${g}`)});return}if(d==="ul"){Array.from(u.querySelectorAll(":scope > li, li")).forEach(p=>{const g=a(p).trim();g&&s.push(`  • ${g}`)});return}if(d==="ol"){Array.from(u.querySelectorAll(":scope > li, li")).forEach((p,g)=>{const f=a(p).trim();f&&s.push(`  ${g+1}. ${f}`)});return}if(d==="p"||d==="div"){if(Array.from(u.children).some(g=>/^(h[1-6]|p|div|ul|ol|blockquote)$/i.test(g.tagName))){u.childNodes.forEach(g=>c(g));return}const p=a(u).trim();p?s.push(p):(u.querySelector("br")||u.innerHTML.includes("<br>"))&&s.push("");return}u.childNodes.forEach(b=>c(b))};if(i.body.childNodes.forEach(l=>c(l)),s.length>0)return s.join(`
`)}}catch{}let n=t;return n=n.replace(/<h1\b[^>]*>(.*?)<\/h1>/gi,(r,i)=>`# ${i.trim()}

`),n=n.replace(/<h2\b[^>]*>(.*?)<\/h2>/gi,(r,i)=>`## ${i.trim()}

`),n=n.replace(/<h3\b[^>]*>(.*?)<\/h3>/gi,(r,i)=>`## ${i.trim()}

`),n=n.replace(/<blockquote\b[^>]*>(.*?)<\/blockquote>/gi,(r,i)=>`> ${i.trim()}

`),n=n.replace(/<li\b[^>]*>(.*?)<\/li>/gi,(r,i)=>`  • ${i.trim()}
`),o?(n=n.replace(/<(b|strong)\b[^>]*>(.*?)<\/\1>/gi,(r,i,a)=>`**${a.trim()}**`),n=n.replace(/<(i|em)\b[^>]*>(.*?)<\/\1>/gi,(r,i,a)=>`*${a.trim()}*`)):(n=n.replace(/<(i|em)\b[^>]*>(.*?)<\/\1>/gi,(r,i,a)=>le(a,"sans-italic")),n=n.replace(/<(b|strong)\b[^>]*>(.*?)<\/\1>/gi,(r,i,a)=>le(a,"sans-bold"))),n=n.replace(/<(s|del|strike)\b[^>]*>(.*?)<\/\1>/gi,(r,i,a)=>`~~${a.trim()}~~`),n=n.replace(/<(u|ins)\b[^>]*>(.*?)<\/\1>/gi,(r,i,a)=>`<u>${a.trim()}</u>`),n=n.replace(/<br\s*\/?>/gi,`
`),n=n.replace(/<\/(p|div)>/gi,`
`),n=n.replace(/<[^>]+>/g,""),n.replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).trim()}const No=[{name:"Double Line (সমান লাইন)",value:"══════════════════════════════"},{name:"Thick Line (মোটা লাইন)",value:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"},{name:"Thin Line (চিকন লাইন)",value:"──────────────────────────────"},{name:"Star Sparkle (তারকা বর্ডার)",value:"•┈┈┈••✦••┈┈┈••✦••┈┈┈••✦••┈┈┈•"},{name:"Flower Border (ফুলের বর্ডার)",value:"✿════════════════════════════✿"},{name:"Block Blocks (বক্স প্যাটার্ন)",value:"▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄"},{name:"Dashed Dots (ডট লাইন)",value:"┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈"},{name:"Double Arrow Star (স্টার অ্যারো)",value:"»»————-　★　————-««"}],Jt=[{id:"price-cut",name:"Price Cut (ডিসকাউন্ট মূল্য)",icon:"💰",content:"💰 Regular Price: ̶২̶,̶৫̶০̶০̶ ৳  ➔  Offer Price: {price}"},{id:"cod-delivery",name:"Cash on Delivery (ক্যাশ অন ডেলিভারি)",icon:"🚚",content:"🚚 সারা বাংলাদেশে ক্যাশ অন হোম ডেলিভারি (প্রোডাক্ট দেখে পেমেন্ট করার সুবিধা)!"},{id:"location",name:"Location (ঠিকানা / লোকেশন)",icon:"📍",content:"📍 Location: {location}"},{id:"contact-whatsapp",name:"Phone / WhatsApp (কল ও হোয়াটসঅ্যাপ)",icon:"📞",content:"📞 Call / WhatsApp: {contact_info}"},{id:"condition-fresh",name:"100% Fresh Condition (কন্ডিশন)",icon:"⚡",content:"⚡ Condition: ১০০% ফুল ফ্রেশ, কোনো স্ক্র্যাচ বা সমস্যা নেই।"},{id:"warranty",name:"Warranty / Replacement (ওয়ারেন্টি)",icon:"🎁",content:"🎁 ৭ দিনের রিপ্লেসমেন্ট এবং ১ বছরের ফ্রি সার্ভিস ওয়ারেন্টি!"},{id:"urgency-stock",name:"Limited Stock (সীমিত স্টক সতর্কতা)",icon:"🚨",content:"🚨 Limited Stock Available! অফার শেষ হওয়ার আগেই দ্রুত অর্ডার করুন!"},{id:"inbox-cta",name:"Inbox CTA (ইনবক্স আহ্বান)",icon:"💬",content:"👉 অর্ডার করতে অথবা যেকোনো তথ্যের জন্য এখনই ইনবক্স করুন!"},{id:"exchange-offer",name:"Exchange Offer (এক্সচেঞ্জ অফার)",icon:"🔄",content:"🔄 যেকোনো ব্যবহৃত ফোন/ডিভাইসের সাথে এক্সচেঞ্জ পসিবল (শর্ত প্রযোজ্য)।"}];function Bo(t){if(!t||typeof t!="string")return t||"";const e=t.trim();if(e.length<30)return t;const o=e.length,n=Math.floor(o/2);for(let i=-15;i<=15;i++){const a=n+i;if(a>15&&a<o-15){const s=e.slice(0,a).trim(),c=e.slice(a).trim();if(s.length>=15&&s===c)return s}}const r=e.split(`
`).filter(i=>i.trim().length>0);if(r.length>=4){const i=Math.floor(r.length/2),a=r.slice(0,i).join(`
`).trim(),s=r.slice(i).join(`
`).trim();if(a.length>=25&&a===s)return a}return t}function Wt(t){try{const o=new URL(t.startsWith("http")?t:`https://${t}`).searchParams.get("q");return o?decodeURIComponent(o.replace(/\+/g," ")):""}catch{return""}}function Oo(){if(typeof window>"u")return!1;const t=window.location.href.toLowerCase();return(t.includes("facebook.com")||t.includes("fb.com"))&&t.includes("/search")}function it(t){var c;if(!t)return!1;const e=t.tagName.toLowerCase(),o=t.getAttribute("role")||"",n=e==="button"||o==="button"||e==="a"||t.getAttribute("tabindex")!==null,r=(t.innerText||t.textContent||"").trim().toLowerCase(),i=(t.getAttribute("aria-label")||"").trim().toLowerCase(),a=(((c=t.querySelector("[aria-label]"))==null?void 0:c.getAttribute("aria-label"))||"").trim().toLowerCase(),s=`${r} | ${i} | ${a}`.toLowerCase();return s.includes("joined")||s.includes("view group")||s.includes("edit membership")||s.includes("যোগ দিয়েছেন")||s.includes("যুক্ত হয়েছেন")||s.includes("গ্রুপ দেখুন")||s.includes("requested")||s.includes("pending")||s.includes("cancel request")||s.includes("অনুরোধ পাঠানো")||s.includes("অনুরোধ করা হয়েছে")||s.includes("share")||s.includes("শেয়ার")||s.includes("message")||s.includes("মেসেজ")||s.includes("close")||s.includes("menu")||s.includes("search")||s.includes("notifications")?!1:!!(r==="join"||r==="join group"||r==="+ join"||r==="+ join group"||r==="request to join"||r==="answer questions"||r==="যোগ দিন"||r==="+ যোগ দিন"||r==="গ্রুপে যোগ দিন"||r==="যুক্ত হোন"||r==="+ যুক্ত হোন"||r==="গ্রুপে যুক্ত হোন"||r==="যোগ দেওয়ার অনুরোধ"||r==="যোগ দেয়ার অনুরোধ"||i==="join"||i==="join group"||i.includes("join group")||i.includes("request to join")||i.includes("যোগ দিন")||i.includes("যুক্ত হোন")||i.includes("অনুরোধ")||n&&(r.startsWith("join ")||r.endsWith(" join")||r.includes("join group")||r.includes("যোগ দিন")||r.includes("যুক্ত হোন")||r.includes("join")&&r.length<=16))}function st(t){if(!t)return!1;const e=(t.innerText||t.textContent||"").trim().toLowerCase(),o=(t.getAttribute("aria-label")||"").trim().toLowerCase(),n=`${e} ${o}`.toLowerCase();return n.includes("joined")||n.includes("view group")||n.includes("edit membership")||n.includes("যোগ দিয়েছেন")||n.includes("যুক্ত হয়েছেন")||n.includes("গ্রুপ দেখুন")}function at(t){if(!t)return!1;const e=(t.innerText||t.textContent||"").trim().toLowerCase(),o=(t.getAttribute("aria-label")||"").trim().toLowerCase(),n=`${e} ${o}`.toLowerCase();return n.includes("requested")||n.includes("pending")||n.includes("cancel request")||n.includes("অনুরোধ পাঠানো")||n.includes("অনুরোধ করা হয়েছে")}function we(t){if(!t||typeof t!="string"||t.includes("/permalink/")||t.includes("/posts/")||t.includes("/photos/")||t.includes("/videos/")||t.includes("/user/")||t.includes("comment_id=")||t.includes("notif_id="))return null;const e=t.match(/(?:facebook\.com|fb\.com)?\/groups\/([^/?#]+)/i);if(!e||!e[1])return null;try{const o=decodeURIComponent(e[1]).trim().toLowerCase();return!o||mt.has(o)?null:o}catch{const o=e[1].trim().toLowerCase();return!o||mt.has(o)?null:o}}function At(t,e,o){let n="";const r=t.querySelector('span[dir="auto"], strong, h1, h2, h3, h4');if(r&&r.textContent&&r.textContent.trim().length>=2&&(n=r.textContent.trim()),!n){const a=(t.getAttribute("aria-label")||"").trim();a&&a.length>=2&&!a.toLowerCase().includes("view group")&&!a.toLowerCase().includes("গ্রুপ দেখুন")&&(n=a)}if(!n&&t.textContent&&(n=t.textContent.trim()),!n||n.length<2){const a=e.querySelector('h1, h2, h3, h4, [role="heading"], strong');n=((a==null?void 0:a.textContent)||"").trim()}n=n.split(`
`)[0].trim();const i=n.toLowerCase();return(i==="join"||i==="যোগ দিন"||i==="view group"||i==="গ্রুপ দেখুন"||i==="visit"||i==="joined")&&(n=""),(!n||n.length<2)&&(n=o.split(/[-_.]+/).map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join(" ")),n}function kt(t){const e=(t.innerText||t.textContent||"").toLowerCase();return e.includes("public")||e.includes("পাবলিক")?"PUBLIC":e.includes("private")||e.includes("প্রাইভেট")?"PRIVATE":"UNKNOWN"}function Ct(t){const e=(t.innerText||"").split(`
`).map(o=>o.trim()).filter(Boolean);for(const o of e){const n=o.toLowerCase();if((n.includes("member")||n.includes("সদস্য")||n.includes("post")||n.includes("পোস্ট"))&&(n.includes("public")||n.includes("private")||n.includes("পাবলিক")||n.includes("প্রাইভেট")||/\d/.test(o)))return o}return""}function Me(){if(typeof document>"u")return[];const t=[],e=new Set,o=Array.from(document.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"], [aria-label*="Join" i], [aria-label*="যোগ" i], [aria-label*="যুক্ত" i]'));for(const i of o){if(!it(i))continue;let a=i.parentElement,s=null,c=null;for(let g=0;g<25&&a&&a!==document.body;g++){const f=Array.from(a.querySelectorAll('a[href*="/groups/"]')).filter(m=>{const A=m.href||m.getAttribute("href")||"";return!!we(A)});if(f.length>0){const m=new Set(f.map(A=>we(A.href||A.getAttribute("href")||"")).filter(Boolean));if(m.size===1)s=f[0],c=a;else if(m.size>1)break}a=a.parentElement}if(!s)continue;const l=we(s.href||s.getAttribute("href")||"");if(!l||e.has(l))continue;e.add(l);const u=c||i.closest('div[role="feed"] > div')||i.parentElement||i,d=At(s,u,l),b=kt(u),p=Ct(u);t.push({cardElement:u,item:{id:l,groupId:l,name:d,url:`https://www.facebook.com/groups/${encodeURIComponent(l)}/`,privacy:b,membersText:p||void 0,status:"READY_TO_JOIN"},joinButton:i})}const n=Array.from(document.querySelectorAll('a[href*="/groups/"]'));for(const i of n){const a=we(i.href||i.getAttribute("href")||"");if(!a||e.has(a))continue;let s=i.parentElement,c=null,l=null,u="READY_TO_JOIN";for(let g=0;g<25&&s&&s!==document.body;g++){const f=Array.from(s.querySelectorAll('a[href*="/groups/"]')).filter(y=>{const E=y.href||y.getAttribute("href")||"";return!!we(E)});if(new Set(f.map(y=>we(y.href||y.getAttribute("href")||"")).filter(Boolean)).size>1)break;c=s;const A=Array.from(s.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"], [aria-label]'));for(const y of A){if(st(y)){u="ALREADY_JOINED",l=null;break}if(at(y)){u="REQUESTED",l=null;break}if(it(y)){u="READY_TO_JOIN",l=y;break}}if(l||u!=="READY_TO_JOIN")break;s=s.parentElement}if(c||(c=i.closest('div[role="feed"] > div')||i.closest('div[role="article"]')||i.parentElement||i),u==="READY_TO_JOIN"&&!l&&c){const g=Array.from(c.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const f of g)if(!st(f)&&!at(f)){const m=(f.innerText||f.textContent||f.getAttribute("aria-label")||"").trim().toLowerCase();if(m&&!m.includes("more")&&!m.includes("menu")&&!m.includes("share")&&!m.includes("close")){l=f;break}}}e.add(a);const d=At(i,c,a),b=kt(c),p=Ct(c);t.push({cardElement:c,item:{id:a,groupId:a,name:d,url:`https://www.facebook.com/groups/${encodeURIComponent(a)}/`,privacy:b,membersText:p||void 0,status:u},joinButton:l})}const r=Array.from(document.querySelectorAll('div[role="feed"] > div, div[role="main"] div[role="article"], div[data-pagelet*="GroupSearchResult"]'));for(const i of r){const a=Array.from(i.querySelectorAll('a[href*="/groups/"]')).filter(m=>!!we(m.href||m.getAttribute("href")||""));if(a.length===0)continue;const s=Array.from(new Set(a.map(m=>we(m.href||m.getAttribute("href")||"")).filter(Boolean)));if(s.length!==1)continue;const c=s[0];if(e.has(c))continue;e.add(c);const l=a[0],u=At(l,i,c),d=kt(i),b=Ct(i);let p=null,g="READY_TO_JOIN";const f=Array.from(i.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const m of f){if(st(m)){g="ALREADY_JOINED";break}if(at(m)){g="REQUESTED";break}if(it(m)){g="READY_TO_JOIN",p=m;break}}t.push({cardElement:i,item:{id:c,groupId:c,name:u,url:`https://www.facebook.com/groups/${encodeURIComponent(c)}/`,privacy:d,membersText:b||void 0,status:g},joinButton:p})}return t}function ze(t){if(!t)return;try{t.scrollIntoView({behavior:"auto",block:"center"})}catch{}t.focus();const e=t.closest('div[role="button"], button, a[role="button"]')||t;e.focus();const o={bubbles:!0,cancelable:!0,view:window};if(e.dispatchEvent(new PointerEvent("pointerdown",o)),e.dispatchEvent(new MouseEvent("mousedown",o)),e.dispatchEvent(new PointerEvent("pointerup",o)),e.dispatchEvent(new MouseEvent("mouseup",o)),e.click(),e!==t)try{t.dispatchEvent(new MouseEvent("click",o)),t.click()}catch{}}async function Do(t){let e=document.querySelector('div[role="dialog"]');if((!e||e.offsetParent===null&&e.getBoundingClientRect().height<=50)&&(await new Promise(s=>setTimeout(s,30)),e=document.querySelector('div[role="dialog"]')),!e||e.offsetParent===null&&e.getBoundingClientRect().height<=50)return!1;console.log("[AGP:AutoJoiner] Membership questions modal detected. Fast auto-answering...");const o=Array.from(e.querySelectorAll('input[type="checkbox"], div[role="checkbox"]'));for(const s of o)(s instanceof HTMLInputElement?s.checked:s.getAttribute("aria-checked")==="true")||ze(s);const n=Array.from(e.querySelectorAll('input[type="radio"], div[role="radio"]'));n.length>0&&(n.some(c=>c instanceof HTMLInputElement?c.checked:c.getAttribute("aria-checked")==="true")||ze(n[0]));const r=Array.from(e.querySelectorAll('textarea, input[type="text"]'));for(const s of r)(!s.value||s.value.trim()==="")&&(s.focus(),s.value=t||"Yes, I agree to the group rules and guidelines.",s.dispatchEvent(new Event("input",{bubbles:!0})),s.dispatchEvent(new Event("change",{bubbles:!0})));const i=Array.from(e.querySelectorAll('button, div[role="button"]'));for(const s of i){const c=(s.innerText||s.textContent||s.getAttribute("aria-label")||"").trim().toLowerCase();if(c==="submit"||c==="জমা দিন"||c==="send"||c==="confirm"||c==="next"||c==="পরবর্তী"||c==="done"||c==="অনুরোধ পাঠান"||c.includes("submit")||c.includes("জমা")){ze(s),await new Promise(l=>setTimeout(l,15));break}}const a=document.querySelector('div[role="dialog"]');if(a){const s=Array.from(a.querySelectorAll('button, div[role="button"]'));for(const c of s){const l=(c.innerText||c.textContent||c.getAttribute("aria-label")||"").trim().toLowerCase();if(l==="submit"||l==="জমা দিন"||l==="done"||l.includes("submit")){ze(c),await new Promise(u=>setTimeout(u,15));break}}}return!0}const Ie=class Ie{constructor(){Se(this,"state",{...Ot});Se(this,"config",{searchUrl:"",delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0});Se(this,"isRunning",!1);Se(this,"isPaused",!1);Se(this,"shouldStop",!1);Se(this,"onProgressCallbacks",[])}static getInstance(){return Ie.instance||(Ie.instance=new Ie),Ie.instance}subscribe(e){this.onProgressCallbacks.push(e)}getState(){return{...this.state}}broadcastState(){var e;for(const o of this.onProgressCallbacks)try{o(this.state)}catch{}try{typeof chrome<"u"&&((e=chrome.runtime)!=null&&e.sendMessage)&&chrome.runtime.sendMessage({type:"AUTO_JOIN_PROGRESS",payload:this.state})}catch{}}pause(){this.isRunning&&!this.isPaused&&(this.isPaused=!0,this.state.status="PAUSED",this.state.message="Auto-Join paused by user.",this.broadcastState())}resume(){this.isRunning&&this.isPaused&&(this.isPaused=!1,this.state.status="JOINING",this.state.message="Resuming group auto-joining...",this.broadcastState())}stop(){this.shouldStop=!0,this.isRunning=!1,this.isPaused=!1,this.state.status="STOPPED",this.state.message="Auto-Join stopped by user.",this.broadcastState()}async start(e){if(this.isRunning)return console.warn("[AGP:AutoJoiner] Already running."),this.state;this.config={...this.config,...e,delaySec:typeof e.delaySec=="number"?e.delaySec:0},this.isRunning=!0,this.isPaused=!1,this.shouldStop=!1;const o=Wt(window.location.href);this.state={...Ot,status:"SEARCHING",searchUrl:window.location.href,query:o,message:`Scanning Facebook group search results for "${o}"...`,startedAt:Date.now()},this.broadcastState();try{let n=0;const r=new Set;for(;!this.shouldStop;){for(;this.isPaused&&!this.shouldStop;)await new Promise(s=>setTimeout(s,500));if(this.shouldStop)break;const i=Me();if(this.state.groups=i.map(s=>s.item),this.state.totalFound=i.length,this.state.alreadyJoinedCount=i.filter(s=>s.item.status==="ALREADY_JOINED").length,this.state.requestedCount=i.filter(s=>s.item.status==="REQUESTED").length,this.state.joinedCount=i.filter(s=>s.item.status==="JOINED").length,this.config.saveToGroups)for(const s of i)s.item.status==="ALREADY_JOINED"&&!r.has(s.item.groupId)&&(r.add(s.item.groupId),await this.saveGroupToDatabase(s.item));const a=i.find(s=>s.item.status==="READY_TO_JOIN"&&!r.has(s.item.groupId));if(a){n=0;const{cardElement:s,item:c}=a;let l=a.joinButton;if(!l&&s){const u=Array.from(s.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const d of u)if(it(d)){l=d;break}if(!l){for(const d of u)if(!st(d)&&!at(d)){const b=(d.innerText||d.textContent||d.getAttribute("aria-label")||"").toLowerCase();if(!b.includes("more")&&!b.includes("menu")&&!b.includes("share")&&!b.includes("close")){l=d;break}}}}if(r.add(c.groupId),this.config.maxGroups>0&&this.state.joinedCount+this.state.requestedCount>=this.config.maxGroups){this.state.message=`Reached target limit of ${this.config.maxGroups} groups.`;break}if(l){this.state.status="JOINING",this.state.currentGroupName=c.name,c.status="JOINING",this.state.message=`Joining: "${c.name}"...`,this.broadcastState();try{s.scrollIntoView({behavior:"auto",block:"nearest"}),s.style.outline="3px solid #10b981",s.style.boxShadow="0 0 15px rgba(16, 185, 129, 0.45)",s.style.borderRadius="8px"}catch{}try{console.log(`[AGP:AutoJoiner] Triggering instant click on Join button for: "${c.name}"`),ze(l),this.config.autoAnswerQuestions&&await Do(this.config.defaultAnswer),c.status="JOINED",c.joinedAt=Date.now(),this.state.joinedCount++,this.config.saveToGroups&&await this.saveGroupToDatabase(c),this.state.message=`Joined "${c.name}" (${c.status})`,this.broadcastState()}catch(d){console.error("[AGP:AutoJoiner] Join error on",c.name,d),c.status="FAILED",c.error=String(d),this.state.failedCount++,this.broadcastState()}finally{try{s.style.outline="2px solid rgba(16, 185, 129, 0.35)",s.style.boxShadow="none"}catch{}}const u=typeof this.config.delaySec=="number"?this.config.delaySec:0;if(u<=0)this.state.countdownSec=0,await new Promise(d=>setTimeout(d,30));else{for(let d=u;d>0&&!this.shouldStop;d--){for(;this.isPaused&&!this.shouldStop;)await new Promise(b=>setTimeout(b,200));if(this.shouldStop)break;this.state.countdownSec=d,this.state.message=`Waiting ${d}s before next group...`,this.broadcastState(),await new Promise(b=>setTimeout(b,1e3))}this.state.countdownSec=0}}}else{this.state.message="Loading more Facebook groups on this page...",this.broadcastState();const s=document.body.scrollHeight;if(window.scrollBy({top:1800,behavior:"auto"}),window.dispatchEvent(new Event("scroll",{bubbles:!0})),await new Promise(u=>setTimeout(u,120)),!Me().some(u=>u.item.status==="READY_TO_JOIN"&&!r.has(u.item.groupId))&&document.body.scrollHeight===s){if(n++,n>=3)break}else n=0}}this.shouldStop||(this.state.status="COMPLETED",this.state.message=`Auto-join complete! Joined ${this.state.joinedCount} groups, requested ${this.state.requestedCount} groups.`)}catch(n){console.error("[AGP:AutoJoiner] Execution error:",n),this.state.status="ERROR",this.state.message=`Error: ${(n==null?void 0:n.message)||String(n)}`}finally{this.isRunning=!1,this.isPaused=!1,this.state.finishedAt=Date.now(),this.broadcastState()}return this.state}async saveGroupToDatabase(e){var o;try{const n=await vt();if(!n.some(i=>i.groupId&&i.groupId.toLowerCase()===e.groupId.toLowerCase()||i.url&&i.url.toLowerCase().includes(e.groupId.toLowerCase()))){const i={id:yt(),name:e.name,url:e.url,groupId:e.groupId,privacy:e.privacy,category:this.config.selectedCategory||"Auto Joined",enabled:!0,selected:!1,status:"READY",postCount:0,verified:!0,source:"facebook-ui",createdAt:Date.now(),updatedAt:Date.now()};await wt([...n,i]),console.log(`[AGP:AutoJoiner] Saved "${e.name}" (${e.groupId}) to My Facebook Groups database.`);try{typeof chrome<"u"&&((o=chrome.runtime)!=null&&o.sendMessage)&&chrome.runtime.sendMessage({type:"AUTO_JOIN_SAVE_GROUPS",payload:{group:i}})}catch{}}}catch(n){console.warn("[AGP:AutoJoiner] Save to database error:",n)}}};Se(Ie,"instance");let Y=Ie,j=null,h=null,S="",F=[],Je=!1,We=!1,Ve="POST_AND_JOIN",Q=0,fe=0,He=!1,Pt=!1,Vt=!1,v={isRunning:!1,isPaused:!1,status:"IDLE",message:"Ready to auto-join and post to Facebook groups from this search page.",total:0,completed:0,skipped:0,failed:0,currentGroupName:""},ce=null;function lt(t){return!t||typeof t!="string"?!1:t.startsWith("data:video")||t.includes("video/")||t.startsWith("blob:")||/\.(mp4|mov|webm|m4v|mkv|avi)($|\?)/i.test(t)}function Ht(t){return new Promise(e=>{if(t.type.startsWith("video/")||/\.(mp4|mov|webm|m4v|mkv|avi|3gp|flv)$/i.test(t.name)){const r=new FileReader;r.onload=i=>{var s;let a=((s=i.target)==null?void 0:s.result)||"";if(a&&(a.startsWith("data:application/octet-stream")||a.startsWith("data:;base64"))){let c="video/mp4";/\.webm$/i.test(t.name)?c="video/webm":/\.mov$/i.test(t.name)?c="video/quicktime":/\.mkv$/i.test(t.name)&&(c="video/x-matroska"),a=a.replace(/^data:[^;]*;base64/,`data:${c};base64`)}e(a)},r.onerror=()=>e(""),r.readAsDataURL(t);return}const n=new FileReader;n.onload=r=>{var s;const i=((s=r.target)==null?void 0:s.result)||"";if(!i)return e("");const a=new Image;a.onload=()=>{let c=a.width,l=a.height;const u=1280;(c>u||l>u)&&(c>l?(l=Math.round(l*u/c),c=u):(c=Math.round(c*u/l),l=u));const d=document.createElement("canvas");d.width=c,d.height=l;const b=d.getContext("2d");b?(b.drawImage(a,0,0,c,l),e(d.toDataURL("image/jpeg",.82))):e(i)},a.onerror=()=>e(i),a.src=i},n.onerror=()=>e(""),n.readAsDataURL(t)})}async function V(){var t;try{typeof chrome<"u"&&((t=chrome.storage)!=null&&t.local)&&await chrome.storage.local.set({agp_search_poster_caption:S,agp_search_poster_photos:F,agp_search_poster_delay:fe,agp_search_poster_target:Q})}catch(e){console.warn("[AGP:SearchPoster] Failed to save draft to storage:",e)}}async function Uo(){var t;if(!Vt){Vt=!0;try{if(typeof chrome<"u"&&((t=chrome.storage)!=null&&t.local)){const e=await chrome.storage.local.get(["agp_search_poster_caption","agp_search_poster_photos","agp_search_poster_delay","agp_search_poster_target"]);typeof(e==null?void 0:e.agp_search_poster_caption)=="string"&&(S=e.agp_search_poster_caption),Array.isArray(e==null?void 0:e.agp_search_poster_photos)&&(F=e.agp_search_poster_photos),typeof(e==null?void 0:e.agp_search_poster_delay)=="number"?fe=e.agp_search_poster_delay:fe=0,typeof(e==null?void 0:e.agp_search_poster_target)=="number"&&(Q=e.agp_search_poster_target)}}catch(e){console.warn("[AGP:SearchPoster] Failed to load draft from storage:",e)}}}function te(t){if(!h)return;const e=h.getElementById("agp-dock-toast");e&&e.remove();const o=document.createElement("div");o.id="agp-dock-toast",o.textContent=t,o.style.cssText=`
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(15, 23, 42, 0.95);
    border: 1px solid #3b82f6;
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 14px;
    border-radius: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    z-index: 1000;
    pointer-events: none;
    animation: fadeInOut 2.2s forwards;
  `,h.appendChild(o),setTimeout(()=>o.remove(),2200)}function me(t){if(!t||!t.trim())return'<span style="color: #94a3b8; font-style: italic;">পোস্টের কোনো ক্যাপশন লেখা হয়নি। উপরে টুলবার দিয়ে ডিজাইন করুন অথবা টেক্সট পেস্ট করুন...</span>';const e=i=>i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),o=i=>{let a=e(i);return a=a.replace(/\*\*(.+?)\*\*/g,'<strong style="font-weight: 800; color: #ffffff;">$1</strong>'),a=a.replace(/\*([^*\n]+?)\*/g,'<em style="font-style: italic; color: #f1f5f9;">$1</em>'),a=a.replace(/~~(.+?)~~/g,'<s style="color: #94a3b8;">$1</s>'),a=a.replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g,'<u style="text-decoration: underline;">$1</u>'),a=a.replace(/`([^`\n]+?)`/g,'<code style="background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 3px; font-family: monospace;">$1</code>'),a},n=t.split(`
`),r=[];for(let i=0;i<n.length;i++){const a=n[i],s=a.trim();if(!s){r.push('<div style="height: 8px;"></div>');continue}if(s.startsWith("# ")){r.push(`<h1 style="font-size: 15px; font-weight: 800; color: #60a5fa; margin: 4px 0 2px 0; line-height: 1.3;">${o(s.replace(/^#\s*/,""))}</h1>`);continue}if(s.startsWith("## ")||s.startsWith("### ")){r.push(`<h2 style="font-size: 13px; font-weight: 700; color: #93c5fd; margin: 3px 0 2px 0; line-height: 1.3;">${o(s.replace(/^#{2,3}\s*/,""))}</h2>`);continue}if(s.startsWith("> ")||s.startsWith("❝")){const c=s.replace(/^>\s*/,"").replace(/^[❝❞]\s*/,"");r.push(`<blockquote style="border-left: 3px solid #3b82f6; background: rgba(59, 130, 246, 0.12); padding: 4px 8px; margin: 4px 0; border-radius: 0 4px 4px 0; font-size: 11px; color: #e2e8f0;">${o(c)}</blockquote>`);continue}if(/^[•✓✔➤➔★⭐◆❖]/.test(s)||/^[\-*–—]\s+/.test(s)){const c=s.match(/^([•✓✔➤➔★⭐◆❖\-*–—]+)\s*(.*)$/),l=c?c[1]:"•",u=c?c[2]:s;r.push(`<div style="display: flex; align-items: flex-start; gap: 6px; padding-left: 4px; font-size: 11.5px; line-height: 1.4; color: #f1f5f9;"><span style="color: #60a5fa; font-weight: bold; flex-shrink: 0;">${e(l)}</span><span>${o(u)}</span></div>`);continue}if(/^(\d+)[\.\)]\s+/.test(s)){const c=s.match(/^(\d+)[\.\)]\s+(.*)$/),l=c?c[1]:"1",u=c?c[2]:s;r.push(`<div style="display: flex; align-items: flex-start; gap: 6px; padding-left: 4px; font-size: 11.5px; line-height: 1.4; color: #f1f5f9;"><span style="color: #93c5fd; font-weight: bold; flex-shrink: 0;">${e(l)}.</span><span>${o(u)}</span></div>`);continue}r.push(`<div style="font-size: 11.5px; line-height: 1.45; color: #e2e8f0;">${o(a)}</div>`)}return r.join("")}async function It(t){if(typeof document>"u")return;await Uo();const e=Y.getInstance(),o=e.getState();if(!j){j=document.createElement("div"),j.id="agp-auto-joiner-root";const n=window.innerWidth<=640;j.style.cssText=`
      position: fixed;
      bottom: ${n?"10px":"24px"};
      right: ${n?"10px":"24px"};
      ${n?"left: 10px; max-width: calc(100vw - 20px);":""}
      z-index: 2147483646;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    `,h=j.attachShadow({mode:"open"}),document.body.appendChild(j),e.subscribe(r=>{T(r,t)}),jo(t)}T(o,t),qo(t)}let Yt=null,Kt=-1,ct=null;function Ro(t){if(!h)return;const e=t.length,o=h.getElementById("btn-toggle-groups");if(o){const s=o.querySelector("strong");s&&(s.textContent=`${e} Groups`)}const n=h.querySelector('#agp-select-target option[value="0"]');n&&(n.textContent=`All Found (${e})`);const r=h.getElementById("btn-start-campaign");if(r&&!v.isRunning){const s=Q>0?Q:e;r.innerHTML=`<span>🚀</span> Start Join & Post (${s} Groups)`}const i=h.querySelector(".groups-list-box");i&&(t.length>0?i.innerHTML=t.map(s=>`
        <div class="group-row">
          <span style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${s.item.name}">
            ${s.item.name}
          </span>
          <span class="group-badge" style="background: ${s.item.privacy==="PUBLIC"?"rgba(16, 185, 129, 0.2)":"rgba(245, 158, 11, 0.2)"}; color: ${s.item.privacy==="PUBLIC"?"#34d399":"#fbbf24"};">
            ${s.item.privacy}
          </span>
        </div>
      `).join(""):i.innerHTML='<div style="text-align: center; color: #64748b; font-size: 11px; padding: 10px;">Scrolling page to detect group cards...</div>');const a=h.querySelector(".stats-grid .stat-item:first-child .stat-num");a&&(a.textContent=String(e))}function qo(t){if(Yt)return;const e=()=>{var r;if(v.isRunning)return;const n=Me();if(n.length!==Kt&&(Kt=n.length,Ro(n),!(((r=h==null?void 0:h.activeElement)==null?void 0:r.id)==="agp-caption-input")&&!He)){const a=Y.getInstance();T(a.getState(),t)}};Yt=setInterval(e,1200),setTimeout(e,300),setTimeout(e,800),setTimeout(e,1600),setTimeout(e,3e3);let o=null;window.addEventListener("scroll",()=>{o&&clearTimeout(o),o=setTimeout(e,300)},{passive:!0}),typeof MutationObserver<"u"&&document.body&&(ct&&ct.disconnect(),ct=new MutationObserver(()=>{o&&clearTimeout(o),o=setTimeout(e,450)}),ct.observe(document.body,{childList:!0,subtree:!0}))}function jo(t){var e;try{typeof chrome<"u"&&((e=chrome.runtime)!=null&&e.sendMessage)&&chrome.runtime.sendMessage({type:"GET_QUEUE_STATE"},o=>{var i,a;const n=(o==null?void 0:o.state)||((i=o==null?void 0:o.payload)==null?void 0:i.state),r=(o==null?void 0:o.stats)||((a=o==null?void 0:o.payload)==null?void 0:a.stats);if(o!=null&&o.success&&(n!=null&&n.isRunning)){v.isRunning=!0,v.isPaused=!!n.isPaused,v.status=n.isPaused?"PAUSED":"RUNNING",v.total=(r==null?void 0:r.total)||0,v.completed=(r==null?void 0:r.completed)||0,v.failed=(r==null?void 0:r.failed)||0,v.skipped=(r==null?void 0:r.skipped)||0,v.currentGroupName=n.expectedGroupName||"Facebook Group",v.message=`Auto-posting in progress (${v.completed}/${v.total} done)...`,Qt();const s=Y.getInstance();T(s.getState(),t)}})}catch{}}function Qt(){ce&&clearInterval(ce),ce=setInterval(()=>{var t;try{typeof chrome<"u"&&((t=chrome.runtime)!=null&&t.sendMessage)&&chrome.runtime.sendMessage({type:"GET_QUEUE_STATE"},e=>{var i,a;if(chrome.runtime.lastError||!(e!=null&&e.success))return;const o=(e==null?void 0:e.state)||((i=e==null?void 0:e.payload)==null?void 0:i.state),n=(e==null?void 0:e.stats)||((a=e==null?void 0:e.payload)==null?void 0:a.stats);if(!o||!n)return;o.isRunning?(v.isRunning=!0,v.isPaused=!!o.isPaused,v.status=o.isPaused?"PAUSED":"RUNNING",v.total=n.total||0,v.completed=n.completed||0,v.failed=n.failed||0,v.skipped=n.skipped||0,v.currentGroupName=o.expectedGroupName||"",v.message=v.isPaused?"Campaign paused by user.":`🚀 Posting to: "${v.currentGroupName||"Group"}" (${v.completed}/${v.total} done)...`):v.isRunning&&(v.isRunning=!1,v.isPaused=!1,v.status="COMPLETED",v.completed=n.completed||v.completed,v.total=n.total||v.total,v.message=`🎉 Campaign Finished! Successfully posted to ${v.completed} groups.`,clearInterval(ce),ce=null);const r=Y.getInstance();T(r.getState())})}catch{ce&&(clearInterval(ce),ce=null)}},1e3)}function T(t,e){if(!h)return;const o=Wt(window.location.href),n=Me(),r=n.length||t.totalFound,i=F.filter(g=>!lt(g)).length,a=F.filter(g=>lt(g)).length;let s="0 Media";i>0&&a>0?s=`${i} Photos + ${a} Video${a>1?"s":""}`:a>0?s=`${a} Video${a>1?"s":""}`:i>0&&(s=`${i} Photo${i>1?"s":""}`);const c=t.status==="SEARCHING"||t.status==="JOINING",l=v.isRunning&&!v.isPaused,u=v.isPaused,d=c||l,b=l?"#10b981":u?"#f59e0b":t.status==="JOINING"?"#10b981":t.status==="SEARCHING"?"#3b82f6":t.status==="PAUSED"?"#f59e0b":v.status==="COMPLETED"?"#10b981":"#6366f1";if(Pt){j&&(j.style.left="auto",j.style.width="auto",j.style.right=window.innerWidth<=640?"12px":"24px",j.style.bottom=window.innerWidth<=640?"12px":"24px");const g=v.isRunning?`Posting: ${v.completed}/${v.total}`:c?`Joining: ${t.joinedCount}`:`Auto-Poster: ${r} Groups`;h.innerHTML=`
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
          background: ${b};
          ${d?"animation: pulse 1.5s infinite;":""}
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.7; }
        }
      </style>
      <div id="agp-dock-expand" class="mini-badge">
        <div class="dot"></div>
        <span style="font-size: 13px; font-weight: 700; letter-spacing: -0.2px;">${g}</span>
        <span style="font-size: 12px; color: #94a3b8; margin-left: 2px;">↗</span>
      </div>
    `;const f=h.getElementById("agp-dock-expand");f&&(f.onclick=()=>{Pt=!1,T(t,e)});return}if(j){const g=window.innerWidth<=640;j.style.left=g?"8px":"auto",j.style.right=g?"8px":"24px",j.style.bottom=g?"8px":"24px",j.style.width=g?"calc(100vw - 16px)":"auto"}const p=v.total>0?Math.min(100,Math.round(v.completed/v.total*100)):0;h.innerHTML=`
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
      @media (max-width: 640px) {
        .dock-card {
          width: 100% !important;
          max-width: 100% !important;
          max-height: 85vh !important;
          border-radius: 16px !important;
          padding: 12px !important;
        }
        .header {
          padding-bottom: 8px !important;
          margin-bottom: 8px !important;
        }
        .tb-btn {
          padding: 4px 6px !important;
          font-size: 11px !important;
        }
        .tb-select {
          max-width: 110px !important;
          font-size: 11px !important;
        }
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
        background: ${b}22;
        color: ${b};
        border: 1px solid ${b}55;
      }
      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${b};
        ${d?"animation: pulse 1.5s infinite;":""}
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
            <div class="subtitle" title="${o||"Facebook Groups"}">
              ${o?`Search: "${o}"`:"Group Search Results"}
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
          <div class="status-pill">
            <div class="status-dot"></div>
            <span>${l?"POSTING":u?"PAUSED":c?"JOINING":t.status}</span>
          </div>
          <button id="agp-dock-min" class="icon-btn" title="Minimize">−</button>
          <button id="agp-dock-close" class="icon-btn" title="Dismiss">✕</button>
        </div>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="tabs-nav">
        <button id="tab-post" class="tab-btn ${Ve==="POST_AND_JOIN"?"active":""}">
          <span>🚀 Auto-Join & Post</span>
          <span class="hot-badge">NEW</span>
        </button>
        <button id="tab-join" class="tab-btn ${Ve==="JOIN_ONLY"?"active":""}">
          <span>⚡ Join Only</span>
        </button>
      </div>

      ${Ve==="POST_AND_JOIN"?`
        <!-- ================= POST & JOIN MODE ================= -->
        <!-- Caption Section -->
        <div class="form-section">
          <div class="label-row">
            <label class="form-label">
              <span>📝 Post Caption / Description *</span>
            </label>
            <div style="display: flex; align-items: center; gap: 8px;">
              ${S?'<button id="btn-clear-caption" class="action-link">Clear</button>':""}
              <span class="char-count" style="margin-top: 0;">${S.length} chars</span>
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
                <option value="serif-bold">𝐬𝐚ｌｅ (Serif Bold)</option>
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
                  ${Jt.map(g=>`<option value="${g.id}">${g.icon} ${g.name}</option>`).join("")}
                </select>
                <select id="tb-select-borders" class="tb-select" title="Insert Decorative Borders">
                  <option value="" disabled selected>➖ Borders</option>
                  ${No.map(g=>`<option value="${g.value}">${g.name}</option>`).join("")}
                </select>
              </div>
              <button type="button" id="tb-btn-preview" class="tb-btn ${We?"active":""}" title="Toggle Live Facebook Post Preview">
                <span>${We?"👁️ Hide":"👁️ FB Preview"}</span>
              </button>
            </div>
          </div>

          <textarea
            id="agp-caption-input"
            class="caption-input"
            placeholder="What are you posting? Write your full listing caption, details, price, phone number...&#10;&#10;Use H1, H2, Bold, Italic, Bullets, Sales Tags above to design your caption!"
          >${S}</textarea>

          <!-- Live Facebook Post Preview Card -->
          ${We?`
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
                ${me(S)}
              </div>
              ${F.length>0?`
                <div style="margin-top: 8px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #000; max-height: 120px; display: flex; align-items: center; justify-content: center;">
                  ${lt(F[0])?`<video src="${F[0]}#t=0.1" style="max-height: 120px; width: 100%; object-fit: cover;" muted></video>`:`<img src="${F[0]}" style="max-height: 120px; width: 100%; object-fit: cover;" alt="Preview" />`}
                </div>
                `:""}
              <div style="display: flex; align-items: center; justify-content: space-around; margin-top: 8px; padding-top: 6px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #94a3b8; font-weight: 600;">
                <span>👍 Like</span>
                <span>💬 Comment</span>
                <span>↗ Share</span>
              </div>
            </div>
            `:""}
        </div>

        <!-- Photos & Videos Section -->
        <div class="form-section">
          <div class="label-row">
            <label class="form-label">
              <span>📸🎥 Product Photos & Videos (${s} Added)</span>
            </label>
            ${F.length>0?'<button id="btn-clear-photos" class="action-link">Remove All</button>':""}
          </div>
          <input
            type="file"
            id="agp-file-input"
            accept="image/*,video/*,.mp4,.mov,.webm,.m4v,.mkv"
            multiple
            style="display: none;"
          />
          <div class="photos-container" id="agp-media-container">
            ${F.map((g,f)=>{const m=lt(g);return`
                  <div class="photo-thumb-wrapper ${m?"is-video":""}" title="${m?"Video":"Photo"} #${f+1}">
                    ${m?`
                        <video src="${g}#t=0.1" class="photo-thumb-img photo-thumb-video" muted playsinline preload="metadata" onloadedmetadata="this.currentTime=0.1"></video>
                        <div class="media-video-overlay">
                          <span class="media-video-badge">▶ VIDEO</span>
                        </div>
                        `:`
                        <img src="${g}" class="photo-thumb-img" alt="Photo ${f+1}" />
                        `}
                    <span class="media-index-pill">#${f+1}</span>
                    <button class="photo-remove-btn" data-index="${f}" title="Remove">✕</button>
                  </div>
                `}).join("")}

            ${Je?`
                <div class="media-uploading-card">
                  <div class="media-spinner"></div>
                  <span>Uploading...</span>
                </div>
                `:""}

            <button id="btn-trigger-upload" class="btn-add-photos" title="Add photos and videos together (ছবি ও ভিডিও একসাথে যোগ করুন)">
              <div style="font-size: 16px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                <span>📷</span>
                <span style="font-size: 11px; opacity: 0.7;">+</span>
                <span>🎥</span>
              </div>
              <span style="font-weight: 700; color: #f1f5f9;">+ Add Photos/Video</span>
              <span style="font-size: 9px; color: #94a3b8; font-weight: normal;">(ছবি ও ভিডিও একসাথে)</span>
            </button>
          </div>
        </div>

        <!-- Options: Targeting & Delay -->
        <div class="options-grid">
          <div>
            <div class="form-label" style="margin-bottom: 4px;">Target Groups</div>
            <select id="agp-select-target" class="select-box">
              <option value="0" ${Q===0?"selected":""}>All Found (${r})</option>
              <option value="5" ${Q===5?"selected":""}>Top 5 Groups</option>
              <option value="10" ${Q===10?"selected":""}>Top 10 Groups</option>
              <option value="20" ${Q===20?"selected":""}>Top 20 Groups</option>
            </select>
          </div>
          <div>
            <div class="form-label" style="margin-bottom: 4px;">Pacing Delay (স্পিড)</div>
            <select id="agp-select-delay" class="select-box">
              <option value="0" ${fe===0?"selected":""}>⚡ Turbo (0s Delay - Super Fast)</option>
              <option value="1" ${fe===1?"selected":""}>⚡ 1 Sec (Ultra Fast)</option>
              <option value="3" ${fe===3?"selected":""}>3 Sec (Fast)</option>
              <option value="5" ${fe===5?"selected":""}>5 Sec (Normal)</option>
              <option value="10" ${fe===10?"selected":""}>10 Seconds</option>
            </select>
          </div>
        </div>

        <!-- Discovered Groups Accordion -->
        <div id="btn-toggle-groups" class="groups-preview-toggle">
          <span>👥 Found on Search Page: <strong style="color: #60a5fa;">${r} Groups</strong></span>
          <span>${He?"▲ Hide":"▼ View List"}</span>
        </div>
        ${He?`
          <div class="groups-list-box">
            ${n.length>0?n.map(g=>`
                  <div class="group-row">
                    <span style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${g.item.name}">
                      ${g.item.name}
                    </span>
                    <span class="group-badge" style="background: ${g.item.privacy==="PUBLIC"?"rgba(16, 185, 129, 0.2)":"rgba(245, 158, 11, 0.2)"}; color: ${g.item.privacy==="PUBLIC"?"#34d399":"#fbbf24"};">
                      ${g.item.privacy}
                    </span>
                  </div>
                `).join(""):'<div style="text-align: center; color: #64748b; font-size: 11px; padding: 10px;">Scrolling page to detect group cards...</div>'}
          </div>
        `:""}

        <!-- Progress Bar when running -->
        ${v.isRunning||v.total>0?`
          <div class="progress-container">
            <div class="progress-bar" style="width: ${p}%;"></div>
          </div>
        `:""}

        <!-- Status Message Box -->
        <div class="message-box">
          ${v.message}
        </div>

        <!-- Action Buttons -->
        <div class="btn-row">
          ${!v.isRunning&&!u?`<button id="btn-start-campaign" class="btn btn-post-primary">
                   <span>🚀</span> Start Join & Post (${Q>0?Q:r} Groups)
                 </button>`:v.isRunning?`<button id="btn-pause-campaign" class="btn btn-pause">⏸ Pause</button>
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
          ${!c&&t.status!=="PAUSED"?`<button id="btn-start-join" class="btn btn-join-primary">
                   <span>▶</span> Auto-Join All Groups
                 </button>`:c?`<button id="btn-pause-join" class="btn btn-pause">⏸ Pause</button>
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
  `,Fo(t,e)}function Fo(t,e){var d,b,p,g,f,m,A,y,E,L,N,I,oe,z,de,R,Z,ae,_e,Le,se,ee,xe,ve,$,H,be;if(!h)return;(d=h.getElementById("agp-dock-close"))==null||d.addEventListener("click",()=>{j&&(j.remove(),j=null,h=null)}),(b=h.getElementById("agp-dock-min"))==null||b.addEventListener("click",()=>{Pt=!0,T(t,e)}),(p=h.getElementById("btn-view-groups"))==null||p.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})}catch{}}),(g=h.getElementById("tab-post"))==null||g.addEventListener("click",()=>{Ve="POST_AND_JOIN",T(t,e)}),(f=h.getElementById("tab-join"))==null||f.addEventListener("click",()=>{Ve="JOIN_ONLY",T(t,e)});const o=h.getElementById("agp-caption-input");o&&(o.addEventListener("input",()=>{S=o.value,V();const x=h==null?void 0:h.querySelector(".char-count");x&&(x.textContent=`${S.length} chars`);const k=h==null?void 0:h.getElementById("agp-preview-body");k&&(k.innerHTML=me(S))}),o.addEventListener("paste",x=>{var P;const k=(P=x.clipboardData)==null?void 0:P.getData("text/html");if(k&&(/<(h[1-6]|b|strong|i|em|s|u|ul|ol|li|blockquote)[\s>]/i.test(k)||/data-lexical/i.test(k))){x.preventDefault();const C=Mo(k),B=o.selectionStart,J=o.selectionEnd,q=o.value.substring(0,B),ne=o.value.substring(J);S=q+C+ne,o.value=S,V(),o.focus(),o.setSelectionRange(B+C.length,B+C.length),te("📋 Styled text pasted with full design!");const re=h==null?void 0:h.querySelector(".char-count");re&&(re.textContent=`${S.length} chars`);const ue=h==null?void 0:h.getElementById("agp-preview-body");ue&&(ue.innerHTML=me(S))}}));const n=(x,k)=>{if(!o)return;const P=o.selectionStart,C=o.selectionEnd;if(P!==C){const q=o.value.substring(P,C),ne=x(q);S=o.value.substring(0,P)+ne+o.value.substring(C),o.value=S,V(),o.focus(),o.setSelectionRange(P,P+ne.length)}else if(k!==void 0){S=o.value.substring(0,P)+k+o.value.substring(C),o.value=S,V(),o.focus();const q=P+Math.floor(k.length/2);o.setSelectionRange(q,q)}else S.trim()&&(S=x(S),o.value=S,V(),o.focus());const B=h==null?void 0:h.querySelector(".char-count");B&&(B.textContent=`${S.length} chars`);const J=h==null?void 0:h.getElementById("agp-preview-body");J&&(J.innerHTML=me(S))};(m=h.getElementById("tb-h1"))==null||m.addEventListener("click",()=>{if(!o)return;const x=o.selectionStart,k=o.selectionEnd;if(x!==k)n(B=>rt(B,1));else{const B=o.value.substring(0,x),J=o.value.substring(k),q=B.lastIndexOf(`
`),ne=J.indexOf(`
`),re=q===-1?0:q+1,ue=ne===-1?o.value.length:x+ne,$t=o.value.substring(re,ue),Gt=rt($t,1);S=o.value.substring(0,re)+Gt+o.value.substring(ue),o.value=S,V(),o.focus()}te("🏷️ Heading 1 (H1)");const P=h==null?void 0:h.querySelector(".char-count");P&&(P.textContent=`${S.length} chars`);const C=h==null?void 0:h.getElementById("agp-preview-body");C&&(C.innerHTML=me(S))}),(A=h.getElementById("tb-h2"))==null||A.addEventListener("click",()=>{if(!o)return;const x=o.selectionStart,k=o.selectionEnd;if(x!==k)n(B=>rt(B,2));else{const B=o.value.substring(0,x),J=o.value.substring(k),q=B.lastIndexOf(`
`),ne=J.indexOf(`
`),re=q===-1?0:q+1,ue=ne===-1?o.value.length:x+ne,$t=o.value.substring(re,ue),Gt=rt($t,2);S=o.value.substring(0,re)+Gt+o.value.substring(ue),o.value=S,V(),o.focus()}te("🏷️ Heading 2 (H2)");const P=h==null?void 0:h.querySelector(".char-count");P&&(P.textContent=`${S.length} chars`);const C=h==null?void 0:h.getElementById("agp-preview-body");C&&(C.innerHTML=me(S))}),(y=h.getElementById("tb-bold"))==null||y.addEventListener("click",()=>{n(x=>_o(x),"****"),te("𝐁 Bold (**text**)")}),(E=h.getElementById("tb-italic"))==null||E.addEventListener("click",()=>{n(x=>Lo(x),"**"),te("𝘐 Italic (*text*)")}),(L=h.getElementById("tb-strike"))==null||L.addEventListener("click",()=>{n(x=>le(x,"strikethrough")),te("Strikethrough / কাটা দাগ")}),(N=h.getElementById("tb-bullets"))==null||N.addEventListener("click",()=>{n(x=>Io(x),`
  • `),te("• Bullets")}),(I=h.getElementById("tb-numbers"))==null||I.addEventListener("click",()=>{n(x=>To(x),`
  1. `),te("1. Numbered List")}),(oe=h.getElementById("tb-quote"))==null||oe.addEventListener("click",()=>{n(x=>$o(x),`
> `),te("❞ Quote")});const r=h.getElementById("tb-select-style");r==null||r.addEventListener("change",()=>{r.value&&(n(x=>le(x,r.value)),te(`Applied ${r.value}!`),r.value="")}),(z=h.getElementById("tb-auto-design"))==null||z.addEventListener("click",()=>{if(!S.trim()){te("⚠️ আগে ক্যাপশন লিখুন (Type caption first)");return}S=Go(S),o&&(o.value=S),V(),te("✨ 1-Click Auto-Design Applied!");const x=h==null?void 0:h.querySelector(".char-count");x&&(x.textContent=`${S.length} chars`);const k=h==null?void 0:h.getElementById("agp-preview-body");k&&(k.innerHTML=me(S))});const i=h.getElementById("tb-select-sales");i==null||i.addEventListener("change",()=>{if(i.value&&o){const x=Jt.find(k=>k.id===i.value);if(x){const k=x.content.replace("{price}","১,৫০০ ৳").replace("{location}","ঢাকা / সারা বাংলাদেশ").replace("{contact_info}","ইনবক্স করুন / 017xxxxxxxx"),P=o.selectionStart,C=o.selectionEnd,B=o.value.substring(0,P),J=o.value.substring(C),q=B.length===0||B.endsWith(`

`)?"":B.endsWith(`
`)?`
`:`

`;S=B+q+k+`
`+J,o.value=S,V(),te(`Inserted ${x.name}!`),o.focus(),o.setSelectionRange(P+q.length+k.length+1,P+q.length+k.length+1);const re=h==null?void 0:h.querySelector(".char-count");re&&(re.textContent=`${S.length} chars`);const ue=h==null?void 0:h.getElementById("agp-preview-body");ue&&(ue.innerHTML=me(S))}i.value=""}});const a=h.getElementById("tb-select-borders");a==null||a.addEventListener("change",()=>{if(a.value&&o){const x=a.value,k=o.selectionStart,P=o.selectionEnd,C=o.value.substring(0,k),B=o.value.substring(P),J=C.length===0||C.endsWith(`
`)?"":`
`,q=B.startsWith(`
`)?"":`
`;S=C+J+x+q+B,o.value=S,V(),te("➖ Border inserted!"),o.focus(),o.setSelectionRange(k+J.length+x.length+q.length,k+J.length+x.length+q.length);const ne=h==null?void 0:h.querySelector(".char-count");ne&&(ne.textContent=`${S.length} chars`);const re=h==null?void 0:h.getElementById("agp-preview-body");re&&(re.innerHTML=me(S)),a.value=""}}),(de=h.getElementById("tb-btn-preview"))==null||de.addEventListener("click",()=>{We=!We,T(t,e)}),(R=h.getElementById("btn-clear-caption"))==null||R.addEventListener("click",()=>{S="",V(),T(t,e)});const s=h.getElementById("agp-file-input");(Z=h.getElementById("btn-trigger-upload"))==null||Z.addEventListener("click",()=>{s==null||s.click()}),s&&s.addEventListener("change",async()=>{if(s.files&&s.files.length>0){Je=!0,T(t,e);const x=Array.from(s.files),k=[];for(const P of x)try{const C=await Ht(P);C&&k.push(C)}catch(C){console.warn("[AGP:SearchPoster] File convert error:",C)}F=[...F,...k],await V(),Je=!1,s.value="",T(t,e)}});const c=h.getElementById("agp-media-container");c&&(c.addEventListener("dragover",x=>{x.preventDefault(),c.classList.add("drag-over")}),c.addEventListener("dragleave",x=>{x.preventDefault(),c.classList.remove("drag-over")}),c.addEventListener("drop",async x=>{var k;if(x.preventDefault(),c.classList.remove("drag-over"),(k=x.dataTransfer)!=null&&k.files&&x.dataTransfer.files.length>0){Je=!0,T(t,e);const P=Array.from(x.dataTransfer.files),C=[];for(const B of P)try{const J=await Ht(B);J&&C.push(J)}catch(J){console.warn("[AGP:SearchPoster] Drag drop convert error:",J)}F=[...F,...C],await V(),Je=!1,T(t,e)}})),h.querySelectorAll(".photo-remove-btn").forEach(x=>{x.addEventListener("click",k=>{k.stopPropagation();const P=x.getAttribute("data-index");if(P!==null){const C=parseInt(P,10);!isNaN(C)&&C>=0&&C<F.length&&(F.splice(C,1),V(),T(t,e))}})}),(ae=h.getElementById("btn-clear-photos"))==null||ae.addEventListener("click",()=>{F=[],V(),T(t,e)});const l=h.getElementById("agp-select-target");l&&l.addEventListener("change",()=>{Q=parseInt(l.value,10)||0,V(),T(t,e)});const u=h.getElementById("agp-select-delay");u&&u.addEventListener("change",()=>{fe=parseInt(u.value,10)||0,V()}),(_e=h.getElementById("btn-toggle-groups"))==null||_e.addEventListener("click",()=>{He=!He,T(t,e)}),(Le=h.getElementById("btn-start-campaign"))==null||Le.addEventListener("click",()=>{zo(t,e)}),(se=h.getElementById("btn-pause-campaign"))==null||se.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&(chrome.runtime.sendMessage({type:"PAUSE_QUEUE"}),v.isPaused=!0,v.status="PAUSED",v.message="Posting campaign paused.",T(t,e))}catch{}}),(ee=h.getElementById("btn-resume-campaign"))==null||ee.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&(chrome.runtime.sendMessage({type:"RESUME_QUEUE"}),v.isPaused=!1,v.status="RUNNING",v.message="Resuming campaign...",T(t,e))}catch{}}),(xe=h.getElementById("btn-stop-campaign"))==null||xe.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&(chrome.runtime.sendMessage({type:"STOP_QUEUE"}),v.isRunning=!1,v.isPaused=!1,v.status="IDLE",v.message="Campaign stopped.",ce&&(clearInterval(ce),ce=null),T(t,e))}catch{}}),(ve=h.getElementById("btn-start-join"))==null||ve.addEventListener("click",()=>{Y.getInstance().start(e||{searchUrl:window.location.href,delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0})}),($=h.getElementById("btn-pause-join"))==null||$.addEventListener("click",()=>{Y.getInstance().pause()}),(H=h.getElementById("btn-resume-join"))==null||H.addEventListener("click",()=>{Y.getInstance().resume()}),(be=h.getElementById("btn-stop-join"))==null||be.addEventListener("click",()=>{Y.getInstance().stop()})}async function zo(t,e){var u;if(!S.trim()&&F.length===0){v.message="⚠️ অনুগ্রহ করে পোস্টের ক্যাপশন অথবা অন্তত একটি ছবি/ভিডিও যুক্ত করুন (Please add caption, photos or video).",T(t,e);return}let o=Me();const n=Q>0?Q:o.length||10;let r=0;for(;o.length<n&&r<3;)r++,v.status="SCANNING",v.message=`🔍 Scanning search results... Found ${o.length}/${n} groups...`,T(t,e),window.scrollBy({top:1e3,behavior:"smooth"}),await new Promise(d=>setTimeout(d,400)),o=Me();if(o.length===0){v.status="ERROR",v.message="⚠️ কোনো ফেসবুক গ্রুপ পাওয়া যায়নি। পেজটি স্ক্রোল করুন অথবা সার্চ লিঙ্ক চেক করুন।",T(t,e);return}const i=Q>0?o.slice(0,Q):o,a=[],s=[];for(const d of i){const b=d.item.groupId||d.item.id,p=d.item.url||`https://www.facebook.com/groups/${encodeURIComponent(b)}/`,g={id:b,groupId:b,name:d.item.name||"Facebook Group",url:p,category:"Search Result",privacy:d.item.privacy,enabled:!0,selected:!0,status:"READY",postCount:0,verified:!0,source:"facebook-ui",createdAt:Date.now(),updatedAt:Date.now()};a.push(g),s.push(g.id)}const c=`search_post_${Date.now()}`,l={id:c,title:S.slice(0,40)||"Product Post",productName:S.slice(0,30)||"Product",caption:S,description:S,images:F,createdAt:Date.now(),updatedAt:Date.now()};v.isRunning=!0,v.isPaused=!1,v.status="RUNNING",v.total=s.length,v.completed=0,v.failed=0,v.skipped=0,v.message=`⚡ Super Fast Turbo Campaign Started! Visiting & posting to ${s.length} groups...`,T(t,e),Qt();try{typeof chrome<"u"&&((u=chrome.runtime)!=null&&u.sendMessage)&&chrome.runtime.sendMessage({type:"CREATE_AND_START_QUEUE",payload:{groupIds:s,postId:c,delaySec:fe,groups:a,post:l}},d=>{d!=null&&d.success?console.log("[AGP:SearchPoster] Campaign successfully queued & running."):(console.warn("[AGP:SearchPoster] Queue start error:",d==null?void 0:d.error),v.status="ERROR",v.isRunning=!1,v.message=`Failed to start: ${(d==null?void 0:d.error)||"Unknown error"}`,T(t,e))})}catch(d){console.error("[AGP:SearchPoster] Error starting campaign:",d),v.status="ERROR",v.isRunning=!1,v.message=`Error starting campaign: ${String(d)}`,T(t,e)}(async()=>{try{const d=await vt(),b=new Map(d.map(f=>[f.groupId?f.groupId.toLowerCase():f.id.toLowerCase(),f])),p=[];for(const f of a)b.has(f.groupId.toLowerCase())||(p.push(f),b.set(f.groupId.toLowerCase(),f));p.length>0&&await wt([...d,...p]);const g=await xo();await vo([l,...g.filter(f=>f.id!==c)])}catch(d){console.warn("[AGP:SearchPoster] Background group persistence warning:",d)}})()}console.log("[AGP:Content] Facebook Assistant Content Script initialized.");let Ee=null,_=null,w=null,Pe=!1,dt=!1,Ne=null,ut=!1;function _t(){U&&(clearInterval(U),U=null),X=!1,he=!0,ut=!0;try{chrome.runtime.sendMessage({type:"STOP_QUEUE"})}catch{}Ee&&(Ee.remove(),Ee=null,_=null),M("🛑 Auto-Posting বন্ধ করা হয়েছে (Stopped & Closed)")}async function Jo(t){try{return await navigator.clipboard.writeText(t),!0}catch{const o=document.createElement("textarea");o.value=t,document.body.appendChild(o),o.select();const n=document.execCommand("copy");return document.body.removeChild(o),n}}async function Xt(t,e){try{if(navigator.clipboard&&window.ClipboardItem){const o=new Blob([t],{type:"text/plain"}),n=new Blob([e],{type:"text/html"});return await navigator.clipboard.write([new window.ClipboardItem({"text/plain":o,"text/html":n})]),!0}}catch{}try{const o=r=>{var i,a;r.preventDefault(),(i=r.clipboardData)==null||i.setData("text/plain",t),(a=r.clipboardData)==null||a.setData("text/html",e)};document.addEventListener("copy",o);const n=document.execCommand("copy");if(document.removeEventListener("copy",o),n)return!0}catch{}return Jo(t)}function M(t,e=!1){if(_){const o=_.getElementById("agp-toast");o&&o.remove();const n=document.createElement("div");n.id="agp-toast",n.innerText=t,n.style.cssText=`
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
    `,_.appendChild(n),setTimeout(()=>n.remove(),2400);return}if(typeof document<"u"&&document.body){const o=document.getElementById("agp-global-toast");o&&o.remove();const n=document.createElement("div");n.id="agp-global-toast",n.innerText=t,n.style.cssText=`
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
    `,document.body.appendChild(n),requestAnimationFrame(()=>{n.style.opacity="1",n.style.transform="translateY(0)"}),setTimeout(()=>{n.style.opacity="0",n.style.transform="translateY(-10px)",setTimeout(()=>n.remove(),400)},3e3)}}let X=!1,O="Preparing auto-post...",U=null,he=!1;const D=t=>new Promise(e=>setTimeout(e,t));async function Wo(t,e="media_1"){try{if(!t||typeof t!="string")return null;let o="image/jpeg",n=null;if(t.startsWith("data:")||t.startsWith("blob:")||t.startsWith("http://")||t.startsWith("https://"))try{const u=await fetch(t);(u.ok||t.startsWith("data:")||t.startsWith("blob:"))&&(n=await u.blob(),n&&n.size>0&&(o=(n.type||"").toLowerCase()||"image/jpeg"))}catch(u){console.warn("[AGP:AutoPost] fetch blob parsing failed, falling back to manual decode:",u)}if(!n||n.size===0){let u=t;if(t.startsWith("data:")){const d=t.indexOf(",");if(d!==-1){const b=t.slice(0,d);u=t.slice(d+1);const p=b.match(/:(.*?);/);o=p?p[1].toLowerCase():"image/jpeg"}}try{const d=atob(u.trim().replace(/\s/g,"")),b=new Uint8Array(d.length);for(let p=0;p<d.length;p++)b[p]=d.charCodeAt(p);if(b.length===0)return null;b.length>8&&b[4]===102&&b[5]===116&&b[6]===121&&b[7]===112&&(o="video/mp4"),n=new Blob([b.buffer],{type:o})}catch(d){return console.warn("[AGP:AutoPost] base64 decode failed:",d),null}}if(!n||n.size===0)return null;const r=o.startsWith("video/");let i="jpg";o.includes("video/mp4")||o.includes("mp4")?i="mp4":o.includes("video/webm")||o.includes("webm")?i="webm":o.includes("video/quicktime")||o.includes("mov")?i="mov":o.includes("video/x-m4v")||o.includes("m4v")?i="m4v":o.includes("video/mkv")||o.includes("matroska")?i="mkv":r?i="mp4":o.includes("png")?i="png":o.includes("webp")?i="webp":o.includes("gif")&&(i="gif");const a=Date.now(),s=e.replace(/\D/g,"")||"1",l=`${r?"VID":"IMG"}_${a}_${s}.${i}`;return new File([n],l,{type:o,lastModified:a})}catch(o){return console.warn("[AGP:AutoPost] mediaToFile error:",o),null}}function W(t){if(!t)return!1;if(t.offsetParent!==null)return!0;try{const e=window.getComputedStyle(t);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0")return!1;const o=t.getBoundingClientRect();return o.width>0&&o.height>0}catch{return!1}}function ye(t){if(!t)return!0;const e=t.tagName.toUpperCase();if(e==="IMG"||e==="SVG"||e==="VIDEO"||e==="AUDIO"||t.closest('a[href*="/photo"], a[href*="/media"], a[href*="/photos"], a[href*="/album"], a[href*="/user/"], a[href*="/watch"]')||t.closest('[data-pagelet*="CoverPhoto"], [data-pagelet*="GroupCover"], [data-pagelet*="Header"], [data-pagelet*="Profile"], [data-pagelet*="MediaViewer"], [role="banner"], [role="navigation"], header, [role="article"], [data-pagelet*="FeedUnit"], [data-pagelet*="Comment"], form, [role="complementary"]'))return!0;const o=(t.getAttribute("aria-label")||"").toLowerCase();return!!(o.includes("cover")||o.includes("profile")||o.includes("avatar")||o.includes("badge")||o.includes("photo by")||o.startsWith("photo:")||o.startsWith("photo ")||o.includes("cover photo")||o.includes("profile photo")||o.includes("group photo")||o.includes("কভার ফটো")||o.includes("প্রোফাইল ফটো")||t.getAttribute("role")==="img")}function Zt(t,e){const o=(e||"").toLowerCase(),n=(t||"").toLowerCase().replace(/\u2026/g,"...").trim(),r=["write something","create a public post","create a post","start discussion","write discussion","what are you selling","sell something","কিছু লিখুন","পোস্ট তৈরি করুন","পাবলিক পোস্ট","আপনার মনে কী আছে","কী ভাবছেন","কী বিক্রি করছেন","কিছু বিক্রি করুন","আলোচনা শুরু করুন"];for(const i of r)if(o.includes(i)||n.startsWith(i)||n.length<80&&n.includes(i))return!0;return!1}async function eo(){if(!(window.location.href.includes("/photo")||!!document.querySelector('[data-pagelet*="MediaViewer"], div[aria-label="Close"][role="button"], img[data-visualcompletion="media-vc-image"]')))return!1;console.log("[AGP:AutoPost] Photo theater viewer detected! Closing it to return to group page...");const e=document.querySelector('[aria-label="Close" i][role="button"], [aria-label="Close" i], [aria-label="Exit" i], div[aria-label="Close" i], [data-pagelet*="MediaViewer"] [aria-label*="Close" i]');if(e&&W(e))try{return e.click(),await D(350),!0}catch{}try{window.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",code:"Escape",keyCode:27,which:27,bubbles:!0})),window.dispatchEvent(new KeyboardEvent("keyup",{key:"Escape",code:"Escape",keyCode:27,which:27,bubbles:!0})),await D(300)}catch{}if(window.location.href.includes("/photo"))try{window.history.back(),await D(500)}catch{}return!0}function Vo(){const t=Array.from(document.querySelectorAll('[role="tab"], a[role="tab"], [role="tablist"] a'));for(const e of t){const o=(e.textContent||"").trim().toLowerCase(),n=(e.getAttribute("href")||"").toLowerCase();if(o==="discussion"||o==="আলোচনা"||n.endsWith("/discussion")||n.endsWith("/discussion/"))try{return e.click(),console.log('[AGP:AutoPost] Clicked "Discussion" tab to reveal composer.'),!0}catch{}}return!1}function Be(){const t=Array.from(document.querySelectorAll('[data-pagelet="GroupInlineComposer"], [data-pagelet="FeedInlineComposer"], [data-pagelet="GroupComposer"], [data-pagelet*="Composer" i]'));for(const o of t){if(ye(o))continue;const n=Array.from(o.querySelectorAll('span, div, [role="button"], button'));for(const a of n){if(ye(a))continue;const s=a.getAttribute("aria-label")||"",c=a.textContent||"";if(Zt(c,s)){const l=a.closest('[role="button"], button')||a.closest('[tabindex="0"]')||a;if(l&&W(l)&&!ye(l))return l}}const r=o.querySelector('[aria-label*="Photo/video" i], [aria-label*="Photo / video" i], [aria-label*="Add Photos" i], [aria-label*="ছবি/ভিডিও" i], [aria-label*="ছবি" i], [aria-label*="Photo" i]');if(r&&W(r)&&!ye(r)){const a=r.closest('[role="button"], button')||r;if(a&&W(a)&&!ye(a))return a}const i=o.querySelector('[role="button"], div[tabindex="0"]');if(i&&W(i)&&!ye(i))return i}const e=Array.from(document.querySelectorAll('[role="main"] [role="button"], [role="main"] div[tabindex="0"], [role="main"] span, [role="main"] div'));for(const o of e){if(ye(o))continue;const n=o.getAttribute("aria-label")||"",r=o.textContent||"";if(Zt(r,n)){const i=o.closest('[role="button"], button')||o.closest('[tabindex="0"]')||o;if(i&&W(i)&&!ye(i))return i}}return null}function Ye(){var e;const t=Array.from(document.querySelectorAll('[role="dialog"], [aria-modal="true"], div[data-pagelet*="ComposerModal"]'));for(const o of t){if(!W(o)||(e=o.getAttribute("data-pagelet"))!=null&&e.toLowerCase().includes("mediaviewer")||o.querySelector('[data-pagelet*="MediaViewer"], img[data-visualcompletion="media-vc-image"], div[aria-label*="Photo viewer" i]')||o.closest('[role="article"]')||o.querySelector('[data-pagelet*="ChatTab"], [aria-label*="Messenger" i], [aria-label*="Chats" i]'))continue;const n=(o.textContent||"").toLowerCase(),r=(o.getAttribute("aria-label")||"").toLowerCase(),i=!!o.querySelector('[aria-label="Post" i], [aria-label="Publish" i], [aria-label="পোস্ট" i], [aria-label="সাবমিট" i], div[aria-label="Next" i], [role="button"][aria-label="Post" i]'),a=!!(o.querySelector('[aria-label*="Add to your post" i], [aria-label*="আপনার পোস্টে যোগ করুন" i], [aria-label*="Photo/video" i]')||n.includes("add to your post")||n.includes("আপনার পোস্টে যোগ করুন")),s=r.includes("create post")||r.includes("create a post")||r.includes("create a public post")||r.includes("পোস্ট তৈরি করুন")||n.includes("create a public post")||n.includes("create post")||n.includes("পোস্ট তৈরি করুন");if((i||a||s)&&(!!o.querySelector('div[role="textbox"][contenteditable="true"], div[contenteditable="true"]')||i||a))return o}return null}function Ke(){const t=(document.body?document.body.innerText:"").toLowerCase(),e=(document.title||"").toLowerCase();return window.location.href.toLowerCase().includes("/groups/grp_")||t.includes("this content isn't available right now")||t.includes("this content isn't available")||t.includes("content isn't available right now")||t.includes("the link you followed may be broken")||t.includes("page may have been removed")||t.includes("এই কন্টেন্টটি এখন উপলব্ধ নয়")||t.includes("এই লিঙ্কটি হয়তো ত্রুটিপূর্ণ")||e.includes("page not found")||e.includes("content not found")||!!document.querySelector('[role="main"] [aria-label*="Go to Feed" i], [role="main"] a[href="/"][role="button"]')}async function Ho(){if(Ke())return null;await eo();let t=Ye();if(t)return t;let e=Be();if(!e){Vo();const r=Date.now();for(;Date.now()-r<4500;){if(t=Ye(),t)return t;if(e=Be(),e)break;await D(25)}}if(!e)return console.log("[AGP:AutoPost] Composer trigger not found on page."),null;e.scrollIntoView({behavior:"instant",block:"center"});try{e.dispatchEvent(new TouchEvent("touchstart",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new TouchEvent("touchend",{bubbles:!0,cancelable:!0}))}catch{}e.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0,cancelable:!0})),e.click();const o=e.querySelector("span, div");if(o&&o!==e&&!ye(o))try{o.click()}catch{}const n=Date.now();for(;Date.now()-n<4500;){if(t=Ye(),t)return t;await D(25)}return await eo()&&console.warn("[AGP:AutoPost] Accidental photo viewer closed."),null}async function to(t,e){if(!e||!e.trim())return!0;const o=Bo(xt(e)).replace(/\r\n/g,`
`).replace(/\r/g,`
`),n=o.split(`
`);Xt(o.trim(),St(o)).catch(()=>{});let r=null;const i=Date.now(),a=['div[role="textbox"][contenteditable="true"]','div[data-lexical-editor="true"][contenteditable="true"]','div[contenteditable="true"]:not([aria-label*="comment" i]):not([aria-label*="মন্তব্য" i])','div[data-editor="true"]','div[aria-label*="Create a public post" i][contenteditable="true"]','div[aria-label*="Write something" i][contenteditable="true"]','div[aria-label*="কিছু লিখুন" i][contenteditable="true"]','div[aria-label*="পাবলিক পোস্ট" i][contenteditable="true"]','div[aria-placeholder*="Create a public post" i]','div[aria-placeholder*="Write something" i]'];for(;Date.now()-i<4e3;){for(const m of a){const A=t.querySelector(m)||document.querySelector(`[role="dialog"] ${m}`);if(A&&W(A)){r=A;break}}if(r)break;await D(10)}if(!r)return console.warn("[AGP:AutoPost] Create post editor not found inside modal."),!1;const s=(r.textContent||"").trim(),c=o.trim().slice(0,30);if(s.length>=o.trim().length*.7&&(!c||s.includes(c)))return console.log("[AGP:AutoPost] Editor already contains caption. Skipping duplicate injection."),!0;r.scrollIntoView({behavior:"instant",block:"center"}),window.focus(),r.focus();const l={bubbles:!0,cancelable:!0,view:window};r.dispatchEvent(new PointerEvent("pointerdown",l)),r.dispatchEvent(new MouseEvent("mousedown",l)),r.dispatchEvent(new PointerEvent("pointerup",l)),r.dispatchEvent(new MouseEvent("mouseup",l)),r.dispatchEvent(new MouseEvent("click",l)),r.dispatchEvent(new FocusEvent("focus",{bubbles:!1})),r.dispatchEvent(new FocusEvent("focusin",{bubbles:!0}));try{const m="agp_inj_"+Date.now()+"_"+Math.random().toString(36).slice(2,7),A=new Promise(E=>{const L=N=>{N.data&&N.data.type==="AGP_MAIN_INJECT_CAPTION_RESPONSE"&&N.data.messageId===m&&(window.removeEventListener("message",L),E(!!N.data.success))};window.addEventListener("message",L),setTimeout(()=>{window.removeEventListener("message",L),E(!1)},250)});if(window.postMessage({type:"AGP_MAIN_INJECT_CAPTION",messageId:m,caption:o},"*"),await A&&(console.log("[AGP:AutoPost] MAIN world injection succeeded with exact layout!"),(r.textContent||"").trim().length>0))return!0}catch(m){console.warn("[AGP:AutoPost] MAIN world bridge error, using direct content injection:",m)}const u=(r.textContent||"").trim();if(u.length>=o.trim().length*.7&&(!c||u.includes(c)))return console.log("[AGP:AutoPost] Editor already populated by bridge. Skipping fallback Strategy 2."),!0;const d=window.getSelection();if(d){const m=document.createRange();m.selectNodeContents(r),d.removeAllRanges(),d.addRange(m),r.dispatchEvent(new InputEvent("beforeinput",{bubbles:!0,cancelable:!0,inputType:"deleteContentBackward"}))}document.execCommand("selectAll",!1),document.execCommand("delete",!1),await D(10);const b=r.querySelector("p")||r;if(b.dispatchEvent(new MouseEvent("mousedown",l)),b.dispatchEvent(new MouseEvent("mouseup",l)),b.click(),d){const m=document.createRange();b.childNodes.length>0?(m.setStart(b,0),m.setEnd(b,b.childNodes.length)):m.selectNodeContents(b),m.collapse(!0),d.removeAllRanges(),d.addRange(m)}document.dispatchEvent(new Event("selectionchange"));let p=!1;const g=St(o);try{const m=new DataTransfer;m.setData("text/plain",o),m.setData("text/html",g);const A=new ClipboardEvent("paste",{bubbles:!0,cancelable:!0,clipboardData:m});r.dispatchEvent(A),await D(20);let y=(r.textContent||"").trim();if((!y||y.length<5)&&(r.dispatchEvent(new InputEvent("beforeinput",{bubbles:!0,cancelable:!0,inputType:"insertFromPaste",dataTransfer:m})),await D(15),y=(r.textContent||"").trim()),!y||y.length<5)try{document.execCommand("insertHTML",!1,g),await D(15),y=(r.textContent||"").trim()}catch{}const E=r.querySelectorAll("p, h1, h2, h3, ul, ol, li, blockquote"),L=r.querySelectorAll("h1, h2, ul, ol, blockquote").length>0;y.length>0&&(!o.includes(`
`)||E.length>1||L||y.length>=o.trim().length*.4)&&(console.log("[AGP:AutoPost] Direct Native Paste event succeeded. Block count:",E.length),p=!0)}catch(m){console.warn("[AGP:AutoPost] Native paste event error:",m)}if(!p)try{console.log("[AGP:AutoPost] Trying Strategy 3: Line-by-line Enter keystrokes with non-collapsing spacing..."),document.execCommand("selectAll",!1),document.execCommand("delete",!1),await D(10);for(let A=0;A<n.length;A++){const y=n[A],E=A===n.length-1;y.length>0?document.execCommand("insertText",!1,y):document.execCommand("insertText",!1," "),E||(r.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0,cancelable:!0})),r.dispatchEvent(new InputEvent("beforeinput",{inputType:"insertParagraph",bubbles:!0,cancelable:!0})),document.execCommand("insertParagraph",!1),r.dispatchEvent(new InputEvent("input",{inputType:"insertParagraph",bubbles:!0})),r.dispatchEvent(new KeyboardEvent("keyup",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0})))}await D(15),(r.textContent||"").trim().length>0&&(console.log("[AGP:AutoPost] Strategy 3 succeeded."),p=!0)}catch(m){console.warn("[AGP:AutoPost] Strategy 3 error:",m)}return r.dispatchEvent(new Event("input",{bubbles:!0})),r.dispatchEvent(new Event("change",{bubbles:!0})),document.dispatchEvent(new Event("selectionchange")),await D(15),(r.textContent||"").trim().length>0}function Yo(t){const e=t.querySelector('[aria-label*="Photo/video" i], [aria-label*="Photo / video" i], [aria-label*="Add photo" i], [aria-label*="Add Photos" i], [aria-label*="Add photos or videos" i], [aria-label*="Add video" i], [aria-label*="Add Photos/videos" i], [aria-label*="ফটো/ভিডিও" i], [aria-label*="Photo" i], [aria-label*="Video" i], [aria-label*="ছবি/ভিডিও" i], [aria-label*="ছবি" i], [aria-label*="ভিডিও" i], div[aria-label*="Photo" i], div[aria-label*="Video" i], div[aria-label*="ফটো" i], div[aria-label*="ভিডিও" i]');if(e&&W(e))return e;const o=Array.from(t.querySelectorAll('[role="button"], button, div[tabindex="0"]'));for(const r of o){const i=(r.getAttribute("aria-label")||"").toLowerCase();if((i.includes("photo")||i.includes("video")||i.includes("image")||i.includes("ফটো")||i.includes("ছবি")||i.includes("ভিডিও"))&&W(r))return r}const n=Array.from(t.querySelectorAll("span, div, p"));for(const r of n){const i=(r.textContent||"").trim().toLowerCase();if(i==="add to your post"||i==="আপনার পোস্টে যোগ করুন"||i.includes("add to your post")){const a=r.closest("div"),s=(a==null?void 0:a.parentElement)||a,c=s==null?void 0:s.querySelector('[role="button"], img, svg');if(c&&W(c))return c.closest('[role="button"]')||c}}return null}function oo(t){return t.querySelector('input[type="file"][accept*="video"]')||t.querySelector('input[type="file"][accept*="image"]')||t.querySelector('input[type="file"]')||document.querySelector('[role="dialog"] input[type="file"]')||document.querySelector('input[type="file"]')}function Oe(t){var o;const e=(t.textContent||"").toLowerCase();if(e.includes("your file can't be uploaded")||e.includes("file can't be uploaded")||e.includes("আপলোড করা যাবে না")||e.includes("আপলোড করা যায়নি")||e.includes("couldn't be uploaded")||e.includes("error uploading")){const n=Array.from(t.querySelectorAll("span, div, p")).find(r=>{const i=(r.textContent||"").toLowerCase();return i.includes("your file can't be uploaded")||i.includes("file can't be uploaded")||i.includes("আপলোড করা যাবে না")||i.includes("আপলোড করা যায়নি")||i.includes("couldn't be uploaded")});return((o=n==null?void 0:n.textContent)==null?void 0:o.trim())||"Your file can't be uploaded"}return null}async function Ko(t,e){if(!e||e.length===0)return!0;const o=e.some(l=>l.includes("video")||l.includes(".mp4")||l.includes(".mov")||l.includes(".webm")||l.includes("data:video"));let n=oo(t);if(!n){const l=Yo(t);if(l){l.scrollIntoView({behavior:"instant",block:"center"}),l.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0})),l.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0,cancelable:!0})),l.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,cancelable:!0})),l.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0,cancelable:!0})),l.click();const u=Date.now();for(;Date.now()-u<2500&&(n=oo(t),!n);)await D(20)}}if(!n)return console.warn("[AGP:AutoPost] File input not found inside create post modal."),!1;const r=new DataTransfer,i=await Promise.all(e.map((l,u)=>Wo(l,`media_${u+1}`)));for(const l of i)l&&l.size>0&&(r.items.add(l),console.log(`[AGP:AutoPost] Prepared media file: ${l.name} (${l.type}, ${l.size} bytes)`));if(r.files.length===0)return console.warn("[AGP:AutoPost] No valid non-empty files prepared from mediaList."),!1;n.files=r.files;const a=n._valueTracker;a&&a.setValue(""),n.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0})),n.dispatchEvent(new Event("input",{bubbles:!0,cancelable:!0}));const s=o?12e3:4e3,c=Date.now();for(;Date.now()-c<s;){const l=Oe(t);if(l)return console.warn("[AGP:AutoPost] Facebook upload error detected:",l),!1;if(!!t.querySelector('video, img[src*="blob:"], img[src*="data:"], img[src*="fbcdn.net"], div[aria-label*="Video" i], div[aria-label*="Photo" i], div[data-pagelet*="MediaViewer"], div[aria-label*="Edit" i], button[aria-label*="Edit" i], div[aria-label*="Remove" i], div[role="button"][aria-label*="Edit" i]')){console.log("[AGP:AutoPost] Media preview mounted immediately in composer.");break}await D(10)}return!Oe(t)}function no(t,e){return t.includes("joined")||t.includes("যোগ দিয়েছেন")||t.includes("মেম্বার")||t.includes("member")||t.includes("leave group")||t.includes("গ্রুপ ত্যাগ")||e.includes("joined")||e.includes("যোগ দিয়েছেন")||e.includes("member")}function De(){const t=['[aria-label*="Join group" i]','[aria-label*="Join Group" i]','[aria-label*="গ্রুপে যোগ দিন" i]','[aria-label*="যোগ দিন" i]','[aria-label*="গ্রুপে যুক্ত হন" i]','[aria-label*="Request to join" i]','[aria-label*="Request to Join" i]','[aria-label*="গ্রুপে যোগ দেওয়ার অনুরোধ" i]','[aria-label*="যোগ দেওয়ার অনুরোধ" i]','[aria-label*="গ্রুপে যোগদানের অনুরোধ" i]','div[role="button"][aria-label*="Join" i]','div[role="button"][aria-label*="যোগ" i]','button[aria-label*="Join" i]','button[aria-label*="যোগ" i]'];for(const o of t){const n=document.querySelector(o);if(n&&W(n)){const r=(n.innerText||n.textContent||"").trim().toLowerCase(),i=(n.getAttribute("aria-label")||"").toLowerCase();if(!no(r,i))return n}}const e=Array.from(document.querySelectorAll('div[role="main"] [role="button"], div[role="main"] button, div[role="region"] [role="button"], [role="banner"] [role="button"], div[role="button"], button'));for(const o of e){if(!W(o))continue;const n=(o.innerText||o.textContent||"").trim().toLowerCase(),r=(o.getAttribute("aria-label")||"").toLowerCase();if(!no(n,r)&&(n==="join group"||n==="join"||n==="গ্রুপে যোগ দিন"||n==="যোগ দিন"||n==="গ্রুপে যুক্ত হন"||n==="request to join"||n==="request to join group"||n==="যোগ দেওয়ার অনুরোধ"||n==="যোগ দেওয়ার অনুরোধ জানান"||n.includes("join group")||n.includes("গ্রুপে যোগ দিন")))return o}return null}function Lt(){const t=!!De(),e=!!Be();return t&&!e}async function ro(){const t=De();if(!t)return{success:!1,isInstantMember:!1,reason:"Join button not found"};console.log("[AGP:AutoJoin] Found Join button. Executing automatic join click..."),O="⚡ Auto-joining group (গ্রুপে যোগ দেওয়া হচ্ছে)...",G(),M("⚡ Auto-joining group...",!0),t.scrollIntoView({behavior:"instant",block:"center"}),await D(10);const e={bubbles:!0,cancelable:!0,view:window};t.dispatchEvent(new PointerEvent("pointerdown",e)),t.dispatchEvent(new MouseEvent("mousedown",e)),t.dispatchEvent(new PointerEvent("pointerup",e)),t.dispatchEvent(new MouseEvent("mouseup",e)),t.click();const o=Date.now();let n=null;for(;Date.now()-o<350&&(n=document.querySelector('div[role="dialog"]'),!(n&&W(n)));){const c=Be();if(c&&W(c))break;await D(15)}if(n&&W(n)){console.log("[AGP:AutoJoin] Rules agreement or membership question dialog detected. Handling...");const c=Array.from(n.querySelectorAll('input[type="checkbox"], div[role="checkbox"]'));for(const d of c)d.getAttribute("aria-checked")==="true"||d.checked||d.click();const l=Array.from(n.querySelectorAll('textarea, input[type="text"]'));for(const d of l)(!d.value||!d.value.trim())&&(d.value="Agree",d.dispatchEvent(new Event("input",{bubbles:!0})),d.dispatchEvent(new Event("change",{bubbles:!0})));const u=Array.from(n.querySelectorAll('button, [role="button"], input[type="submit"]')).find(d=>{const b=(d.innerText||d.textContent||d.getAttribute("aria-label")||"").trim().toLowerCase();return b==="submit"||b==="send"||b==="agree"||b==="confirm"||b==="সাবমিট"||b==="জমা দিন"||b==="সম্মতি দিচ্ছি"||b.includes("submit")||b.includes("সাবমিট")});if(u&&W(u)){console.log("[AGP:AutoJoin] Clicking modal submit button..."),u.click();const d=Date.now();for(;Date.now()-d<600&&document.querySelector('div[role="dialog"]');)await D(20)}}const r=Date.now();for(;Date.now()-r<3500;){let c=Be();if(c&&W(c))return console.log("[AGP:AutoJoin] Instant membership granted! Composer available."),M("✅ Joined group! Post box ready.",!0),{success:!0,isInstantMember:!0,reason:"Instant member"};Date.now()-r>1e3&&window.scrollY<200&&window.scrollBy({top:300,behavior:"instant"}),await D(25)}const i=(document.body?document.body.innerText:"").toLowerCase();return i.includes("requested")||i.includes("pending")||i.includes("অনুরোধ করা হয়েছে")||i.includes("cancel request")||i.includes("অনুরোধ বাতিল")?(console.log("[AGP:AutoJoin] Join request sent (Pending admin approval)."),{success:!0,isInstantMember:!1,reason:"Join request pending admin approval"}):Be()?{success:!0,isInstantMember:!0,reason:"Instant member"}:De()?{success:!0,isInstantMember:!1,reason:"Join submitted"}:(console.log("[AGP:AutoJoin] Join button disappeared. Group is joined, proceeding to post..."),{success:!0,isInstantMember:!0,reason:"Instant member"})}function io(){if(Ke())return{forbidden:!0,reason:"Group unavailable or broken link"};const t=(document.body?document.body.innerText:"").toLowerCase();return t.includes("only admins can post")||t.includes("শুধুমাত্র অ্যাডমিনরা এই গ্রুপে পোস্ট করতে পারবেন")||t.includes("শুধুমাত্র অ্যাডমিনরা পোস্ট করতে পারবেন")||t.includes("posting is paused for this group")||t.includes("posting is turned off")||t.includes("এই গ্রুপের জন্য পোস্ট করা সাময়িকভাবে বন্ধ আছে")||t.includes("posting in this group has been paused")?{forbidden:!0,reason:"Posting is paused or admin-only in this group"}:t.includes("you can't post to this group")||t.includes("you've been temporarily blocked")||t.includes("you have been muted")||t.includes("আপনার অ্যাকাউন্ট সাময়িকভাবে ব্লক করা হয়েছে")||t.includes("আপনাকে এই গ্রুপে পোস্ট করা থেকে সাময়িকভাবে নিষিদ্ধ করা হয়েছে")?{forbidden:!0,reason:"Account restricted or muted in this group"}:{forbidden:!1,reason:""}}let so=!1;async function K(t){if(!(so||!(w!=null&&w.queueItem))){so=!0,X=!1,U&&(clearInterval(U),U=null);try{window.onbeforeunload=null}catch{}console.warn(`[AGP:AutoPost] Auto-skipping group: ${t}`),O=`⚡ Auto-skipping: ${t}...`,G(),M(`⚡ Auto-skipping: ${t}...`,!0),await D(200),chrome.runtime.sendMessage({type:"SKIP_CURRENT_ITEM",payload:{itemId:w.queueItem.id,reason:t}})}}async function Qo(t,e=15e3){const o=Date.now();let n=0;for(;Date.now()-o<e;){const r=[t,...Array.from(document.querySelectorAll('[role="dialog"]'))];for(const i of r){const a=Array.from(i.querySelectorAll('[role="button"], button'));for(const s of a){const c=(s.getAttribute("aria-label")||"").toLowerCase().trim(),l=(s.textContent||"").toLowerCase().trim(),u=s.getAttribute("aria-disabled")==="true"||s.disabled||s.classList.contains("aria-disabled")||s.classList.contains("disabled");if((c==="post"||c==="publish"||c==="submit"||c==="submit for review"||c==="পোস্ট"||c==="সাবমিট"||c==="পোস্ট করুন"||c==="সাবমিট করুন"||c.includes("post to group")||c.includes("গ্রুপে পোস্ট")||c.includes("submit for review")||c.includes("রিভিউ")||l==="post"||l==="পোস্ট"||l==="publish"||l==="submit"||l==="submit for review"||l==="পোস্ট করুন"||l==="সাবমিট"||l==="সাবমিট করুন"||l==="post to group"||l==="পাবলিশ"||l.includes("submit for review")||l.includes("রিভিউয়ের জন্য সাবমিট"))&&!u)return s.scrollIntoView({behavior:"instant",block:"center"}),s.style.outline="3px solid #10b981",s.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0})),s.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0,cancelable:!0})),s.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,cancelable:!0})),s.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0,cancelable:!0})),s.click(),!0}}if(Date.now()-n>2500){n=Date.now();const i=Math.round((Date.now()-o)/1e3);i>=4&&(O=`⚡ Step 4/4: Media processing & uploading (${i}s)...`,G())}await D(20)}return!1}async function pt(){if(X||!w||!w.queueItem)return;if(Ke()){await K("Group unavailable on Facebook");return}if(!w.isGroupMatch){await K("Wrong group URL detected");return}if(Lt()||De()){X=!0,O="⚡ Step 0/4: Auto-joining group (গ্রুপে যোগ দেওয়া হচ্ছে)...",G(),M("⚡ Auto-joining group...",!0);const e=await ro();if(e.isInstantMember)console.log("[AGP:AutoPost] Successfully auto-joined group! Proceeding with post immediately..."),O="⚡ Joined! Step 1/4: Opening Post Box...",G(),M("✅ Joined! Now opening post box...",!0);else{O=`⚡ ${e.reason}. Advancing to next group...`,G(),M(`⚡ ${e.reason}`,!0),await D(100),await K(e.reason);return}}const t=io();if(t.forbidden){await K(t.reason);return}X=!0,O="⚡ Step 1/4: Opening Post Box...",G();try{const e=await Ho();if(!e){if(Ke()){await K("Group unavailable on Facebook");return}await K("Could not open Facebook post box");return}O="⚡ Step 2/4: Typing caption...",G();const o=w.caption||w.formattedPost||"";o&&o.trim()&&(await to(e,o)||(console.warn("[AGP:AutoPost] Caption injection check returned false, but clipboard has caption. Proceeding to photos..."),M("⚠️ Caption in clipboard (Ctrl+V ready)")));const n=w.media||[],r=n.some(f=>f.includes("video")||f.includes(".mp4")||f.includes(".mov")||f.includes(".webm")||f.includes("data:video")),i=n.filter(f=>!f.includes("video")&&!f.includes(".mp4")&&!f.includes(".mov")&&!f.includes(".webm")&&!f.includes("data:video")).length,a=n.length-i;if(n.length>0){let f=`${n.length} files`;if(i>0&&a>0?f=`${i} photos + ${a} video`:a>0?f=`${a} video`:f=`${i} photos`,O=`⚡ Step 3/4: Attaching ${f}...`,G(),!await Ko(e,n)){const A=Oe(e);if(A){console.warn("[AGP:AutoPost] Upload rejected by Facebook:",A),O=`❌ Upload failed: ${A}`,G(),await K(`Media rejected by Facebook: ${A}`);return}console.warn("[AGP:AutoPost] Media attachment warning - continuing post workflow")}}if(O=r?"⚡ Step 4/4: Video uploading & submitting post... (ভিডিও আপলোড হচ্ছে)":"⚡ Step 4/4: Submitting post...",G(),!await Qo(e,r?9e4:2e4)){const f=Oe(e);f?await K(`Facebook upload error: ${f}`):await K("Post button disabled or timed out");return}O="⚡ Post submitted! Shifting to next group...",G();const l=Date.now();let u=!1;const d=r?25e3:3500;for(;Date.now()-l<d;){const f=Ye();if(!f){console.log("[AGP:AutoPost] Composer dialog closed cleanly. Post submitted successfully!"),u=!0;break}const m=Oe(f);if(m){console.warn("[AGP:AutoPost] Post aborted due to Facebook file error:",m),O=`❌ Upload error: ${m}`,G(),await K(`Facebook upload error: ${m}`);return}const A=Array.from(document.querySelectorAll('[role="dialog"]'));for(const y of A){const E=(y.textContent||"").toLowerCase();if(E.includes("pending")||E.includes("approval")||E.includes("admin")||E.includes("অনুমোদনের অপেক্ষায়")||E.includes("অনুমোদন")||E.includes("সাবমিট করা হয়েছে")||E.includes("আপনার পোস্টটি জমা দেওয়া হয়েছে")){const L=Array.from(y.querySelectorAll('[role="button"], button')).find(N=>{const I=(N.textContent||"").toLowerCase().trim();return I==="done"||I==="ok"||I==="ঠিক আছে"||I==="close"||I==="বন্ধ করুন"||I==="got it"});if(L){L.click(),u=!0;break}}}if(u)break;await D(10)}if(!u){const f=Ye();if(f){const m=Oe(f);if(m){console.warn("[AGP:AutoPost] Facebook upload error remained:",m),O=`❌ Upload failed: ${m}`,G(),await K(`Facebook upload error: ${m}`);return}if(!!f.querySelector('[aria-disabled="true"], button[disabled]')){console.warn("[AGP:AutoPost] Post button remained disabled after wait"),O="❌ Post button stayed disabled",G(),await K("Post button disabled or upload blocked by Facebook");return}}}try{window.onbeforeunload=null}catch{}O="⚡ Post submitted! Moving to next group...",G();const b=w.queueIndex,p=w.totalQueueItems,g=(w.postedCount||b-1)+1;M(`⚡ Auto-Posted to Group #${b}! (${g}/${p} done)`),chrome.runtime.sendMessage({type:"MARK_AS_POSTED",payload:{itemId:w.queueItem.id}})}catch(e){const o=e instanceof Error?e.message:String(e);console.log("[AGP:AutoPost] Routine caught error, auto-skipping:",o),await K(o||"Posting failed")}}function Xo(){if(he||X||!(w!=null&&w.queueItem))return;if(Ke()){O="⚡ Group unavailable on Facebook. Auto-skipping...",G(),setTimeout(()=>{K("Group unavailable on Facebook")},10);return}if(!w.isGroupMatch){O="⚡ Wrong group detected. Auto-skipping to next group...",G(),M("⚠️ Wrong group detected. Auto-skipping...",!0),setTimeout(()=>{he||K("Wrong group URL detected")},20);return}if(Lt()||De()){O="⚡ Not joined: Auto-joining group...",G(),M("⚡ Auto-joining group...",!0),U&&clearInterval(U),U=null,setTimeout(()=>{!he&&!X&&pt()},0);return}const t=io();if(t.forbidden){O=`⚡ Cannot post: ${t.reason}. Auto-skipping...`,G(),setTimeout(()=>{K(t.reason)},20);return}O="⚡ Instant Auto-Posting in progress...",G(),U&&clearInterval(U),U=null,setTimeout(()=>{!he&&!X&&pt()},0)}function G(){var g,f,m,A,y,E,L,N,I,oe,z,de,R,Z,ae,_e,Le,se,ee,xe,ve;if(ut||!_)return;const t=ke(),e=qe();if(!t.isGroupPage){const $=!!(Ne!=null&&Ne.isRunning),H=!!(Ne!=null&&Ne.isPaused),be=0,x=0,k=0;_.innerHTML=`
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

      ${Pe?`
        <div class="launcher-pill" id="agp-launcher-btn" title="Click to open AI Group Poster Assistant">
          <div class="badge-logo">AI</div>
          <span class="launcher-title">AI Group Poster</span>
          ${$?`
            <span class="status-pill running">
              <span class="pulse-dot"></span>
              Auto-Posting (${be}/${x})
            </span>
          `:H?`
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
              ${$?'<span class="status-pill running"><span class="pulse-dot"></span> Auto-Posting</span>':H?'<span class="status-pill paused">⏸️ Paused</span>':'<span class="status-pill ready">⚡ Ready</span>'}
            </div>
            <div class="header-actions">
              <button class="icon-btn" id="agp-toggle-btn" title="Minimize">▼ Minimize</button>
              <button class="close-btn" id="agp-close-btn" title="Stop & Close (ডাইরেক্ট অফ)">✕</button>
            </div>
          </div>

          <div class="panel-body">
            ${$?`
              <div class="progress-container">
                <div class="progress-label">
                  <span>Posting: <strong>${be} of ${x}</strong> Groups</span>
                  <span>${k}%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: ${k}%"></div>
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

              ${H?`
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

            ${$?`
              <button class="action-btn" id="btn-open-dashboard" style="width: 100%;">
                Open Full Dashboard ↗
              </button>
            `:""}
          </div>
        </div>
      `}
    `,(g=_.getElementById("agp-launcher-btn"))==null||g.addEventListener("click",P=>{var C;(C=P.target)!=null&&C.closest("#agp-launcher-close")||(Pe=!1,G())}),(f=_.getElementById("agp-toggle-btn"))==null||f.addEventListener("click",()=>{Pe=!0,G()}),(m=_.getElementById("agp-close-btn"))==null||m.addEventListener("click",P=>{P.stopPropagation(),_t()}),(A=_.getElementById("agp-launcher-close"))==null||A.addEventListener("click",P=>{P.stopPropagation(),_t()}),(y=_.getElementById("btn-focus-tab"))==null||y.addEventListener("click",()=>{}),(E=_.getElementById("btn-pause-queue"))==null||E.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"PAUSE_QUEUE"},()=>{M("Auto-posting paused"),Qe()})}),(L=_.getElementById("btn-resume-queue"))==null||L.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"RESUME_QUEUE"},()=>{M("Resuming auto-posting..."),Qe()})}),(N=_.getElementById("btn-start-queue"))==null||N.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"START_QUEUE"},()=>{M("Starting auto-posting queue..."),Qe()})}),(I=_.getElementById("btn-sync-groups"))==null||I.addEventListener("click",()=>{window.location.href="https://www.facebook.com/groups/joins/?nav_source=tab"}),(oe=_.getElementById("btn-open-dashboard"))==null||oe.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})});return}const o=w==null?void 0:w.group,n=w==null?void 0:w.post,r=(w==null?void 0:w.queueIndex)||1,i=(w==null?void 0:w.totalQueueItems)||1,a=(w==null?void 0:w.postedCount)??Math.max(0,r-1),s=i>0?Math.round(a/i*100):0,c=(w==null?void 0:w.formattedPost)||(n==null?void 0:n.description)||"",l=(w==null?void 0:w.caption)||(n==null?void 0:n.caption)||(n==null?void 0:n.description)||"",u=w!=null&&w.media?w.media.length:n!=null&&n.images?n.images.length:0,d=w?w.isGroupMatch:!0,b=(w==null?void 0:w.expectedGroupName)||(o==null?void 0:o.name)||"Expected Group",p=t.groupName||"Current Page";_.innerHTML=`
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
        display: ${Pe?"none":"block"};
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
        max-height: ${dt?"160px":"55px"};
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
            ${Pe?"▲ Expand":"▼ Minimize"}
          </button>
          <button class="icon-btn close-btn" id="agp-close-btn" title="Stop & Close (ডাইরেক্ট অফ)">✕</button>
        </div>
      </div>

      <div class="panel-body">
        ${d?"":`
          <div class="warning-box">
            <strong>⚠️ Wrong Group Detected!</strong><br/>
            Expected: <strong>${b}</strong><br/>
            Current page: <em>${p}</em><br/>
            <span style="font-size: 11px; color: #fca5a5;">Auto-skipping to next group...</span>
          </div>
        `}

        <div class="progress-container">
          <div class="progress-label">
            <span>Posted: <strong>${a} of ${i}</strong> Groups</span>
            <span>${s}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${s}%"></div>
          </div>
        </div>

        <div class="autopost-box">
          <div class="autopost-header">
            <span class="pulse-dot"></span>
            <span>${X?"Auto-Posting in Progress":he?"Auto-Pilot Paused":"Auto-Pilot Running"}</span>
          </div>
          <div class="autopost-status-text">${O}</div>
        </div>

        <div class="meta-row">
          <span class="group-name" title="${b}">${b}</span>
          <span class="queue-badge">Queue ${r} / ${i}</span>
        </div>

        <div class="post-card">
          <div class="post-title">${(n==null?void 0:n.productName)||(n==null?void 0:n.title)||"Prepared Listing"}</div>
          ${u>0?((n==null?void 0:n.images)||(w==null?void 0:w.media)||[]).some($=>$.includes("video")||$.includes("data:video")||$.endsWith(".mp4")||$.endsWith(".webm")||$.endsWith(".mov"))?`<div class="media-badge" style="background:#065f46;color:#6ee7b7;border:1px solid #059669;">🎬 Video Attached (${u})</div>`:`<div class="media-badge">📷 ${u} Photos attached</div>`:""}
          <div class="post-preview">${l||c||"No prepared caption."}</div>
        </div>

        <button class="auto-btn ${X?"running":""}" id="btn-auto-post">
          ${X?"⏸️ Pause Auto-Posting":"🤖 Auto-Post Now"}
        </button>

        ${Lt()||De()?`<button class="action-btn" id="btn-auto-join" style="background:#2563eb;color:#ffffff;font-weight:700;margin-top:6px;width:100%;justify-content:center;box-shadow:0 2px 4px rgba(37,99,235,0.3);">
                ➕ Auto-Join Group (গ্রুপে যোগ দিন)
              </button>`:""}

        <button class="action-btn primary-btn" id="btn-mark-posted">
          ✅ Mark Posted & Next Group
        </button>

        <div class="button-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
          <button class="action-btn" id="btn-toggle-caption">
            ${dt?"Collapse":"👁️ View"}
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
  `,(z=_.getElementById("agp-toggle-btn"))==null||z.addEventListener("click",()=>{Pe=!Pe,G()}),(de=_.getElementById("agp-close-btn"))==null||de.addEventListener("click",$=>{$.stopPropagation(),_t()}),(R=_.getElementById("btn-auto-post"))==null||R.addEventListener("click",()=>{X?(he=!0,X=!1,O="Auto-posting paused by user",U&&clearInterval(U),M("Auto-posting paused"),G()):(he=!1,U&&clearInterval(U),pt())}),(Z=_.getElementById("btn-auto-join"))==null||Z.addEventListener("click",async()=>{const $=_==null?void 0:_.getElementById("btn-auto-join");$&&($.textContent="⏳ Joining..."),(await ro()).isInstantMember&&pt()}),(ae=_.getElementById("btn-toggle-caption"))==null||ae.addEventListener("click",()=>{dt=!dt,G()}),(_e=_.getElementById("btn-copy-caption"))==null||_e.addEventListener("click",async()=>{const H=xt(l||c).replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),be=St(H);await Xt(H,be)&&M("📋 Caption & Design copied (Ctrl+V ready)!")}),(Le=_.getElementById("btn-paste-caption"))==null||Le.addEventListener("click",async()=>{const H=xt(l||c).replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),be=document.querySelector('[role="dialog"]')||document.body;M("✨ Pasting caption with exact styling..."),await to(be,H)?M("✅ Caption pasted with exact design!"):M("⚠️ Click inside post box and press Ctrl+V",!0)}),(se=_.getElementById("btn-mark-posted"))==null||se.addEventListener("click",()=>{var $;U&&clearInterval(U);try{window.onbeforeunload=null}catch{}chrome.runtime.sendMessage({type:"MARK_AS_POSTED",payload:{itemId:($=w==null?void 0:w.queueItem)==null?void 0:$.id}},()=>{M("Marked as Posted! Moving to next group...")})}),(ee=_.getElementById("btn-skip"))==null||ee.addEventListener("click",()=>{var $;U&&clearInterval(U);try{window.onbeforeunload=null}catch{}chrome.runtime.sendMessage({type:"SKIP_CURRENT_ITEM",payload:{itemId:($=w==null?void 0:w.queueItem)==null?void 0:$.id,reason:"Skipped by user"}},()=>{M("Skipped group. Moving to next...")})}),(xe=_.getElementById("btn-pause"))==null||xe.addEventListener("click",()=>{U&&clearInterval(U),he=!0,X=!1,chrome.runtime.sendMessage({type:"PAUSE_QUEUE"},()=>{M("Posting Session Paused")})}),(ve=_.getElementById("btn-open-dashboard"))==null||ve.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})})}function Zo(){ut||(Ee||(Ee=document.createElement("div"),Ee.id="ai-group-poster-dock-root",document.body.appendChild(Ee),_=Ee.attachShadow({mode:"open"})),G())}function Qe(){var o;if(ut)return;const t=ke(),e=qe();e.isLoggedIn&&chrome.runtime.sendMessage({type:"FB_USER_PROFILE_DETECTED",payload:e}),t.isGroupPage?(chrome.runtime.sendMessage({type:"FB_PAGE_DETECTED",payload:{url:t.canonicalUrl,groupIdOrSlug:t.groupIdOrSlug,pageTitle:t.groupName}}),chrome.runtime.sendMessage({type:"GET_ACTIVE_POST_FOR_TAB",payload:{url:t.canonicalUrl}},n=>{chrome.runtime.lastError||n!=null&&n.isUserTab||n&&n.payload&&(w=n.payload,Zo(),w&&w.queueItem&&Xo())})):Oo()&&(console.log("[AGP:Content] Facebook Group Search Page detected."),It(),typeof chrome<"u"&&((o=chrome.storage)!=null&&o.local)&&chrome.storage.local.get(["agp_pending_auto_join","agp_auto_join_config"],n=>{const r=n==null?void 0:n.agp_pending_auto_join,i=n==null?void 0:n.agp_auto_join_config;if(r&&r.active&&Date.now()-(r.requestedAt||0)<9e4){console.log("[AGP:Content] Detected pending Auto-Join request. Starting auto-joiner..."),chrome.storage.local.remove("agp_pending_auto_join");const a=r.config||i||{searchUrl:window.location.href,delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0};It(a),setTimeout(()=>{Y.getInstance().start(a)},1500)}}))}let Xe=!1;function ao(t=0,e){if(typeof document>"u"||!document.body)return;Xe=!1;const o=document.getElementById("agp-sync-window-overlay");o&&o.remove();const n=document.createElement("div");n.id="agp-sync-window-overlay",n.innerHTML=`
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
  `,n.style.cssText=`
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
  `,document.body.appendChild(n);const r=document.getElementById("agp-sync-finish-btn");r&&(r.onclick=()=>{Xe=!0,r.innerHTML="<span>Saving...</span>",r.style.opacity="0.7",r.style.pointerEvents="none"});const i=document.getElementById("agp-sync-cancel-btn");i&&(i.onclick=()=>{Xe=!0,Ze()})}function ft(t,e){const o=document.getElementById("agp-sync-counter-badge");o&&(o.innerText=e?`${t} / ${e} Found`:`${t} Found`);const n=document.getElementById("agp-sync-btn-count");n&&(n.innerText=String(t));const r=document.getElementById("agp-sync-status-text");r&&t>0&&(r.innerText=`Found ${t} groups. Scrolling for more...`)}function Ze(){const t=document.getElementById("agp-sync-window-overlay");t&&t.remove()}let gt=null;chrome.runtime.onMessage.addListener((t,e,o)=>{if(t.type==="START_GROUP_DISCOVERY")return(async()=>{try{console.log("[AGP:Content] Starting deep group discovery scan on current Facebook page...");const n=qe(),r=n.userId||n.name||void 0;ao(),lo();const i=await Nt({maxRounds:350,stagnantLimit:35,scrollDelayMs:300,accountContext:r,shouldStop:()=>Xe,onBatchDiscovered:async(l,u,d)=>{gt=d;const b=bt(),p=[...l];for(const g of b)p.find(f=>f.groupId.toLowerCase()===g.groupId.toLowerCase())||p.push(g);ft(p.length);try{chrome.runtime.sendMessage({type:"GROUP_BATCH_DISCOVERED",payload:{liveGroups:p,verifiedCount:p.length,duplicatesRemoved:(d==null?void 0:d.duplicatesRemoved)||0,debugMetrics:d}})}catch{}try{await nt(p,{syncMode:"merge",accountContext:r})}catch(g){console.warn("[AGP:Content] Progressive batch merge error:",g)}},onProgress:(l,u,d,b)=>{gt=b;const p=ge.size,g=Math.max(l,p);ft(g,d);try{chrome.runtime.sendMessage({type:"GROUP_DISCOVERY_PROGRESS",payload:{foundCount:g,status:u,targetCount:d,debugMetrics:b}})}catch{}}}),a=bt();if(a.length>0)try{await nt(a,{syncMode:"merge",accountContext:r})}catch{}const s=[...i.groups];for(const l of a)s.find(u=>u.groupId.toLowerCase()===l.groupId.toLowerCase())||s.push(l);const c=Math.max(i.totalFound,s.length);gt=i.debugMetrics,Ze(),o({success:!0,payload:{groups:s,sourceUrl:window.location.href,isLoggedIn:i.isLoggedIn,totalFoundOnPage:c,profile:n,outcome:i.outcome,completionReason:i.completionReason,isPartial:i.isPartial,debugMetrics:i.debugMetrics}})}catch(n){Ze();const r=n instanceof Error?n.message:String(n);o({success:!1,error:r})}})(),!0;if(t.type==="CANCEL_GROUP_DISCOVERY")return Ze(),M("AI Group Poster: Discovery cancelled.",!0),o({success:!0}),!1;if(t.type==="GET_DEBUG_METRICS")return o({success:!0,debugMetrics:gt}),!1;if(t.type==="CHECK_FACEBOOK_SESSION"){const n=tt(),r=qe();return o({success:!0,isLoggedIn:n,profile:r,currentUrl:window.location.href}),!1}if(t.type==="GET_FACEBOOK_USER_INFO")return(async()=>{try{const n=tt(),r=qe();let a=ht(r.userId||r.name||void 0).items;o({success:!0,isLoggedIn:n,profile:r,groups:a,totalGroups:a.length,currentUrl:window.location.href})}catch(n){const r=n instanceof Error?n.message:String(n);o({success:!1,error:r})}})(),!0;if(t.type==="START_AUTO_JOIN"||t.type==="AUTO_JOIN_START_ON_PAGE")return(async()=>{try{const n=t.payload||{},r={...n,delaySec:typeof n.delaySec=="number"?n.delaySec:0};It(r);const i=await Y.getInstance().start(r);o({success:!0,state:i})}catch(n){const r=n instanceof Error?n.message:String(n);o({success:!1,error:r})}})(),!0;if(t.type==="PAUSE_AUTO_JOIN"||t.type==="AUTO_JOIN_PAUSE_ON_PAGE")return Y.getInstance().pause(),o({success:!0}),!1;if(t.type==="RESUME_AUTO_JOIN"||t.type==="AUTO_JOIN_RESUME_ON_PAGE")return Y.getInstance().resume(),o({success:!0}),!1;if(t.type==="STOP_AUTO_JOIN"||t.type==="AUTO_JOIN_STOP_ON_PAGE")return Y.getInstance().stop(),o({success:!0}),!1;if(t.type==="GET_AUTO_JOIN_STATE"){const n=Y.getInstance().getState();return o({success:!0,state:n}),!1}});let Tt=!1,ge=new Map;function lo(){if(typeof window>"u"||window.__agpFetchIntercepted)return;window.__agpFetchIntercepted=!0;const t=window.fetch;window.fetch=async function(...e){var n;const o=await t.apply(this,e);try{const r=typeof e[0]=="string"?e[0]:((n=e[0])==null?void 0:n.url)||"";(r.includes("/api/graphql")||r.includes("graphql"))&&o.clone().text().then(a=>{a.includes("Group")&&(a.includes("/groups/")||a.includes('__typename":"Group"'))&&en(a)}).catch(()=>{})}catch{}return o},console.log("[AGP:Content] GraphQL response interceptor installed")}function en(t){try{const e=/"__typename"\s*:\s*"Group"[^}]*?"id"\s*:\s*"(\d+)"[^}]*?"name"\s*:\s*"([^"]+)"/g;let o;for(;(o=e.exec(t))!==null;){const r=o[1],i=o[2].trim();r&&i&&i.length>=2&&ge.set(r,{name:i,id:r})}const n=/"node"\s*:\s*\{\s*"__typename"\s*:\s*"Group"\s*,\s*"id"\s*:\s*"(\d+)"\s*,\s*"name"\s*:\s*"([^"]+)"/g;for(;(o=n.exec(t))!==null;){const r=o[1],i=o[2].trim();r&&i&&i.length>=2&&ge.set(r,{name:i,id:r})}ge.size>0&&console.log(`[AGP:Content] GraphQL interceptor: total ${ge.size} groups captured`)}catch{}}function bt(){const t=[];for(const[e,o]of ge)t.push({name:o.name,url:`https://www.facebook.com/groups/${e}/`,groupId:e,privacy:"UNKNOWN",imageUrl:o.imageUrl});return t}async function co(){const t=window.location.href.toLowerCase();if((t.includes("/groups/joins")||t.includes("category=membership"))&&!Tt){Tt=!0,console.log("[AGP:Content] Detected Your Groups page (/groups/joins/)! Starting full auto-scan of all joined groups..."),M("AI Group Poster: Auto-scanning your joined groups..."),lo(),ao(0);try{const e=await Nt({maxRounds:350,stagnantLimit:35,scrollDelayMs:300,shouldStop:()=>Xe,onBatchDiscovered:async(r,i)=>{const a=bt(),s=[...r];for(const c of a)s.find(l=>l.groupId===c.groupId)||s.push(c);ft(s.length);try{await nt(s,{syncMode:"merge"})}catch(c){console.warn("[AGP:Content] Batch save err:",c)}},onProgress:(r,i,a)=>{const s=ge.size,c=Math.max(r,s);ft(c,a),M(`AI Group Poster: Found ${c}${a?` / ${a}`:""} groups...`);try{chrome.runtime.sendMessage({type:"GROUP_DISCOVERY_PROGRESS",payload:{foundCount:c,status:i,targetCount:a}})}catch{}}}),o=bt();if(o.length>0)try{await nt(o,{syncMode:"merge"}),console.log(`[AGP:Content] Final merge: added ${o.length} intercepted groups`)}catch{}const n=Math.max(e.totalFound,ge.size);M(`AI Group Poster: Sync complete! Found ${n} groups.`)}catch(e){console.warn("[AGP:Content] Auto-scan err:",e)}finally{Tt=!1,setTimeout(Ze,1500)}}}window.addEventListener("message",t=>{if(!(t.source!==window||!t.data)){if(t.data.type==="AGP_MAIN_GRAPHQL_GROUPS"&&Array.isArray(t.data.groups)){for(const e of t.data.groups)e.id&&e.name&&ge.set(e.id,{name:e.name,id:e.id});console.log(`[AGP:Content] Intercepted ${ge.size} groups from MAIN world GraphQL`)}t.data.type==="AGP_MAIN_URL_CHANGED"&&et()}}),chrome.runtime.onMessage.addListener(t=>{t&&t.type==="AGP_NAVIGATE_TO_GROUP"&&et()}),po(),Qe(),setTimeout(co,100);let uo=window.location.href;function et(){window.location.href!==uo&&(uo=window.location.href,po(),Qe(),setTimeout(co,100))}function po(){const t=window.location.hostname.toLowerCase();if(t.startsWith("m.")||t.includes("mbasic.")){if(document.getElementById("agp-mobile-banner"))return;const e=document.createElement("div");e.id="agp-mobile-banner",e.style.cssText=`
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
    `,e.innerHTML=`
      <div style="font-size: 11.5px; line-height: 1.4;">
        <strong>📱 AI Group Poster:</strong> মোবাইলে অটোমেশনের জন্য Kiwi Browser-এর ৩টি ডট (⋮) থেকে <strong>"Desktop site"</strong> অন করুন অথবা এখানে ট্যাপ করুন।
      </div>
      <div style="display: flex; align-items: center; gap: 6px;">
        <button id="agp-switch-desktop-btn" style="background: #3b82f6; border: none; border-radius: 6px; color: #fff; padding: 6px 10px; font-weight: bold; font-size: 11px; white-space: nowrap; cursor: pointer;">
          🖥️ Desktop Mode
        </button>
        <button id="agp-close-banner-btn" style="background: transparent; border: none; color: #94a3b8; font-size: 16px; cursor: pointer; padding: 2px 6px;">✕</button>
      </div>
    `,document.body.appendChild(e);const o=document.getElementById("agp-switch-desktop-btn");o&&(o.onclick=()=>{window.location.href=window.location.href.replace("://m.","://www.").replace("://mbasic.","://www.")});const n=document.getElementById("agp-close-banner-btn");n&&(n.onclick=()=>e.remove())}}window.addEventListener("popstate",et,{passive:!0}),window.addEventListener("hashchange",et,{passive:!0}),setInterval(et,1e3),setInterval(()=>{if(X||w&&w.queueItem)try{chrome.runtime.sendMessage({type:"KEEPALIVE_PING"},()=>{chrome.runtime.lastError})}catch{}},1e4)})();
