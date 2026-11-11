var on=Object.defineProperty;var nn=(ke,fe,Pe)=>fe in ke?on(ke,fe,{enumerable:!0,configurable:!0,writable:!0,value:Pe}):ke[fe]=Pe;var Ce=(ke,fe,Pe)=>nn(ke,typeof fe!="symbol"?fe+"":fe,Pe);(function(){"use strict";function ke(t){const e=[];if(!t||typeof t!="string")return{valid:!1,errors:["URL is required"]};const n=t.trim();if(!n)return{valid:!1,errors:["URL cannot be empty"]};let o=n;/^https?:\/\//i.test(o)||(o="https://"+o);let r;try{r=new URL(o)}catch{return{valid:!1,errors:["Invalid URL format"]}}const s=["facebook.com","www.facebook.com","web.facebook.com","m.facebook.com"],a=r.hostname.toLowerCase();s.some(g=>a===g||a.endsWith("."+g))||e.push("URL must be a Facebook domain (e.g. facebook.com, web.facebook.com)");const l=r.pathname.split("/").filter(Boolean),c=l.indexOf("groups");if(c===-1||c>=l.length-1)return e.push("URL must point directly to a Facebook group (e.g. /groups/group_name)"),{valid:!1,errors:e};const u=decodeURIComponent(l[c+1]);if(!u||["feed","discover","joins","about","settings","notifications","search","categories","create","help","privacy","support"].includes(u.toLowerCase()))return e.push("URL must point to a specific group, not a feed or discovery page"),{valid:!1,errors:e};const f=l.slice(c+2).map(g=>g.toLowerCase()),p=["permalink","posts","user","photos","videos","events","files","stories"];if(f.some(g=>p.includes(g)))return e.push("URL points to an individual post or permalink inside a group, not the group itself"),{valid:!1,errors:e};if(r.searchParams.has("comment_id")||r.searchParams.has("notif_id")||r.searchParams.has("notif_t"))return e.push("URL is a notification or comment permalink, not a group page"),{valid:!1,errors:e};const b=`https://www.facebook.com/groups/${u}/`;return{valid:e.length===0,errors:e,cleanUrl:b,groupId:u}}const fe={META_OG_TITLE:'meta[property="og:title"]',HEADER_H1:'h1[dir="auto"], h1 span'};function Pe(){if(typeof window>"u")return{isGroupPage:!1,groupIdOrSlug:"",groupName:"",canonicalUrl:"",isReady:!1};const t=window.location.href,e=ke(t);if(!e.valid||!e.groupId)return{isGroupPage:!1,groupIdOrSlug:"",groupName:"",canonicalUrl:t,isReady:!1};let n="";const o=document.querySelector(fe.META_OG_TITLE);if(o&&o.content&&(n=o.content.replace(/\s*\|\s*Facebook.*$/i,"").trim()),!n){const s=document.querySelector(fe.HEADER_H1);s&&s.innerText&&(n=s.innerText.trim())}!n&&document.title&&(n=document.title.replace(/\s*\|\s*Facebook.*$/i,"").trim()),n||(n=e.groupId.replace(/[-_.]+/g," "),n=n.charAt(0).toUpperCase()+n.slice(1));const r=document.readyState==="interactive"||document.readyState==="complete";return{isGroupPage:!0,groupIdOrSlug:e.groupId,groupName:n,canonicalUrl:e.cleanUrl||t,isReady:r}}const mt=new Set(["feed","discover","create","notifications","search","categories","joins","member-requests","expert_badge","settings","about","events","media","files","chats","manage","canvas","support","buy_sell_discussion","permalink","user","profile.php","hashtag","messages","marketplace","stories","reels","watch","gaming","members","photos","videos","posts"]),Re=new Set(["view group","visit","open","view","join","group","groups","view all","see all","see more","গ্রুপ দেখুন","দেখুন","সব দেখুন","যোগ দিন","গ্রুপে যান","আরও দেখুন"]);function fo(t){const e={"০":"0","১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9"};return t.replace(/[০-৯]/g,n=>e[n]||n)}function go(t){if(typeof document>"u")return{count:null,status:"UNAVAILABLE",rawText:""};const n=Array.from(document.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, div, p')),o=[/(?:All groups you['’]?ve joined|Groups you['’]?ve joined)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/(?:আপনার যোগ দেওয়া সমস্ত গ্রুপ|আপনার যোগ দেওয়া সব গ্রুপ|আপনি যেসব গ্রুপে যোগ দিয়েছেন|যোগ দেওয়া সমস্ত গ্রুপ|যোগ দেওয়া সব গ্রুপ|যোগ দেওয়া গ্রুপ|সব গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/^All groups you['’]?ve joined\s*[:\-•]?\s*([0-9,kKmM\u09E6-\u09EF.]+)$/i],r=[/(?:Joined Groups|Your Groups|আমার গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/(?:Groups|গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i],s=a=>{const i=fo(a).replace(/,/g,"").trim().toLowerCase();if(i.endsWith("k")){const c=parseFloat(i.replace("k",""));return isNaN(c)?null:Math.round(c*1e3)}if(i.endsWith("m")){const c=parseFloat(i.replace("m",""));return isNaN(c)?null:Math.round(c*1e6)}const l=parseInt(i,10);return isNaN(l)?null:l};for(const a of n){const i=(a.textContent||"").trim();if(!(i.length>120||i.length<3))for(const l of o){const c=i.match(l);if(c&&c[1]){const u=s(c[1]);if(u!==null&&u>0)return{count:u,status:"CONFIRMED",rawText:i}}}}for(const a of n){const i=(a.textContent||"").trim();if(!(i.length>80||i.length<3))for(const l of r){const c=i.match(l);if(c&&c[1]){const u=s(c[1]);if(u!==null&&u>0)return{count:u,status:"UNCERTAIN",rawText:i}}}}return{count:null,status:"UNAVAILABLE",rawText:""}}function bo(t=document){const e=["end of results","no more groups to show","you’ve reached the end","you've reached the end","সব গ্রুপ দেখানো হয়েছে","ফলাফলের সমাপ্তি"],n=t.querySelectorAll('div[role="status"], span[dir="auto"], div, p');for(const o of n){const r=(o.textContent||"").trim().toLowerCase();if(!(r.length>100||r.length<5)){for(const s of e)if(r.includes(s))return!0}}return!1}function qe(t){if(!t)return"";let e=t.trim();return e=e.replace(/^(?:Profile photo of|Profile picture of|Photo of|Cover photo of|প্রোফাইল ছবি|কভার ছবি)\s*/i,""),e=e.replace(/^(?:Visit group|Visit|Open group|Open|View group|View|গ্রুপ দেখুন|দেখুন|গ্রুপে যান)\s*/i,""),e=e.replace(/\s*(?:Last active|You last visited|last visited|active)\s+[^\n]+/i,""),e=e.replace(/\s*(?:গত|আগে|মিনিট আগে|ঘণ্টা আগে|দিন আগে)[^\n]*/i,""),e=e.replace(/\s*·\s*(?:Public group|Private group|পাবলিক গ্রুপ|প্রাইভেট গ্রুপ).*$/i,""),e=e.replace(/\s*·\s*\d+.*members.*$/i,""),e=e.replace(/\s*·\s*[০-৯\d]+.*সদস্য.*$/i,""),e=e.replace(/\s*·\s*[^\n]+/i,""),e.trim()}function mo(t){var d,f;const e=p=>({valid:!1,reason:p,name:"",url:"",groupId:"",privacy:"UNKNOWN"}),n=t.href||t.getAttribute("href")||"";if(!n||!n.includes("/groups/"))return e("Not a group link");if(n.includes("/permalink/")||n.includes("/posts/")||n.includes("/photos/")||n.includes("/videos/")||n.includes("comment_id=")||n.includes("notif_id="))return e("Post or photo permalink, not a group home");let o="";try{const b=new URL(n,"https://www.facebook.com").pathname.split("/").filter(Boolean),g=b.indexOf("groups");if(g!==-1&&b[g+1]){const m=b[g+1];try{o=decodeURIComponent(m)}catch{o=m}if(b.length>g+2){const A=b[g+2].toLowerCase();if(["posts","permalink","photos","videos","user","media"].includes(A))return e("Post or photo permalink, not a group home")}}}catch{return e("Malformed URL")}if(!o||mt.has(o.toLowerCase()))return e("Non-group system path");if(t.closest('[aria-label*="Notification" i], [aria-label*="বিজ্ঞপ্তি" i], [data-pagelet*="Notification" i]'))return e("Inside notification flyout");let r=t.closest('div[role="listitem"], div[role="article"], div[role="gridcell"], li, div[role="row"]');if(!r){let p=t.parentElement;for(let b=0;b<7&&p&&p!==document.body;b++){const g=(p.textContent||"").toLowerCase(),m=p.querySelectorAll?p.querySelectorAll('a[href*="/groups/"]').length:0;if(m>=1&&m<=5&&(g.includes("view group")||g.includes("visited")||g.includes("last active")||g.includes("গ্রুপ দেখুন"))){r=p;break}p=p.parentElement}r||(r=((d=t.parentElement)==null?void 0:d.parentElement)||t.parentElement)}if(r){const p=(r.textContent||"").toLowerCase();if(p.includes("sponsored")||p.includes("বিজ্ঞাপন")||r.querySelector('[aria-label*="Sponsored" i], [aria-label*="বিজ্ঞাপন" i]'))return e("Sponsored advertisement");if((r.querySelectorAll?Array.from(r.querySelectorAll('a[href*="/groups/"]')):[]).length<=4){if(p.includes("requested to join")||p.includes("অনুরোধ পাঠানো হয়েছে")||p.includes("answer questions")||p.includes("update responses")||p.includes("suggested for you")||p.includes("আপনার জন্য প্রস্তাবিত")||p.includes("suggested groups")||p.includes("প্রস্তাবিত গ্রুপ"))return e("Unjoined or suggested group");if(r.querySelectorAll){const m=Array.from(r.querySelectorAll('button, [role="button"]'));for(const A of m){const y=(A.textContent||A.getAttribute("aria-label")||"").trim().toLowerCase();if((y==="join"||y==="join group"||y==="যোগ দিন"||y==="গ্রুপে যোগ দিন"||y==="request to join")&&!p.includes("view group")&&!p.includes("গ্রুপ দেখুন")&&!p.includes("visited")&&!p.includes("last active"))return e("Card has Join button, not joined")}}}}let s="";const a=(t.getAttribute("aria-label")||"").trim();if(a&&a.length>=2&&!Re.has(a.toLowerCase())&&(s=qe(a)),!s){const p=(t.textContent||t.innerText||"").trim(),b=qe(p);b&&b.length>=2&&!Re.has(b.toLowerCase())&&(s=b)}if(!s){const p=Array.from(t.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, span'));for(const b of p){const g=qe((b.textContent||"").trim()),m=g.toLowerCase();if(g.length>=2&&!Re.has(m)&&!m.includes("last active")&&!m.includes("you last visited")&&!m.includes("members")&&!m.includes("সদস্য")&&!m.includes("ago")){s=g;break}}}if(!s&&r){const p=r.querySelector('h1, h2, h3, h4, [role="heading"]');if(p&&p.textContent){const b=qe(p.textContent.trim());b.length>=2&&!Re.has(b.toLowerCase())&&(s=b)}}if(!s&&r){const p=Array.from(r.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, a[href*="/groups/"] > span, a[href*="/groups/"], div[dir="auto"]'));for(const b of p){if(b===t)continue;const g=qe((b.textContent||"").trim()),m=g.toLowerCase();if(g.length>=2&&g.length<200&&!Re.has(m)&&!m.includes("view group")&&!m.includes("you last visited")&&!m.includes("last active")&&!m.includes("members")&&!m.includes("সদস্য")&&!m.includes("hours ago")&&!m.includes("minutes ago")&&!m.includes("days ago")&&!m.includes("weeks ago")&&!m.includes("ঘণ্টা আগে")&&!m.includes("দিন আগে")&&!m.includes("সপ্তাহ আগে")&&!/^\d+\s*(hours?|minutes?|days?|weeks?)\s*ago$/i.test(m)){s=g;break}}}s||(s=o.split(/[-_.]+/).filter(Boolean).map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join(" "));let i="";const l=r!=null&&r.querySelector?r.querySelector("img, image")||t.querySelector("img, image"):null;l&&(i=l.getAttribute("src")||l.getAttribute("href")||((f=l.href)==null?void 0:f.baseVal)||"",(i.includes("/rsrc.php/")||i.includes("spacer")||i.includes("1x1"))&&(i=""));let c="UNKNOWN";const u=p=>{const b=(p||"").toLowerCase();return b.includes("public group")||b.includes("পাবলিক গ্রুপ")||b.includes("public")||b.includes("পাবলিক")?"PUBLIC":b.includes("private group")||b.includes("প্রাইভেট গ্রুপ")||b.includes("private")||b.includes("প্রাইভেট")?"PRIVATE":"UNKNOWN"};if(r){const p=u(r.textContent||"");if(p!=="UNKNOWN")c=p;else if(r.querySelectorAll){const b=Array.from(r.querySelectorAll("span, div, p"));for(const g of b){const m=u(g.textContent||"");if(m!=="UNKNOWN"){c=m;break}}}}return c==="UNKNOWN"&&(c=u(t.textContent||"")),{valid:!0,name:s,url:`https://www.facebook.com/groups/${o}/`,groupId:o,imageUrl:i,privacy:c}}function tt(){if(typeof document>"u")return!1;const t=typeof window<"u"?window.location.href:"";if(t.includes("/login")||t.includes("/recover")||t.includes("/checkpoint"))return!1;const e=document.body&&(document.body.innerText||document.body.textContent)||"";return e.includes("What's on your mind")||e.includes("আপনার মনে কী আছে")||e.includes("কী ভাবছেন")||e.includes("Professional dashboard")||e.includes("Ads Manager")||e.includes("Meta Business Suite")?!0:!!document.querySelector('[role="navigation"], [data-pagelet="LeftRail"], [aria-label="Facebook"], input[placeholder*="Search" i], [aria-label*="profile" i], [aria-label*="Account" i], a[href*="/me/"], a[href*="/groups/"]')||!!(document.cookie&&document.cookie.includes("c_user"))}function je(){var i,l;if(typeof document>"u")return{isLoggedIn:!1,name:"",profileUrl:""};let t="",e="",n="",o="";if(document.body){const u=(document.body.innerText||document.body.textContent||"").match(/(?:What['’]s on your mind|আপনার মনে কী আছে|কী ভাবছেন)[,?\s]+([^?!\n]+?)(?:\?|$)/i);if(u&&u[1]){const d=u[1].trim().replace(/[?,!]+$/,"").trim();d.length>=2&&d.length<=50&&!d.toLowerCase().includes("facebook")&&(t=d)}}const r=Array.from(document.querySelectorAll('a[href*="/me/"], a[href*="facebook.com/profile"], [role="navigation"] a[href]'));for(const c of r){const u=c.getAttribute("href")||c.href||"",d=c.querySelector('span[dir="auto"], span, strong, h1'),f=(d?d.textContent:c.innerText||c.textContent||"").trim();if(f&&f.length>=2&&f.length<=35&&!["Home","Friends","Feeds","Groups","Watch","Marketplace","Memories","Saved","Video","Settings","Meta AI","Professional dashboard","Ads Manager","Ad Center","Meta Business Suite","See more","See all","Facebook","Menu","Notifications"].includes(f)){t||(t=f),!e&&u&&(e=u);const b=c.querySelector("image, img");if(b&&!n&&(n=b.getAttribute("src")||((i=b.href)==null?void 0:i.baseVal)||""),t)break}}const s=document.querySelector('[aria-label="Your profile" i], [aria-label*="Your profile" i], [aria-label*="Account Controls" i], [aria-label*="আপনার প্রোফাইল" i]');if(s&&!n){const c=s.querySelector("image, img");c&&(n=c.getAttribute("src")||((l=c.href)==null?void 0:l.baseVal)||"")}try{const c=Array.from(document.querySelectorAll("script"));for(const u of c){const d=u.textContent||"";if(d.includes('"NAME":')||d.includes('"USER_ID":')||d.includes('"short_name":')){const f=d.match(/"NAME":\s*"([^"]+)"/)||d.match(/"short_name":\s*"([^"]+)"/);if(f&&f[1]&&!t)try{t=JSON.parse(`"${f[1]}"`)}catch{t=f[1]}const p=d.match(/"USER_ID":\s*"(\d+)"/);if(p&&p[1]&&!o&&(o=p[1]),t)break}}}catch{}if(!o&&document.cookie){const c=document.cookie.match(/c_user=(\d+)/);c&&(o=c[1])}const a=tt()||!!(t||o);return{isLoggedIn:a,name:t||(a?"Facebook User":""),profileUrl:e||"https://www.facebook.com",avatarUrl:n,userId:o}}function ho(t){if(typeof document>"u")return[];const e=new Map,n=Date.now();try{const o=Array.from(document.querySelectorAll("script"));for(const r of o){const s=r.textContent||"";if(s.length<40)continue;const a=[/"__typename"\s*:\s*"Group"[\s\S]{0,500}?"id"\s*:\s*"(\d+)"[\s\S]{0,500}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,/"__typename"\s*:\s*"Group"[\s\S]{0,500}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,500}?"id"\s*:\s*"(\d+)"/g,/"node"\s*:\s*\{[\s\S]{0,120}?"__typename"\s*:\s*"Group"[\s\S]{0,350}?"id"\s*:\s*"(\d+)"[\s\S]{0,350}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,/"node"\s*:\s*\{[\s\S]{0,120}?"__typename"\s*:\s*"Group"[\s\S]{0,350}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,350}?"id"\s*:\s*"(\d+)"/g,/\{"id"\s*:\s*"(\d+)"[\s\S]{0,300}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,300}?(?:"__typename"\s*:\s*"Group"|url"\s*:\s*"https:[^"]*?\/groups\/[^"]+?")/g,/\{"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,300}?"id"\s*:\s*"(\d+)"[\s\S]{0,300}?(?:"__typename"\s*:\s*"Group"|url"\s*:\s*"https:[^"]*?\/groups\/[^"]+?")/g];for(const i of a){let l;for(;(l=i.exec(s))!==null;){let c="",u="";if(/^\d+$/.test(l[1])?(c=l[1],u=l[2]):/^\d+$/.test(l[2])&&(c=l[2],u=l[1]),c&&u){u=u.trim();try{u=u.replace(/\\u[\dA-Fa-f]{4}/g,f=>String.fromCharCode(parseInt(f.replace("\\u",""),16)))}catch{}const d=s.slice(Math.max(0,l.index-350),Math.min(s.length,l.index+600));if(d.includes('"__typename":"User"')||d.includes('"__typename":"Actor"')||d.includes('"__typename":"Story"')||d.includes('"__typename":"Comment"')||d.includes('"__typename":"Page"')||t&&u.toLowerCase()===t.toLowerCase())continue;if(u.length>=2&&!e.has(c)){let f="";const b=s.slice(Math.max(0,l.index-500),Math.min(s.length,l.index+1e3)).match(/"(?:uri|url|cover_photo|image)"\s*:\s*\{[^}]*"uri"\s*:\s*"([^"]+)"/);if(b&&b[1]){let g=b[1];try{g=g.replace(/\\u[\dA-Fa-f]{4}/g,m=>String.fromCharCode(parseInt(m.replace("\\u",""),16)))}catch{}!g.includes("/rsrc.php/")&&!g.includes("1x1")&&(f=g.replace(/\\\//g,"/"))}e.set(c,{name:Ot(u,c),url:`https://www.facebook.com/groups/${c}/`,groupId:c,privacy:"UNKNOWN",imageUrl:f,verified:!0,source:"facebook-ui",accountContext:t,discoveredAt:n})}}}}}}catch(o){console.warn("[AGP:Discovery] Script tags extraction warning:",o)}return Array.from(e.values())}function ht(t){if(typeof document>"u")return{items:[],rejectedCount:0};const e=new Map;let n=0;const o=Date.now(),r=ho(t);for(const a of r)e.set(a.groupId.toLowerCase(),a);const s=Array.from(document.querySelectorAll('a[href*="/groups/"]'));for(const a of s){const i=mo(a);if(!i.valid||!i.name||!i.url||!i.groupId){n++;continue}const l=i.groupId.toLowerCase(),c=e.get(l);c?(!c.imageUrl&&i.imageUrl&&(c.imageUrl=i.imageUrl),i.name&&c.name.length<i.name.length&&(c.name=i.name),i.privacy!=="UNKNOWN"&&(c.privacy=i.privacy)):e.set(l,{name:i.name,url:i.url,groupId:i.groupId,privacy:i.privacy,imageUrl:i.imageUrl,verified:!0,source:"facebook-ui",accountContext:t,discoveredAt:o})}return{items:Array.from(e.values()),rejectedCount:n}}function Nt(){if(typeof document>"u")return 0;let t=0;const e=Array.from(document.querySelectorAll('div[role="button"], button, span[dir="auto"], [role="navigation"] [role="button"], [data-pagelet="LeftRail"] [role="button"]'));for(const n of e){const o=(n.textContent||n.getAttribute("aria-label")||"").trim().toLowerCase();if(o==="see more"||o==="আরও দেখুন"||o==="see all"||o==="সব দেখুন"||o==="see all groups"||o==="সব গ্রুপ দেখুন"||o==="view more")try{(n.closest('[role="button"], button')||n).click(),t++}catch{}}return t}async function Bt(t={}){var y,E,L,B,I,oe;const e=t.maxRounds||350,n=t.stagnantLimit||35,o=t.scrollDelayMs!==void 0?t.scrollDelayMs:250,r=t.accountContext,s=Date.now(),a=tt(),i=new Map;let l=0,c=0,u=0,d=0;const f=go(),p=f.count,b=f.status;console.log(`[AGP:Engine] Discovery started. Target count: ${p??"N/A"} (Status: ${b})`);const g=J=>({candidateCount:i.size+c,verifiedCount:i.size,duplicatesRemoved:l,rejectedCount:c,scrollIterations:d,mutationEvents:u,targetCount:p,targetCountStatus:b,completionReason:J,scanDurationMs:Date.now()-s,lastNewGroupTimestamp:i.size>0?Date.now():null}),m=J=>{let ue=0;for(const q of J){const Z=q.groupId.toLowerCase();i.has(Z)?l++:(i.set(Z,q),ue++)}return ue};let A=null;typeof MutationObserver<"u"&&typeof document<"u"&&(A=new MutationObserver(J=>{u+=J.length}),A.observe(document.body||document.documentElement,{childList:!0,subtree:!0}));try{try{Nt()}catch{}const J=ht(r);if(c+=J.rejectedCount,m(J.items)>0&&t.onBatchDiscovered)try{await t.onBatchDiscovered(Array.from(i.values()),i.size,g(null))}catch{}if(t.onProgress){const se=p?`Found ${i.size} of ${p} groups...`:`Found ${i.size} groups...`;t.onProgress(i.size,se,p,g(null))}if(b==="CONFIRMED"&&p!==null&&i.size>=p){const se=g("TARGET_REACHED");return console.log(`[AGP:Engine] Target count of ${p} confirmed on initial scan.`),{isLoggedIn:a,groups:Array.from(i.values()),totalFound:i.size,targetCount:p,isPartial:!1,outcome:"COMPLETE",completionReason:"TARGET_REACHED",debugMetrics:se}}let q=0,Z="PARTIAL",le="STAGNANT_TIMEOUT";for(let se=0;se<e;se++){if(d++,t.shouldStop&&t.shouldStop()){console.log("[AGP:Engine] Progressive scan stopped by user request."),Z=i.size>0?"COMPLETE":"PARTIAL",le="USER_CANCELLED";break}if(se%3===0)try{Nt()}catch{}const ee=Array.from(document.querySelectorAll('a[href*="/groups/"]'));if(ee.length>0){const x=ee[ee.length-1];try{x.scrollIntoView({block:"end",inline:"nearest",behavior:"auto"})}catch{}}const ve=document.querySelector('[role="main"], [data-pagelet*="Group"]');if(ve&&ve.lastElementChild)try{ve.lastElementChild.scrollIntoView({block:"end",behavior:"auto"})}catch{}const we=Math.max(((y=document.documentElement)==null?void 0:y.scrollHeight)||0,((E=document.scrollingElement)==null?void 0:E.scrollHeight)||0,((L=document.body)==null?void 0:L.scrollHeight)||0);window.scrollTo(0,we),document.scrollingElement&&(document.scrollingElement.scrollTop=we),document.documentElement&&(document.documentElement.scrollTop=we);const $=Array.from(document.querySelectorAll("div, main, section"));for(const x of $)if(x.scrollHeight>x.clientHeight+80){const C=window.getComputedStyle(x);(C.overflowY==="auto"||C.overflowY==="scroll")&&(x.scrollTop=x.scrollHeight,x.dispatchEvent(new Event("scroll",{bubbles:!0})))}window.dispatchEvent(new Event("scroll",{bubbles:!0}));try{window.dispatchEvent(new WheelEvent("wheel",{deltaY:2500,bubbles:!0})),(B=document.body)==null||B.dispatchEvent(new KeyboardEvent("keydown",{key:"PageDown",code:"PageDown",bubbles:!0}))}catch{}await new Promise(x=>setTimeout(x,o));const H=ht(r);if(c+=H.rejectedCount,m(H.items)>0){if(q=0,t.onBatchDiscovered)try{await t.onBatchDiscovered(Array.from(i.values()),i.size,g(null))}catch{}if(t.onProgress){const x=p?`Scanning Facebook Groups... ${i.size} of ${p} discovered`:`Scanning Facebook Groups... ${i.size} groups discovered`;t.onProgress(i.size,x,p,g(null))}if(b==="CONFIRMED"&&p!==null&&i.size>=p){console.log(`[AGP:Engine] Target count reached: ${i.size} >= ${p}.`),Z="COMPLETE",le="TARGET_REACHED";break}}else{if(q++,bo()){console.log("[AGP:Engine] Explicit end-of-list indicator detected."),Z="COMPLETE",le="LIST_END";break}if(window.scrollBy(0,-600),ee.length>5&&((I=ee[Math.max(0,ee.length-6)])==null||I.scrollIntoView({block:"center",behavior:"instant"})),await new Promise(x=>setTimeout(x,300)),window.scrollBy(0,1200),ee.length>0&&((oe=ee[ee.length-1])==null||oe.scrollIntoView({block:"end",behavior:"smooth"})),b==="CONFIRMED"&&p!==null&&i.size<p&&q<45){window.scrollBy(0,-1e3),await new Promise(x=>setTimeout(x,350)),window.scrollBy(0,2500);continue}if(q>=n){console.log(`[AGP:Engine] Scan complete/stagnant after ${q} attempts. Total verified: ${i.size}`),Z="PARTIAL",le="STAGNANT_TIMEOUT";break}}}try{window.scrollTo({top:0,behavior:"smooth"})}catch{}const Te=Z!=="COMPLETE",$e=g(le);return{isLoggedIn:a,groups:Array.from(i.values()),totalFound:i.size,targetCount:p,isPartial:Te,outcome:Z,completionReason:le,debugMetrics:$e}}finally{A&&A.disconnect()}}function Ot(t,e){if(!t||!t.trim())return e?e.split(/[-_.]+/).filter(Boolean).map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" "):"Facebook Group";let n=t.trim();return n=n.replace(/^(?:Visit|Open|View|গ্রুপ দেখুন|দেখুন)\s+/i,""),n=n.replace(/\s*(?:Last active|You last visited|last visited|active)\s+[^\n]+/i,""),n=n.replace(/\s*(?:গত|আগে|মিনিট আগে|ঘণ্টা আগে|দিন আগে)[^\n]*/i,""),n=n.replace(/\s*·\s*(?:Public group|Private group|পাবলিক গ্রুপ|প্রাইভেট গ্রুপ).*$/i,""),n=n.replace(/\s*·\s*\d+.*members.*$/i,""),n=n.replace(/\s*·\s*[০-৯\d]+.*সদস্য.*$/i,""),n=n.replace(/\s*·\s*[^\n]+/i,""),(n.toLowerCase()==="visit"||n.toLowerCase()==="group"||n.toLowerCase()==="view group")&&e?e.split(/[-_.]+/).filter(Boolean).map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" "):n.trim()||"Facebook Group"}function yt(t="id"){const e=Math.random().toString(36).substring(2,9),n=Date.now().toString(36);return`${t}_${n}_${e}`}function xt(t){if(!t)return"";if(!t.includes("{")||!t.includes("|"))return t;let e=t,n=0;const o=/\{([^{}]+)\}/g;for(;n<10&&o.test(e);)n++,e=e.replace(o,(r,s)=>{if(s.includes("|")){const a=s.split("|").map(i=>i.trim()).filter(Boolean);if(a.length>0)return a[Math.floor(Math.random()*a.length)]}return r});return e=e.replace(/\{([^{}\r\n]+?)(?=[.,!?\r\n]|$)/g,(r,s)=>s.includes("|")?s.split("|").map(i=>i.trim()).filter(Boolean)[0]||"":r),e}const Dt={status:"IDLE",searchUrl:"",query:"",totalFound:0,joinedCount:0,requestedCount:0,alreadyJoinedCount:0,failedCount:0,skippedCount:0,currentIndex:0,currentGroupName:"",countdownSec:0,message:"Enter any Facebook search link to start auto-joining.",groups:[]},ie={GROUPS:"agp_groups",ACCOUNT_GROUPS:"agp_facebook_groups_by_account",POSTS:"agp_posts",LOGS:"agp_logs",FACEBOOK_ACCOUNT:"agp_facebook_account"},Ut=()=>{var t;return typeof chrome<"u"&&!!((t=chrome.storage)!=null&&t.local)},Fe={};async function Ie(t,e){if(Ut())return new Promise(n=>{chrome.storage.local.get([t],o=>{if(chrome.runtime.lastError){console.warn(`Storage get error for ${t}:`,chrome.runtime.lastError),n(Fe[t]!==void 0?Fe[t]:e);return}o&&o[t]!==void 0?n(o[t]):n(e)})});try{if(typeof window<"u"&&window.localStorage){const n=window.localStorage.getItem(t);if(n!==null)return JSON.parse(n)}}catch(n){console.warn("LocalStorage access failed:",n)}return Fe[t]!==void 0?Fe[t]:e}async function Ge(t,e){if(Fe[t]=e,Ut())return new Promise((n,o)=>{chrome.storage.local.set({[t]:e},()=>{chrome.runtime.lastError?o(chrome.runtime.lastError):n()})});try{typeof window<"u"&&window.localStorage&&window.localStorage.setItem(t,JSON.stringify(e))}catch(n){console.warn("LocalStorage set failed:",n)}}function Rt(t){return t&&t.trim().toLowerCase().replace(/[^a-z0-9_\u0980-\u09FF]/gi,"_")||"default_account"}async function ot(){return Ie(ie.ACCOUNT_GROUPS,{})}let qt=!1;async function jt(){const t=await ot(),e=new Map,n=a=>{if(!a||!a.id||ze(a))return;const i=(a.groupId||a.url||a.id).toLowerCase();if(!e.has(i))e.set(i,{...a});else{const l=e.get(i);a.name&&(!l.name||a.name.length>l.name.length)&&(l.name=a.name),a.imageUrl&&!l.imageUrl&&(l.imageUrl=a.imageUrl),a.privacy&&a.privacy!=="UNKNOWN"&&(l.privacy=a.privacy)}};for(const a of Object.keys(t)){const i=t[a];i&&Array.isArray(i.groups)&&i.groups.forEach(n)}(await Ie(ie.GROUPS,[])).forEach(n);const r=Array.from(e.values());return r.filter(a=>a.selected).length>50&&(r.forEach(a=>{a.selected=!1}),qt||(qt=!0,yo().catch(()=>{}))),r}async function yo(){var o;const t=await ot();let e=!1;for(const r of Object.keys(t))(o=t[r])!=null&&o.groups&&Array.isArray(t[r].groups)&&(t[r].groups=t[r].groups.map(s=>({...s,selected:!1})),e=!0);e&&await Ge(ie.ACCOUNT_GROUPS,t);const n=await Ie(ie.GROUPS,[]);if(n.some(r=>r.selected)){const r=n.map(s=>({...s,selected:!1}));await Ge(ie.GROUPS,r)}}async function vt(t){if(t==="all")return jt();const e=await Et(),n=Rt(t||(e==null?void 0:e.userId)||(e==null?void 0:e.name)),o=await ot();if(o[n]&&Array.isArray(o[n].groups)&&o[n].groups.length>0){const l=o[n].groups.filter(c=>!ze(c));if(l.length>0)return l.filter(c=>c.selected).length>50&&l.forEach(c=>{c.selected=!1}),l}const s=(await Ie(ie.GROUPS,[])).filter(i=>!ze(i));if(s.length>0)return s.filter(i=>i.selected).length>50&&s.forEach(i=>{i.selected=!1}),s;const a=await jt();return a.length>0?a:[]}async function wt(t,e){const n=(t||[]).filter(i=>!ze(i)),o=await Et(),r=Rt(e||(o==null?void 0:o.userId)||(o==null?void 0:o.name)),s=await ot(),a=s[r]||{accountContext:r,accountInfo:o||{isLoggedIn:!0,name:"Facebook User",lastSyncedAt:Date.now()},groups:[],lastSyncedAt:Date.now()};s[r]={...a,groups:n,lastSyncedAt:Date.now()},await Ge(ie.ACCOUNT_GROUPS,s),await Ge(ie.GROUPS,n)}function ze(t){if(!t)return!0;const e=(t.name||"").trim().toLowerCase(),n=(t.url||"").trim().toLowerCase();if(e.startsWith("unread")||e.includes("commented on")||e.includes("also commented")||e.includes("likes your")||e.includes("liked your")||e.includes("reacted to")||e.includes("shared a post")||e.includes("shared your post")||e.includes("invited you")||e.includes("mentioned you")||e.includes("requested to join")||e.includes("মন্তব্য করেছেন")||e.includes("মতামত দিয়েছেন")||e.includes("লাইক দিয়েছেন")||e.includes("শেয়ার করেছেন")||n.includes("/permalink/")||n.includes("/posts/")||n.includes("/user/")||n.includes("/profile.php")||n.includes("/friends/")||n.includes("/people/")||n.includes("/photos/")||n.includes("/videos/")||n.includes("/events/")||n.includes("/files/")||n.includes("comment_id=")||n.includes("notif_id=")||n.includes("notif_t=")||n.includes("reply_comment_id="))return!0;const o=new Set(["about","about group","feed","discover","create","notifications","search","categories","joins","settings","help","privacy","terms","policies","support","messages","marketplace"]),r=e.replace(/\s*group\s*$/i,"").trim();return!!(o.has(e)||o.has(r)||t.groupId&&o.has(t.groupId.toLowerCase()))}async function xo(){return Ie(ie.POSTS,[])}async function vo(t){await Ge(ie.POSTS,t)}async function wo(){return Ie(ie.LOGS,[])}async function Eo(t){await Ge(ie.LOGS,t)}async function So(t){const e=await wo();e.unshift(t),e.length>300&&(e.length=300),await Eo(e)}async function Et(){return Ie(ie.FACEBOOK_ACCOUNT,null)}class Ao{async writeLog(e,n,o,r){const s={id:yt("log"),timestamp:Date.now(),level:e,source:n,message:o,details:r},a=`[AGP:${n.toUpperCase()}][${e}]`;e==="ERROR"?console.error(a,o,r||""):e==="WARNING"?console.warn(a,o,r||""):console.log(a,o,r||"");try{await So(s)}catch(i){console.warn("Failed to persist log entry:",i)}return s}info(e,n,o){return this.writeLog("INFO",e,n,o)}success(e,n,o){return this.writeLog("SUCCESS",e,n,o)}warning(e,n,o){return this.writeLog("WARNING",e,n,o)}error(e,n,o){return this.writeLog("ERROR",e,n,o)}}const Co=new Ao;async function nt(t,e){var A;const n=(e==null?void 0:e.accountContext)||((A=await Et())==null?void 0:A.name)||"default_account",o=await vt(n),r=new Map,s=new Map,a=new Map,i=y=>y.trim().toLowerCase().replace(/\s+/g," ");o.forEach(y=>{y.groupId&&r.set(y.groupId.toLowerCase(),y),y.url&&s.set(y.url.toLowerCase().replace(/\/$/,""),y),y.name&&a.set(i(y.name),y)});let l=0,c=0;const u=Date.now(),d=[],f=new Set;for(const y of t){if(ze(y))continue;const E=(y.groupId||"").toLowerCase(),L=(y.url||"").toLowerCase().replace(/\/$/,""),B=i(y.name||"");let I=(E?r.get(E):void 0)||(L?s.get(L):void 0)||(B&&B.length>=3?a.get(B):void 0);const oe=Ot(y.name||"",y.groupId);if(I)c++,f.add(I.id),oe&&(!I.name||I.name.includes("·")||I.name.length<oe.length)&&(I.name=oe),y.imageUrl&&!I.imageUrl&&(I.imageUrl=y.imageUrl),y.privacy&&y.privacy!=="UNKNOWN"&&(I.privacy=y.privacy),I.verified=!0,I.source="facebook-ui",I.accountContext=n,I.discoveredAt=u,I.updatedAt=u;else{l++;const J=y.groupId?`grp_${y.groupId.replace(/[^a-zA-Z0-9_-]/g,"")}`:yt("grp"),ue=y.url.startsWith("http")?y.url:`https://www.facebook.com/groups/${y.groupId}/`,q={id:J,name:oe,url:ue,groupId:y.groupId,privacy:y.privacy||"UNKNOWN",imageUrl:y.imageUrl,category:"Discovered",enabled:!0,selected:!1,status:"READY",postCount:0,verified:!0,source:"facebook-ui",accountContext:n,discoveredAt:u,createdAt:u,updatedAt:u};d.push(q),E&&r.set(E,q),L&&s.set(L,q),B&&a.set(B,q),f.add(q.id)}}let p;if((e==null?void 0:e.syncMode)==="exact"){const y=L=>L.source==="manual"||L.category&&L.category!=="Discovered",E=o.filter(L=>f.has(L.id)||y(L));p=[...d,...E]}else p=[...d,...o];const b=[],g=new Set,m=new Set;for(const y of p){const E=y.url.toLowerCase().replace(/\/$/,"");!g.has(y.id)&&!m.has(E)&&(g.add(y.id),m.add(E),b.push(y))}return await wt(b,n),await Co.info("dashboard",`Group discovery merged (${(e==null?void 0:e.syncMode)||"merge"}): ${l} imported, ${c} duplicates, total ${b.length}`),{imported:l,duplicates:c,totalStored:b.length,verifiedCount:b.filter(y=>y.verified).length}}const ko={a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",f:"ғ",g:"ɢ",h:"ʜ",i:"ɪ",j:"ᴊ",k:"ᴋ",l:"ʟ",m:"ᴍ",n:"ɴ",o:"ᴏ",p:"ᴘ",q:"ǫ",r:"ʀ",s:"s",t:"ᴛ",u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",y:"ʏ",z:"ᴢ"},Ft={"ᴀ":"a",ʙ:"b","ᴄ":"c","ᴅ":"d","ᴇ":"e",ғ:"f",ɢ:"g",ʜ:"h",ɪ:"i","ᴊ":"j","ᴋ":"k",ʟ:"l","ᴍ":"m",ɴ:"n","ᴏ":"o","ᴘ":"p",ǫ:"q",ʀ:"r","ᴛ":"t","ᴜ":"u","ᴠ":"v","ᴡ":"w",ʏ:"y","ᴢ":"z"};function Po(t,e){const n=t.charCodeAt(0);if(e==="normal")return zt(t);if(e==="small-caps"){const o=t.toLowerCase();return ko[o]||t}if(n>=65&&n<=90){const o=n-65;switch(e){case"sans-italic":return String.fromCodePoint(120328+o);case"sans-bold":return String.fromCodePoint(120276+o);case"sans-bold-italic":return String.fromCodePoint(120380+o);case"serif-bold":return String.fromCodePoint(119808+o);case"serif-italic":return String.fromCodePoint(119860+o);case"monospace":return String.fromCodePoint(120432+o);case"script":{const r={66:8492,69:8496,70:8497,72:8459,73:8464,76:8466,77:8499,82:8475};return String.fromCodePoint(r[n]||119964+o)}case"bold-script":return String.fromCodePoint(120016+o);case"fraktur":{const r={67:8493,72:8460,73:8465,82:8476,90:8488};return String.fromCodePoint(r[n]||120068+o)}case"bold-fraktur":return String.fromCodePoint(120172+o);case"double-struck":{const r={67:8450,72:8461,78:8469,80:8473,81:8474,82:8477,90:8484};return String.fromCodePoint(r[n]||120120+o)}case"bubble":return String.fromCodePoint(9398+o);case"bubble-black":return String.fromCodePoint(127312+o);case"square":return String.fromCodePoint(127280+o);case"square-black":return String.fromCodePoint(127344+o)}}if(n>=97&&n<=122){const o=n-97;switch(e){case"sans-italic":return String.fromCodePoint(120354+o);case"sans-bold":return String.fromCodePoint(120302+o);case"sans-bold-italic":return String.fromCodePoint(120406+o);case"serif-bold":return String.fromCodePoint(119834+o);case"serif-italic":return t==="h"?"ℎ":String.fromCodePoint(119886+o);case"monospace":return String.fromCodePoint(120458+o);case"script":{const r={101:8495,103:8458,111:8500};return String.fromCodePoint(r[n]||119990+o)}case"bold-script":return String.fromCodePoint(120042+o);case"fraktur":return String.fromCodePoint(120094+o);case"bold-fraktur":return String.fromCodePoint(120198+o);case"double-struck":return String.fromCodePoint(120146+o);case"bubble":return String.fromCodePoint(9424+o);case"bubble-black":return String.fromCodePoint(127312+o);case"square":return String.fromCodePoint(127280+o);case"square-black":return String.fromCodePoint(127344+o)}}if(n>=48&&n<=57){const o=n-48;switch(e){case"sans-bold":case"sans-bold-italic":return String.fromCodePoint(120812+o);case"serif-bold":return String.fromCodePoint(120782+o);case"monospace":return String.fromCodePoint(120822+o);case"double-struck":return String.fromCodePoint(120792+o);case"bubble":return o===0?"⓪":String.fromCodePoint(9312+(o-1));case"bubble-black":return o===0?"⓿":String.fromCodePoint(10122+(o-1));default:return t}}return t}function zt(t){if(Ft[t])return Ft[t];const e=t.codePointAt(0);return e?e===8462?"h":e===8492?"B":e===8496?"E":e===8497?"F":e===8459?"H":e===8464?"I":e===8466?"L":e===8499?"M":e===8475?"R":e===8495?"e":e===8458?"g":e===8500?"o":e===8493?"C":e===8460?"H":e===8465?"I":e===8476?"R":e===8488?"Z":e===8450?"C":e===8461?"H":e===8469?"N":e===8473?"P":e===8474?"Q":e===8477?"R":e===8484?"Z":e>=119808&&e<=119833?String.fromCharCode(65+(e-119808)):e>=119834&&e<=119859?String.fromCharCode(97+(e-119834)):e>=119860&&e<=119885?String.fromCharCode(65+(e-119860)):e>=119886&&e<=119911?String.fromCharCode(97+(e-119886)):e>=119912&&e<=119937?String.fromCharCode(65+(e-119912)):e>=119938&&e<=119963?String.fromCharCode(97+(e-119938)):e>=119964&&e<=119989?String.fromCharCode(65+(e-119964)):e>=119990&&e<=120015?String.fromCharCode(97+(e-119990)):e>=120016&&e<=120041?String.fromCharCode(65+(e-120016)):e>=120042&&e<=120067?String.fromCharCode(97+(e-120042)):e>=120068&&e<=120093?String.fromCharCode(65+(e-120068)):e>=120094&&e<=120119?String.fromCharCode(97+(e-120094)):e>=120172&&e<=120197?String.fromCharCode(65+(e-120172)):e>=120198&&e<=120223?String.fromCharCode(97+(e-120198)):e>=120120&&e<=120145?String.fromCharCode(65+(e-120120)):e>=120146&&e<=120171?String.fromCharCode(97+(e-120146)):e>=120276&&e<=120301?String.fromCharCode(65+(e-120276)):e>=120302&&e<=120327?String.fromCharCode(97+(e-120302)):e>=120328&&e<=120353?String.fromCharCode(65+(e-120328)):e>=120354&&e<=120379?String.fromCharCode(97+(e-120354)):e>=120380&&e<=120405?String.fromCharCode(65+(e-120380)):e>=120406&&e<=120431?String.fromCharCode(97+(e-120406)):e>=120432&&e<=120457?String.fromCharCode(65+(e-120432)):e>=120458&&e<=120483?String.fromCharCode(97+(e-120458)):e>=9398&&e<=9423?String.fromCharCode(65+(e-9398)):e>=9424&&e<=9449?String.fromCharCode(97+(e-9424)):e>=127312&&e<=127337?String.fromCharCode(65+(e-127312)):e>=127280&&e<=127305?String.fromCharCode(65+(e-127280)):e>=127344&&e<=127369?String.fromCharCode(65+(e-127344)):e>=120782&&e<=120791?String.fromCharCode(48+(e-120782)):e>=120792&&e<=120801?String.fromCharCode(48+(e-120792)):e>=120812&&e<=120821?String.fromCharCode(48+(e-120812)):e>=120822&&e<=120831?String.fromCharCode(48+(e-120822)):e===9450?"0":e>=9312&&e<=9320?String.fromCharCode(49+(e-9312)):e===9471?"0":e>=10122&&e<=10130?String.fromCharCode(49+(e-10122)):t:t}function Me(t){if(!t)return"";const e=t.replace(/[\u0336\u0335\u0332]/g,"");let n="";for(const o of e)n+=zt(o);return n}function ce(t,e){if(!t)return"";if(e==="normal")return Me(t);if(e==="strikethrough")return t.replace(/[\u0336\u0335]/g,"").split("").map(s=>s===`
`||s==="\r"||s===" "?s:s+"̶").join("");if(e==="underline")return t.replace(/\u0332/g,"").split("").map(s=>s===`
`||s==="\r"||s===" "?s:s+"̲").join("");if(e==="uppercase")return Me(t).toUpperCase();if(e==="lowercase")return Me(t).toLowerCase();if(e==="titlecase")return Me(t).replace(/\b\w+/g,s=>s.charAt(0).toUpperCase()+s.slice(1).toLowerCase());let n="";const o=Me(t);for(const r of o)n+=Po(r,e);return n}function Io(t){return Jt(t,"bullet")}function Jt(t,e){const n=r=>{switch(e){case"bullet":return"  • ";case"check":return"  ✓ ";case"arrow":return"  ➤ ";case"star":return"  ★ ";case"diamond":return"  ❖ ";case"number":return`  ${r+1}. `}};return t?t.split(`
`).map((r,s)=>{const a=r.trim();if(!a)return r;const i=a.replace(/^([•*\-–—✓✔➤➔★⭐◆❖]|\d+[\.\)])\s*/,"");return n(s)+i}).join(`
`):n(0)}function rt(t,e=1){const n=e===1?"# ":"## ";return!t||!t.trim()?n:t.split(`
`).map(r=>{const s=r.trim();return s?s.startsWith("## ")?e===1?"# "+s.slice(3):s:s.startsWith("# ")?e===2?"## "+s.slice(2):s:n+s:r}).join(`
`)}function _o(t){if(!t)return"****";const e=t.trim();return e.startsWith("**")&&e.endsWith("**")&&e.length>=4?e.slice(2,-2):`**${t}**`}function Lo(t){if(!t)return"**";const e=t.trim();return e.startsWith("*")&&e.endsWith("*")&&e.length>=2&&!e.startsWith("**")?e.slice(1,-1):`*${t}*`}function To(t){return!t||!t.trim()?"  1. ":Jt(t,"number")}function $o(t){return!t||!t.trim()?"> ":t.split(`
`).map(n=>{const o=n.trim();return o?o.startsWith("> ")?o:`> ${o}`:n}).join(`
`)}function Go(t){if(!t||!t.trim())return t;const n=Me(t).split(`
`),o=[];let r=!1;for(let s=0;s<n.length;s++){const a=n[s],i=a.trim();if(!i){o.push("");continue}if(!r){r=!0,o.push(ce(i,"sans-italic"));continue}if(/^(model|brand|device|item|condition|color|varient|variant)\s*[:=]/i.test(i)){const c=i.match(/^([^:=]+[:=]\s*)(.*)$/);if(c){const u=ce(c[1],"sans-italic"),d=c[2];o.push(u+d);continue}}if((/^[•*\-–—✓✔➤➔★⭐◆❖]/.test(i)||/^(ram|rom|storage|storege|camera|battery|display|processor|chipset|condition|screen|charger|box|accessories|sound|sim|dual|official|unofficial|gaming|phone|fast)/i.test(i)||!i.includes(".")&&i.length<40&&!i.toLowerCase().includes("exchange")&&!i.toLowerCase().includes("price"))&&!i.toLowerCase().includes("exchange")&&!i.toLowerCase().includes("inbox")){const c=i.replace(/^[•*\-–—✓✔➤➔★⭐◆❖\s]+/,"");o.push("  • "+c);continue}if(i.toLowerCase().includes("exchange")||i.toLowerCase().includes("price")||i.toLowerCase().includes("inbox")||i.toLowerCase().includes("call")||i.toLowerCase().includes("contact")||i.toLowerCase().includes("location")){o.push(ce(i,"sans-italic"));continue}o.push(a)}return o.join(`
`)}function St(t){if(!t)return"<p><br></p>";const e=t.split(`
`),n=[];let o=!1,r=[],s=!1,a=[],i=!1,l=[];const c=()=>{o&&r.length>0&&(n.push("<ul>"+r.map(p=>`<li>${p}</li>`).join("")+"</ul>"),r=[],o=!1)},u=()=>{s&&a.length>0&&(n.push("<ol>"+a.map(p=>`<li>${p}</li>`).join("")+"</ol>"),a=[],s=!1)},d=()=>{i&&l.length>0&&(n.push("<blockquote>"+l.map(p=>`<p>${p}</p>`).join("")+"</blockquote>"),l=[],i=!1)},f=()=>{c(),u(),d()};for(let p=0;p<e.length;p++){const b=e[p],g=b.trim();if(!g){f(),n.push("<p><br></p>");continue}const A=g.match(/^<h1\b[^>]*>(.*?)<\/h1>$/i)||g.match(/^#\s+(.+)$/)||g.match(/^h1:\s*(.+)$/i);if(A){f(),n.push(`<h1>${Ne(A[1])}</h1>`);continue}const E=g.match(/^<h[23]\b[^>]*>(.*?)<\/h[23]>$/i)||g.match(/^##\s+(.+)$/)||g.match(/^###\s+(.+)$/)||g.match(/^h[23]:\s*(.+)$/i);if(E){f(),n.push(`<h2>${Ne(E[1])}</h2>`);continue}const B=g.match(/^<blockquote\b[^>]*>(.*?)<\/blockquote>$/i)||g.match(/^>\s*(.+)$/)||g.match(/^[❝❞]\s*(.+?)[❝❞]?$/);if(B){c(),u(),i=!0,l.push(Ne(B[1]));continue}const I=g.match(/^(\d+)[\.\)]\s+(.*)$/);if(I){c(),d(),s=!0,a.push(Ne(I[2]));continue}const J=g.match(/^<li\b[^>]*>(.*?)<\/li>$/i)||g.match(/^[•✓✔➤➔★⭐◆❖]\s*(.*)$/)||g.match(/^[\-*–—]\s+(.*)$/);if(J){u(),d(),o=!0,r.push(Ne(J[1]));continue}f(),n.push(`<p>${Ne(b)}</p>`)}return f(),n.join("")}function Ne(t){if(!t)return"";let e=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");return e=e.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em style="font-style: italic;">$1</em></strong>'),e=e.replace(/___(.+?)___/g,'<strong><em style="font-style: italic;">$1</em></strong>'),e=e.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),e=e.replace(/__(.+?)__/g,"<strong>$1</strong>"),e=e.replace(/\*([^*\n]+?)\*/g,'<em style="font-style: italic;">$1</em>'),e=e.replace(/_([^_\n]+?)_/g,'<em style="font-style: italic;">$1</em>'),e=e.replace(/~~(.+?)~~/g,"<s>$1</s>"),e=e.replace(/`([^`\n]+?)`/g,"<code>$1</code>"),e=e.replace(/&lt;(\/?)strong&gt;/gi,"<$1strong>").replace(/&lt;(\/?)b&gt;/gi,"<$1strong>").replace(/&lt;(\/?)em&gt;/gi,"<$1em>").replace(/&lt;(\/?)i&gt;/gi,"<$1em>").replace(/&lt;(\/?)s&gt;/gi,"<$1s>").replace(/&lt;(\/?)del&gt;/gi,"<$1s>").replace(/&lt;(\/?)u&gt;/gi,"<$1u>").replace(/&lt;(\/?)code&gt;/gi,"<$1code>").replace(/&lt;br\s*\/?&gt;/gi,"<br>"),e}function Mo(t,e){if(!t||!t.trim())return"";const n=/<(h[1-6]|blockquote|ol)[\s>]/i.test(t)||/data-lexical/i.test(t)||/[\u0980-\u09FF]/.test(t)||(e==null?void 0:e.mode)==="markdown";if(typeof DOMParser<"u")try{const s=new DOMParser().parseFromString(t,"text/html");if(s&&s.body){if(!n&&(e==null?void 0:e.mode)!=="markdown"){s.querySelectorAll('i, em, span[style*="italic"]').forEach(u=>{const d=u.textContent||"";d.trim()&&(u.textContent=ce(d,"sans-italic"))}),s.querySelectorAll('b, strong, span[style*="bold"], span[style*="700"]').forEach(u=>{const d=u.textContent||"";d.trim()&&(u.textContent=ce(d,"sans-bold"))}),s.querySelectorAll('s, strike, del, span[style*="line-through"]').forEach(u=>{const d=u.textContent||"";d.trim()&&(u.textContent=ce(d,"strikethrough"))}),s.querySelectorAll('u, ins, span[style*="underline"]').forEach(u=>{const d=u.textContent||"";d.trim()&&(u.textContent=ce(d,"underline"))}),s.querySelectorAll("li").forEach(u=>{const d=(u.textContent||"").trim();u.textContent="  • "+d+`
`}),s.querySelectorAll("br").forEach(u=>u.replaceWith(`
`)),s.querySelectorAll("p, div").forEach(u=>{u.appendChild(document.createTextNode(`
`))});const c=(s.body.textContent||"").trim();if(c.length>0)return c.replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).trim()}const a=c=>{if(c.nodeType===Node.TEXT_NODE)return c.textContent||"";if(c.nodeType!==Node.ELEMENT_NODE)return"";const u=c,d=u.tagName.toLowerCase();if(d==="br")return`
`;let f="";u.childNodes.forEach(E=>{f+=a(E)});const p=(u.getAttribute("style")||"").toLowerCase(),b=d==="strong"||d==="b"||p.includes("font-weight: bold")||p.includes("font-weight:bold")||p.includes("font-weight: 700")||p.includes("font-weight:700")||p.includes("font-weight: 800")||p.includes("font-weight: 900"),g=d==="em"||d==="i"||p.includes("font-style: italic")||p.includes("font-style:italic"),m=d==="s"||d==="strike"||d==="del"||p.includes("line-through"),A=d==="u"||d==="ins"||p.includes("underline");if(!f.trim())return f;let y=f;if(b){const E=y.trim();(!E.startsWith("**")||!E.endsWith("**"))&&(y=`**${E}**`)}if(g){const E=y.trim();(!E.startsWith("*")||!E.endsWith("*"))&&(y=`*${E}*`)}if(m){const E=y.trim();(!E.startsWith("~~")||!E.endsWith("~~"))&&(y=`~~${E}~~`)}return A&&(y=`<u>${y.trim()}</u>`),d==="code"&&(y=`\`${y.trim()}\``),y},i=[],l=c=>{if(c.nodeType===Node.TEXT_NODE){const f=(c.textContent||"").trim();f&&i.push(f);return}if(c.nodeType!==Node.ELEMENT_NODE)return;const u=c,d=u.tagName.toLowerCase();if(d==="h1"){const f=a(u).trim();f&&i.push(`# ${f}`);return}if(d==="h2"){const f=a(u).trim();f&&i.push(`## ${f}`);return}if(d==="h3"||d==="h4"||d==="h5"||d==="h6"){const f=a(u).trim();f&&i.push(`## ${f}`);return}if(d==="blockquote"){const f=a(u).trim();f&&f.split(`
`).forEach(p=>{const b=p.trim();b&&i.push(`> ${b}`)});return}if(d==="ul"){Array.from(u.querySelectorAll(":scope > li, li")).forEach(p=>{const b=a(p).trim();b&&i.push(`  • ${b}`)});return}if(d==="ol"){Array.from(u.querySelectorAll(":scope > li, li")).forEach((p,b)=>{const g=a(p).trim();g&&i.push(`  ${b+1}. ${g}`)});return}if(d==="p"||d==="div"){if(Array.from(u.children).some(b=>/^(h[1-6]|p|div|ul|ol|blockquote)$/i.test(b.tagName))){u.childNodes.forEach(b=>l(b));return}const p=a(u).trim();p?i.push(p):(u.querySelector("br")||u.innerHTML.includes("<br>"))&&i.push("");return}u.childNodes.forEach(f=>l(f))};if(s.body.childNodes.forEach(c=>l(c)),i.length>0)return i.join(`
`)}}catch{}let o=t;return o=o.replace(/<h1\b[^>]*>(.*?)<\/h1>/gi,(r,s)=>`# ${s.trim()}

`),o=o.replace(/<h2\b[^>]*>(.*?)<\/h2>/gi,(r,s)=>`## ${s.trim()}

`),o=o.replace(/<h3\b[^>]*>(.*?)<\/h3>/gi,(r,s)=>`## ${s.trim()}

`),o=o.replace(/<blockquote\b[^>]*>(.*?)<\/blockquote>/gi,(r,s)=>`> ${s.trim()}

`),o=o.replace(/<li\b[^>]*>(.*?)<\/li>/gi,(r,s)=>`  • ${s.trim()}
`),n?(o=o.replace(/<(b|strong)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>`**${a.trim()}**`),o=o.replace(/<(i|em)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>`*${a.trim()}*`)):(o=o.replace(/<(i|em)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>ce(a,"sans-italic")),o=o.replace(/<(b|strong)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>ce(a,"sans-bold"))),o=o.replace(/<(s|del|strike)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>`~~${a.trim()}~~`),o=o.replace(/<(u|ins)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>`<u>${a.trim()}</u>`),o=o.replace(/<br\s*\/?>/gi,`
`),o=o.replace(/<\/(p|div)>/gi,`
`),o=o.replace(/<[^>]+>/g,""),o.replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).trim()}const No=[{name:"Double Line (সমান লাইন)",value:"══════════════════════════════"},{name:"Thick Line (মোটা লাইন)",value:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"},{name:"Thin Line (চিকন লাইন)",value:"──────────────────────────────"},{name:"Star Sparkle (তারকা বর্ডার)",value:"•┈┈┈••✦••┈┈┈••✦••┈┈┈••✦••┈┈┈•"},{name:"Flower Border (ফুলের বর্ডার)",value:"✿════════════════════════════✿"},{name:"Block Blocks (বক্স প্যাটার্ন)",value:"▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄"},{name:"Dashed Dots (ডট লাইন)",value:"┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈"},{name:"Double Arrow Star (স্টার অ্যারো)",value:"»»————-　★　————-««"}],Wt=[{id:"price-cut",name:"Price Cut (ডিসকাউন্ট মূল্য)",icon:"💰",content:"💰 Regular Price: ̶২̶,̶৫̶০̶০̶ ৳  ➔  Offer Price: {price}"},{id:"cod-delivery",name:"Cash on Delivery (ক্যাশ অন ডেলিভারি)",icon:"🚚",content:"🚚 সারা বাংলাদেশে ক্যাশ অন হোম ডেলিভারি (প্রোডাক্ট দেখে পেমেন্ট করার সুবিধা)!"},{id:"location",name:"Location (ঠিকানা / লোকেশন)",icon:"📍",content:"📍 Location: {location}"},{id:"contact-whatsapp",name:"Phone / WhatsApp (কল ও হোয়াটসঅ্যাপ)",icon:"📞",content:"📞 Call / WhatsApp: {contact_info}"},{id:"condition-fresh",name:"100% Fresh Condition (কন্ডিশন)",icon:"⚡",content:"⚡ Condition: ১০০% ফুল ফ্রেশ, কোনো স্ক্র্যাচ বা সমস্যা নেই।"},{id:"warranty",name:"Warranty / Replacement (ওয়ারেন্টি)",icon:"🎁",content:"🎁 ৭ দিনের রিপ্লেসমেন্ট এবং ১ বছরের ফ্রি সার্ভিস ওয়ারেন্টি!"},{id:"urgency-stock",name:"Limited Stock (সীমিত স্টক সতর্কতা)",icon:"🚨",content:"🚨 Limited Stock Available! অফার শেষ হওয়ার আগেই দ্রুত অর্ডার করুন!"},{id:"inbox-cta",name:"Inbox CTA (ইনবক্স আহ্বান)",icon:"💬",content:"👉 অর্ডার করতে অথবা যেকোনো তথ্যের জন্য এখনই ইনবক্স করুন!"},{id:"exchange-offer",name:"Exchange Offer (এক্সচেঞ্জ অফার)",icon:"🔄",content:"🔄 যেকোনো ব্যবহৃত ফোন/ডিভাইসের সাথে এক্সচেঞ্জ পসিবল (শর্ত প্রযোজ্য)।"}];function Bo(t){if(!t||typeof t!="string")return t||"";const e=t.trim();if(e.length<30)return t;const n=e.length,o=Math.floor(n/2);for(let s=-15;s<=15;s++){const a=o+s;if(a>15&&a<n-15){const i=e.slice(0,a).trim(),l=e.slice(a).trim();if(i.length>=15&&i===l)return i}}const r=e.split(`
`).filter(s=>s.trim().length>0);if(r.length>=4){const s=Math.floor(r.length/2),a=r.slice(0,s).join(`
`).trim(),i=r.slice(s).join(`
`).trim();if(a.length>=25&&a===i)return a}return t}function Vt(t){try{const n=new URL(t.startsWith("http")?t:`https://${t}`).searchParams.get("q");return n?decodeURIComponent(n.replace(/\+/g," ")):""}catch{return""}}function Oo(){if(typeof window>"u")return!1;const t=window.location.href.toLowerCase();return(t.includes("facebook.com")||t.includes("fb.com"))&&t.includes("/search")}function it(t){var l;if(!t)return!1;const e=t.tagName.toLowerCase(),n=t.getAttribute("role")||"",o=e==="button"||n==="button"||e==="a"||t.getAttribute("tabindex")!==null,r=(t.innerText||t.textContent||"").trim().toLowerCase(),s=(t.getAttribute("aria-label")||"").trim().toLowerCase(),a=(((l=t.querySelector("[aria-label]"))==null?void 0:l.getAttribute("aria-label"))||"").trim().toLowerCase(),i=`${r} | ${s} | ${a}`.toLowerCase();return i.includes("joined")||i.includes("view group")||i.includes("edit membership")||i.includes("যোগ দিয়েছেন")||i.includes("যুক্ত হয়েছেন")||i.includes("গ্রুপ দেখুন")||i.includes("requested")||i.includes("pending")||i.includes("cancel request")||i.includes("অনুরোধ পাঠানো")||i.includes("অনুরোধ করা হয়েছে")||i.includes("share")||i.includes("শেয়ার")||i.includes("message")||i.includes("মেসেজ")||i.includes("close")||i.includes("menu")||i.includes("search")||i.includes("notifications")?!1:!!(r==="join"||r==="join group"||r==="+ join"||r==="+ join group"||r==="request to join"||r==="answer questions"||r==="যোগ দিন"||r==="+ যোগ দিন"||r==="গ্রুপে যোগ দিন"||r==="যুক্ত হোন"||r==="+ যুক্ত হোন"||r==="গ্রুপে যুক্ত হোন"||r==="যোগ দেওয়ার অনুরোধ"||r==="যোগ দেয়ার অনুরোধ"||s==="join"||s==="join group"||s.includes("join group")||s.includes("request to join")||s.includes("যোগ দিন")||s.includes("যুক্ত হোন")||s.includes("অনুরোধ")||o&&(r.startsWith("join ")||r.endsWith(" join")||r.includes("join group")||r.includes("যোগ দিন")||r.includes("যুক্ত হোন")||r.includes("join")&&r.length<=16))}function st(t){if(!t)return!1;const e=(t.innerText||t.textContent||"").trim().toLowerCase(),n=(t.getAttribute("aria-label")||"").trim().toLowerCase(),o=`${e} ${n}`.toLowerCase();return o.includes("joined")||o.includes("view group")||o.includes("edit membership")||o.includes("যোগ দিয়েছেন")||o.includes("যুক্ত হয়েছেন")||o.includes("গ্রুপ দেখুন")}function at(t){if(!t)return!1;const e=(t.innerText||t.textContent||"").trim().toLowerCase(),n=(t.getAttribute("aria-label")||"").trim().toLowerCase(),o=`${e} ${n}`.toLowerCase();return o.includes("requested")||o.includes("pending")||o.includes("cancel request")||o.includes("অনুরোধ পাঠানো")||o.includes("অনুরোধ করা হয়েছে")}function Ee(t){if(!t||typeof t!="string"||t.includes("/permalink/")||t.includes("/posts/")||t.includes("/photos/")||t.includes("/videos/")||t.includes("/user/")||t.includes("comment_id=")||t.includes("notif_id="))return null;const e=t.match(/(?:facebook\.com|fb\.com)?\/groups\/([^/?#]+)/i);if(!e||!e[1])return null;try{const n=decodeURIComponent(e[1]).trim().toLowerCase();return!n||mt.has(n)?null:n}catch{const n=e[1].trim().toLowerCase();return!n||mt.has(n)?null:n}}function At(t,e,n){let o="";const r=t.querySelector('span[dir="auto"], strong, h1, h2, h3, h4');if(r&&r.textContent&&r.textContent.trim().length>=2&&(o=r.textContent.trim()),!o){const a=(t.getAttribute("aria-label")||"").trim();a&&a.length>=2&&!a.toLowerCase().includes("view group")&&!a.toLowerCase().includes("গ্রুপ দেখুন")&&(o=a)}if(!o&&t.textContent&&(o=t.textContent.trim()),!o||o.length<2){const a=e.querySelector('h1, h2, h3, h4, [role="heading"], strong');o=((a==null?void 0:a.textContent)||"").trim()}o=o.split(`
`)[0].trim(),o=o.replace(/^(?:Profile photo of|Profile picture of|Photo of|Cover photo of|প্রোফাইল ছবি|কভার ছবি)\s*/i,"");const s=o.toLowerCase();return(s==="join"||s==="যোগ দিন"||s==="view group"||s==="গ্রুপ দেখুন"||s==="visit"||s==="joined")&&(o=""),(!o||o.length<2)&&(o=n.split(/[-_.]+/).map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join(" ")),o}function Ct(t){const e=(t.innerText||t.textContent||"").toLowerCase();return e.includes("public")||e.includes("পাবলিক")?"PUBLIC":e.includes("private")||e.includes("প্রাইভেট")?"PRIVATE":"UNKNOWN"}function kt(t){const e=(t.innerText||"").split(`
`).map(n=>n.trim()).filter(Boolean);for(const n of e){const o=n.toLowerCase();if((o.includes("member")||o.includes("সদস্য")||o.includes("post")||o.includes("পোস্ট"))&&(o.includes("public")||o.includes("private")||o.includes("পাবলিক")||o.includes("প্রাইভেট")||/\d/.test(n)))return n}return""}function Be(){if(typeof document>"u")return[];const t=[],e=new Set,n=Array.from(document.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"], [aria-label*="Join" i], [aria-label*="যোগ" i], [aria-label*="যুক্ত" i]'));for(const s of n){if(!it(s))continue;let a=s.parentElement,i=null,l=null;for(let b=0;b<25&&a&&a!==document.body;b++){const g=Array.from(a.querySelectorAll('a[href*="/groups/"]')).filter(m=>{const A=m.href||m.getAttribute("href")||"";return!!Ee(A)});if(g.length>0){const m=new Set(g.map(A=>Ee(A.href||A.getAttribute("href")||"")).filter(Boolean));if(m.size===1)i=g[0],l=a;else if(m.size>1)break}a=a.parentElement}if(!i)continue;const c=Ee(i.href||i.getAttribute("href")||"");if(!c||e.has(c))continue;e.add(c);const u=l||s.closest('div[role="feed"] > div')||s.parentElement||s,d=At(i,u,c),f=Ct(u),p=kt(u);t.push({cardElement:u,item:{id:c,groupId:c,name:d,url:`https://www.facebook.com/groups/${encodeURIComponent(c)}/`,privacy:f,membersText:p||void 0,status:"READY_TO_JOIN"},joinButton:s})}const o=Array.from(document.querySelectorAll('a[href*="/groups/"]'));for(const s of o){const a=Ee(s.href||s.getAttribute("href")||"");if(!a||e.has(a))continue;let i=s.parentElement,l=null,c=null,u="READY_TO_JOIN";for(let b=0;b<25&&i&&i!==document.body;b++){const g=Array.from(i.querySelectorAll('a[href*="/groups/"]')).filter(y=>{const E=y.href||y.getAttribute("href")||"";return!!Ee(E)});if(new Set(g.map(y=>Ee(y.href||y.getAttribute("href")||"")).filter(Boolean)).size>1)break;l=i;const A=Array.from(i.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"], [aria-label]'));for(const y of A){if(st(y)){u="ALREADY_JOINED",c=null;break}if(at(y)){u="REQUESTED",c=null;break}if(it(y)){u="READY_TO_JOIN",c=y;break}}if(c||u!=="READY_TO_JOIN")break;i=i.parentElement}if(l||(l=s.closest('div[role="feed"] > div')||s.closest('div[role="article"]')||s.parentElement||s),u==="READY_TO_JOIN"&&!c&&l){const b=Array.from(l.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const g of b)if(!st(g)&&!at(g)){const m=(g.innerText||g.textContent||g.getAttribute("aria-label")||"").trim().toLowerCase();if(m&&!m.includes("more")&&!m.includes("menu")&&!m.includes("share")&&!m.includes("close")){c=g;break}}}e.add(a);const d=At(s,l,a),f=Ct(l),p=kt(l);t.push({cardElement:l,item:{id:a,groupId:a,name:d,url:`https://www.facebook.com/groups/${encodeURIComponent(a)}/`,privacy:f,membersText:p||void 0,status:u},joinButton:c})}const r=Array.from(document.querySelectorAll('div[role="feed"] > div, div[role="main"] div[role="article"], div[data-pagelet*="GroupSearchResult"]'));for(const s of r){const a=Array.from(s.querySelectorAll('a[href*="/groups/"]')).filter(m=>!!Ee(m.href||m.getAttribute("href")||""));if(a.length===0)continue;const i=Array.from(new Set(a.map(m=>Ee(m.href||m.getAttribute("href")||"")).filter(Boolean)));if(i.length!==1)continue;const l=i[0];if(e.has(l))continue;e.add(l);const c=a[0],u=At(c,s,l),d=Ct(s),f=kt(s);let p=null,b="READY_TO_JOIN";const g=Array.from(s.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const m of g){if(st(m)){b="ALREADY_JOINED";break}if(at(m)){b="REQUESTED";break}if(it(m)){b="READY_TO_JOIN",p=m;break}}t.push({cardElement:s,item:{id:l,groupId:l,name:u,url:`https://www.facebook.com/groups/${encodeURIComponent(l)}/`,privacy:d,membersText:f||void 0,status:b},joinButton:p})}return t}function Je(t){if(!t)return;try{t.scrollIntoView({behavior:"auto",block:"center"})}catch{}t.focus();const e=t.closest('div[role="button"], button, a[role="button"]')||t;e.focus();const n={bubbles:!0,cancelable:!0,view:window};if(e.dispatchEvent(new PointerEvent("pointerdown",n)),e.dispatchEvent(new MouseEvent("mousedown",n)),e.dispatchEvent(new PointerEvent("pointerup",n)),e.dispatchEvent(new MouseEvent("mouseup",n)),e.click(),e!==t)try{t.dispatchEvent(new MouseEvent("click",n)),t.click()}catch{}}async function Do(t){let e=document.querySelector('div[role="dialog"]');if((!e||e.offsetParent===null&&e.getBoundingClientRect().height<=50)&&(await new Promise(i=>setTimeout(i,30)),e=document.querySelector('div[role="dialog"]')),!e||e.offsetParent===null&&e.getBoundingClientRect().height<=50)return!1;console.log("[AGP:AutoJoiner] Membership questions modal detected. Fast auto-answering...");const n=Array.from(e.querySelectorAll('input[type="checkbox"], div[role="checkbox"]'));for(const i of n)(i instanceof HTMLInputElement?i.checked:i.getAttribute("aria-checked")==="true")||Je(i);const o=Array.from(e.querySelectorAll('input[type="radio"], div[role="radio"]'));o.length>0&&(o.some(l=>l instanceof HTMLInputElement?l.checked:l.getAttribute("aria-checked")==="true")||Je(o[0]));const r=Array.from(e.querySelectorAll('textarea, input[type="text"]'));for(const i of r)(!i.value||i.value.trim()==="")&&(i.focus(),i.value=t||"Yes, I agree to the group rules and guidelines.",i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})));const s=Array.from(e.querySelectorAll('button, div[role="button"]'));for(const i of s){const l=(i.innerText||i.textContent||i.getAttribute("aria-label")||"").trim().toLowerCase();if(l==="submit"||l==="জমা দিন"||l==="send"||l==="confirm"||l==="next"||l==="পরবর্তী"||l==="done"||l==="অনুরোধ পাঠান"||l.includes("submit")||l.includes("জমা")){Je(i),await new Promise(c=>setTimeout(c,15));break}}const a=document.querySelector('div[role="dialog"]');if(a){const i=Array.from(a.querySelectorAll('button, div[role="button"]'));for(const l of i){const c=(l.innerText||l.textContent||l.getAttribute("aria-label")||"").trim().toLowerCase();if(c==="submit"||c==="জমা দিন"||c==="done"||c.includes("submit")){Je(l),await new Promise(u=>setTimeout(u,15));break}}}return!0}const Le=class Le{constructor(){Ce(this,"state",{...Dt});Ce(this,"config",{searchUrl:"",delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0});Ce(this,"isRunning",!1);Ce(this,"isPaused",!1);Ce(this,"shouldStop",!1);Ce(this,"onProgressCallbacks",[])}static getInstance(){return Le.instance||(Le.instance=new Le),Le.instance}subscribe(e){this.onProgressCallbacks.push(e)}getState(){return{...this.state}}broadcastState(){var e;for(const n of this.onProgressCallbacks)try{n(this.state)}catch{}try{typeof chrome<"u"&&((e=chrome.runtime)!=null&&e.sendMessage)&&chrome.runtime.sendMessage({type:"AUTO_JOIN_PROGRESS",payload:this.state})}catch{}}pause(){this.isRunning&&!this.isPaused&&(this.isPaused=!0,this.state.status="PAUSED",this.state.message="Auto-Join paused by user.",this.broadcastState())}resume(){this.isRunning&&this.isPaused&&(this.isPaused=!1,this.state.status="JOINING",this.state.message="Resuming group auto-joining...",this.broadcastState())}stop(){this.shouldStop=!0,this.isRunning=!1,this.isPaused=!1,this.state.status="STOPPED",this.state.message="Auto-Join stopped by user.",this.broadcastState()}async start(e){if(this.isRunning)return console.warn("[AGP:AutoJoiner] Already running."),this.state;this.config={...this.config,...e,delaySec:typeof e.delaySec=="number"?e.delaySec:0},this.isRunning=!0,this.isPaused=!1,this.shouldStop=!1;const n=Vt(window.location.href);this.state={...Dt,status:"SEARCHING",searchUrl:window.location.href,query:n,message:`Scanning Facebook group search results for "${n}"...`,startedAt:Date.now()},this.broadcastState();try{let o=0;const r=new Set;for(;!this.shouldStop;){for(;this.isPaused&&!this.shouldStop;)await new Promise(i=>setTimeout(i,500));if(this.shouldStop)break;const s=Be();if(this.state.groups=s.map(i=>i.item),this.state.totalFound=s.length,this.state.alreadyJoinedCount=s.filter(i=>i.item.status==="ALREADY_JOINED").length,this.state.requestedCount=s.filter(i=>i.item.status==="REQUESTED").length,this.state.joinedCount=s.filter(i=>i.item.status==="JOINED").length,this.config.saveToGroups)for(const i of s)i.item.status==="ALREADY_JOINED"&&!r.has(i.item.groupId)&&(r.add(i.item.groupId),await this.saveGroupToDatabase(i.item));const a=s.find(i=>i.item.status==="READY_TO_JOIN"&&!r.has(i.item.groupId));if(a){o=0;const{cardElement:i,item:l}=a;let c=a.joinButton;if(!c&&i){const u=Array.from(i.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const d of u)if(it(d)){c=d;break}if(!c){for(const d of u)if(!st(d)&&!at(d)){const f=(d.innerText||d.textContent||d.getAttribute("aria-label")||"").toLowerCase();if(!f.includes("more")&&!f.includes("menu")&&!f.includes("share")&&!f.includes("close")){c=d;break}}}}if(r.add(l.groupId),this.config.maxGroups>0&&this.state.joinedCount+this.state.requestedCount>=this.config.maxGroups){this.state.message=`Reached target limit of ${this.config.maxGroups} groups.`;break}if(c){this.state.status="JOINING",this.state.currentGroupName=l.name,l.status="JOINING",this.state.message=`Joining: "${l.name}"...`,this.broadcastState();try{i.scrollIntoView({behavior:"auto",block:"nearest"}),i.style.outline="3px solid #10b981",i.style.boxShadow="0 0 15px rgba(16, 185, 129, 0.45)",i.style.borderRadius="8px"}catch{}try{console.log(`[AGP:AutoJoiner] Triggering instant click on Join button for: "${l.name}"`),Je(c),this.config.autoAnswerQuestions&&await Do(this.config.defaultAnswer),l.status="JOINED",l.joinedAt=Date.now(),this.state.joinedCount++,this.config.saveToGroups&&await this.saveGroupToDatabase(l),this.state.message=`Joined "${l.name}" (${l.status})`,this.broadcastState()}catch(d){console.error("[AGP:AutoJoiner] Join error on",l.name,d),l.status="FAILED",l.error=String(d),this.state.failedCount++,this.broadcastState()}finally{try{i.style.outline="2px solid rgba(16, 185, 129, 0.35)",i.style.boxShadow="none"}catch{}}const u=typeof this.config.delaySec=="number"?this.config.delaySec:0;if(u<=0)this.state.countdownSec=0,await new Promise(d=>setTimeout(d,30));else{for(let d=u;d>0&&!this.shouldStop;d--){for(;this.isPaused&&!this.shouldStop;)await new Promise(f=>setTimeout(f,200));if(this.shouldStop)break;this.state.countdownSec=d,this.state.message=`Waiting ${d}s before next group...`,this.broadcastState(),await new Promise(f=>setTimeout(f,1e3))}this.state.countdownSec=0}}}else{this.state.message="Loading more Facebook groups on this page...",this.broadcastState();const i=document.body.scrollHeight;if(window.scrollBy({top:1800,behavior:"auto"}),window.dispatchEvent(new Event("scroll",{bubbles:!0})),await new Promise(u=>setTimeout(u,120)),!Be().some(u=>u.item.status==="READY_TO_JOIN"&&!r.has(u.item.groupId))&&document.body.scrollHeight===i){if(o++,o>=3)break}else o=0}}this.shouldStop||(this.state.status="COMPLETED",this.state.message=`Auto-join complete! Joined ${this.state.joinedCount} groups, requested ${this.state.requestedCount} groups.`)}catch(o){console.error("[AGP:AutoJoiner] Execution error:",o),this.state.status="ERROR",this.state.message=`Error: ${(o==null?void 0:o.message)||String(o)}`}finally{this.isRunning=!1,this.isPaused=!1,this.state.finishedAt=Date.now(),this.broadcastState()}return this.state}async saveGroupToDatabase(e){var n;try{const o=await vt();if(!o.some(s=>s.groupId&&s.groupId.toLowerCase()===e.groupId.toLowerCase()||s.url&&s.url.toLowerCase().includes(e.groupId.toLowerCase()))){const s={id:yt(),name:e.name,url:e.url,groupId:e.groupId,privacy:e.privacy,category:this.config.selectedCategory||"Auto Joined",enabled:!0,selected:!1,status:"READY",postCount:0,verified:!0,source:"facebook-ui",createdAt:Date.now(),updatedAt:Date.now()};await wt([...o,s]),console.log(`[AGP:AutoJoiner] Saved "${e.name}" (${e.groupId}) to My Facebook Groups database.`);try{typeof chrome<"u"&&((n=chrome.runtime)!=null&&n.sendMessage)&&chrome.runtime.sendMessage({type:"AUTO_JOIN_SAVE_GROUPS",payload:{group:s}})}catch{}}}catch(o){console.warn("[AGP:AutoJoiner] Save to database error:",o)}}};Ce(Le,"instance");let Y=Le,F=null,h=null,S="",z=[],We=!1,Ve=!1,He="POST_AND_JOIN",Q=0,ge=0,Ye=!1,Pt=!1,Ht=!1,v={isRunning:!1,isPaused:!1,status:"IDLE",message:"Ready to auto-join and post to Facebook groups from this search page.",total:0,completed:0,skipped:0,failed:0,currentGroupName:""},de=null;function lt(t){return!t||typeof t!="string"?!1:t.startsWith("data:video")||t.includes("video/")||t.startsWith("blob:")||/\.(mp4|mov|webm|m4v|mkv|avi)($|\?)/i.test(t)}function Yt(t){return new Promise(e=>{if(t.type.startsWith("video/")||/\.(mp4|mov|webm|m4v|mkv|avi|3gp|flv)$/i.test(t.name)){const r=new FileReader;r.onload=s=>{var i;let a=((i=s.target)==null?void 0:i.result)||"";if(a&&(a.startsWith("data:application/octet-stream")||a.startsWith("data:;base64"))){let l="video/mp4";/\.webm$/i.test(t.name)?l="video/webm":/\.mov$/i.test(t.name)?l="video/quicktime":/\.mkv$/i.test(t.name)&&(l="video/x-matroska"),a=a.replace(/^data:[^;]*;base64/,`data:${l};base64`)}e(a)},r.onerror=()=>e(""),r.readAsDataURL(t);return}const o=new FileReader;o.onload=r=>{var i;const s=((i=r.target)==null?void 0:i.result)||"";if(!s)return e("");const a=new Image;a.onload=()=>{let l=a.width,c=a.height;const u=1280;(l>u||c>u)&&(l>c?(c=Math.round(c*u/l),l=u):(l=Math.round(l*u/c),c=u));const d=document.createElement("canvas");d.width=l,d.height=c;const f=d.getContext("2d");f?(f.drawImage(a,0,0,l,c),e(d.toDataURL("image/jpeg",.82))):e(s)},a.onerror=()=>e(s),a.src=s},o.onerror=()=>e(""),o.readAsDataURL(t)})}async function V(){var t;try{typeof chrome<"u"&&((t=chrome.storage)!=null&&t.local)&&await chrome.storage.local.set({agp_search_poster_caption:S,agp_search_poster_photos:z,agp_search_poster_delay:ge,agp_search_poster_target:Q})}catch(e){console.warn("[AGP:SearchPoster] Failed to save draft to storage:",e)}}async function Uo(){var t;if(!Ht){Ht=!0;try{if(typeof chrome<"u"&&((t=chrome.storage)!=null&&t.local)){const e=await chrome.storage.local.get(["agp_search_poster_caption","agp_search_poster_photos","agp_search_poster_delay","agp_search_poster_target"]);typeof(e==null?void 0:e.agp_search_poster_caption)=="string"&&(S=e.agp_search_poster_caption),Array.isArray(e==null?void 0:e.agp_search_poster_photos)&&(z=e.agp_search_poster_photos),typeof(e==null?void 0:e.agp_search_poster_delay)=="number"?ge=e.agp_search_poster_delay:ge=0,typeof(e==null?void 0:e.agp_search_poster_target)=="number"&&(Q=e.agp_search_poster_target)}}catch(e){console.warn("[AGP:SearchPoster] Failed to load draft from storage:",e)}}}function te(t){if(!h)return;const e=h.getElementById("agp-dock-toast");e&&e.remove();const n=document.createElement("div");n.id="agp-dock-toast",n.textContent=t,n.style.cssText=`
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
  `,h.appendChild(n),setTimeout(()=>n.remove(),2200)}function he(t){if(!t||!t.trim())return'<span style="color: #94a3b8; font-style: italic;">পোস্টের কোনো ক্যাপশন লেখা হয়নি। উপরে টুলবার দিয়ে ডিজাইন করুন অথবা টেক্সট পেস্ট করুন...</span>';const e=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),n=s=>{let a=e(s);return a=a.replace(/\*\*(.+?)\*\*/g,'<strong style="font-weight: 800; color: #ffffff;">$1</strong>'),a=a.replace(/\*([^*\n]+?)\*/g,'<em style="font-style: italic; color: #f1f5f9;">$1</em>'),a=a.replace(/~~(.+?)~~/g,'<s style="color: #94a3b8;">$1</s>'),a=a.replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g,'<u style="text-decoration: underline;">$1</u>'),a=a.replace(/`([^`\n]+?)`/g,'<code style="background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 3px; font-family: monospace;">$1</code>'),a},o=t.split(`
`),r=[];for(let s=0;s<o.length;s++){const a=o[s],i=a.trim();if(!i){r.push('<div style="height: 8px;"></div>');continue}if(i.startsWith("# ")){r.push(`<h1 style="font-size: 15px; font-weight: 800; color: #60a5fa; margin: 4px 0 2px 0; line-height: 1.3;">${n(i.replace(/^#\s*/,""))}</h1>`);continue}if(i.startsWith("## ")||i.startsWith("### ")){r.push(`<h2 style="font-size: 13px; font-weight: 700; color: #93c5fd; margin: 3px 0 2px 0; line-height: 1.3;">${n(i.replace(/^#{2,3}\s*/,""))}</h2>`);continue}if(i.startsWith("> ")||i.startsWith("❝")){const l=i.replace(/^>\s*/,"").replace(/^[❝❞]\s*/,"");r.push(`<blockquote style="border-left: 3px solid #3b82f6; background: rgba(59, 130, 246, 0.12); padding: 4px 8px; margin: 4px 0; border-radius: 0 4px 4px 0; font-size: 11px; color: #e2e8f0;">${n(l)}</blockquote>`);continue}if(/^[•✓✔➤➔★⭐◆❖]/.test(i)||/^[\-*–—]\s+/.test(i)){const l=i.match(/^([•✓✔➤➔★⭐◆❖\-*–—]+)\s*(.*)$/),c=l?l[1]:"•",u=l?l[2]:i;r.push(`<div style="display: flex; align-items: flex-start; gap: 6px; padding-left: 4px; font-size: 11.5px; line-height: 1.4; color: #f1f5f9;"><span style="color: #60a5fa; font-weight: bold; flex-shrink: 0;">${e(c)}</span><span>${n(u)}</span></div>`);continue}if(/^(\d+)[\.\)]\s+/.test(i)){const l=i.match(/^(\d+)[\.\)]\s+(.*)$/),c=l?l[1]:"1",u=l?l[2]:i;r.push(`<div style="display: flex; align-items: flex-start; gap: 6px; padding-left: 4px; font-size: 11.5px; line-height: 1.4; color: #f1f5f9;"><span style="color: #93c5fd; font-weight: bold; flex-shrink: 0;">${e(c)}.</span><span>${n(u)}</span></div>`);continue}r.push(`<div style="font-size: 11.5px; line-height: 1.45; color: #e2e8f0;">${n(a)}</div>`)}return r.join("")}async function It(t){if(typeof document>"u")return;await Uo();const e=Y.getInstance(),n=e.getState();if(!F){F=document.createElement("div"),F.id="agp-auto-joiner-root";const o=window.innerWidth<=640;F.style.cssText=`
      position: fixed;
      bottom: ${o?"10px":"24px"};
      right: ${o?"10px":"24px"};
      ${o?"left: 10px; max-width: calc(100vw - 20px);":""}
      z-index: 2147483646;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    `,h=F.attachShadow({mode:"open"}),document.body.appendChild(F),e.subscribe(r=>{T(r,t)}),jo(t)}T(n,t),qo(t)}let Kt=null,Qt=-1,ct=null;function Ro(t){if(!h)return;const e=t.length,n=h.getElementById("btn-toggle-groups");if(n){const i=n.querySelector("strong");i&&(i.textContent=`${e} Groups`)}const o=h.querySelector('#agp-select-target option[value="0"]');o&&(o.textContent=`All Found (${e})`);const r=h.getElementById("btn-start-campaign");if(r&&!v.isRunning){const i=Q>0?Q:e;r.innerHTML=`<span>🚀</span> Start Join & Post (${i} Groups)`}const s=h.querySelector(".groups-list-box");s&&(t.length>0?s.innerHTML=t.map(i=>`
        <div class="group-row">
          <span style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${i.item.name}">
            ${i.item.name}
          </span>
          <span class="group-badge" style="background: ${i.item.privacy==="PUBLIC"?"rgba(16, 185, 129, 0.2)":"rgba(245, 158, 11, 0.2)"}; color: ${i.item.privacy==="PUBLIC"?"#34d399":"#fbbf24"};">
            ${i.item.privacy}
          </span>
        </div>
      `).join(""):s.innerHTML='<div style="text-align: center; color: #64748b; font-size: 11px; padding: 10px;">Scrolling page to detect group cards...</div>');const a=h.querySelector(".stats-grid .stat-item:first-child .stat-num");a&&(a.textContent=String(e))}function qo(t){if(Kt)return;const e=()=>{var r;if(v.isRunning)return;const o=Be();if(o.length!==Qt&&(Qt=o.length,Ro(o),!(((r=h==null?void 0:h.activeElement)==null?void 0:r.id)==="agp-caption-input")&&!Ye)){const a=Y.getInstance();T(a.getState(),t)}};Kt=setInterval(e,1200),setTimeout(e,300),setTimeout(e,800),setTimeout(e,1600),setTimeout(e,3e3);let n=null;window.addEventListener("scroll",()=>{n&&clearTimeout(n),n=setTimeout(e,300)},{passive:!0}),typeof MutationObserver<"u"&&document.body&&(ct&&ct.disconnect(),ct=new MutationObserver(()=>{n&&clearTimeout(n),n=setTimeout(e,450)}),ct.observe(document.body,{childList:!0,subtree:!0}))}function jo(t){var e;try{typeof chrome<"u"&&((e=chrome.runtime)!=null&&e.sendMessage)&&chrome.runtime.sendMessage({type:"GET_QUEUE_STATE"},n=>{var s,a;const o=(n==null?void 0:n.state)||((s=n==null?void 0:n.payload)==null?void 0:s.state),r=(n==null?void 0:n.stats)||((a=n==null?void 0:n.payload)==null?void 0:a.stats);if(n!=null&&n.success&&(o!=null&&o.isRunning)){v.isRunning=!0,v.isPaused=!!o.isPaused,v.status=o.isPaused?"PAUSED":"RUNNING",v.total=(r==null?void 0:r.total)||0,v.completed=(r==null?void 0:r.completed)||0,v.failed=(r==null?void 0:r.failed)||0,v.skipped=(r==null?void 0:r.skipped)||0,v.currentGroupName=o.expectedGroupName||"Facebook Group",v.message=`Auto-posting in progress (${v.completed}/${v.total} done)...`,Xt();const i=Y.getInstance();T(i.getState(),t)}})}catch{}}function Xt(){de&&clearInterval(de),de=setInterval(()=>{var t;try{typeof chrome<"u"&&((t=chrome.runtime)!=null&&t.sendMessage)&&chrome.runtime.sendMessage({type:"GET_QUEUE_STATE"},e=>{var s,a;if(chrome.runtime.lastError||!(e!=null&&e.success))return;const n=(e==null?void 0:e.state)||((s=e==null?void 0:e.payload)==null?void 0:s.state),o=(e==null?void 0:e.stats)||((a=e==null?void 0:e.payload)==null?void 0:a.stats);if(!n||!o)return;n.isRunning?(v.isRunning=!0,v.isPaused=!!n.isPaused,v.status=n.isPaused?"PAUSED":"RUNNING",v.total=o.total||0,v.completed=o.completed||0,v.failed=o.failed||0,v.skipped=o.skipped||0,v.currentGroupName=n.expectedGroupName||"",v.message=v.isPaused?"Campaign paused by user.":`🚀 Posting to: "${v.currentGroupName||"Group"}" (${v.completed}/${v.total} done)...`):v.isRunning&&(v.isRunning=!1,v.isPaused=!1,v.status="COMPLETED",v.completed=o.completed||v.completed,v.total=o.total||v.total,v.message=`🎉 Campaign Finished! Successfully posted to ${v.completed} groups.`,clearInterval(de),de=null);const r=Y.getInstance();T(r.getState())})}catch{de&&(clearInterval(de),de=null)}},1e3)}function T(t,e){if(!h)return;const n=Vt(window.location.href),o=Be(),r=o.length||t.totalFound,s=z.filter(b=>!lt(b)).length,a=z.filter(b=>lt(b)).length;let i="0 Media";s>0&&a>0?i=`${s} Photos + ${a} Video${a>1?"s":""}`:a>0?i=`${a} Video${a>1?"s":""}`:s>0&&(i=`${s} Photo${s>1?"s":""}`);const l=t.status==="SEARCHING"||t.status==="JOINING",c=v.isRunning&&!v.isPaused,u=v.isPaused,d=l||c,f=c?"#10b981":u?"#f59e0b":t.status==="JOINING"?"#10b981":t.status==="SEARCHING"?"#3b82f6":t.status==="PAUSED"?"#f59e0b":v.status==="COMPLETED"?"#10b981":"#6366f1";if(Pt){F&&(F.style.left="auto",F.style.width="auto",F.style.right=window.innerWidth<=640?"12px":"24px",F.style.bottom=window.innerWidth<=640?"12px":"24px");const b=v.isRunning?`Posting: ${v.completed}/${v.total}`:l?`Joining: ${t.joinedCount}`:`Auto-Poster: ${r} Groups`;h.innerHTML=`
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
          background: ${f};
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
        <span style="font-size: 13px; font-weight: 700; letter-spacing: -0.2px;">${b}</span>
        <span style="font-size: 12px; color: #94a3b8; margin-left: 2px;">↗</span>
      </div>
    `;const g=h.getElementById("agp-dock-expand");g&&(g.onclick=()=>{Pt=!1,T(t,e)});return}if(F){const b=window.innerWidth<=640;F.style.left=b?"8px":"auto",F.style.right=b?"8px":"24px",F.style.bottom=b?"8px":"24px",F.style.width=b?"calc(100vw - 16px)":"auto"}const p=v.total>0?Math.min(100,Math.round(v.completed/v.total*100)):0;h.innerHTML=`
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
        background: ${f}22;
        color: ${f};
        border: 1px solid ${f}55;
      }
      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${f};
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
            <div class="subtitle" title="${n||"Facebook Groups"}">
              ${n?`Search: "${n}"`:"Group Search Results"}
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
          <div class="status-pill">
            <div class="status-dot"></div>
            <span>${c?"POSTING":u?"PAUSED":l?"JOINING":t.status}</span>
          </div>
          <button id="agp-dock-min" class="icon-btn" title="Minimize">−</button>
          <button id="agp-dock-close" class="icon-btn" title="Dismiss">✕</button>
        </div>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="tabs-nav">
        <button id="tab-post" class="tab-btn ${He==="POST_AND_JOIN"?"active":""}">
          <span>🚀 Auto-Join & Post</span>
          <span class="hot-badge">NEW</span>
        </button>
        <button id="tab-join" class="tab-btn ${He==="JOIN_ONLY"?"active":""}">
          <span>⚡ Join Only</span>
        </button>
      </div>

      ${He==="POST_AND_JOIN"?`
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
                  ${Wt.map(b=>`<option value="${b.id}">${b.icon} ${b.name}</option>`).join("")}
                </select>
                <select id="tb-select-borders" class="tb-select" title="Insert Decorative Borders">
                  <option value="" disabled selected>➖ Borders</option>
                  ${No.map(b=>`<option value="${b.value}">${b.name}</option>`).join("")}
                </select>
              </div>
              <button type="button" id="tb-btn-preview" class="tb-btn ${Ve?"active":""}" title="Toggle Live Facebook Post Preview">
                <span>${Ve?"👁️ Hide":"👁️ FB Preview"}</span>
              </button>
            </div>
          </div>

          <textarea
            id="agp-caption-input"
            class="caption-input"
            placeholder="What are you posting? Write your full listing caption, details, price, phone number...&#10;&#10;Use H1, H2, Bold, Italic, Bullets, Sales Tags above to design your caption!"
          >${S}</textarea>

          <!-- Live Facebook Post Preview Card -->
          ${Ve?`
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
                ${he(S)}
              </div>
              ${z.length>0?`
                <div style="margin-top: 8px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #000; max-height: 120px; display: flex; align-items: center; justify-content: center;">
                  ${lt(z[0])?`<video src="${z[0]}#t=0.1" style="max-height: 120px; width: 100%; object-fit: cover;" muted></video>`:`<img src="${z[0]}" style="max-height: 120px; width: 100%; object-fit: cover;" alt="Preview" />`}
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
              <span>📸🎥 Product Photos & Videos (${i} Added)</span>
            </label>
            ${z.length>0?'<button id="btn-clear-photos" class="action-link">Remove All</button>':""}
          </div>
          <input
            type="file"
            id="agp-file-input"
            accept="image/*,video/*,.mp4,.mov,.webm,.m4v,.mkv"
            multiple
            style="display: none;"
          />
          <div class="photos-container" id="agp-media-container">
            ${z.map((b,g)=>{const m=lt(b);return`
                  <div class="photo-thumb-wrapper ${m?"is-video":""}" title="${m?"Video":"Photo"} #${g+1}">
                    ${m?`
                        <video src="${b}#t=0.1" class="photo-thumb-img photo-thumb-video" muted playsinline preload="metadata" onloadedmetadata="this.currentTime=0.1"></video>
                        <div class="media-video-overlay">
                          <span class="media-video-badge">▶ VIDEO</span>
                        </div>
                        `:`
                        <img src="${b}" class="photo-thumb-img" alt="Photo ${g+1}" />
                        `}
                    <span class="media-index-pill">#${g+1}</span>
                    <button class="photo-remove-btn" data-index="${g}" title="Remove">✕</button>
                  </div>
                `}).join("")}

            ${We?`
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
              <option value="0" ${ge===0?"selected":""}>⚡ Turbo (0s Delay - Super Fast)</option>
              <option value="1" ${ge===1?"selected":""}>⚡ 1 Sec (Ultra Fast)</option>
              <option value="3" ${ge===3?"selected":""}>3 Sec (Fast)</option>
              <option value="5" ${ge===5?"selected":""}>5 Sec (Normal)</option>
              <option value="10" ${ge===10?"selected":""}>10 Seconds</option>
            </select>
          </div>
        </div>

        <!-- Discovered Groups Accordion -->
        <div id="btn-toggle-groups" class="groups-preview-toggle">
          <span>👥 Found on Search Page: <strong style="color: #60a5fa;">${r} Groups</strong></span>
          <span>${Ye?"▲ Hide":"▼ View List"}</span>
        </div>
        ${Ye?`
          <div class="groups-list-box">
            ${o.length>0?o.map(b=>`
                  <div class="group-row">
                    <span style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${b.item.name}">
                      ${b.item.name}
                    </span>
                    <span class="group-badge" style="background: ${b.item.privacy==="PUBLIC"?"rgba(16, 185, 129, 0.2)":"rgba(245, 158, 11, 0.2)"}; color: ${b.item.privacy==="PUBLIC"?"#34d399":"#fbbf24"};">
                      ${b.item.privacy}
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
          ${!l&&t.status!=="PAUSED"?`<button id="btn-start-join" class="btn btn-join-primary">
                   <span>▶</span> Auto-Join All Groups
                 </button>`:l?`<button id="btn-pause-join" class="btn btn-pause">⏸ Pause</button>
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
  `,Fo(t,e)}function Fo(t,e){var d,f,p,b,g,m,A,y,E,L,B,I,oe,J,ue,q,Z,le,Te,$e,se,ee,ve,we,$,H,me;if(!h)return;(d=h.getElementById("agp-dock-close"))==null||d.addEventListener("click",()=>{F&&(F.remove(),F=null,h=null)}),(f=h.getElementById("agp-dock-min"))==null||f.addEventListener("click",()=>{Pt=!0,T(t,e)}),(p=h.getElementById("btn-view-groups"))==null||p.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})}catch{}}),(b=h.getElementById("tab-post"))==null||b.addEventListener("click",()=>{He="POST_AND_JOIN",T(t,e)}),(g=h.getElementById("tab-join"))==null||g.addEventListener("click",()=>{He="JOIN_ONLY",T(t,e)});const n=h.getElementById("agp-caption-input");n&&(n.addEventListener("input",()=>{S=n.value,V();const x=h==null?void 0:h.querySelector(".char-count");x&&(x.textContent=`${S.length} chars`);const C=h==null?void 0:h.getElementById("agp-preview-body");C&&(C.innerHTML=he(S))}),n.addEventListener("paste",x=>{var P;const C=(P=x.clipboardData)==null?void 0:P.getData("text/html");if(C&&(/<(h[1-6]|b|strong|i|em|s|u|ul|ol|li|blockquote)[\s>]/i.test(C)||/data-lexical/i.test(C))){x.preventDefault();const k=Mo(C),D=n.selectionStart,W=n.selectionEnd,j=n.value.substring(0,D),ne=n.value.substring(W);S=j+k+ne,n.value=S,V(),n.focus(),n.setSelectionRange(D+k.length,D+k.length),te("📋 Styled text pasted with full design!");const re=h==null?void 0:h.querySelector(".char-count");re&&(re.textContent=`${S.length} chars`);const pe=h==null?void 0:h.getElementById("agp-preview-body");pe&&(pe.innerHTML=he(S))}}));const o=(x,C)=>{if(!n)return;const P=n.selectionStart,k=n.selectionEnd;if(P!==k){const j=n.value.substring(P,k),ne=x(j);S=n.value.substring(0,P)+ne+n.value.substring(k),n.value=S,V(),n.focus(),n.setSelectionRange(P,P+ne.length)}else if(C!==void 0){S=n.value.substring(0,P)+C+n.value.substring(k),n.value=S,V(),n.focus();const j=P+Math.floor(C.length/2);n.setSelectionRange(j,j)}else S.trim()&&(S=x(S),n.value=S,V(),n.focus());const D=h==null?void 0:h.querySelector(".char-count");D&&(D.textContent=`${S.length} chars`);const W=h==null?void 0:h.getElementById("agp-preview-body");W&&(W.innerHTML=he(S))};(m=h.getElementById("tb-h1"))==null||m.addEventListener("click",()=>{if(!n)return;const x=n.selectionStart,C=n.selectionEnd;if(x!==C)o(D=>rt(D,1));else{const D=n.value.substring(0,x),W=n.value.substring(C),j=D.lastIndexOf(`
`),ne=W.indexOf(`
`),re=j===-1?0:j+1,pe=ne===-1?n.value.length:x+ne,Gt=n.value.substring(re,pe),Mt=rt(Gt,1);S=n.value.substring(0,re)+Mt+n.value.substring(pe),n.value=S,V(),n.focus()}te("🏷️ Heading 1 (H1)");const P=h==null?void 0:h.querySelector(".char-count");P&&(P.textContent=`${S.length} chars`);const k=h==null?void 0:h.getElementById("agp-preview-body");k&&(k.innerHTML=he(S))}),(A=h.getElementById("tb-h2"))==null||A.addEventListener("click",()=>{if(!n)return;const x=n.selectionStart,C=n.selectionEnd;if(x!==C)o(D=>rt(D,2));else{const D=n.value.substring(0,x),W=n.value.substring(C),j=D.lastIndexOf(`
`),ne=W.indexOf(`
`),re=j===-1?0:j+1,pe=ne===-1?n.value.length:x+ne,Gt=n.value.substring(re,pe),Mt=rt(Gt,2);S=n.value.substring(0,re)+Mt+n.value.substring(pe),n.value=S,V(),n.focus()}te("🏷️ Heading 2 (H2)");const P=h==null?void 0:h.querySelector(".char-count");P&&(P.textContent=`${S.length} chars`);const k=h==null?void 0:h.getElementById("agp-preview-body");k&&(k.innerHTML=he(S))}),(y=h.getElementById("tb-bold"))==null||y.addEventListener("click",()=>{o(x=>_o(x),"****"),te("𝐁 Bold (**text**)")}),(E=h.getElementById("tb-italic"))==null||E.addEventListener("click",()=>{o(x=>Lo(x),"**"),te("𝘐 Italic (*text*)")}),(L=h.getElementById("tb-strike"))==null||L.addEventListener("click",()=>{o(x=>ce(x,"strikethrough")),te("Strikethrough / কাটা দাগ")}),(B=h.getElementById("tb-bullets"))==null||B.addEventListener("click",()=>{o(x=>Io(x),`
  • `),te("• Bullets")}),(I=h.getElementById("tb-numbers"))==null||I.addEventListener("click",()=>{o(x=>To(x),`
  1. `),te("1. Numbered List")}),(oe=h.getElementById("tb-quote"))==null||oe.addEventListener("click",()=>{o(x=>$o(x),`
> `),te("❞ Quote")});const r=h.getElementById("tb-select-style");r==null||r.addEventListener("change",()=>{r.value&&(o(x=>ce(x,r.value)),te(`Applied ${r.value}!`),r.value="")}),(J=h.getElementById("tb-auto-design"))==null||J.addEventListener("click",()=>{if(!S.trim()){te("⚠️ আগে ক্যাপশন লিখুন (Type caption first)");return}S=Go(S),n&&(n.value=S),V(),te("✨ 1-Click Auto-Design Applied!");const x=h==null?void 0:h.querySelector(".char-count");x&&(x.textContent=`${S.length} chars`);const C=h==null?void 0:h.getElementById("agp-preview-body");C&&(C.innerHTML=he(S))});const s=h.getElementById("tb-select-sales");s==null||s.addEventListener("change",()=>{if(s.value&&n){const x=Wt.find(C=>C.id===s.value);if(x){const C=x.content.replace("{price}","১,৫০০ ৳").replace("{location}","ঢাকা / সারা বাংলাদেশ").replace("{contact_info}","ইনবক্স করুন / 017xxxxxxxx"),P=n.selectionStart,k=n.selectionEnd,D=n.value.substring(0,P),W=n.value.substring(k),j=D.length===0||D.endsWith(`

`)?"":D.endsWith(`
`)?`
`:`

`;S=D+j+C+`
`+W,n.value=S,V(),te(`Inserted ${x.name}!`),n.focus(),n.setSelectionRange(P+j.length+C.length+1,P+j.length+C.length+1);const re=h==null?void 0:h.querySelector(".char-count");re&&(re.textContent=`${S.length} chars`);const pe=h==null?void 0:h.getElementById("agp-preview-body");pe&&(pe.innerHTML=he(S))}s.value=""}});const a=h.getElementById("tb-select-borders");a==null||a.addEventListener("change",()=>{if(a.value&&n){const x=a.value,C=n.selectionStart,P=n.selectionEnd,k=n.value.substring(0,C),D=n.value.substring(P),W=k.length===0||k.endsWith(`
`)?"":`
`,j=D.startsWith(`
`)?"":`
`;S=k+W+x+j+D,n.value=S,V(),te("➖ Border inserted!"),n.focus(),n.setSelectionRange(C+W.length+x.length+j.length,C+W.length+x.length+j.length);const ne=h==null?void 0:h.querySelector(".char-count");ne&&(ne.textContent=`${S.length} chars`);const re=h==null?void 0:h.getElementById("agp-preview-body");re&&(re.innerHTML=he(S)),a.value=""}}),(ue=h.getElementById("tb-btn-preview"))==null||ue.addEventListener("click",()=>{Ve=!Ve,T(t,e)}),(q=h.getElementById("btn-clear-caption"))==null||q.addEventListener("click",()=>{S="",V(),T(t,e)});const i=h.getElementById("agp-file-input");(Z=h.getElementById("btn-trigger-upload"))==null||Z.addEventListener("click",()=>{i==null||i.click()}),i&&i.addEventListener("change",async()=>{if(i.files&&i.files.length>0){We=!0,T(t,e);const x=Array.from(i.files),C=[];for(const P of x)try{const k=await Yt(P);k&&C.push(k)}catch(k){console.warn("[AGP:SearchPoster] File convert error:",k)}z=[...z,...C],await V(),We=!1,i.value="",T(t,e)}});const l=h.getElementById("agp-media-container");l&&(l.addEventListener("dragover",x=>{x.preventDefault(),l.classList.add("drag-over")}),l.addEventListener("dragleave",x=>{x.preventDefault(),l.classList.remove("drag-over")}),l.addEventListener("drop",async x=>{var C;if(x.preventDefault(),l.classList.remove("drag-over"),(C=x.dataTransfer)!=null&&C.files&&x.dataTransfer.files.length>0){We=!0,T(t,e);const P=Array.from(x.dataTransfer.files),k=[];for(const D of P)try{const W=await Yt(D);W&&k.push(W)}catch(W){console.warn("[AGP:SearchPoster] Drag drop convert error:",W)}z=[...z,...k],await V(),We=!1,T(t,e)}})),h.querySelectorAll(".photo-remove-btn").forEach(x=>{x.addEventListener("click",C=>{C.stopPropagation();const P=x.getAttribute("data-index");if(P!==null){const k=parseInt(P,10);!isNaN(k)&&k>=0&&k<z.length&&(z.splice(k,1),V(),T(t,e))}})}),(le=h.getElementById("btn-clear-photos"))==null||le.addEventListener("click",()=>{z=[],V(),T(t,e)});const c=h.getElementById("agp-select-target");c&&c.addEventListener("change",()=>{Q=parseInt(c.value,10)||0,V(),T(t,e)});const u=h.getElementById("agp-select-delay");u&&u.addEventListener("change",()=>{ge=parseInt(u.value,10)||0,V()}),(Te=h.getElementById("btn-toggle-groups"))==null||Te.addEventListener("click",()=>{Ye=!Ye,T(t,e)}),($e=h.getElementById("btn-start-campaign"))==null||$e.addEventListener("click",()=>{zo(t,e)}),(se=h.getElementById("btn-pause-campaign"))==null||se.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&(chrome.runtime.sendMessage({type:"PAUSE_QUEUE"}),v.isPaused=!0,v.status="PAUSED",v.message="Posting campaign paused.",T(t,e))}catch{}}),(ee=h.getElementById("btn-resume-campaign"))==null||ee.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&(chrome.runtime.sendMessage({type:"RESUME_QUEUE"}),v.isPaused=!1,v.status="RUNNING",v.message="Resuming campaign...",T(t,e))}catch{}}),(ve=h.getElementById("btn-stop-campaign"))==null||ve.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&(chrome.runtime.sendMessage({type:"STOP_QUEUE"}),v.isRunning=!1,v.isPaused=!1,v.status="IDLE",v.message="Campaign stopped.",de&&(clearInterval(de),de=null),T(t,e))}catch{}}),(we=h.getElementById("btn-start-join"))==null||we.addEventListener("click",()=>{Y.getInstance().start(e||{searchUrl:window.location.href,delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0})}),($=h.getElementById("btn-pause-join"))==null||$.addEventListener("click",()=>{Y.getInstance().pause()}),(H=h.getElementById("btn-resume-join"))==null||H.addEventListener("click",()=>{Y.getInstance().resume()}),(me=h.getElementById("btn-stop-join"))==null||me.addEventListener("click",()=>{Y.getInstance().stop()})}async function zo(t,e){var u;if(!S.trim()&&z.length===0){v.message="⚠️ অনুগ্রহ করে পোস্টের ক্যাপশন অথবা অন্তত একটি ছবি/ভিডিও যুক্ত করুন (Please add caption, photos or video).",T(t,e);return}let n=Be();const o=Q>0?Q:n.length||10;let r=0;for(;n.length<o&&r<3;)r++,v.status="SCANNING",v.message=`🔍 Scanning search results... Found ${n.length}/${o} groups...`,T(t,e),window.scrollBy({top:1e3,behavior:"smooth"}),await new Promise(d=>setTimeout(d,400)),n=Be();if(n.length===0){v.status="ERROR",v.message="⚠️ কোনো ফেসবুক গ্রুপ পাওয়া যায়নি। পেজটি স্ক্রোল করুন অথবা সার্চ লিঙ্ক চেক করুন।",T(t,e);return}const s=Q>0?n.slice(0,Q):n,a=[],i=[];for(const d of s){const f=d.item.groupId||d.item.id,p=d.item.url||`https://www.facebook.com/groups/${encodeURIComponent(f)}/`,b={id:f,groupId:f,name:d.item.name||"Facebook Group",url:p,category:"Search Result",privacy:d.item.privacy,enabled:!0,selected:!0,status:"READY",postCount:0,verified:!0,source:"facebook-ui",createdAt:Date.now(),updatedAt:Date.now()};a.push(b),i.push(b.id)}const l=`search_post_${Date.now()}`,c={id:l,title:S.slice(0,40)||"Product Post",productName:S.slice(0,30)||"Product",caption:S,description:S,images:z,createdAt:Date.now(),updatedAt:Date.now()};v.isRunning=!0,v.isPaused=!1,v.status="RUNNING",v.total=i.length,v.completed=0,v.failed=0,v.skipped=0,v.message=`⚡ Super Fast Turbo Campaign Started! Visiting & posting to ${i.length} groups...`,T(t,e),Xt();try{typeof chrome<"u"&&((u=chrome.runtime)!=null&&u.sendMessage)&&chrome.runtime.sendMessage({type:"CREATE_AND_START_QUEUE",payload:{groupIds:i,postId:l,delaySec:ge,groups:a,post:c}},d=>{d!=null&&d.success?console.log("[AGP:SearchPoster] Campaign successfully queued & running."):(console.warn("[AGP:SearchPoster] Queue start error:",d==null?void 0:d.error),v.status="ERROR",v.isRunning=!1,v.message=`Failed to start: ${(d==null?void 0:d.error)||"Unknown error"}`,T(t,e))})}catch(d){console.error("[AGP:SearchPoster] Error starting campaign:",d),v.status="ERROR",v.isRunning=!1,v.message=`Error starting campaign: ${String(d)}`,T(t,e)}(async()=>{try{const d=await vt(),f=new Map(d.map(g=>[g.groupId?g.groupId.toLowerCase():g.id.toLowerCase(),g])),p=[];for(const g of a)f.has(g.groupId.toLowerCase())||(p.push(g),f.set(g.groupId.toLowerCase(),g));p.length>0&&await wt([...d,...p]);const b=await xo();await vo([c,...b.filter(g=>g.id!==l)])}catch(d){console.warn("[AGP:SearchPoster] Background group persistence warning:",d)}})()}console.log("[AGP:Content] Facebook Assistant Content Script initialized.");let Se=null,_=null,w=null,_e=!1,dt=!1,Oe=null,ut=!1;function _t(){R&&(clearInterval(R),R=null),X=!1,ye=!0,ut=!0;try{chrome.runtime.sendMessage({type:"STOP_QUEUE"})}catch{}Se&&(Se.remove(),Se=null,_=null),N("🛑 Auto-Posting বন্ধ করা হয়েছে (Stopped & Closed)")}async function Jo(t){try{return await navigator.clipboard.writeText(t),!0}catch{const n=document.createElement("textarea");n.value=t,document.body.appendChild(n),n.select();const o=document.execCommand("copy");return document.body.removeChild(n),o}}async function Zt(t,e){try{if(navigator.clipboard&&window.ClipboardItem){const n=new Blob([t],{type:"text/plain"}),o=new Blob([e],{type:"text/html"});return await navigator.clipboard.write([new window.ClipboardItem({"text/plain":n,"text/html":o})]),!0}}catch{}try{const n=r=>{var s,a;r.preventDefault(),(s=r.clipboardData)==null||s.setData("text/plain",t),(a=r.clipboardData)==null||a.setData("text/html",e)};document.addEventListener("copy",n);const o=document.execCommand("copy");if(document.removeEventListener("copy",n),o)return!0}catch{}return Jo(t)}function N(t,e=!1){if(_){const n=_.getElementById("agp-toast");n&&n.remove();const o=document.createElement("div");o.id="agp-toast",o.innerText=t,o.style.cssText=`
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
    `,_.appendChild(o),setTimeout(()=>o.remove(),2400);return}if(typeof document<"u"&&document.body){const n=document.getElementById("agp-global-toast");n&&n.remove();const o=document.createElement("div");o.id="agp-global-toast",o.innerText=t,o.style.cssText=`
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
    `,document.body.appendChild(o),requestAnimationFrame(()=>{o.style.opacity="1",o.style.transform="translateY(0)"}),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateY(-10px)",setTimeout(()=>o.remove(),400)},3e3)}}let X=!1,U="Preparing auto-post...",R=null,ye=!1;const G=t=>new Promise(e=>setTimeout(e,t));async function Wo(t,e="media_1"){try{if(!t||typeof t!="string")return null;let n="image/jpeg",o=null;if(t.startsWith("data:")||t.startsWith("blob:")||t.startsWith("http://")||t.startsWith("https://"))try{const u=await fetch(t);(u.ok||t.startsWith("data:")||t.startsWith("blob:"))&&(o=await u.blob(),o&&o.size>0&&(n=(o.type||"").toLowerCase()||"image/jpeg"))}catch(u){console.warn("[AGP:AutoPost] fetch blob parsing failed, falling back to manual decode:",u)}if(!o||o.size===0){let u=t;if(t.startsWith("data:")){const d=t.indexOf(",");if(d!==-1){const f=t.slice(0,d);u=t.slice(d+1);const p=f.match(/:(.*?);/);n=p?p[1].toLowerCase():"image/jpeg"}}try{const d=atob(u.trim().replace(/\s/g,"")),f=new Uint8Array(d.length);for(let p=0;p<d.length;p++)f[p]=d.charCodeAt(p);if(f.length===0)return null;f.length>8&&f[4]===102&&f[5]===116&&f[6]===121&&f[7]===112&&(n="video/mp4"),o=new Blob([f.buffer],{type:n})}catch(d){return console.warn("[AGP:AutoPost] base64 decode failed:",d),null}}if(!o||o.size===0)return null;const r=n.startsWith("video/");let s="jpg";n.includes("video/mp4")||n.includes("mp4")?s="mp4":n.includes("video/webm")||n.includes("webm")?s="webm":n.includes("video/quicktime")||n.includes("mov")?s="mov":n.includes("video/x-m4v")||n.includes("m4v")?s="m4v":n.includes("video/mkv")||n.includes("matroska")?s="mkv":r?s="mp4":n.includes("png")?s="png":n.includes("webp")?s="webp":n.includes("gif")&&(s="gif");const a=Date.now(),i=e.replace(/\D/g,"")||"1",c=`${r?"VID":"IMG"}_${a}_${i}.${s}`;return new File([o],c,{type:n,lastModified:a})}catch(n){return console.warn("[AGP:AutoPost] mediaToFile error:",n),null}}function O(t){if(!t)return!1;if(t.offsetParent!==null)return!0;try{const e=window.getComputedStyle(t);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0")return!1;const n=t.getBoundingClientRect();return n.width>0&&n.height>0}catch{return!1}}function ae(t){if(!t)return!0;const e=t.tagName.toUpperCase();if(e==="IMG"||e==="SVG"||e==="VIDEO"||e==="AUDIO"||t.closest('[role="tab"], [role="tablist"], [role="navigation"], nav, [role="menu"], [role="menuitem"]')||t.closest('[data-pagelet*="CoverPhoto"], [data-pagelet*="GroupCover"], [data-pagelet*="GroupBanner"], div[data-pagelet="CoverPhoto"]')||t.closest('[data-pagelet*="MediaViewer"], div[aria-label*="Photo viewer" i]')||t.closest('a[href*="/photo/"], a[href*="/photos/"], a[href*="/media/"], a[href*="/album/"], a[href*="/videos/"], a[href*="/posts/"], a[href*="/permalink/"]')||t.closest('[data-pagelet*="Comment"], [aria-label*="Comment as" i], [aria-label="Write a comment" i], [aria-label*="Actions for this post" i], [aria-label*="Like" i]'))return!0;const n=(t.getAttribute("aria-label")||"").toLowerCase();return!!(n.includes("cover photo")||n.includes("কভার ফটো")||n.startsWith("photo:")||n.includes("photo by")||n.includes("profile picture")||n.includes("প্রোফাইল ছবি")||t.getAttribute("role")==="img")}const Vo=["what's on your mind","whats on your mind","what is on your mind","write something","write something to","create a public post","create a post","create post","write post","start discussion","write discussion","what are you selling","sell something","anonymous post","পোস্ট তৈরি করুন","একটি পোস্ট তৈরি করুন","কিছু লিখুন","পাবলিক পোস্ট","আপনার মনে কী আছে","আপনার মনে কি আছে","আপনার মনে কি চলছে","কী ভাবছেন","কি ভাবছেন","আলোচনা শুরু করুন","কী বিক্রি করছেন","কি বিক্রি করছেন","কিছু বিক্রি করুন","বেনামী পোস্ট"];function Lt(t,e,n){const o=(e||"").toLowerCase(),r=(t||"").toLowerCase().replace(/\u2026/g,"...").trim(),s=(n||"").toLowerCase();for(const a of Vo)if(o.includes(a)||s.includes(a)||r.startsWith(a)||r.length<120&&r.includes(a))return!0;return!1}async function eo(){if(!(window.location.href.includes("/photo")||!!document.querySelector('[data-pagelet*="MediaViewer"], div[aria-label="Close"][role="button"], img[data-visualcompletion="media-vc-image"]')))return!1;console.log("[AGP:AutoPost] Photo theater viewer detected! Closing it to return to group page...");const e=document.querySelector('[aria-label="Close" i][role="button"], [aria-label="Close" i], [aria-label="Exit" i], div[aria-label="Close" i], [data-pagelet*="MediaViewer"] [aria-label*="Close" i]');if(e&&O(e))try{return e.click(),await G(350),!0}catch{}try{window.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",code:"Escape",keyCode:27,which:27,bubbles:!0})),window.dispatchEvent(new KeyboardEvent("keyup",{key:"Escape",code:"Escape",keyCode:27,which:27,bubbles:!0})),await G(300)}catch{}if(window.location.href.includes("/photo"))try{window.history.back(),await G(500)}catch{}return!0}function Ho(){const t=Array.from(document.querySelectorAll('[role="tab"], a[role="tab"], [role="tablist"] a, a[href*="/discussion"]'));for(const e of t){const n=(e.textContent||"").trim().toLowerCase(),o=(e.getAttribute("href")||"").toLowerCase();if(n==="discussion"||n==="আলোচনা"||o.endsWith("/discussion")||o.endsWith("/discussion/")||o.includes("/discussion/?"))try{return e.click(),console.log('[AGP:AutoPost] Clicked "Discussion" tab to reveal composer.'),!0}catch{}}return!1}function xe(){const t=Array.from(document.querySelectorAll('[data-pagelet="GroupInlineComposer"], [data-pagelet="FeedInlineComposer"], [data-pagelet="GroupComposer"], [data-pagelet*="Composer" i]'));for(const r of t){if(ae(r))continue;const s=Array.from(r.querySelectorAll('[role="button"], button, div[tabindex="0"], span, textarea, input'));for(const l of s){if(ae(l))continue;const c=l.getAttribute("aria-label")||"",u=l.textContent||"",d=l.getAttribute("placeholder")||"";if(Lt(u,c,d)){const f=l.closest('[role="button"], button')||l.closest('[tabindex="0"]')||l;if(f&&O(f)&&!ae(f))return f}}const a=r.querySelector('[aria-label*="Photo/video" i], [aria-label*="Photo / video" i], [aria-label*="Add Photos" i], [aria-label*="ছবি/ভিডিও" i], [aria-label*="ছবি" i], [aria-label*="Photo" i]');if(a&&O(a)&&!ae(a)){const l=a.closest('[role="button"], button')||a;if(l&&O(l)&&!ae(l))return l}const i=r.querySelector('div[role="button"][tabindex="0"], div[role="button"]');if(i&&O(i)&&!ae(i))return i}const e=document.querySelector('[role="main"] div[role="feed"], div[role="feed"]');if(e){const r=Array.from(e.children).slice(0,3);e.previousElementSibling&&r.unshift(e.previousElementSibling);for(const s of r){if(s.querySelector('a[href*="/posts/"], a[href*="/permalink/"], [aria-label="Like" i]'))continue;const a=Array.from(s.querySelectorAll('[role="button"], button, [tabindex="0"]'));for(const l of a){if(ae(l))continue;const c=l.getAttribute("aria-label")||"",u=l.textContent||"",d=l.getAttribute("placeholder")||"";if(Lt(u,c,d)&&O(l))return l}const i=s.querySelector('[aria-label*="Photo/video" i], [aria-label*="ছবি/ভিডিও" i]');if(i&&O(i)&&!ae(i))return i.closest('[role="button"], button')||i}}const n=Array.from(document.querySelectorAll('[role="main"] div[role="button"][tabindex="0"], [role="main"] [role="button"], [role="main"] button, div[role="button"][tabindex="0"], button'));for(const r of n){if(ae(r))continue;const s=r.getAttribute("aria-label")||"",a=(r.textContent||"").trim();if((a.length<100||s)&&Lt(a,s)&&O(r))return r}const o=Array.from(document.querySelectorAll('div[data-sigil*="m-composer"], div#MComposer, textarea[name="status"], button[value="Post"], div[role="button"][data-sigil*="touchable"]'));for(const r of o)if(O(r)&&!ae(r))return r;return null}function Ae(){var n;const t=Array.from(document.querySelectorAll('[role="dialog"], [aria-modal="true"], div[data-pagelet*="ComposerModal"]'));for(const o of t){if(!O(o)||(n=o.getAttribute("data-pagelet"))!=null&&n.toLowerCase().includes("mediaviewer")||o.querySelector('[data-pagelet*="MediaViewer"], img[data-visualcompletion="media-vc-image"], div[aria-label*="Photo viewer" i]')||o.closest('[role="article"]')||o.querySelector('[data-pagelet*="ChatTab"], [aria-label*="Messenger" i], [aria-label*="Chats" i]'))continue;const r=(o.textContent||"").toLowerCase(),s=(o.getAttribute("aria-label")||"").toLowerCase(),a=!!(o.querySelector('[aria-label="Post" i], [aria-label="Publish" i], [aria-label="পোস্ট" i], [aria-label="সাবমিট" i], div[aria-label="Next" i], [role="button"][aria-label="Post" i]')||Array.from(o.querySelectorAll('[role="button"], button')).some(u=>{const d=(u.textContent||"").trim().toLowerCase();return d==="post"||d==="publish"||d==="পোস্ট"||d==="পোস্ট করুন"||d==="next"||d==="পরবর্তী"})),i=!!(o.querySelector('[aria-label*="Add to your post" i], [aria-label*="আপনার পোস্টে যোগ করুন" i], [aria-label*="Photo/video" i]')||r.includes("add to your post")||r.includes("আপনার পোস্টে যোগ করুন")),l=s.includes("create post")||s.includes("create a post")||s.includes("create a public post")||s.includes("পোস্ট তৈরি করুন")||r.includes("create a public post")||r.includes("create post")||r.includes("পোস্ট তৈরি করুন")||r.includes("what are you selling")||r.includes("কী বিক্রি করছেন")||!!o.querySelector('h2, [role="heading"]');if(!!o.querySelector('div[role="textbox"][contenteditable="true"], div[contenteditable="true"]')&&(a||i||l)||a&&i)return o}const e=Array.from(document.querySelectorAll('[data-pagelet*="Composer"] div[role="textbox"][contenteditable="true"], [data-pagelet*="InlineComposer"] div[role="textbox"][contenteditable="true"]'));for(const o of e){if(!O(o)||o.closest('[aria-label*="Comment" i], [data-pagelet*="Comment"]'))continue;const r=o.closest('[data-pagelet*="Composer"], [data-pagelet*="InlineComposer"]')||o.parentElement;if(r&&O(r))return r}return null}function Ke(){const t=(document.body?document.body.innerText:"").toLowerCase(),e=(document.title||"").toLowerCase();return window.location.href.toLowerCase().includes("/groups/grp_")||t.includes("this content isn't available right now")||t.includes("this content isn't available")||t.includes("content isn't available right now")||t.includes("the link you followed may be broken")||t.includes("page may have been removed")||t.includes("এই কন্টেন্টটি এখন উপলব্ধ নয়")||t.includes("এই লিঙ্কটি হয়তো ত্রুটিপূর্ণ")||e.includes("page not found")||e.includes("content not found")||!!document.querySelector('[role="main"] [aria-label*="Go to Feed" i], [role="main"] a[href="/"][role="button"]')}async function Yo(){if(Ke())return null;await eo();let t=Ae();if(t)return t;let e=xe();if(!e){if(window.scrollTo({top:0,behavior:"instant"}),await G(200),t=Ae(),t)return t;e=xe()}if(!e){if(Ho(),await G(350),t=Ae(),t)return t;e=xe()}if(!e){if(window.scrollTo({top:350,behavior:"instant"}),await G(200),t=Ae(),t)return t;e=xe()}if(!e){const a=Date.now();for(;Date.now()-a<5500;){if(t=Ae(),t)return t;if(e=xe(),e)break;await G(30)}}if(!e)return console.log("[AGP:AutoPost] Composer trigger not found on page."),null;e.scrollIntoView({behavior:"instant",block:"center"}),await G(40);try{e.focus()}catch{}try{e.dispatchEvent(new TouchEvent("touchstart",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new TouchEvent("touchend",{bubbles:!0,cancelable:!0}))}catch{}const n={bubbles:!0,cancelable:!0,view:window,button:0,buttons:1,detail:1},o={bubbles:!0,cancelable:!0,view:window,button:0,buttons:0,detail:1};e.dispatchEvent(new PointerEvent("pointerdown",n)),e.dispatchEvent(new MouseEvent("mousedown",n)),e.dispatchEvent(new PointerEvent("pointerup",o)),e.dispatchEvent(new MouseEvent("mouseup",o)),e.click();const r=e.querySelector('span, div[dir="auto"], div');if(r&&r!==e&&!ae(r))try{r.click()}catch{}const s=Date.now();for(;Date.now()-s<5500;){if(t=Ae(),t)return t;if(Date.now()-s>1200&&Date.now()-s<1350){const a=e.closest('[data-pagelet*="Composer"], div[role="feed"] > div');if(a){const i=a.querySelector('[aria-label*="Photo/video" i], [aria-label*="ছবি/ভিডিও" i]');if(i&&O(i)&&!ae(i))try{i.click()}catch{}}}await G(25)}return await eo()&&console.warn("[AGP:AutoPost] Accidental photo viewer closed."),null}async function to(t,e){if(!e||!e.trim())return!0;const n=Bo(xt(e)).replace(/\r\n/g,`
`).replace(/\r/g,`
`),o=n.split(`
`);Zt(n.trim(),St(n)).catch(()=>{});let r=null;const s=Date.now(),a=['div[role="textbox"][contenteditable="true"]','div[data-lexical-editor="true"][contenteditable="true"]','div[contenteditable="true"]:not([aria-label*="comment" i]):not([aria-label*="মন্তব্য" i])','div[data-editor="true"]','div[aria-label*="Create a public post" i][contenteditable="true"]','div[aria-label*="Write something" i][contenteditable="true"]','div[aria-label*="কিছু লিখুন" i][contenteditable="true"]','div[aria-label*="পাবলিক পোস্ট" i][contenteditable="true"]','div[aria-placeholder*="Create a public post" i]','div[aria-placeholder*="Write something" i]'];for(;Date.now()-s<4e3;){for(const m of a){const A=t.querySelector(m)||document.querySelector(`[role="dialog"] ${m}`);if(A&&O(A)){r=A;break}}if(r)break;await G(10)}if(!r)return console.warn("[AGP:AutoPost] Create post editor not found inside modal."),!1;const i=(r.textContent||"").trim(),l=n.trim().slice(0,30);if(i.length>=n.trim().length*.7&&(!l||i.includes(l)))return console.log("[AGP:AutoPost] Editor already contains caption. Skipping duplicate injection."),!0;r.scrollIntoView({behavior:"instant",block:"center"}),window.focus(),r.focus();const c={bubbles:!0,cancelable:!0,view:window};r.dispatchEvent(new PointerEvent("pointerdown",c)),r.dispatchEvent(new MouseEvent("mousedown",c)),r.dispatchEvent(new PointerEvent("pointerup",c)),r.dispatchEvent(new MouseEvent("mouseup",c)),r.dispatchEvent(new MouseEvent("click",c)),r.dispatchEvent(new FocusEvent("focus",{bubbles:!1})),r.dispatchEvent(new FocusEvent("focusin",{bubbles:!0}));try{const m="agp_inj_"+Date.now()+"_"+Math.random().toString(36).slice(2,7),A=new Promise(E=>{const L=B=>{B.data&&B.data.type==="AGP_MAIN_INJECT_CAPTION_RESPONSE"&&B.data.messageId===m&&(window.removeEventListener("message",L),E(!!B.data.success))};window.addEventListener("message",L),setTimeout(()=>{window.removeEventListener("message",L),E(!1)},250)});if(window.postMessage({type:"AGP_MAIN_INJECT_CAPTION",messageId:m,caption:n},"*"),await A&&(console.log("[AGP:AutoPost] MAIN world injection succeeded with exact layout!"),(r.textContent||"").trim().length>0))return!0}catch(m){console.warn("[AGP:AutoPost] MAIN world bridge error, using direct content injection:",m)}const u=(r.textContent||"").trim();if(u.length>=n.trim().length*.7&&(!l||u.includes(l)))return console.log("[AGP:AutoPost] Editor already populated by bridge. Skipping fallback Strategy 2."),!0;const d=window.getSelection();if(d){const m=document.createRange();m.selectNodeContents(r),d.removeAllRanges(),d.addRange(m),r.dispatchEvent(new InputEvent("beforeinput",{bubbles:!0,cancelable:!0,inputType:"deleteContentBackward"}))}document.execCommand("selectAll",!1),document.execCommand("delete",!1),await G(10);const f=r.querySelector("p")||r;if(f.dispatchEvent(new MouseEvent("mousedown",c)),f.dispatchEvent(new MouseEvent("mouseup",c)),f.click(),d){const m=document.createRange();f.childNodes.length>0?(m.setStart(f,0),m.setEnd(f,f.childNodes.length)):m.selectNodeContents(f),m.collapse(!0),d.removeAllRanges(),d.addRange(m)}document.dispatchEvent(new Event("selectionchange"));let p=!1;const b=St(n);try{const m=new DataTransfer;m.setData("text/plain",n),m.setData("text/html",b);const A=new ClipboardEvent("paste",{bubbles:!0,cancelable:!0,clipboardData:m});r.dispatchEvent(A),await G(20);let y=(r.textContent||"").trim();if((!y||y.length<5)&&(r.dispatchEvent(new InputEvent("beforeinput",{bubbles:!0,cancelable:!0,inputType:"insertFromPaste",dataTransfer:m})),await G(15),y=(r.textContent||"").trim()),!y||y.length<5)try{document.execCommand("insertHTML",!1,b),await G(15),y=(r.textContent||"").trim()}catch{}const E=r.querySelectorAll("p, h1, h2, h3, ul, ol, li, blockquote"),L=r.querySelectorAll("h1, h2, ul, ol, blockquote").length>0;y.length>0&&(!n.includes(`
`)||E.length>1||L||y.length>=n.trim().length*.4)&&(console.log("[AGP:AutoPost] Direct Native Paste event succeeded. Block count:",E.length),p=!0)}catch(m){console.warn("[AGP:AutoPost] Native paste event error:",m)}if(!p)try{console.log("[AGP:AutoPost] Trying Strategy 3: Line-by-line Enter keystrokes with non-collapsing spacing..."),document.execCommand("selectAll",!1),document.execCommand("delete",!1),await G(10);for(let A=0;A<o.length;A++){const y=o[A],E=A===o.length-1;y.length>0?document.execCommand("insertText",!1,y):document.execCommand("insertText",!1," "),E||(r.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0,cancelable:!0})),r.dispatchEvent(new InputEvent("beforeinput",{inputType:"insertParagraph",bubbles:!0,cancelable:!0})),document.execCommand("insertParagraph",!1),r.dispatchEvent(new InputEvent("input",{inputType:"insertParagraph",bubbles:!0})),r.dispatchEvent(new KeyboardEvent("keyup",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0})))}await G(15),(r.textContent||"").trim().length>0&&(console.log("[AGP:AutoPost] Strategy 3 succeeded."),p=!0)}catch(m){console.warn("[AGP:AutoPost] Strategy 3 error:",m)}return r.dispatchEvent(new Event("input",{bubbles:!0})),r.dispatchEvent(new Event("change",{bubbles:!0})),document.dispatchEvent(new Event("selectionchange")),await G(15),(r.textContent||"").trim().length>0}function Ko(t){const e=t.querySelector('[aria-label*="Photo/video" i], [aria-label*="Photo / video" i], [aria-label*="Add photo" i], [aria-label*="Add Photos" i], [aria-label*="Add photos or videos" i], [aria-label*="Add video" i], [aria-label*="Add Photos/videos" i], [aria-label*="ফটো/ভিডিও" i], [aria-label*="Photo" i], [aria-label*="Video" i], [aria-label*="ছবি/ভিডিও" i], [aria-label*="ছবি" i], [aria-label*="ভিডিও" i], div[aria-label*="Photo" i], div[aria-label*="Video" i], div[aria-label*="ফটো" i], div[aria-label*="ভিডিও" i]');if(e&&O(e))return e;const n=Array.from(t.querySelectorAll('[role="button"], button, div[tabindex="0"]'));for(const r of n){const s=(r.getAttribute("aria-label")||"").toLowerCase();if((s.includes("photo")||s.includes("video")||s.includes("image")||s.includes("ফটো")||s.includes("ছবি")||s.includes("ভিডিও"))&&O(r))return r}const o=Array.from(t.querySelectorAll("span, div, p"));for(const r of o){const s=(r.textContent||"").trim().toLowerCase();if(s==="add to your post"||s==="আপনার পোস্টে যোগ করুন"||s.includes("add to your post")){const a=r.closest("div"),i=(a==null?void 0:a.parentElement)||a,l=i==null?void 0:i.querySelector('[role="button"], img, svg');if(l&&O(l))return l.closest('[role="button"]')||l}}return null}function oo(t){return t.querySelector('input[type="file"][accept*="video"]')||t.querySelector('input[type="file"][accept*="image"]')||t.querySelector('input[type="file"]')||document.querySelector('[role="dialog"] input[type="file"]')||document.querySelector('input[type="file"]')}function De(t){var n;const e=(t.textContent||"").toLowerCase();if(e.includes("your file can't be uploaded")||e.includes("file can't be uploaded")||e.includes("আপলোড করা যাবে না")||e.includes("আপলোড করা যায়নি")||e.includes("couldn't be uploaded")||e.includes("error uploading")){const o=Array.from(t.querySelectorAll("span, div, p")).find(r=>{const s=(r.textContent||"").toLowerCase();return s.includes("your file can't be uploaded")||s.includes("file can't be uploaded")||s.includes("আপলোড করা যাবে না")||s.includes("আপলোড করা যায়নি")||s.includes("couldn't be uploaded")});return((n=o==null?void 0:o.textContent)==null?void 0:n.trim())||"Your file can't be uploaded"}return null}async function Qo(t,e){if(!e||e.length===0)return!0;const n=e.some(c=>c.includes("video")||c.includes(".mp4")||c.includes(".mov")||c.includes(".webm")||c.includes("data:video"));let o=oo(t);if(!o){const c=Ko(t);if(c){c.scrollIntoView({behavior:"instant",block:"center"}),c.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0})),c.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0,cancelable:!0})),c.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,cancelable:!0})),c.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0,cancelable:!0})),c.click();const u=Date.now();for(;Date.now()-u<2500&&(o=oo(t),!o);)await G(20)}}if(!o)return console.warn("[AGP:AutoPost] File input not found inside create post modal."),!1;const r=new DataTransfer,s=await Promise.all(e.map((c,u)=>Wo(c,`media_${u+1}`)));for(const c of s)c&&c.size>0&&(r.items.add(c),console.log(`[AGP:AutoPost] Prepared media file: ${c.name} (${c.type}, ${c.size} bytes)`));if(r.files.length===0)return console.warn("[AGP:AutoPost] No valid non-empty files prepared from mediaList."),!1;o.files=r.files;const a=o._valueTracker;a&&a.setValue(""),o.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0})),o.dispatchEvent(new Event("input",{bubbles:!0,cancelable:!0}));const i=n?12e3:4e3,l=Date.now();for(;Date.now()-l<i;){const c=De(t);if(c)return console.warn("[AGP:AutoPost] Facebook upload error detected:",c),!1;if(!!t.querySelector('video, img[src*="blob:"], img[src*="data:"], img[src*="fbcdn.net"], div[aria-label*="Video" i], div[aria-label*="Photo" i], div[data-pagelet*="MediaViewer"], div[aria-label*="Edit" i], button[aria-label*="Edit" i], div[aria-label*="Remove" i], div[role="button"][aria-label*="Edit" i]')){console.log("[AGP:AutoPost] Media preview mounted immediately in composer.");break}await G(10)}return!De(t)}function no(t,e){return t.includes("joined")||t.includes("যোগ দিয়েছেন")||t.includes("মেম্বার")||t.includes("member")||t.includes("leave group")||t.includes("গ্রুপ ত্যাগ")||e.includes("joined")||e.includes("যোগ দিয়েছেন")||e.includes("member")}function Ue(){const t=['[aria-label*="Join group" i]','[aria-label*="Join Group" i]','[aria-label*="গ্রুপে যোগ দিন" i]','[aria-label*="যোগ দিন" i]','[aria-label*="গ্রুপে যুক্ত হন" i]','[aria-label*="Request to join" i]','[aria-label*="Request to Join" i]','[aria-label*="গ্রুপে যোগ দেওয়ার অনুরোধ" i]','[aria-label*="যোগ দেওয়ার অনুরোধ" i]','[aria-label*="গ্রুপে যোগদানের অনুরোধ" i]','div[role="button"][aria-label*="Join" i]','div[role="button"][aria-label*="যোগ" i]','button[aria-label*="Join" i]','button[aria-label*="যোগ" i]'];for(const n of t){const o=document.querySelector(n);if(o&&O(o)){const r=(o.innerText||o.textContent||"").trim().toLowerCase(),s=(o.getAttribute("aria-label")||"").toLowerCase();if(!no(r,s))return o}}const e=Array.from(document.querySelectorAll('div[role="main"] [role="button"], div[role="main"] button, div[role="region"] [role="button"], [role="banner"] [role="button"], div[role="button"], button'));for(const n of e){if(!O(n))continue;const o=(n.innerText||n.textContent||"").trim().toLowerCase(),r=(n.getAttribute("aria-label")||"").toLowerCase();if(!no(o,r)&&(o==="join group"||o==="join"||o==="গ্রুপে যোগ দিন"||o==="যোগ দিন"||o==="গ্রুপে যুক্ত হন"||o==="request to join"||o==="request to join group"||o==="যোগ দেওয়ার অনুরোধ"||o==="যোগ দেওয়ার অনুরোধ জানান"||o.includes("join group")||o.includes("গ্রুপে যোগ দিন")))return n}return null}function Tt(){const t=!!Ue(),e=!!xe();return t&&!e}async function ro(){const t=Ue();if(!t)return{success:!1,isInstantMember:!1,reason:"Join button not found"};console.log("[AGP:AutoJoin] Found Join button. Executing automatic join click..."),U="⚡ Auto-joining group (গ্রুপে যোগ দেওয়া হচ্ছে)...",M(),N("⚡ Auto-joining group...",!0),t.scrollIntoView({behavior:"instant",block:"center"}),await G(10);const e={bubbles:!0,cancelable:!0,view:window};t.dispatchEvent(new PointerEvent("pointerdown",e)),t.dispatchEvent(new MouseEvent("mousedown",e)),t.dispatchEvent(new PointerEvent("pointerup",e)),t.dispatchEvent(new MouseEvent("mouseup",e)),t.click();const n=Date.now();let o=null;for(;Date.now()-n<350&&(o=document.querySelector('div[role="dialog"]'),!(o&&O(o)));){const l=xe();if(l&&O(l))break;await G(15)}if(o&&O(o)){console.log("[AGP:AutoJoin] Rules agreement or membership question dialog detected. Handling...");const l=Array.from(o.querySelectorAll('input[type="checkbox"], div[role="checkbox"]'));for(const d of l)d.getAttribute("aria-checked")==="true"||d.checked||d.click();const c=Array.from(o.querySelectorAll('textarea, input[type="text"]'));for(const d of c)(!d.value||!d.value.trim())&&(d.value="Agree",d.dispatchEvent(new Event("input",{bubbles:!0})),d.dispatchEvent(new Event("change",{bubbles:!0})));const u=Array.from(o.querySelectorAll('button, [role="button"], input[type="submit"]')).find(d=>{const f=(d.innerText||d.textContent||d.getAttribute("aria-label")||"").trim().toLowerCase();return f==="submit"||f==="send"||f==="agree"||f==="confirm"||f==="সাবমিট"||f==="জমা দিন"||f==="সম্মতি দিচ্ছি"||f.includes("submit")||f.includes("সাবমিট")});if(u&&O(u)){console.log("[AGP:AutoJoin] Clicking modal submit button..."),u.click();const d=Date.now();for(;Date.now()-d<600&&document.querySelector('div[role="dialog"]');)await G(20)}}const r=Date.now();for(;Date.now()-r<3500;){let l=xe();if(l&&O(l))return console.log("[AGP:AutoJoin] Instant membership granted! Composer available."),N("✅ Joined group! Post box ready.",!0),{success:!0,isInstantMember:!0,reason:"Instant member"};Date.now()-r>1e3&&window.scrollY<200&&window.scrollBy({top:300,behavior:"instant"}),await G(25)}const s=(document.body?document.body.innerText:"").toLowerCase();return s.includes("requested")||s.includes("pending")||s.includes("অনুরোধ করা হয়েছে")||s.includes("cancel request")||s.includes("অনুরোধ বাতিল")?(console.log("[AGP:AutoJoin] Join request sent (Pending admin approval)."),{success:!0,isInstantMember:!1,reason:"Join request pending admin approval"}):xe()?{success:!0,isInstantMember:!0,reason:"Instant member"}:Ue()?{success:!0,isInstantMember:!1,reason:"Join submitted"}:(console.log("[AGP:AutoJoin] Join button disappeared. Group is joined, proceeding to post..."),{success:!0,isInstantMember:!0,reason:"Instant member"})}function io(){if(Ke())return{forbidden:!0,reason:"Group unavailable or broken link"};const t=(document.body?document.body.innerText:"").toLowerCase();return t.includes("only admins can post")||t.includes("শুধুমাত্র অ্যাডমিনরা এই গ্রুপে পোস্ট করতে পারবেন")||t.includes("শুধুমাত্র অ্যাডমিনরা পোস্ট করতে পারবেন")||t.includes("posting is paused for this group")||t.includes("posting is turned off")||t.includes("এই গ্রুপের জন্য পোস্ট করা সাময়িকভাবে বন্ধ আছে")||t.includes("posting in this group has been paused")?{forbidden:!0,reason:"Posting is paused or admin-only in this group"}:t.includes("you can't post to this group")||t.includes("you've been temporarily blocked")||t.includes("you have been muted")||t.includes("আপনার অ্যাকাউন্ট সাময়িকভাবে ব্লক করা হয়েছে")||t.includes("আপনাকে এই গ্রুপে পোস্ট করা থেকে সাময়িকভাবে নিষিদ্ধ করা হয়েছে")?{forbidden:!0,reason:"Account restricted or muted in this group"}:{forbidden:!1,reason:""}}let so=!1;async function K(t){if(!(so||!(w!=null&&w.queueItem))){so=!0,X=!1,R&&(clearInterval(R),R=null);try{window.onbeforeunload=null}catch{}console.warn(`[AGP:AutoPost] Auto-skipping group: ${t}`),U=`⚡ Auto-skipping: ${t}...`,M(),N(`⚡ Auto-skipping: ${t}...`,!0),await G(200),chrome.runtime.sendMessage({type:"SKIP_CURRENT_ITEM",payload:{itemId:w.queueItem.id,reason:t}})}}async function Xo(t,e=15e3){const n=Date.now();let o=0;for(;Date.now()-n<e;){const r=[t,...Array.from(document.querySelectorAll('[role="dialog"]'))];for(const s of r){const a=Array.from(s.querySelectorAll('[role="button"], button'));for(const i of a){const l=(i.getAttribute("aria-label")||"").toLowerCase().trim(),c=(i.textContent||"").toLowerCase().trim(),u=i.getAttribute("aria-disabled")==="true"||i.disabled||i.classList.contains("aria-disabled")||i.classList.contains("disabled");if((l==="post"||l==="publish"||l==="submit"||l==="submit for review"||l==="পোস্ট"||l==="সাবমিট"||l==="পোস্ট করুন"||l==="সাবমিট করুন"||l.includes("post to group")||l.includes("গ্রুপে পোস্ট")||l.includes("submit for review")||l.includes("রিভিউ")||c==="post"||c==="পোস্ট"||c==="publish"||c==="submit"||c==="submit for review"||c==="পোস্ট করুন"||c==="সাবমিট"||c==="সাবমিট করুন"||c==="post to group"||c==="পাবলিশ"||c.includes("submit for review")||c.includes("রিভিউয়ের জন্য সাবমিট"))&&!u)return i.scrollIntoView({behavior:"instant",block:"center"}),i.style.outline="3px solid #10b981",i.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0})),i.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0,cancelable:!0})),i.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,cancelable:!0})),i.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0,cancelable:!0})),i.click(),!0}}if(Date.now()-o>2500){o=Date.now();const s=Math.round((Date.now()-n)/1e3);s>=4&&(U=`⚡ Step 4/4: Media processing & uploading (${s}s)...`,M())}await G(20)}return!1}async function pt(){if(X||!w||!w.queueItem)return;if(Ke()){await K("Group unavailable on Facebook");return}if(!w.isGroupMatch){await K("Wrong group URL detected");return}if(Tt()||Ue()){X=!0,U="⚡ Step 0/4: Auto-joining group (গ্রুপে যোগ দেওয়া হচ্ছে)...",M(),N("⚡ Auto-joining group...",!0);const e=await ro();if(e.isInstantMember)console.log("[AGP:AutoPost] Successfully auto-joined group! Proceeding with post immediately..."),U="⚡ Joined! Step 1/4: Opening Post Box...",M(),N("✅ Joined! Now opening post box...",!0);else{U=`⚡ ${e.reason}. Advancing to next group...`,M(),N(`⚡ ${e.reason}`,!0),await G(100),await K(e.reason);return}}const t=io();if(t.forbidden){await K(t.reason);return}X=!0,U="⚡ Step 1/4: Opening Post Box...",M();try{const e=await Yo();if(!e){if(Ke()){await K("Group unavailable on Facebook");return}await K("Could not open Facebook post box");return}U="⚡ Step 2/4: Typing caption...",M();const n=w.caption||w.formattedPost||"";n&&n.trim()&&(await to(e,n)||(console.warn("[AGP:AutoPost] Caption injection check returned false, but clipboard has caption. Proceeding to photos..."),N("⚠️ Caption in clipboard (Ctrl+V ready)")));const o=w.media||[],r=o.some(g=>g.includes("video")||g.includes(".mp4")||g.includes(".mov")||g.includes(".webm")||g.includes("data:video")),s=o.filter(g=>!g.includes("video")&&!g.includes(".mp4")&&!g.includes(".mov")&&!g.includes(".webm")&&!g.includes("data:video")).length,a=o.length-s;if(o.length>0){let g=`${o.length} files`;if(s>0&&a>0?g=`${s} photos + ${a} video`:a>0?g=`${a} video`:g=`${s} photos`,U=`⚡ Step 3/4: Attaching ${g}...`,M(),!await Qo(e,o)){const A=De(e);if(A){console.warn("[AGP:AutoPost] Upload rejected by Facebook:",A),U=`❌ Upload failed: ${A}`,M(),await K(`Media rejected by Facebook: ${A}`);return}console.warn("[AGP:AutoPost] Media attachment warning - continuing post workflow")}}if(U=r?"⚡ Step 4/4: Video uploading & submitting post... (ভিডিও আপলোড হচ্ছে)":"⚡ Step 4/4: Submitting post...",M(),!await Xo(e,r?9e4:2e4)){const g=De(e);g?await K(`Facebook upload error: ${g}`):await K("Post button disabled or timed out");return}U="⚡ Post submitted! Shifting to next group...",M();const c=Date.now();let u=!1;const d=r?25e3:3500;for(;Date.now()-c<d;){const g=Ae();if(!g){console.log("[AGP:AutoPost] Composer dialog closed cleanly. Post submitted successfully!"),u=!0;break}const m=De(g);if(m){console.warn("[AGP:AutoPost] Post aborted due to Facebook file error:",m),U=`❌ Upload error: ${m}`,M(),await K(`Facebook upload error: ${m}`);return}const A=Array.from(document.querySelectorAll('[role="dialog"]'));for(const y of A){const E=(y.textContent||"").toLowerCase();if(E.includes("pending")||E.includes("approval")||E.includes("admin")||E.includes("অনুমোদনের অপেক্ষায়")||E.includes("অনুমোদন")||E.includes("সাবমিট করা হয়েছে")||E.includes("আপনার পোস্টটি জমা দেওয়া হয়েছে")){const L=Array.from(y.querySelectorAll('[role="button"], button')).find(B=>{const I=(B.textContent||"").toLowerCase().trim();return I==="done"||I==="ok"||I==="ঠিক আছে"||I==="close"||I==="বন্ধ করুন"||I==="got it"});if(L){L.click(),u=!0;break}}}if(u)break;await G(10)}if(!u){const g=Ae();if(g){const m=De(g);if(m){console.warn("[AGP:AutoPost] Facebook upload error remained:",m),U=`❌ Upload failed: ${m}`,M(),await K(`Facebook upload error: ${m}`);return}if(!!g.querySelector('[aria-disabled="true"], button[disabled]')){console.warn("[AGP:AutoPost] Post button remained disabled after wait"),U="❌ Post button stayed disabled",M(),await K("Post button disabled or upload blocked by Facebook");return}}}try{window.onbeforeunload=null}catch{}U="⚡ Post submitted! Moving to next group...",M();const f=w.queueIndex,p=w.totalQueueItems,b=(w.postedCount||f-1)+1;N(`⚡ Auto-Posted to Group #${f}! (${b}/${p} done)`),chrome.runtime.sendMessage({type:"MARK_AS_POSTED",payload:{itemId:w.queueItem.id}})}catch(e){const n=e instanceof Error?e.message:String(e);console.log("[AGP:AutoPost] Routine caught error, auto-skipping:",n),await K(n||"Posting failed")}}function Zo(){if(ye||X||!(w!=null&&w.queueItem))return;if(Ke()){U="⚡ Group unavailable on Facebook. Auto-skipping...",M(),setTimeout(()=>{K("Group unavailable on Facebook")},10);return}if(!w.isGroupMatch){U="⚡ Wrong group detected. Auto-skipping to next group...",M(),N("⚠️ Wrong group detected. Auto-skipping...",!0),setTimeout(()=>{ye||K("Wrong group URL detected")},20);return}if(Tt()||Ue()){U="⚡ Not joined: Auto-joining group...",M(),N("⚡ Auto-joining group...",!0),R&&clearInterval(R),R=null,setTimeout(()=>{!ye&&!X&&pt()},0);return}const t=io();if(t.forbidden){U=`⚡ Cannot post: ${t.reason}. Auto-skipping...`,M(),setTimeout(()=>{K(t.reason)},20);return}U="⚡ Instant Auto-Posting in progress...",M(),R&&clearInterval(R),R=null,setTimeout(()=>{!ye&&!X&&pt()},0)}function M(){var b,g,m,A,y,E,L,B,I,oe,J,ue,q,Z,le,Te,$e,se,ee,ve,we;if(ut||!_)return;const t=Pe(),e=je();if(!t.isGroupPage){const $=!!(Oe!=null&&Oe.isRunning),H=!!(Oe!=null&&Oe.isPaused),me=0,x=0,C=0;_.innerHTML=`
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

      ${_e?`
        <div class="launcher-pill" id="agp-launcher-btn" title="Click to open AI Group Poster Assistant">
          <div class="badge-logo">AI</div>
          <span class="launcher-title">AI Group Poster</span>
          ${$?`
            <span class="status-pill running">
              <span class="pulse-dot"></span>
              Auto-Posting (${me}/${x})
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
                  <span>Posting: <strong>${me} of ${x}</strong> Groups</span>
                  <span>${C}%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: ${C}%"></div>
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
    `,(b=_.getElementById("agp-launcher-btn"))==null||b.addEventListener("click",P=>{var k;(k=P.target)!=null&&k.closest("#agp-launcher-close")||(_e=!1,M())}),(g=_.getElementById("agp-toggle-btn"))==null||g.addEventListener("click",()=>{_e=!0,M()}),(m=_.getElementById("agp-close-btn"))==null||m.addEventListener("click",P=>{P.stopPropagation(),_t()}),(A=_.getElementById("agp-launcher-close"))==null||A.addEventListener("click",P=>{P.stopPropagation(),_t()}),(y=_.getElementById("btn-focus-tab"))==null||y.addEventListener("click",()=>{}),(E=_.getElementById("btn-pause-queue"))==null||E.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"PAUSE_QUEUE"},()=>{N("Auto-posting paused"),Qe()})}),(L=_.getElementById("btn-resume-queue"))==null||L.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"RESUME_QUEUE"},()=>{N("Resuming auto-posting..."),Qe()})}),(B=_.getElementById("btn-start-queue"))==null||B.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"START_QUEUE"},()=>{N("Starting auto-posting queue..."),Qe()})}),(I=_.getElementById("btn-sync-groups"))==null||I.addEventListener("click",()=>{window.location.href="https://www.facebook.com/groups/joins/?nav_source=tab"}),(oe=_.getElementById("btn-open-dashboard"))==null||oe.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})});return}const n=w==null?void 0:w.group,o=w==null?void 0:w.post,r=(w==null?void 0:w.queueIndex)||1,s=(w==null?void 0:w.totalQueueItems)||1,a=(w==null?void 0:w.postedCount)??Math.max(0,r-1),i=s>0?Math.round(a/s*100):0,l=(w==null?void 0:w.formattedPost)||(o==null?void 0:o.description)||"",c=(w==null?void 0:w.caption)||(o==null?void 0:o.caption)||(o==null?void 0:o.description)||"",u=w!=null&&w.media?w.media.length:o!=null&&o.images?o.images.length:0,d=w?w.isGroupMatch:!0,f=(w==null?void 0:w.expectedGroupName)||(n==null?void 0:n.name)||"Expected Group",p=t.groupName||"Current Page";_.innerHTML=`
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
        display: ${_e?"none":"block"};
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
            ${_e?"▲ Expand":"▼ Minimize"}
          </button>
          <button class="icon-btn close-btn" id="agp-close-btn" title="Stop & Close (ডাইরেক্ট অফ)">✕</button>
        </div>
      </div>

      <div class="panel-body">
        ${d?"":`
          <div class="warning-box">
            <strong>⚠️ Wrong Group Detected!</strong><br/>
            Expected: <strong>${f}</strong><br/>
            Current page: <em>${p}</em><br/>
            <span style="font-size: 11px; color: #fca5a5;">Auto-skipping to next group...</span>
          </div>
        `}

        <div class="progress-container">
          <div class="progress-label">
            <span>Posted: <strong>${a} of ${s}</strong> Groups</span>
            <span>${i}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${i}%"></div>
          </div>
        </div>

        <div class="autopost-box">
          <div class="autopost-header">
            <span class="pulse-dot"></span>
            <span>${X?"Auto-Posting in Progress":ye?"Auto-Pilot Paused":"Auto-Pilot Running"}</span>
          </div>
          <div class="autopost-status-text">${U}</div>
        </div>

        <div class="meta-row">
          <span class="group-name" title="${f}">${f}</span>
          <span class="queue-badge">Queue ${r} / ${s}</span>
        </div>

        <div class="post-card">
          <div class="post-title">${(o==null?void 0:o.productName)||(o==null?void 0:o.title)||"Prepared Listing"}</div>
          ${u>0?((o==null?void 0:o.images)||(w==null?void 0:w.media)||[]).some($=>$.includes("video")||$.includes("data:video")||$.endsWith(".mp4")||$.endsWith(".webm")||$.endsWith(".mov"))?`<div class="media-badge" style="background:#065f46;color:#6ee7b7;border:1px solid #059669;">🎬 Video Attached (${u})</div>`:`<div class="media-badge">📷 ${u} Photos attached</div>`:""}
          <div class="post-preview">${c||l||"No prepared caption."}</div>
        </div>

        <button class="auto-btn ${X?"running":""}" id="btn-auto-post">
          ${X?"⏸️ Pause Auto-Posting":"🤖 Auto-Post Now"}
        </button>

        ${Tt()||Ue()?`<button class="action-btn" id="btn-auto-join" style="background:#2563eb;color:#ffffff;font-weight:700;margin-top:6px;width:100%;justify-content:center;box-shadow:0 2px 4px rgba(37,99,235,0.3);">
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
  `,(J=_.getElementById("agp-toggle-btn"))==null||J.addEventListener("click",()=>{_e=!_e,M()}),(ue=_.getElementById("agp-close-btn"))==null||ue.addEventListener("click",$=>{$.stopPropagation(),_t()}),(q=_.getElementById("btn-auto-post"))==null||q.addEventListener("click",()=>{X?(ye=!0,X=!1,U="Auto-posting paused by user",R&&clearInterval(R),N("Auto-posting paused"),M()):(ye=!1,R&&clearInterval(R),pt())}),(Z=_.getElementById("btn-auto-join"))==null||Z.addEventListener("click",async()=>{const $=_==null?void 0:_.getElementById("btn-auto-join");$&&($.textContent="⏳ Joining..."),(await ro()).isInstantMember&&pt()}),(le=_.getElementById("btn-toggle-caption"))==null||le.addEventListener("click",()=>{dt=!dt,M()}),(Te=_.getElementById("btn-copy-caption"))==null||Te.addEventListener("click",async()=>{const H=xt(c||l).replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),me=St(H);await Zt(H,me)&&N("📋 Caption & Design copied (Ctrl+V ready)!")}),($e=_.getElementById("btn-paste-caption"))==null||$e.addEventListener("click",async()=>{const H=xt(c||l).replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),me=document.querySelector('[role="dialog"]')||document.body;N("✨ Pasting caption with exact styling..."),await to(me,H)?N("✅ Caption pasted with exact design!"):N("⚠️ Click inside post box and press Ctrl+V",!0)}),(se=_.getElementById("btn-mark-posted"))==null||se.addEventListener("click",()=>{var $;R&&clearInterval(R);try{window.onbeforeunload=null}catch{}chrome.runtime.sendMessage({type:"MARK_AS_POSTED",payload:{itemId:($=w==null?void 0:w.queueItem)==null?void 0:$.id}},()=>{N("Marked as Posted! Moving to next group...")})}),(ee=_.getElementById("btn-skip"))==null||ee.addEventListener("click",()=>{var $;R&&clearInterval(R);try{window.onbeforeunload=null}catch{}chrome.runtime.sendMessage({type:"SKIP_CURRENT_ITEM",payload:{itemId:($=w==null?void 0:w.queueItem)==null?void 0:$.id,reason:"Skipped by user"}},()=>{N("Skipped group. Moving to next...")})}),(ve=_.getElementById("btn-pause"))==null||ve.addEventListener("click",()=>{R&&clearInterval(R),ye=!0,X=!1,chrome.runtime.sendMessage({type:"PAUSE_QUEUE"},()=>{N("Posting Session Paused")})}),(we=_.getElementById("btn-open-dashboard"))==null||we.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})})}function en(){ut||(Se||(Se=document.createElement("div"),Se.id="ai-group-poster-dock-root",document.body.appendChild(Se),_=Se.attachShadow({mode:"open"})),M())}function Qe(){var n;if(ut)return;const t=Pe(),e=je();e.isLoggedIn&&chrome.runtime.sendMessage({type:"FB_USER_PROFILE_DETECTED",payload:e}),t.isGroupPage?(chrome.runtime.sendMessage({type:"FB_PAGE_DETECTED",payload:{url:t.canonicalUrl,groupIdOrSlug:t.groupIdOrSlug,pageTitle:t.groupName}}),chrome.runtime.sendMessage({type:"GET_ACTIVE_POST_FOR_TAB",payload:{url:t.canonicalUrl}},o=>{chrome.runtime.lastError||o!=null&&o.isUserTab||o&&o.payload&&(w=o.payload,en(),w&&w.queueItem&&Zo())})):Oo()&&(console.log("[AGP:Content] Facebook Group Search Page detected."),It(),typeof chrome<"u"&&((n=chrome.storage)!=null&&n.local)&&chrome.storage.local.get(["agp_pending_auto_join","agp_auto_join_config"],o=>{const r=o==null?void 0:o.agp_pending_auto_join,s=o==null?void 0:o.agp_auto_join_config;if(r&&r.active&&Date.now()-(r.requestedAt||0)<9e4){console.log("[AGP:Content] Detected pending Auto-Join request. Starting auto-joiner..."),chrome.storage.local.remove("agp_pending_auto_join");const a=r.config||s||{searchUrl:window.location.href,delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0};It(a),setTimeout(()=>{Y.getInstance().start(a)},1500)}}))}let Xe=!1;function ao(t=0,e){if(typeof document>"u"||!document.body)return;Xe=!1;const n=document.getElementById("agp-sync-window-overlay");n&&n.remove();const o=document.createElement("div");o.id="agp-sync-window-overlay",o.innerHTML=`
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
  `,document.body.appendChild(o);const r=document.getElementById("agp-sync-finish-btn");r&&(r.onclick=()=>{Xe=!0,r.innerHTML="<span>Saving...</span>",r.style.opacity="0.7",r.style.pointerEvents="none"});const s=document.getElementById("agp-sync-cancel-btn");s&&(s.onclick=()=>{Xe=!0,Ze()})}function ft(t,e){const n=document.getElementById("agp-sync-counter-badge");n&&(n.innerText=e?`${t} / ${e} Found`:`${t} Found`);const o=document.getElementById("agp-sync-btn-count");o&&(o.innerText=String(t));const r=document.getElementById("agp-sync-status-text");r&&t>0&&(r.innerText=`Found ${t} groups. Scrolling for more...`)}function Ze(){const t=document.getElementById("agp-sync-window-overlay");t&&t.remove()}let gt=null;chrome.runtime.onMessage.addListener((t,e,n)=>{if(t.type==="START_GROUP_DISCOVERY")return(async()=>{try{console.log("[AGP:Content] Starting deep group discovery scan on current Facebook page...");const o=je(),r=o.userId||o.name||void 0;ao(),lo();const s=await Bt({maxRounds:350,stagnantLimit:35,scrollDelayMs:300,accountContext:r,shouldStop:()=>Xe,onBatchDiscovered:async(c,u,d)=>{gt=d;const f=bt(),p=[...c];for(const b of f)p.find(g=>g.groupId.toLowerCase()===b.groupId.toLowerCase())||p.push(b);ft(p.length);try{chrome.runtime.sendMessage({type:"GROUP_BATCH_DISCOVERED",payload:{liveGroups:p,verifiedCount:p.length,duplicatesRemoved:(d==null?void 0:d.duplicatesRemoved)||0,debugMetrics:d}})}catch{}try{await nt(p,{syncMode:"merge",accountContext:r})}catch(b){console.warn("[AGP:Content] Progressive batch merge error:",b)}},onProgress:(c,u,d,f)=>{gt=f;const p=be.size,b=Math.max(c,p);ft(b,d);try{chrome.runtime.sendMessage({type:"GROUP_DISCOVERY_PROGRESS",payload:{foundCount:b,status:u,targetCount:d,debugMetrics:f}})}catch{}}}),a=bt();if(a.length>0)try{await nt(a,{syncMode:"merge",accountContext:r})}catch{}const i=[...s.groups];for(const c of a)i.find(u=>u.groupId.toLowerCase()===c.groupId.toLowerCase())||i.push(c);const l=Math.max(s.totalFound,i.length);gt=s.debugMetrics,Ze(),n({success:!0,payload:{groups:i,sourceUrl:window.location.href,isLoggedIn:s.isLoggedIn,totalFoundOnPage:l,profile:o,outcome:s.outcome,completionReason:s.completionReason,isPartial:s.isPartial,debugMetrics:s.debugMetrics}})}catch(o){Ze();const r=o instanceof Error?o.message:String(o);n({success:!1,error:r})}})(),!0;if(t.type==="CANCEL_GROUP_DISCOVERY")return Ze(),N("AI Group Poster: Discovery cancelled.",!0),n({success:!0}),!1;if(t.type==="GET_DEBUG_METRICS")return n({success:!0,debugMetrics:gt}),!1;if(t.type==="CHECK_FACEBOOK_SESSION"){const o=tt(),r=je();return n({success:!0,isLoggedIn:o,profile:r,currentUrl:window.location.href}),!1}if(t.type==="GET_FACEBOOK_USER_INFO")return(async()=>{try{const o=tt(),r=je();let a=ht(r.userId||r.name||void 0).items;n({success:!0,isLoggedIn:o,profile:r,groups:a,totalGroups:a.length,currentUrl:window.location.href})}catch(o){const r=o instanceof Error?o.message:String(o);n({success:!1,error:r})}})(),!0;if(t.type==="START_AUTO_JOIN"||t.type==="AUTO_JOIN_START_ON_PAGE")return(async()=>{try{const o=t.payload||{},r={...o,delaySec:typeof o.delaySec=="number"?o.delaySec:0};It(r);const s=await Y.getInstance().start(r);n({success:!0,state:s})}catch(o){const r=o instanceof Error?o.message:String(o);n({success:!1,error:r})}})(),!0;if(t.type==="PAUSE_AUTO_JOIN"||t.type==="AUTO_JOIN_PAUSE_ON_PAGE")return Y.getInstance().pause(),n({success:!0}),!1;if(t.type==="RESUME_AUTO_JOIN"||t.type==="AUTO_JOIN_RESUME_ON_PAGE")return Y.getInstance().resume(),n({success:!0}),!1;if(t.type==="STOP_AUTO_JOIN"||t.type==="AUTO_JOIN_STOP_ON_PAGE")return Y.getInstance().stop(),n({success:!0}),!1;if(t.type==="GET_AUTO_JOIN_STATE"){const o=Y.getInstance().getState();return n({success:!0,state:o}),!1}});let $t=!1,be=new Map;function lo(){if(typeof window>"u"||window.__agpFetchIntercepted)return;window.__agpFetchIntercepted=!0;const t=window.fetch;window.fetch=async function(...e){var o;const n=await t.apply(this,e);try{const r=typeof e[0]=="string"?e[0]:((o=e[0])==null?void 0:o.url)||"";(r.includes("/api/graphql")||r.includes("graphql"))&&n.clone().text().then(a=>{a.includes("Group")&&(a.includes("/groups/")||a.includes('__typename":"Group"'))&&tn(a)}).catch(()=>{})}catch{}return n},console.log("[AGP:Content] GraphQL response interceptor installed")}function tn(t){try{const e=/"__typename"\s*:\s*"Group"[^}]*?"id"\s*:\s*"(\d+)"[^}]*?"name"\s*:\s*"([^"]+)"/g;let n;for(;(n=e.exec(t))!==null;){const r=n[1],s=n[2].trim();r&&s&&s.length>=2&&be.set(r,{name:s,id:r})}const o=/"node"\s*:\s*\{\s*"__typename"\s*:\s*"Group"\s*,\s*"id"\s*:\s*"(\d+)"\s*,\s*"name"\s*:\s*"([^"]+)"/g;for(;(n=o.exec(t))!==null;){const r=n[1],s=n[2].trim();r&&s&&s.length>=2&&be.set(r,{name:s,id:r})}be.size>0&&console.log(`[AGP:Content] GraphQL interceptor: total ${be.size} groups captured`)}catch{}}function bt(){const t=[];for(const[e,n]of be)t.push({name:n.name,url:`https://www.facebook.com/groups/${e}/`,groupId:e,privacy:"UNKNOWN",imageUrl:n.imageUrl});return t}async function co(){const t=window.location.href.toLowerCase();if((t.includes("/groups/joins")||t.includes("category=membership"))&&!$t){$t=!0,console.log("[AGP:Content] Detected Your Groups page (/groups/joins/)! Starting full auto-scan of all joined groups..."),N("AI Group Poster: Auto-scanning your joined groups..."),lo(),ao(0);try{const e=await Bt({maxRounds:350,stagnantLimit:35,scrollDelayMs:300,shouldStop:()=>Xe,onBatchDiscovered:async(r,s)=>{const a=bt(),i=[...r];for(const l of a)i.find(c=>c.groupId===l.groupId)||i.push(l);ft(i.length);try{await nt(i,{syncMode:"merge"})}catch(l){console.warn("[AGP:Content] Batch save err:",l)}},onProgress:(r,s,a)=>{const i=be.size,l=Math.max(r,i);ft(l,a),N(`AI Group Poster: Found ${l}${a?` / ${a}`:""} groups...`);try{chrome.runtime.sendMessage({type:"GROUP_DISCOVERY_PROGRESS",payload:{foundCount:l,status:s,targetCount:a}})}catch{}}}),n=bt();if(n.length>0)try{await nt(n,{syncMode:"merge"}),console.log(`[AGP:Content] Final merge: added ${n.length} intercepted groups`)}catch{}const o=Math.max(e.totalFound,be.size);N(`AI Group Poster: Sync complete! Found ${o} groups.`)}catch(e){console.warn("[AGP:Content] Auto-scan err:",e)}finally{$t=!1,setTimeout(Ze,1500)}}}window.addEventListener("message",t=>{if(!(t.source!==window||!t.data)){if(t.data.type==="AGP_MAIN_GRAPHQL_GROUPS"&&Array.isArray(t.data.groups)){for(const e of t.data.groups)e.id&&e.name&&be.set(e.id,{name:e.name,id:e.id});console.log(`[AGP:Content] Intercepted ${be.size} groups from MAIN world GraphQL`)}t.data.type==="AGP_MAIN_URL_CHANGED"&&et()}}),chrome.runtime.onMessage.addListener(t=>{t&&t.type==="AGP_NAVIGATE_TO_GROUP"&&et()}),po(),Qe(),setTimeout(co,100);let uo=window.location.href;function et(){window.location.href!==uo&&(uo=window.location.href,po(),Qe(),setTimeout(co,100))}function po(){const t=window.location.hostname.toLowerCase();if(t.startsWith("m.")||t.includes("mbasic.")){if(document.getElementById("agp-mobile-banner"))return;const e=document.createElement("div");e.id="agp-mobile-banner",e.style.cssText=`
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
    `,document.body.appendChild(e);const n=document.getElementById("agp-switch-desktop-btn");n&&(n.onclick=()=>{window.location.href=window.location.href.replace("://m.","://www.").replace("://mbasic.","://www.")});const o=document.getElementById("agp-close-banner-btn");o&&(o.onclick=()=>e.remove())}}window.addEventListener("popstate",et,{passive:!0}),window.addEventListener("hashchange",et,{passive:!0}),setInterval(et,1e3),setInterval(()=>{if(X||w&&w.queueItem)try{chrome.runtime.sendMessage({type:"KEEPALIVE_PING"},()=>{chrome.runtime.lastError})}catch{}},1e4)})();
