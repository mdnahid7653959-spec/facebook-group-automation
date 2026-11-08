var Qo=Object.defineProperty;var Xo=(Se,pe,Ae)=>pe in Se?Qo(Se,pe,{enumerable:!0,configurable:!0,writable:!0,value:Ae}):Se[pe]=Ae;var Ee=(Se,pe,Ae)=>Xo(Se,typeof pe!="symbol"?pe+"":pe,Ae);(function(){"use strict";function Se(t){const e=[];if(!t||typeof t!="string")return{valid:!1,errors:["URL is required"]};const n=t.trim();if(!n)return{valid:!1,errors:["URL cannot be empty"]};let o=n;/^https?:\/\//i.test(o)||(o="https://"+o);let r;try{r=new URL(o)}catch{return{valid:!1,errors:["Invalid URL format"]}}const s=["facebook.com","www.facebook.com","web.facebook.com","m.facebook.com"],a=r.hostname.toLowerCase();s.some(p=>a===p||a.endsWith("."+p))||e.push("URL must be a Facebook domain (e.g. facebook.com, web.facebook.com)");const c=r.pathname.split("/").filter(Boolean),l=c.indexOf("groups");if(l===-1||l>=c.length-1)return e.push("URL must point directly to a Facebook group (e.g. /groups/group_name)"),{valid:!1,errors:e};const d=decodeURIComponent(c[l+1]);if(!d||["feed","discover","joins","about","settings","notifications","search","categories","create","help","privacy","support"].includes(d.toLowerCase()))return e.push("URL must point to a specific group, not a feed or discovery page"),{valid:!1,errors:e};const b=c.slice(l+2).map(p=>p.toLowerCase()),f=["permalink","posts","user","photos","videos","events","files","stories"];if(b.some(p=>f.includes(p)))return e.push("URL points to an individual post or permalink inside a group, not the group itself"),{valid:!1,errors:e};if(r.searchParams.has("comment_id")||r.searchParams.has("notif_id")||r.searchParams.has("notif_t"))return e.push("URL is a notification or comment permalink, not a group page"),{valid:!1,errors:e};const g=`https://www.facebook.com/groups/${d}/`;return{valid:e.length===0,errors:e,cleanUrl:g,groupId:d}}const pe={META_OG_TITLE:'meta[property="og:title"]',HEADER_H1:'h1[dir="auto"], h1 span'};function Ae(){if(typeof window>"u")return{isGroupPage:!1,groupIdOrSlug:"",groupName:"",canonicalUrl:"",isReady:!1};const t=window.location.href,e=Se(t);if(!e.valid||!e.groupId)return{isGroupPage:!1,groupIdOrSlug:"",groupName:"",canonicalUrl:t,isReady:!1};let n="";const o=document.querySelector(pe.META_OG_TITLE);if(o&&o.content&&(n=o.content.replace(/\s*\|\s*Facebook.*$/i,"").trim()),!n){const s=document.querySelector(pe.HEADER_H1);s&&s.innerText&&(n=s.innerText.trim())}!n&&document.title&&(n=document.title.replace(/\s*\|\s*Facebook.*$/i,"").trim()),n||(n=e.groupId.replace(/[-_.]+/g," "),n=n.charAt(0).toUpperCase()+n.slice(1));const r=document.readyState==="interactive"||document.readyState==="complete";return{isGroupPage:!0,groupIdOrSlug:e.groupId,groupName:n,canonicalUrl:e.cleanUrl||t,isReady:r}}const mt=new Set(["feed","discover","create","notifications","search","categories","joins","member-requests","expert_badge","settings","about","events","media","files","chats","manage","canvas","support","buy_sell_discussion","permalink","user","profile.php","hashtag","messages","marketplace","stories","reels","watch","gaming","members","photos","videos","posts"]),Ue=new Set(["view group","visit","open","view","join","group","groups","view all","see all","see more","গ্রুপ দেখুন","দেখুন","সব দেখুন","যোগ দিন","গ্রুপে যান","আরও দেখুন"]);function co(t){const e={"০":"0","১":"1","২":"2","৩":"3","৪":"4","৫":"5","৬":"6","৭":"7","৮":"8","৯":"9"};return t.replace(/[০-৯]/g,n=>e[n]||n)}function uo(t){if(typeof document>"u")return{count:null,status:"UNAVAILABLE",rawText:""};const n=Array.from(document.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, div, p')),o=[/(?:All groups you['’]?ve joined|Groups you['’]?ve joined)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/(?:আপনার যোগ দেওয়া সমস্ত গ্রুপ|আপনার যোগ দেওয়া সব গ্রুপ|আপনি যেসব গ্রুপে যোগ দিয়েছেন|যোগ দেওয়া সমস্ত গ্রুপ|যোগ দেওয়া সব গ্রুপ|যোগ দেওয়া গ্রুপ|সব গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/^All groups you['’]?ve joined\s*[:\-•]?\s*([0-9,kKmM\u09E6-\u09EF.]+)$/i],r=[/(?:Joined Groups|Your Groups|আমার গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i,/(?:Groups|গ্রুপ)\s*\(([0-9,kKmM\u09E6-\u09EF.]+)\)/i],s=a=>{const i=co(a).replace(/,/g,"").trim().toLowerCase();if(i.endsWith("k")){const l=parseFloat(i.replace("k",""));return isNaN(l)?null:Math.round(l*1e3)}if(i.endsWith("m")){const l=parseFloat(i.replace("m",""));return isNaN(l)?null:Math.round(l*1e6)}const c=parseInt(i,10);return isNaN(c)?null:c};for(const a of n){const i=(a.textContent||"").trim();if(!(i.length>120||i.length<3))for(const c of o){const l=i.match(c);if(l&&l[1]){const d=s(l[1]);if(d!==null&&d>0)return{count:d,status:"CONFIRMED",rawText:i}}}}for(const a of n){const i=(a.textContent||"").trim();if(!(i.length>80||i.length<3))for(const c of r){const l=i.match(c);if(l&&l[1]){const d=s(l[1]);if(d!==null&&d>0)return{count:d,status:"UNCERTAIN",rawText:i}}}}return{count:null,status:"UNAVAILABLE",rawText:""}}function po(t=document){const e=["end of results","no more groups to show","you’ve reached the end","you've reached the end","সব গ্রুপ দেখানো হয়েছে","ফলাফলের সমাপ্তি"],n=t.querySelectorAll('div[role="status"], span[dir="auto"], div, p');for(const o of n){const r=(o.textContent||"").trim().toLowerCase();if(!(r.length>100||r.length<5)){for(const s of e)if(r.includes(s))return!0}}return!1}function Re(t){if(!t)return"";let e=t.trim();return e=e.replace(/^(?:Visit group|Visit|Open group|Open|View group|View|গ্রুপ দেখুন|দেখুন|গ্রুপে যান)\s*/i,""),e=e.replace(/\s*(?:Last active|You last visited|last visited|active)\s+[^\n]+/i,""),e=e.replace(/\s*(?:গত|আগে|মিনিট আগে|ঘণ্টা আগে|দিন আগে)[^\n]*/i,""),e=e.replace(/\s*·\s*(?:Public group|Private group|পাবলিক গ্রুপ|প্রাইভেট গ্রুপ).*$/i,""),e=e.replace(/\s*·\s*\d+.*members.*$/i,""),e=e.replace(/\s*·\s*[০-৯\d]+.*সদস্য.*$/i,""),e=e.replace(/\s*·\s*[^\n]+/i,""),e.trim()}function fo(t){var u,b;const e=f=>({valid:!1,reason:f,name:"",url:"",groupId:"",privacy:"UNKNOWN"}),n=t.href||t.getAttribute("href")||"";if(!n||!n.includes("/groups/"))return e("Not a group link");if(n.includes("/permalink/")||n.includes("/posts/")||n.includes("/photos/")||n.includes("/videos/")||n.includes("comment_id=")||n.includes("notif_id="))return e("Post or photo permalink, not a group home");let o="";try{const g=new URL(n,"https://www.facebook.com").pathname.split("/").filter(Boolean),p=g.indexOf("groups");if(p!==-1&&g[p+1]){const m=g[p+1];try{o=decodeURIComponent(m)}catch{o=m}if(g.length>p+2){const S=g[p+2].toLowerCase();if(["posts","permalink","photos","videos","user","media"].includes(S))return e("Post or photo permalink, not a group home")}}}catch{return e("Malformed URL")}if(!o||mt.has(o.toLowerCase()))return e("Non-group system path");if(t.closest('[aria-label*="Notification" i], [aria-label*="বিজ্ঞপ্তি" i], [data-pagelet*="Notification" i]'))return e("Inside notification flyout");let r=t.closest('div[role="listitem"], div[role="article"], div[role="gridcell"], li, div[role="row"]');if(!r){let f=t.parentElement;for(let g=0;g<7&&f&&f!==document.body;g++){const p=(f.textContent||"").toLowerCase(),m=f.querySelectorAll?f.querySelectorAll('a[href*="/groups/"]').length:0;if(m>=1&&m<=5&&(p.includes("view group")||p.includes("visited")||p.includes("last active")||p.includes("গ্রুপ দেখুন"))){r=f;break}f=f.parentElement}r||(r=((u=t.parentElement)==null?void 0:u.parentElement)||t.parentElement)}if(r){const f=(r.textContent||"").toLowerCase();if(f.includes("sponsored")||f.includes("বিজ্ঞাপন")||r.querySelector('[aria-label*="Sponsored" i], [aria-label*="বিজ্ঞাপন" i]'))return e("Sponsored advertisement");if((r.querySelectorAll?Array.from(r.querySelectorAll('a[href*="/groups/"]')):[]).length<=4){if(f.includes("requested to join")||f.includes("অনুরোধ পাঠানো হয়েছে")||f.includes("answer questions")||f.includes("update responses")||f.includes("suggested for you")||f.includes("আপনার জন্য প্রস্তাবিত")||f.includes("suggested groups")||f.includes("প্রস্তাবিত গ্রুপ"))return e("Unjoined or suggested group");if(r.querySelectorAll){const m=Array.from(r.querySelectorAll('button, [role="button"]'));for(const S of m){const y=(S.textContent||S.getAttribute("aria-label")||"").trim().toLowerCase();if((y==="join"||y==="join group"||y==="যোগ দিন"||y==="গ্রুপে যোগ দিন"||y==="request to join")&&!f.includes("view group")&&!f.includes("গ্রুপ দেখুন")&&!f.includes("visited")&&!f.includes("last active"))return e("Card has Join button, not joined")}}}}let s="";const a=(t.getAttribute("aria-label")||"").trim();if(a&&a.length>=2&&!Ue.has(a.toLowerCase())&&(s=Re(a)),!s){const f=(t.textContent||t.innerText||"").trim(),g=Re(f);g&&g.length>=2&&!Ue.has(g.toLowerCase())&&(s=g)}if(!s){const f=Array.from(t.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, span'));for(const g of f){const p=Re((g.textContent||"").trim()),m=p.toLowerCase();if(p.length>=2&&!Ue.has(m)&&!m.includes("last active")&&!m.includes("you last visited")&&!m.includes("members")&&!m.includes("সদস্য")&&!m.includes("ago")){s=p;break}}}if(!s&&r){const f=r.querySelector('h1, h2, h3, h4, [role="heading"]');if(f&&f.textContent){const g=Re(f.textContent.trim());g.length>=2&&!Ue.has(g.toLowerCase())&&(s=g)}}if(!s&&r){const f=Array.from(r.querySelectorAll('h1, h2, h3, h4, span[dir="auto"], strong, a[href*="/groups/"] > span, a[href*="/groups/"], div[dir="auto"]'));for(const g of f){if(g===t)continue;const p=Re((g.textContent||"").trim()),m=p.toLowerCase();if(p.length>=2&&p.length<200&&!Ue.has(m)&&!m.includes("view group")&&!m.includes("you last visited")&&!m.includes("last active")&&!m.includes("members")&&!m.includes("সদস্য")&&!m.includes("hours ago")&&!m.includes("minutes ago")&&!m.includes("days ago")&&!m.includes("weeks ago")&&!m.includes("ঘণ্টা আগে")&&!m.includes("দিন আগে")&&!m.includes("সপ্তাহ আগে")&&!/^\d+\s*(hours?|minutes?|days?|weeks?)\s*ago$/i.test(m)){s=p;break}}}s||(s=o.split(/[-_.]+/).filter(Boolean).map(f=>f.charAt(0).toUpperCase()+f.slice(1)).join(" "));let i="";const c=r!=null&&r.querySelector?r.querySelector("img, image")||t.querySelector("img, image"):null;c&&(i=c.getAttribute("src")||c.getAttribute("href")||((b=c.href)==null?void 0:b.baseVal)||"",(i.includes("/rsrc.php/")||i.includes("spacer")||i.includes("1x1"))&&(i=""));let l="UNKNOWN";const d=f=>{const g=(f||"").toLowerCase();return g.includes("public group")||g.includes("পাবলিক গ্রুপ")||g.includes("public")||g.includes("পাবলিক")?"PUBLIC":g.includes("private group")||g.includes("প্রাইভেট গ্রুপ")||g.includes("private")||g.includes("প্রাইভেট")?"PRIVATE":"UNKNOWN"};if(r){const f=d(r.textContent||"");if(f!=="UNKNOWN")l=f;else if(r.querySelectorAll){const g=Array.from(r.querySelectorAll("span, div, p"));for(const p of g){const m=d(p.textContent||"");if(m!=="UNKNOWN"){l=m;break}}}}return l==="UNKNOWN"&&(l=d(t.textContent||"")),{valid:!0,name:s,url:`https://www.facebook.com/groups/${o}/`,groupId:o,imageUrl:i,privacy:l}}function et(){if(typeof document>"u")return!1;const t=typeof window<"u"?window.location.href:"";if(t.includes("/login")||t.includes("/recover")||t.includes("/checkpoint"))return!1;const e=document.body&&(document.body.innerText||document.body.textContent)||"";return e.includes("What's on your mind")||e.includes("আপনার মনে কী আছে")||e.includes("কী ভাবছেন")||e.includes("Professional dashboard")||e.includes("Ads Manager")||e.includes("Meta Business Suite")?!0:!!document.querySelector('[role="navigation"], [data-pagelet="LeftRail"], [aria-label="Facebook"], input[placeholder*="Search" i], [aria-label*="profile" i], [aria-label*="Account" i], a[href*="/me/"], a[href*="/groups/"]')||!!(document.cookie&&document.cookie.includes("c_user"))}function qe(){var i,c;if(typeof document>"u")return{isLoggedIn:!1,name:"",profileUrl:""};let t="",e="",n="",o="";if(document.body){const d=(document.body.innerText||document.body.textContent||"").match(/(?:What['’]s on your mind|আপনার মনে কী আছে|কী ভাবছেন)[,?\s]+([^?!\n]+?)(?:\?|$)/i);if(d&&d[1]){const u=d[1].trim().replace(/[?,!]+$/,"").trim();u.length>=2&&u.length<=50&&!u.toLowerCase().includes("facebook")&&(t=u)}}const r=Array.from(document.querySelectorAll('a[href*="/me/"], a[href*="facebook.com/profile"], [role="navigation"] a[href]'));for(const l of r){const d=l.getAttribute("href")||l.href||"",u=l.querySelector('span[dir="auto"], span, strong, h1'),b=(u?u.textContent:l.innerText||l.textContent||"").trim();if(b&&b.length>=2&&b.length<=35&&!["Home","Friends","Feeds","Groups","Watch","Marketplace","Memories","Saved","Video","Settings","Meta AI","Professional dashboard","Ads Manager","Ad Center","Meta Business Suite","See more","See all","Facebook","Menu","Notifications"].includes(b)){t||(t=b),!e&&d&&(e=d);const g=l.querySelector("image, img");if(g&&!n&&(n=g.getAttribute("src")||((i=g.href)==null?void 0:i.baseVal)||""),t)break}}const s=document.querySelector('[aria-label="Your profile" i], [aria-label*="Your profile" i], [aria-label*="Account Controls" i], [aria-label*="আপনার প্রোফাইল" i]');if(s&&!n){const l=s.querySelector("image, img");l&&(n=l.getAttribute("src")||((c=l.href)==null?void 0:c.baseVal)||"")}try{const l=Array.from(document.querySelectorAll("script"));for(const d of l){const u=d.textContent||"";if(u.includes('"NAME":')||u.includes('"USER_ID":')||u.includes('"short_name":')){const b=u.match(/"NAME":\s*"([^"]+)"/)||u.match(/"short_name":\s*"([^"]+)"/);if(b&&b[1]&&!t)try{t=JSON.parse(`"${b[1]}"`)}catch{t=b[1]}const f=u.match(/"USER_ID":\s*"(\d+)"/);if(f&&f[1]&&!o&&(o=f[1]),t)break}}}catch{}if(!o&&document.cookie){const l=document.cookie.match(/c_user=(\d+)/);l&&(o=l[1])}const a=et()||!!(t||o);return{isLoggedIn:a,name:t||(a?"Facebook User":""),profileUrl:e||"https://www.facebook.com",avatarUrl:n,userId:o}}function go(t){if(typeof document>"u")return[];const e=new Map,n=Date.now();try{const o=Array.from(document.querySelectorAll("script"));for(const r of o){const s=r.textContent||"";if(s.length<40)continue;const a=[/"__typename"\s*:\s*"Group"[\s\S]{0,500}?"id"\s*:\s*"(\d+)"[\s\S]{0,500}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,/"__typename"\s*:\s*"Group"[\s\S]{0,500}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,500}?"id"\s*:\s*"(\d+)"/g,/"node"\s*:\s*\{[\s\S]{0,120}?"__typename"\s*:\s*"Group"[\s\S]{0,350}?"id"\s*:\s*"(\d+)"[\s\S]{0,350}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/g,/"node"\s*:\s*\{[\s\S]{0,120}?"__typename"\s*:\s*"Group"[\s\S]{0,350}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,350}?"id"\s*:\s*"(\d+)"/g,/\{"id"\s*:\s*"(\d+)"[\s\S]{0,300}?"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,300}?(?:"__typename"\s*:\s*"Group"|url"\s*:\s*"https:[^"]*?\/groups\/[^"]+?")/g,/\{"name"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"[\s\S]{0,300}?"id"\s*:\s*"(\d+)"[\s\S]{0,300}?(?:"__typename"\s*:\s*"Group"|url"\s*:\s*"https:[^"]*?\/groups\/[^"]+?")/g];for(const i of a){let c;for(;(c=i.exec(s))!==null;){let l="",d="";if(/^\d+$/.test(c[1])?(l=c[1],d=c[2]):/^\d+$/.test(c[2])&&(l=c[2],d=c[1]),l&&d){d=d.trim();try{d=d.replace(/\\u[\dA-Fa-f]{4}/g,b=>String.fromCharCode(parseInt(b.replace("\\u",""),16)))}catch{}const u=s.slice(Math.max(0,c.index-350),Math.min(s.length,c.index+600));if(u.includes('"__typename":"User"')||u.includes('"__typename":"Actor"')||u.includes('"__typename":"Story"')||u.includes('"__typename":"Comment"')||u.includes('"__typename":"Page"')||t&&d.toLowerCase()===t.toLowerCase())continue;if(d.length>=2&&!e.has(l)){let b="";const g=s.slice(Math.max(0,c.index-500),Math.min(s.length,c.index+1e3)).match(/"(?:uri|url|cover_photo|image)"\s*:\s*\{[^}]*"uri"\s*:\s*"([^"]+)"/);if(g&&g[1]){let p=g[1];try{p=p.replace(/\\u[\dA-Fa-f]{4}/g,m=>String.fromCharCode(parseInt(m.replace("\\u",""),16)))}catch{}!p.includes("/rsrc.php/")&&!p.includes("1x1")&&(b=p.replace(/\\\//g,"/"))}e.set(l,{name:Nt(d,l),url:`https://www.facebook.com/groups/${l}/`,groupId:l,privacy:"UNKNOWN",imageUrl:b,verified:!0,source:"facebook-ui",accountContext:t,discoveredAt:n})}}}}}}catch(o){console.warn("[AGP:Discovery] Script tags extraction warning:",o)}return Array.from(e.values())}function ht(t){if(typeof document>"u")return{items:[],rejectedCount:0};const e=new Map;let n=0;const o=Date.now(),r=go(t);for(const a of r)e.set(a.groupId.toLowerCase(),a);const s=Array.from(document.querySelectorAll('a[href*="/groups/"]'));for(const a of s){const i=fo(a);if(!i.valid||!i.name||!i.url||!i.groupId){n++;continue}const c=i.groupId.toLowerCase(),l=e.get(c);l?(!l.imageUrl&&i.imageUrl&&(l.imageUrl=i.imageUrl),i.name&&l.name.length<i.name.length&&(l.name=i.name),i.privacy!=="UNKNOWN"&&(l.privacy=i.privacy)):e.set(c,{name:i.name,url:i.url,groupId:i.groupId,privacy:i.privacy,imageUrl:i.imageUrl,verified:!0,source:"facebook-ui",accountContext:t,discoveredAt:o})}return{items:Array.from(e.values()),rejectedCount:n}}function Gt(){if(typeof document>"u")return 0;let t=0;const e=Array.from(document.querySelectorAll('div[role="button"], button, span[dir="auto"], [role="navigation"] [role="button"], [data-pagelet="LeftRail"] [role="button"]'));for(const n of e){const o=(n.textContent||n.getAttribute("aria-label")||"").trim().toLowerCase();if(o==="see more"||o==="আরও দেখুন"||o==="see all"||o==="সব দেখুন"||o==="see all groups"||o==="সব গ্রুপ দেখুন"||o==="view more")try{(n.closest('[role="button"], button')||n).click(),t++}catch{}}return t}async function Mt(t={}){var y,E,T,N,I,oe;const e=t.maxRounds||350,n=t.stagnantLimit||35,o=t.scrollDelayMs!==void 0?t.scrollDelayMs:250,r=t.accountContext,s=Date.now(),a=et(),i=new Map;let c=0,l=0,d=0,u=0;const b=uo(),f=b.count,g=b.status;console.log(`[AGP:Engine] Discovery started. Target count: ${f??"N/A"} (Status: ${g})`);const p=z=>({candidateCount:i.size+l,verifiedCount:i.size,duplicatesRemoved:c,rejectedCount:l,scrollIterations:u,mutationEvents:d,targetCount:f,targetCountStatus:g,completionReason:z,scanDurationMs:Date.now()-s,lastNewGroupTimestamp:i.size>0?Date.now():null}),m=z=>{let de=0;for(const R of z){const X=R.groupId.toLowerCase();i.has(X)?c++:(i.set(X,R),de++)}return de};let S=null;typeof MutationObserver<"u"&&typeof document<"u"&&(S=new MutationObserver(z=>{d+=z.length}),S.observe(document.body||document.documentElement,{childList:!0,subtree:!0}));try{try{Gt()}catch{}const z=ht(r);if(l+=z.rejectedCount,m(z.items)>0&&t.onBatchDiscovered)try{await t.onBatchDiscovered(Array.from(i.values()),i.size,p(null))}catch{}if(t.onProgress){const se=f?`Found ${i.size} of ${f} groups...`:`Found ${i.size} groups...`;t.onProgress(i.size,se,f,p(null))}if(g==="CONFIRMED"&&f!==null&&i.size>=f){const se=p("TARGET_REACHED");return console.log(`[AGP:Engine] Target count of ${f} confirmed on initial scan.`),{isLoggedIn:a,groups:Array.from(i.values()),totalFound:i.size,targetCount:f,isPartial:!1,outcome:"COMPLETE",completionReason:"TARGET_REACHED",debugMetrics:se}}let R=0,X="PARTIAL",ae="STAGNANT_TIMEOUT";for(let se=0;se<e;se++){if(u++,t.shouldStop&&t.shouldStop()){console.log("[AGP:Engine] Progressive scan stopped by user request."),X=i.size>0?"COMPLETE":"PARTIAL",ae="USER_CANCELLED";break}if(se%3===0)try{Gt()}catch{}const Z=Array.from(document.querySelectorAll('a[href*="/groups/"]'));if(Z.length>0){const x=Z[Z.length-1];try{x.scrollIntoView({block:"end",inline:"nearest",behavior:"auto"})}catch{}}const ye=document.querySelector('[role="main"], [data-pagelet*="Group"]');if(ye&&ye.lastElementChild)try{ye.lastElementChild.scrollIntoView({block:"end",behavior:"auto"})}catch{}const xe=Math.max(((y=document.documentElement)==null?void 0:y.scrollHeight)||0,((E=document.scrollingElement)==null?void 0:E.scrollHeight)||0,((T=document.body)==null?void 0:T.scrollHeight)||0);window.scrollTo(0,xe),document.scrollingElement&&(document.scrollingElement.scrollTop=xe),document.documentElement&&(document.documentElement.scrollTop=xe);const $=Array.from(document.querySelectorAll("div, main, section"));for(const x of $)if(x.scrollHeight>x.clientHeight+80){const k=window.getComputedStyle(x);(k.overflowY==="auto"||k.overflowY==="scroll")&&(x.scrollTop=x.scrollHeight,x.dispatchEvent(new Event("scroll",{bubbles:!0})))}window.dispatchEvent(new Event("scroll",{bubbles:!0}));try{window.dispatchEvent(new WheelEvent("wheel",{deltaY:2500,bubbles:!0})),(N=document.body)==null||N.dispatchEvent(new KeyboardEvent("keydown",{key:"PageDown",code:"PageDown",bubbles:!0}))}catch{}await new Promise(x=>setTimeout(x,o));const H=ht(r);if(l+=H.rejectedCount,m(H.items)>0){if(R=0,t.onBatchDiscovered)try{await t.onBatchDiscovered(Array.from(i.values()),i.size,p(null))}catch{}if(t.onProgress){const x=f?`Scanning Facebook Groups... ${i.size} of ${f} discovered`:`Scanning Facebook Groups... ${i.size} groups discovered`;t.onProgress(i.size,x,f,p(null))}if(g==="CONFIRMED"&&f!==null&&i.size>=f){console.log(`[AGP:Engine] Target count reached: ${i.size} >= ${f}.`),X="COMPLETE",ae="TARGET_REACHED";break}}else{if(R++,po()){console.log("[AGP:Engine] Explicit end-of-list indicator detected."),X="COMPLETE",ae="LIST_END";break}if(window.scrollBy(0,-600),Z.length>5&&((I=Z[Math.max(0,Z.length-6)])==null||I.scrollIntoView({block:"center",behavior:"instant"})),await new Promise(x=>setTimeout(x,300)),window.scrollBy(0,1200),Z.length>0&&((oe=Z[Z.length-1])==null||oe.scrollIntoView({block:"end",behavior:"smooth"})),g==="CONFIRMED"&&f!==null&&i.size<f&&R<45){window.scrollBy(0,-1e3),await new Promise(x=>setTimeout(x,350)),window.scrollBy(0,2500);continue}if(R>=n){console.log(`[AGP:Engine] Scan complete/stagnant after ${R} attempts. Total verified: ${i.size}`),X="PARTIAL",ae="STAGNANT_TIMEOUT";break}}}try{window.scrollTo({top:0,behavior:"smooth"})}catch{}const Ie=X!=="COMPLETE",_e=p(ae);return{isLoggedIn:a,groups:Array.from(i.values()),totalFound:i.size,targetCount:f,isPartial:Ie,outcome:X,completionReason:ae,debugMetrics:_e}}finally{S&&S.disconnect()}}function Nt(t,e){if(!t||!t.trim())return e?e.split(/[-_.]+/).filter(Boolean).map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" "):"Facebook Group";let n=t.trim();return n=n.replace(/^(?:Visit|Open|View|গ্রুপ দেখুন|দেখুন)\s+/i,""),n=n.replace(/\s*(?:Last active|You last visited|last visited|active)\s+[^\n]+/i,""),n=n.replace(/\s*(?:গত|আগে|মিনিট আগে|ঘণ্টা আগে|দিন আগে)[^\n]*/i,""),n=n.replace(/\s*·\s*(?:Public group|Private group|পাবলিক গ্রুপ|প্রাইভেট গ্রুপ).*$/i,""),n=n.replace(/\s*·\s*\d+.*members.*$/i,""),n=n.replace(/\s*·\s*[০-৯\d]+.*সদস্য.*$/i,""),n=n.replace(/\s*·\s*[^\n]+/i,""),(n.toLowerCase()==="visit"||n.toLowerCase()==="group"||n.toLowerCase()==="view group")&&e?e.split(/[-_.]+/).filter(Boolean).map(o=>o.charAt(0).toUpperCase()+o.slice(1)).join(" "):n.trim()||"Facebook Group"}function tt(t="id"){const e=Math.random().toString(36).substring(2,9),n=Date.now().toString(36);return`${t}_${n}_${e}`}function yt(t){if(!t)return"";if(!t.includes("{")||!t.includes("|"))return t;let e=t,n=0;const o=/\{([^{}]+)\}/g;for(;n<10&&o.test(e);)n++,e=e.replace(o,(r,s)=>{if(s.includes("|")){const a=s.split("|").map(i=>i.trim()).filter(Boolean);if(a.length>0)return a[Math.floor(Math.random()*a.length)]}return r});return e=e.replace(/\{([^{}\r\n]+?)(?=[.,!?\r\n]|$)/g,(r,s)=>s.includes("|")?s.split("|").map(i=>i.trim()).filter(Boolean)[0]||"":r),e}const Bt={status:"IDLE",searchUrl:"",query:"",totalFound:0,joinedCount:0,requestedCount:0,alreadyJoinedCount:0,failedCount:0,skippedCount:0,currentIndex:0,currentGroupName:"",countdownSec:0,message:"Enter any Facebook search link to start auto-joining.",groups:[]},ie={GROUPS:"agp_groups",ACCOUNT_GROUPS:"agp_facebook_groups_by_account",POSTS:"agp_posts",LOGS:"agp_logs",FACEBOOK_ACCOUNT:"agp_facebook_account"},Ot=()=>{var t;return typeof chrome<"u"&&!!((t=chrome.storage)!=null&&t.local)},je={};async function ke(t,e){if(Ot())return new Promise(n=>{chrome.storage.local.get([t],o=>{if(chrome.runtime.lastError){console.warn(`Storage get error for ${t}:`,chrome.runtime.lastError),n(je[t]!==void 0?je[t]:e);return}o&&o[t]!==void 0?n(o[t]):n(e)})});try{if(typeof window<"u"&&window.localStorage){const n=window.localStorage.getItem(t);if(n!==null)return JSON.parse(n)}}catch(n){console.warn("LocalStorage access failed:",n)}return je[t]!==void 0?je[t]:e}async function Le(t,e){if(je[t]=e,Ot())return new Promise((n,o)=>{chrome.storage.local.set({[t]:e},()=>{chrome.runtime.lastError?o(chrome.runtime.lastError):n()})});try{typeof window<"u"&&window.localStorage&&window.localStorage.setItem(t,JSON.stringify(e))}catch(n){console.warn("LocalStorage set failed:",n)}}function Dt(t){return t&&t.trim().toLowerCase().replace(/[^a-z0-9_\u0980-\u09FF]/gi,"_")||"default_account"}async function ot(){return ke(ie.ACCOUNT_GROUPS,{})}let Ut=!1;async function Rt(){const t=await ot(),e=new Map,n=a=>{if(!a||!a.id||Fe(a))return;const i=(a.groupId||a.url||a.id).toLowerCase();if(!e.has(i))e.set(i,{...a});else{const c=e.get(i);a.name&&(!c.name||a.name.length>c.name.length)&&(c.name=a.name),a.imageUrl&&!c.imageUrl&&(c.imageUrl=a.imageUrl),a.privacy&&a.privacy!=="UNKNOWN"&&(c.privacy=a.privacy)}};for(const a of Object.keys(t)){const i=t[a];i&&Array.isArray(i.groups)&&i.groups.forEach(n)}(await ke(ie.GROUPS,[])).forEach(n);const r=Array.from(e.values());return r.filter(a=>a.selected).length>50&&(r.forEach(a=>{a.selected=!1}),Ut||(Ut=!0,bo().catch(()=>{}))),r}async function bo(){var o;const t=await ot();let e=!1;for(const r of Object.keys(t))(o=t[r])!=null&&o.groups&&Array.isArray(t[r].groups)&&(t[r].groups=t[r].groups.map(s=>({...s,selected:!1})),e=!0);e&&await Le(ie.ACCOUNT_GROUPS,t);const n=await ke(ie.GROUPS,[]);if(n.some(r=>r.selected)){const r=n.map(s=>({...s,selected:!1}));await Le(ie.GROUPS,r)}}async function xt(t){if(t==="all")return Rt();const e=await wt(),n=Dt(t||(e==null?void 0:e.userId)||(e==null?void 0:e.name)),o=await ot();if(o[n]&&Array.isArray(o[n].groups)&&o[n].groups.length>0){const c=o[n].groups.filter(l=>!Fe(l));if(c.length>0)return c.filter(l=>l.selected).length>50&&c.forEach(l=>{l.selected=!1}),c}const s=(await ke(ie.GROUPS,[])).filter(i=>!Fe(i));if(s.length>0)return s.filter(i=>i.selected).length>50&&s.forEach(i=>{i.selected=!1}),s;const a=await Rt();return a.length>0?a:[]}async function vt(t,e){const n=(t||[]).filter(i=>!Fe(i)),o=await wt(),r=Dt(e||(o==null?void 0:o.userId)||(o==null?void 0:o.name)),s=await ot(),a=s[r]||{accountContext:r,accountInfo:o||{isLoggedIn:!0,name:"Facebook User",lastSyncedAt:Date.now()},groups:[],lastSyncedAt:Date.now()};s[r]={...a,groups:n,lastSyncedAt:Date.now()},await Le(ie.ACCOUNT_GROUPS,s),await Le(ie.GROUPS,n)}function Fe(t){if(!t)return!0;const e=(t.name||"").trim().toLowerCase(),n=(t.url||"").trim().toLowerCase();if(e.startsWith("unread")||e.includes("commented on")||e.includes("also commented")||e.includes("likes your")||e.includes("liked your")||e.includes("reacted to")||e.includes("shared a post")||e.includes("shared your post")||e.includes("invited you")||e.includes("mentioned you")||e.includes("requested to join")||e.includes("মন্তব্য করেছেন")||e.includes("মতামত দিয়েছেন")||e.includes("লাইক দিয়েছেন")||e.includes("শেয়ার করেছেন")||n.includes("/permalink/")||n.includes("/posts/")||n.includes("/user/")||n.includes("/profile.php")||n.includes("/friends/")||n.includes("/people/")||n.includes("/photos/")||n.includes("/videos/")||n.includes("/events/")||n.includes("/files/")||n.includes("comment_id=")||n.includes("notif_id=")||n.includes("notif_t=")||n.includes("reply_comment_id="))return!0;const o=new Set(["about","about group","feed","discover","create","notifications","search","categories","joins","settings","help","privacy","terms","policies","support","messages","marketplace"]),r=e.replace(/\s*group\s*$/i,"").trim();return!!(o.has(e)||o.has(r)||t.groupId&&o.has(t.groupId.toLowerCase()))}async function mo(){return ke(ie.POSTS,[])}async function ho(t){await Le(ie.POSTS,t)}async function yo(){return ke(ie.LOGS,[])}async function xo(t){await Le(ie.LOGS,t)}async function vo(t){const e=await yo();e.unshift(t),e.length>300&&(e.length=300),await xo(e)}async function wt(){return ke(ie.FACEBOOK_ACCOUNT,null)}class wo{async writeLog(e,n,o,r){const s={id:tt("log"),timestamp:Date.now(),level:e,source:n,message:o,details:r},a=`[AGP:${n.toUpperCase()}][${e}]`;e==="ERROR"?console.error(a,o,r||""):e==="WARNING"?console.warn(a,o,r||""):console.log(a,o,r||"");try{await vo(s)}catch(i){console.warn("Failed to persist log entry:",i)}return s}info(e,n,o){return this.writeLog("INFO",e,n,o)}success(e,n,o){return this.writeLog("SUCCESS",e,n,o)}warning(e,n,o){return this.writeLog("WARNING",e,n,o)}error(e,n,o){return this.writeLog("ERROR",e,n,o)}}const Eo=new wo;async function nt(t,e){var S;const n=(e==null?void 0:e.accountContext)||((S=await wt())==null?void 0:S.name)||"default_account",o=await xt(n),r=new Map,s=new Map,a=new Map,i=y=>y.trim().toLowerCase().replace(/\s+/g," ");o.forEach(y=>{y.groupId&&r.set(y.groupId.toLowerCase(),y),y.url&&s.set(y.url.toLowerCase().replace(/\/$/,""),y),y.name&&a.set(i(y.name),y)});let c=0,l=0;const d=Date.now(),u=[],b=new Set;for(const y of t){if(Fe(y))continue;const E=(y.groupId||"").toLowerCase(),T=(y.url||"").toLowerCase().replace(/\/$/,""),N=i(y.name||"");let I=(E?r.get(E):void 0)||(T?s.get(T):void 0)||(N&&N.length>=3?a.get(N):void 0);const oe=Nt(y.name||"",y.groupId);if(I)l++,b.add(I.id),oe&&(!I.name||I.name.includes("·")||I.name.length<oe.length)&&(I.name=oe),y.imageUrl&&!I.imageUrl&&(I.imageUrl=y.imageUrl),y.privacy&&y.privacy!=="UNKNOWN"&&(I.privacy=y.privacy),I.verified=!0,I.source="facebook-ui",I.accountContext=n,I.discoveredAt=d,I.updatedAt=d;else{c++;const z=y.groupId?`grp_${y.groupId.replace(/[^a-zA-Z0-9_-]/g,"")}`:tt("grp"),de=y.url.startsWith("http")?y.url:`https://www.facebook.com/groups/${y.groupId}/`,R={id:z,name:oe,url:de,groupId:y.groupId,privacy:y.privacy||"UNKNOWN",imageUrl:y.imageUrl,category:"Discovered",enabled:!0,selected:!1,status:"READY",postCount:0,verified:!0,source:"facebook-ui",accountContext:n,discoveredAt:d,createdAt:d,updatedAt:d};u.push(R),E&&r.set(E,R),T&&s.set(T,R),N&&a.set(N,R),b.add(R.id)}}let f;if((e==null?void 0:e.syncMode)==="exact"){const y=T=>T.source==="manual"||T.category&&T.category!=="Discovered",E=o.filter(T=>b.has(T.id)||y(T));f=[...u,...E]}else f=[...u,...o];const g=[],p=new Set,m=new Set;for(const y of f){const E=y.url.toLowerCase().replace(/\/$/,"");!p.has(y.id)&&!m.has(E)&&(p.add(y.id),m.add(E),g.push(y))}return await vt(g,n),await Eo.info("dashboard",`Group discovery merged (${(e==null?void 0:e.syncMode)||"merge"}): ${c} imported, ${l} duplicates, total ${g.length}`),{imported:c,duplicates:l,totalStored:g.length,verifiedCount:g.filter(y=>y.verified).length}}const So={a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",f:"ғ",g:"ɢ",h:"ʜ",i:"ɪ",j:"ᴊ",k:"ᴋ",l:"ʟ",m:"ᴍ",n:"ɴ",o:"ᴏ",p:"ᴘ",q:"ǫ",r:"ʀ",s:"s",t:"ᴛ",u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",y:"ʏ",z:"ᴢ"},qt={"ᴀ":"a",ʙ:"b","ᴄ":"c","ᴅ":"d","ᴇ":"e",ғ:"f",ɢ:"g",ʜ:"h",ɪ:"i","ᴊ":"j","ᴋ":"k",ʟ:"l","ᴍ":"m",ɴ:"n","ᴏ":"o","ᴘ":"p",ǫ:"q",ʀ:"r","ᴛ":"t","ᴜ":"u","ᴠ":"v","ᴡ":"w",ʏ:"y","ᴢ":"z"};function Ao(t,e){const n=t.charCodeAt(0);if(e==="normal")return jt(t);if(e==="small-caps"){const o=t.toLowerCase();return So[o]||t}if(n>=65&&n<=90){const o=n-65;switch(e){case"sans-italic":return String.fromCodePoint(120328+o);case"sans-bold":return String.fromCodePoint(120276+o);case"sans-bold-italic":return String.fromCodePoint(120380+o);case"serif-bold":return String.fromCodePoint(119808+o);case"serif-italic":return String.fromCodePoint(119860+o);case"monospace":return String.fromCodePoint(120432+o);case"script":{const r={66:8492,69:8496,70:8497,72:8459,73:8464,76:8466,77:8499,82:8475};return String.fromCodePoint(r[n]||119964+o)}case"bold-script":return String.fromCodePoint(120016+o);case"fraktur":{const r={67:8493,72:8460,73:8465,82:8476,90:8488};return String.fromCodePoint(r[n]||120068+o)}case"bold-fraktur":return String.fromCodePoint(120172+o);case"double-struck":{const r={67:8450,72:8461,78:8469,80:8473,81:8474,82:8477,90:8484};return String.fromCodePoint(r[n]||120120+o)}case"bubble":return String.fromCodePoint(9398+o);case"bubble-black":return String.fromCodePoint(127312+o);case"square":return String.fromCodePoint(127280+o);case"square-black":return String.fromCodePoint(127344+o)}}if(n>=97&&n<=122){const o=n-97;switch(e){case"sans-italic":return String.fromCodePoint(120354+o);case"sans-bold":return String.fromCodePoint(120302+o);case"sans-bold-italic":return String.fromCodePoint(120406+o);case"serif-bold":return String.fromCodePoint(119834+o);case"serif-italic":return t==="h"?"ℎ":String.fromCodePoint(119886+o);case"monospace":return String.fromCodePoint(120458+o);case"script":{const r={101:8495,103:8458,111:8500};return String.fromCodePoint(r[n]||119990+o)}case"bold-script":return String.fromCodePoint(120042+o);case"fraktur":return String.fromCodePoint(120094+o);case"bold-fraktur":return String.fromCodePoint(120198+o);case"double-struck":return String.fromCodePoint(120146+o);case"bubble":return String.fromCodePoint(9424+o);case"bubble-black":return String.fromCodePoint(127312+o);case"square":return String.fromCodePoint(127280+o);case"square-black":return String.fromCodePoint(127344+o)}}if(n>=48&&n<=57){const o=n-48;switch(e){case"sans-bold":case"sans-bold-italic":return String.fromCodePoint(120812+o);case"serif-bold":return String.fromCodePoint(120782+o);case"monospace":return String.fromCodePoint(120822+o);case"double-struck":return String.fromCodePoint(120792+o);case"bubble":return o===0?"⓪":String.fromCodePoint(9312+(o-1));case"bubble-black":return o===0?"⓿":String.fromCodePoint(10122+(o-1));default:return t}}return t}function jt(t){if(qt[t])return qt[t];const e=t.codePointAt(0);return e?e===8462?"h":e===8492?"B":e===8496?"E":e===8497?"F":e===8459?"H":e===8464?"I":e===8466?"L":e===8499?"M":e===8475?"R":e===8495?"e":e===8458?"g":e===8500?"o":e===8493?"C":e===8460?"H":e===8465?"I":e===8476?"R":e===8488?"Z":e===8450?"C":e===8461?"H":e===8469?"N":e===8473?"P":e===8474?"Q":e===8477?"R":e===8484?"Z":e>=119808&&e<=119833?String.fromCharCode(65+(e-119808)):e>=119834&&e<=119859?String.fromCharCode(97+(e-119834)):e>=119860&&e<=119885?String.fromCharCode(65+(e-119860)):e>=119886&&e<=119911?String.fromCharCode(97+(e-119886)):e>=119912&&e<=119937?String.fromCharCode(65+(e-119912)):e>=119938&&e<=119963?String.fromCharCode(97+(e-119938)):e>=119964&&e<=119989?String.fromCharCode(65+(e-119964)):e>=119990&&e<=120015?String.fromCharCode(97+(e-119990)):e>=120016&&e<=120041?String.fromCharCode(65+(e-120016)):e>=120042&&e<=120067?String.fromCharCode(97+(e-120042)):e>=120068&&e<=120093?String.fromCharCode(65+(e-120068)):e>=120094&&e<=120119?String.fromCharCode(97+(e-120094)):e>=120172&&e<=120197?String.fromCharCode(65+(e-120172)):e>=120198&&e<=120223?String.fromCharCode(97+(e-120198)):e>=120120&&e<=120145?String.fromCharCode(65+(e-120120)):e>=120146&&e<=120171?String.fromCharCode(97+(e-120146)):e>=120276&&e<=120301?String.fromCharCode(65+(e-120276)):e>=120302&&e<=120327?String.fromCharCode(97+(e-120302)):e>=120328&&e<=120353?String.fromCharCode(65+(e-120328)):e>=120354&&e<=120379?String.fromCharCode(97+(e-120354)):e>=120380&&e<=120405?String.fromCharCode(65+(e-120380)):e>=120406&&e<=120431?String.fromCharCode(97+(e-120406)):e>=120432&&e<=120457?String.fromCharCode(65+(e-120432)):e>=120458&&e<=120483?String.fromCharCode(97+(e-120458)):e>=9398&&e<=9423?String.fromCharCode(65+(e-9398)):e>=9424&&e<=9449?String.fromCharCode(97+(e-9424)):e>=127312&&e<=127337?String.fromCharCode(65+(e-127312)):e>=127280&&e<=127305?String.fromCharCode(65+(e-127280)):e>=127344&&e<=127369?String.fromCharCode(65+(e-127344)):e>=120782&&e<=120791?String.fromCharCode(48+(e-120782)):e>=120792&&e<=120801?String.fromCharCode(48+(e-120792)):e>=120812&&e<=120821?String.fromCharCode(48+(e-120812)):e>=120822&&e<=120831?String.fromCharCode(48+(e-120822)):e===9450?"0":e>=9312&&e<=9320?String.fromCharCode(49+(e-9312)):e===9471?"0":e>=10122&&e<=10130?String.fromCharCode(49+(e-10122)):t:t}function Te(t){if(!t)return"";const e=t.replace(/[\u0336\u0335\u0332]/g,"");let n="";for(const o of e)n+=jt(o);return n}function le(t,e){if(!t)return"";if(e==="normal")return Te(t);if(e==="strikethrough")return t.replace(/[\u0336\u0335]/g,"").split("").map(s=>s===`
`||s==="\r"||s===" "?s:s+"̶").join("");if(e==="underline")return t.replace(/\u0332/g,"").split("").map(s=>s===`
`||s==="\r"||s===" "?s:s+"̲").join("");if(e==="uppercase")return Te(t).toUpperCase();if(e==="lowercase")return Te(t).toLowerCase();if(e==="titlecase")return Te(t).replace(/\b\w+/g,s=>s.charAt(0).toUpperCase()+s.slice(1).toLowerCase());let n="";const o=Te(t);for(const r of o)n+=Ao(r,e);return n}function ko(t){return Ft(t,"bullet")}function Ft(t,e){const n=r=>{switch(e){case"bullet":return"  • ";case"check":return"  ✓ ";case"arrow":return"  ➤ ";case"star":return"  ★ ";case"diamond":return"  ❖ ";case"number":return`  ${r+1}. `}};return t?t.split(`
`).map((r,s)=>{const a=r.trim();if(!a)return r;const i=a.replace(/^([•*\-–—✓✔➤➔★⭐◆❖]|\d+[\.\)])\s*/,"");return n(s)+i}).join(`
`):n(0)}function rt(t,e=1){const n=e===1?"# ":"## ";return!t||!t.trim()?n:t.split(`
`).map(r=>{const s=r.trim();return s?s.startsWith("## ")?e===1?"# "+s.slice(3):s:s.startsWith("# ")?e===2?"## "+s.slice(2):s:n+s:r}).join(`
`)}function Co(t){if(!t)return"****";const e=t.trim();return e.startsWith("**")&&e.endsWith("**")&&e.length>=4?e.slice(2,-2):`**${t}**`}function Po(t){if(!t)return"**";const e=t.trim();return e.startsWith("*")&&e.endsWith("*")&&e.length>=2&&!e.startsWith("**")?e.slice(1,-1):`*${t}*`}function Io(t){return!t||!t.trim()?"  1. ":Ft(t,"number")}function _o(t){return!t||!t.trim()?"> ":t.split(`
`).map(n=>{const o=n.trim();return o?o.startsWith("> ")?o:`> ${o}`:n}).join(`
`)}function Lo(t){if(!t||!t.trim())return t;const n=Te(t).split(`
`),o=[];let r=!1;for(let s=0;s<n.length;s++){const a=n[s],i=a.trim();if(!i){o.push("");continue}if(!r){r=!0,o.push(le(i,"sans-italic"));continue}if(/^(model|brand|device|item|condition|color|varient|variant)\s*[:=]/i.test(i)){const l=i.match(/^([^:=]+[:=]\s*)(.*)$/);if(l){const d=le(l[1],"sans-italic"),u=l[2];o.push(d+u);continue}}if((/^[•*\-–—✓✔➤➔★⭐◆❖]/.test(i)||/^(ram|rom|storage|storege|camera|battery|display|processor|chipset|condition|screen|charger|box|accessories|sound|sim|dual|official|unofficial|gaming|phone|fast)/i.test(i)||!i.includes(".")&&i.length<40&&!i.toLowerCase().includes("exchange")&&!i.toLowerCase().includes("price"))&&!i.toLowerCase().includes("exchange")&&!i.toLowerCase().includes("inbox")){const l=i.replace(/^[•*\-–—✓✔➤➔★⭐◆❖\s]+/,"");o.push("  • "+l);continue}if(i.toLowerCase().includes("exchange")||i.toLowerCase().includes("price")||i.toLowerCase().includes("inbox")||i.toLowerCase().includes("call")||i.toLowerCase().includes("contact")||i.toLowerCase().includes("location")){o.push(le(i,"sans-italic"));continue}o.push(a)}return o.join(`
`)}function Et(t){if(!t)return"<p><br></p>";const e=t.split(`
`),n=[];let o=!1,r=[],s=!1,a=[],i=!1,c=[];const l=()=>{o&&r.length>0&&(n.push("<ul>"+r.map(f=>`<li>${f}</li>`).join("")+"</ul>"),r=[],o=!1)},d=()=>{s&&a.length>0&&(n.push("<ol>"+a.map(f=>`<li>${f}</li>`).join("")+"</ol>"),a=[],s=!1)},u=()=>{i&&c.length>0&&(n.push("<blockquote>"+c.map(f=>`<p>${f}</p>`).join("")+"</blockquote>"),c=[],i=!1)},b=()=>{l(),d(),u()};for(let f=0;f<e.length;f++){const g=e[f],p=g.trim();if(!p){b(),n.push("<p><br></p>");continue}const S=p.match(/^<h1\b[^>]*>(.*?)<\/h1>$/i)||p.match(/^#\s+(.+)$/)||p.match(/^h1:\s*(.+)$/i);if(S){b(),n.push(`<h1>${$e(S[1])}</h1>`);continue}const E=p.match(/^<h[23]\b[^>]*>(.*?)<\/h[23]>$/i)||p.match(/^##\s+(.+)$/)||p.match(/^###\s+(.+)$/)||p.match(/^h[23]:\s*(.+)$/i);if(E){b(),n.push(`<h2>${$e(E[1])}</h2>`);continue}const N=p.match(/^<blockquote\b[^>]*>(.*?)<\/blockquote>$/i)||p.match(/^>\s*(.+)$/)||p.match(/^[❝❞]\s*(.+?)[❝❞]?$/);if(N){l(),d(),i=!0,c.push($e(N[1]));continue}const I=p.match(/^(\d+)[\.\)]\s+(.*)$/);if(I){l(),u(),s=!0,a.push($e(I[2]));continue}const z=p.match(/^<li\b[^>]*>(.*?)<\/li>$/i)||p.match(/^[•✓✔➤➔★⭐◆❖]\s*(.*)$/)||p.match(/^[\-*–—]\s+(.*)$/);if(z){d(),u(),o=!0,r.push($e(z[1]));continue}b(),n.push(`<p>${$e(g)}</p>`)}return b(),n.join("")}function $e(t){if(!t)return"";let e=t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");return e=e.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em style="font-style: italic;">$1</em></strong>'),e=e.replace(/___(.+?)___/g,'<strong><em style="font-style: italic;">$1</em></strong>'),e=e.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),e=e.replace(/__(.+?)__/g,"<strong>$1</strong>"),e=e.replace(/\*([^*\n]+?)\*/g,'<em style="font-style: italic;">$1</em>'),e=e.replace(/_([^_\n]+?)_/g,'<em style="font-style: italic;">$1</em>'),e=e.replace(/~~(.+?)~~/g,"<s>$1</s>"),e=e.replace(/`([^`\n]+?)`/g,"<code>$1</code>"),e=e.replace(/&lt;(\/?)strong&gt;/gi,"<$1strong>").replace(/&lt;(\/?)b&gt;/gi,"<$1strong>").replace(/&lt;(\/?)em&gt;/gi,"<$1em>").replace(/&lt;(\/?)i&gt;/gi,"<$1em>").replace(/&lt;(\/?)s&gt;/gi,"<$1s>").replace(/&lt;(\/?)del&gt;/gi,"<$1s>").replace(/&lt;(\/?)u&gt;/gi,"<$1u>").replace(/&lt;(\/?)code&gt;/gi,"<$1code>").replace(/&lt;br\s*\/?&gt;/gi,"<br>"),e}function To(t,e){if(!t||!t.trim())return"";const n=/<(h[1-6]|blockquote|ol)[\s>]/i.test(t)||/data-lexical/i.test(t)||/[\u0980-\u09FF]/.test(t)||(e==null?void 0:e.mode)==="markdown";if(typeof DOMParser<"u")try{const s=new DOMParser().parseFromString(t,"text/html");if(s&&s.body){if(!n&&(e==null?void 0:e.mode)!=="markdown"){s.querySelectorAll('i, em, span[style*="italic"]').forEach(d=>{const u=d.textContent||"";u.trim()&&(d.textContent=le(u,"sans-italic"))}),s.querySelectorAll('b, strong, span[style*="bold"], span[style*="700"]').forEach(d=>{const u=d.textContent||"";u.trim()&&(d.textContent=le(u,"sans-bold"))}),s.querySelectorAll('s, strike, del, span[style*="line-through"]').forEach(d=>{const u=d.textContent||"";u.trim()&&(d.textContent=le(u,"strikethrough"))}),s.querySelectorAll('u, ins, span[style*="underline"]').forEach(d=>{const u=d.textContent||"";u.trim()&&(d.textContent=le(u,"underline"))}),s.querySelectorAll("li").forEach(d=>{const u=(d.textContent||"").trim();d.textContent="  • "+u+`
`}),s.querySelectorAll("br").forEach(d=>d.replaceWith(`
`)),s.querySelectorAll("p, div").forEach(d=>{d.appendChild(document.createTextNode(`
`))});const l=(s.body.textContent||"").trim();if(l.length>0)return l.replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).trim()}const a=l=>{if(l.nodeType===Node.TEXT_NODE)return l.textContent||"";if(l.nodeType!==Node.ELEMENT_NODE)return"";const d=l,u=d.tagName.toLowerCase();if(u==="br")return`
`;let b="";d.childNodes.forEach(E=>{b+=a(E)});const f=(d.getAttribute("style")||"").toLowerCase(),g=u==="strong"||u==="b"||f.includes("font-weight: bold")||f.includes("font-weight:bold")||f.includes("font-weight: 700")||f.includes("font-weight:700")||f.includes("font-weight: 800")||f.includes("font-weight: 900"),p=u==="em"||u==="i"||f.includes("font-style: italic")||f.includes("font-style:italic"),m=u==="s"||u==="strike"||u==="del"||f.includes("line-through"),S=u==="u"||u==="ins"||f.includes("underline");if(!b.trim())return b;let y=b;if(g){const E=y.trim();(!E.startsWith("**")||!E.endsWith("**"))&&(y=`**${E}**`)}if(p){const E=y.trim();(!E.startsWith("*")||!E.endsWith("*"))&&(y=`*${E}*`)}if(m){const E=y.trim();(!E.startsWith("~~")||!E.endsWith("~~"))&&(y=`~~${E}~~`)}return S&&(y=`<u>${y.trim()}</u>`),u==="code"&&(y=`\`${y.trim()}\``),y},i=[],c=l=>{if(l.nodeType===Node.TEXT_NODE){const b=(l.textContent||"").trim();b&&i.push(b);return}if(l.nodeType!==Node.ELEMENT_NODE)return;const d=l,u=d.tagName.toLowerCase();if(u==="h1"){const b=a(d).trim();b&&i.push(`# ${b}`);return}if(u==="h2"){const b=a(d).trim();b&&i.push(`## ${b}`);return}if(u==="h3"||u==="h4"||u==="h5"||u==="h6"){const b=a(d).trim();b&&i.push(`## ${b}`);return}if(u==="blockquote"){const b=a(d).trim();b&&b.split(`
`).forEach(f=>{const g=f.trim();g&&i.push(`> ${g}`)});return}if(u==="ul"){Array.from(d.querySelectorAll(":scope > li, li")).forEach(f=>{const g=a(f).trim();g&&i.push(`  • ${g}`)});return}if(u==="ol"){Array.from(d.querySelectorAll(":scope > li, li")).forEach((f,g)=>{const p=a(f).trim();p&&i.push(`  ${g+1}. ${p}`)});return}if(u==="p"||u==="div"){if(Array.from(d.children).some(g=>/^(h[1-6]|p|div|ul|ol|blockquote)$/i.test(g.tagName))){d.childNodes.forEach(g=>c(g));return}const f=a(d).trim();f?i.push(f):(d.querySelector("br")||d.innerHTML.includes("<br>"))&&i.push("");return}d.childNodes.forEach(b=>c(b))};if(s.body.childNodes.forEach(l=>c(l)),i.length>0)return i.join(`
`)}}catch{}let o=t;return o=o.replace(/<h1\b[^>]*>(.*?)<\/h1>/gi,(r,s)=>`# ${s.trim()}

`),o=o.replace(/<h2\b[^>]*>(.*?)<\/h2>/gi,(r,s)=>`## ${s.trim()}

`),o=o.replace(/<h3\b[^>]*>(.*?)<\/h3>/gi,(r,s)=>`## ${s.trim()}

`),o=o.replace(/<blockquote\b[^>]*>(.*?)<\/blockquote>/gi,(r,s)=>`> ${s.trim()}

`),o=o.replace(/<li\b[^>]*>(.*?)<\/li>/gi,(r,s)=>`  • ${s.trim()}
`),n?(o=o.replace(/<(b|strong)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>`**${a.trim()}**`),o=o.replace(/<(i|em)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>`*${a.trim()}*`)):(o=o.replace(/<(i|em)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>le(a,"sans-italic")),o=o.replace(/<(b|strong)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>le(a,"sans-bold"))),o=o.replace(/<(s|del|strike)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>`~~${a.trim()}~~`),o=o.replace(/<(u|ins)\b[^>]*>(.*?)<\/\1>/gi,(r,s,a)=>`<u>${a.trim()}</u>`),o=o.replace(/<br\s*\/?>/gi,`
`),o=o.replace(/<\/(p|div)>/gi,`
`),o=o.replace(/<[^>]+>/g,""),o.replace(/\r\n/g,`
`).replace(/\r/g,`
`).replace(/\n{3,}/g,`

`).trim()}const $o=[{name:"Double Line (সমান লাইন)",value:"══════════════════════════════"},{name:"Thick Line (মোটা লাইন)",value:"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"},{name:"Thin Line (চিকন লাইন)",value:"──────────────────────────────"},{name:"Star Sparkle (তারকা বর্ডার)",value:"•┈┈┈••✦••┈┈┈••✦••┈┈┈••✦••┈┈┈•"},{name:"Flower Border (ফুলের বর্ডার)",value:"✿════════════════════════════✿"},{name:"Block Blocks (বক্স প্যাটার্ন)",value:"▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄"},{name:"Dashed Dots (ডট লাইন)",value:"┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈"},{name:"Double Arrow Star (স্টার অ্যারো)",value:"»»————-　★　————-««"}],zt=[{id:"price-cut",name:"Price Cut (ডিসকাউন্ট মূল্য)",icon:"💰",content:"💰 Regular Price: ̶২̶,̶৫̶০̶০̶ ৳  ➔  Offer Price: {price}"},{id:"cod-delivery",name:"Cash on Delivery (ক্যাশ অন ডেলিভারি)",icon:"🚚",content:"🚚 সারা বাংলাদেশে ক্যাশ অন হোম ডেলিভারি (প্রোডাক্ট দেখে পেমেন্ট করার সুবিধা)!"},{id:"location",name:"Location (ঠিকানা / লোকেশন)",icon:"📍",content:"📍 Location: {location}"},{id:"contact-whatsapp",name:"Phone / WhatsApp (কল ও হোয়াটসঅ্যাপ)",icon:"📞",content:"📞 Call / WhatsApp: {contact_info}"},{id:"condition-fresh",name:"100% Fresh Condition (কন্ডিশন)",icon:"⚡",content:"⚡ Condition: ১০০% ফুল ফ্রেশ, কোনো স্ক্র্যাচ বা সমস্যা নেই।"},{id:"warranty",name:"Warranty / Replacement (ওয়ারেন্টি)",icon:"🎁",content:"🎁 ৭ দিনের রিপ্লেসমেন্ট এবং ১ বছরের ফ্রি সার্ভিস ওয়ারেন্টি!"},{id:"urgency-stock",name:"Limited Stock (সীমিত স্টক সতর্কতা)",icon:"🚨",content:"🚨 Limited Stock Available! অফার শেষ হওয়ার আগেই দ্রুত অর্ডার করুন!"},{id:"inbox-cta",name:"Inbox CTA (ইনবক্স আহ্বান)",icon:"💬",content:"👉 অর্ডার করতে অথবা যেকোনো তথ্যের জন্য এখনই ইনবক্স করুন!"},{id:"exchange-offer",name:"Exchange Offer (এক্সচেঞ্জ অফার)",icon:"🔄",content:"🔄 যেকোনো ব্যবহৃত ফোন/ডিভাইসের সাথে এক্সচেঞ্জ পসিবল (শর্ত প্রযোজ্য)।"}];function Go(t){if(!t||typeof t!="string")return t||"";const e=t.trim();if(e.length<30)return t;const n=e.length,o=Math.floor(n/2);for(let s=-15;s<=15;s++){const a=o+s;if(a>15&&a<n-15){const i=e.slice(0,a).trim(),c=e.slice(a).trim();if(i.length>=15&&i===c)return i}}const r=e.split(`
`).filter(s=>s.trim().length>0);if(r.length>=4){const s=Math.floor(r.length/2),a=r.slice(0,s).join(`
`).trim(),i=r.slice(s).join(`
`).trim();if(a.length>=25&&a===i)return a}return t}function Jt(t){try{const n=new URL(t.startsWith("http")?t:`https://${t}`).searchParams.get("q");return n?decodeURIComponent(n.replace(/\+/g," ")):""}catch{return""}}function Mo(){if(typeof window>"u")return!1;const t=window.location.href.toLowerCase();return(t.includes("facebook.com")||t.includes("fb.com"))&&t.includes("/search")}function it(t){var c;if(!t)return!1;const e=t.tagName.toLowerCase(),n=t.getAttribute("role")||"",o=e==="button"||n==="button"||e==="a"||t.getAttribute("tabindex")!==null,r=(t.innerText||t.textContent||"").trim().toLowerCase(),s=(t.getAttribute("aria-label")||"").trim().toLowerCase(),a=(((c=t.querySelector("[aria-label]"))==null?void 0:c.getAttribute("aria-label"))||"").trim().toLowerCase(),i=`${r} | ${s} | ${a}`.toLowerCase();return i.includes("joined")||i.includes("view group")||i.includes("edit membership")||i.includes("যোগ দিয়েছেন")||i.includes("যুক্ত হয়েছেন")||i.includes("গ্রুপ দেখুন")||i.includes("requested")||i.includes("pending")||i.includes("cancel request")||i.includes("অনুরোধ পাঠানো")||i.includes("অনুরোধ করা হয়েছে")||i.includes("share")||i.includes("শেয়ার")||i.includes("message")||i.includes("মেসেজ")||i.includes("close")||i.includes("menu")||i.includes("search")||i.includes("notifications")?!1:!!(r==="join"||r==="join group"||r==="+ join"||r==="+ join group"||r==="request to join"||r==="answer questions"||r==="যোগ দিন"||r==="+ যোগ দিন"||r==="গ্রুপে যোগ দিন"||r==="যুক্ত হোন"||r==="+ যুক্ত হোন"||r==="গ্রুপে যুক্ত হোন"||r==="যোগ দেওয়ার অনুরোধ"||r==="যোগ দেয়ার অনুরোধ"||s==="join"||s==="join group"||s.includes("join group")||s.includes("request to join")||s.includes("যোগ দিন")||s.includes("যুক্ত হোন")||s.includes("অনুরোধ")||o&&(r.startsWith("join ")||r.endsWith(" join")||r.includes("join group")||r.includes("যোগ দিন")||r.includes("যুক্ত হোন")||r.includes("join")&&r.length<=16))}function st(t){if(!t)return!1;const e=(t.innerText||t.textContent||"").trim().toLowerCase(),n=(t.getAttribute("aria-label")||"").trim().toLowerCase(),o=`${e} ${n}`.toLowerCase();return o.includes("joined")||o.includes("view group")||o.includes("edit membership")||o.includes("যোগ দিয়েছেন")||o.includes("যুক্ত হয়েছেন")||o.includes("গ্রুপ দেখুন")}function at(t){if(!t)return!1;const e=(t.innerText||t.textContent||"").trim().toLowerCase(),n=(t.getAttribute("aria-label")||"").trim().toLowerCase(),o=`${e} ${n}`.toLowerCase();return o.includes("requested")||o.includes("pending")||o.includes("cancel request")||o.includes("অনুরোধ পাঠানো")||o.includes("অনুরোধ করা হয়েছে")}function ve(t){if(!t||typeof t!="string"||t.includes("/permalink/")||t.includes("/posts/")||t.includes("/photos/")||t.includes("/videos/")||t.includes("/user/")||t.includes("comment_id=")||t.includes("notif_id="))return null;const e=t.match(/(?:facebook\.com|fb\.com)?\/groups\/([^/?#]+)/i);if(!e||!e[1])return null;try{const n=decodeURIComponent(e[1]).trim().toLowerCase();return!n||mt.has(n)?null:n}catch{const n=e[1].trim().toLowerCase();return!n||mt.has(n)?null:n}}function St(t,e,n){let o="";const r=t.querySelector('span[dir="auto"], strong, h1, h2, h3, h4');if(r&&r.textContent&&r.textContent.trim().length>=2&&(o=r.textContent.trim()),!o){const a=(t.getAttribute("aria-label")||"").trim();a&&a.length>=2&&!a.toLowerCase().includes("view group")&&!a.toLowerCase().includes("গ্রুপ দেখুন")&&(o=a)}if(!o&&t.textContent&&(o=t.textContent.trim()),!o||o.length<2){const a=e.querySelector('h1, h2, h3, h4, [role="heading"], strong');o=((a==null?void 0:a.textContent)||"").trim()}o=o.split(`
`)[0].trim();const s=o.toLowerCase();return(s==="join"||s==="যোগ দিন"||s==="view group"||s==="গ্রুপ দেখুন"||s==="visit"||s==="joined")&&(o=""),(!o||o.length<2)&&(o=n.split(/[-_.]+/).map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join(" ")),o}function At(t){const e=(t.innerText||t.textContent||"").toLowerCase();return e.includes("public")||e.includes("পাবলিক")?"PUBLIC":e.includes("private")||e.includes("প্রাইভেট")?"PRIVATE":"UNKNOWN"}function kt(t){const e=(t.innerText||"").split(`
`).map(n=>n.trim()).filter(Boolean);for(const n of e){const o=n.toLowerCase();if((o.includes("member")||o.includes("সদস্য")||o.includes("post")||o.includes("পোস্ট"))&&(o.includes("public")||o.includes("private")||o.includes("পাবলিক")||o.includes("প্রাইভেট")||/\d/.test(n)))return n}return""}function Ge(){if(typeof document>"u")return[];const t=[],e=new Set,n=Array.from(document.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"], [aria-label*="Join" i], [aria-label*="যোগ" i], [aria-label*="যুক্ত" i]'));for(const s of n){if(!it(s))continue;let a=s.parentElement,i=null,c=null;for(let g=0;g<25&&a&&a!==document.body;g++){const p=Array.from(a.querySelectorAll('a[href*="/groups/"]')).filter(m=>{const S=m.href||m.getAttribute("href")||"";return!!ve(S)});if(p.length>0){const m=new Set(p.map(S=>ve(S.href||S.getAttribute("href")||"")).filter(Boolean));if(m.size===1)i=p[0],c=a;else if(m.size>1)break}a=a.parentElement}if(!i)continue;const l=ve(i.href||i.getAttribute("href")||"");if(!l||e.has(l))continue;e.add(l);const d=c||s.closest('div[role="feed"] > div')||s.parentElement||s,u=St(i,d,l),b=At(d),f=kt(d);t.push({cardElement:d,item:{id:l,groupId:l,name:u,url:`https://www.facebook.com/groups/${encodeURIComponent(l)}/`,privacy:b,membersText:f||void 0,status:"READY_TO_JOIN"},joinButton:s})}const o=Array.from(document.querySelectorAll('a[href*="/groups/"]'));for(const s of o){const a=ve(s.href||s.getAttribute("href")||"");if(!a||e.has(a))continue;let i=s.parentElement,c=null,l=null,d="READY_TO_JOIN";for(let g=0;g<25&&i&&i!==document.body;g++){const p=Array.from(i.querySelectorAll('a[href*="/groups/"]')).filter(y=>{const E=y.href||y.getAttribute("href")||"";return!!ve(E)});if(new Set(p.map(y=>ve(y.href||y.getAttribute("href")||"")).filter(Boolean)).size>1)break;c=i;const S=Array.from(i.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"], [aria-label]'));for(const y of S){if(st(y)){d="ALREADY_JOINED",l=null;break}if(at(y)){d="REQUESTED",l=null;break}if(it(y)){d="READY_TO_JOIN",l=y;break}}if(l||d!=="READY_TO_JOIN")break;i=i.parentElement}if(c||(c=s.closest('div[role="feed"] > div')||s.closest('div[role="article"]')||s.parentElement||s),d==="READY_TO_JOIN"&&!l&&c){const g=Array.from(c.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const p of g)if(!st(p)&&!at(p)){const m=(p.innerText||p.textContent||p.getAttribute("aria-label")||"").trim().toLowerCase();if(m&&!m.includes("more")&&!m.includes("menu")&&!m.includes("share")&&!m.includes("close")){l=p;break}}}e.add(a);const u=St(s,c,a),b=At(c),f=kt(c);t.push({cardElement:c,item:{id:a,groupId:a,name:u,url:`https://www.facebook.com/groups/${encodeURIComponent(a)}/`,privacy:b,membersText:f||void 0,status:d},joinButton:l})}const r=Array.from(document.querySelectorAll('div[role="feed"] > div, div[role="main"] div[role="article"], div[data-pagelet*="GroupSearchResult"]'));for(const s of r){const a=Array.from(s.querySelectorAll('a[href*="/groups/"]')).filter(m=>!!ve(m.href||m.getAttribute("href")||""));if(a.length===0)continue;const i=Array.from(new Set(a.map(m=>ve(m.href||m.getAttribute("href")||"")).filter(Boolean)));if(i.length!==1)continue;const c=i[0];if(e.has(c))continue;e.add(c);const l=a[0],d=St(l,s,c),u=At(s),b=kt(s);let f=null,g="READY_TO_JOIN";const p=Array.from(s.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const m of p){if(st(m)){g="ALREADY_JOINED";break}if(at(m)){g="REQUESTED";break}if(it(m)){g="READY_TO_JOIN",f=m;break}}t.push({cardElement:s,item:{id:c,groupId:c,name:d,url:`https://www.facebook.com/groups/${encodeURIComponent(c)}/`,privacy:u,membersText:b||void 0,status:g},joinButton:f})}return t}function ze(t){if(!t)return;try{t.scrollIntoView({behavior:"auto",block:"center"})}catch{}t.focus();const e=t.closest('div[role="button"], button, a[role="button"]')||t;e.focus();const n={bubbles:!0,cancelable:!0,view:window};if(e.dispatchEvent(new PointerEvent("pointerdown",n)),e.dispatchEvent(new MouseEvent("mousedown",n)),e.dispatchEvent(new PointerEvent("pointerup",n)),e.dispatchEvent(new MouseEvent("mouseup",n)),e.click(),e!==t)try{t.dispatchEvent(new MouseEvent("click",n)),t.click()}catch{}}async function No(t){let e=document.querySelector('div[role="dialog"]');if((!e||e.offsetParent===null&&e.getBoundingClientRect().height<=50)&&(await new Promise(i=>setTimeout(i,30)),e=document.querySelector('div[role="dialog"]')),!e||e.offsetParent===null&&e.getBoundingClientRect().height<=50)return!1;console.log("[AGP:AutoJoiner] Membership questions modal detected. Fast auto-answering...");const n=Array.from(e.querySelectorAll('input[type="checkbox"], div[role="checkbox"]'));for(const i of n)(i instanceof HTMLInputElement?i.checked:i.getAttribute("aria-checked")==="true")||ze(i);const o=Array.from(e.querySelectorAll('input[type="radio"], div[role="radio"]'));o.length>0&&(o.some(c=>c instanceof HTMLInputElement?c.checked:c.getAttribute("aria-checked")==="true")||ze(o[0]));const r=Array.from(e.querySelectorAll('textarea, input[type="text"]'));for(const i of r)(!i.value||i.value.trim()==="")&&(i.focus(),i.value=t||"Yes, I agree to the group rules and guidelines.",i.dispatchEvent(new Event("input",{bubbles:!0})),i.dispatchEvent(new Event("change",{bubbles:!0})));const s=Array.from(e.querySelectorAll('button, div[role="button"]'));for(const i of s){const c=(i.innerText||i.textContent||i.getAttribute("aria-label")||"").trim().toLowerCase();if(c==="submit"||c==="জমা দিন"||c==="send"||c==="confirm"||c==="next"||c==="পরবর্তী"||c==="done"||c==="অনুরোধ পাঠান"||c.includes("submit")||c.includes("জমা")){ze(i),await new Promise(l=>setTimeout(l,15));break}}const a=document.querySelector('div[role="dialog"]');if(a){const i=Array.from(a.querySelectorAll('button, div[role="button"]'));for(const c of i){const l=(c.innerText||c.textContent||c.getAttribute("aria-label")||"").trim().toLowerCase();if(l==="submit"||l==="জমা দিন"||l==="done"||l.includes("submit")){ze(c),await new Promise(d=>setTimeout(d,15));break}}}return!0}const Pe=class Pe{constructor(){Ee(this,"state",{...Bt});Ee(this,"config",{searchUrl:"",delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0});Ee(this,"isRunning",!1);Ee(this,"isPaused",!1);Ee(this,"shouldStop",!1);Ee(this,"onProgressCallbacks",[])}static getInstance(){return Pe.instance||(Pe.instance=new Pe),Pe.instance}subscribe(e){this.onProgressCallbacks.push(e)}getState(){return{...this.state}}broadcastState(){var e;for(const n of this.onProgressCallbacks)try{n(this.state)}catch{}try{typeof chrome<"u"&&((e=chrome.runtime)!=null&&e.sendMessage)&&chrome.runtime.sendMessage({type:"AUTO_JOIN_PROGRESS",payload:this.state})}catch{}}pause(){this.isRunning&&!this.isPaused&&(this.isPaused=!0,this.state.status="PAUSED",this.state.message="Auto-Join paused by user.",this.broadcastState())}resume(){this.isRunning&&this.isPaused&&(this.isPaused=!1,this.state.status="JOINING",this.state.message="Resuming group auto-joining...",this.broadcastState())}stop(){this.shouldStop=!0,this.isRunning=!1,this.isPaused=!1,this.state.status="STOPPED",this.state.message="Auto-Join stopped by user.",this.broadcastState()}async start(e){if(this.isRunning)return console.warn("[AGP:AutoJoiner] Already running."),this.state;this.config={...this.config,...e,delaySec:typeof e.delaySec=="number"?e.delaySec:0},this.isRunning=!0,this.isPaused=!1,this.shouldStop=!1;const n=Jt(window.location.href);this.state={...Bt,status:"SEARCHING",searchUrl:window.location.href,query:n,message:`Scanning Facebook group search results for "${n}"...`,startedAt:Date.now()},this.broadcastState();try{let o=0;const r=new Set;for(;!this.shouldStop;){for(;this.isPaused&&!this.shouldStop;)await new Promise(i=>setTimeout(i,500));if(this.shouldStop)break;const s=Ge();if(this.state.groups=s.map(i=>i.item),this.state.totalFound=s.length,this.state.alreadyJoinedCount=s.filter(i=>i.item.status==="ALREADY_JOINED").length,this.state.requestedCount=s.filter(i=>i.item.status==="REQUESTED").length,this.state.joinedCount=s.filter(i=>i.item.status==="JOINED").length,this.config.saveToGroups)for(const i of s)i.item.status==="ALREADY_JOINED"&&!r.has(i.item.groupId)&&(r.add(i.item.groupId),await this.saveGroupToDatabase(i.item));const a=s.find(i=>i.item.status==="READY_TO_JOIN"&&!r.has(i.item.groupId));if(a){o=0;const{cardElement:i,item:c}=a;let l=a.joinButton;if(!l&&i){const d=Array.from(i.querySelectorAll('div[role="button"], button, a[role="button"], [role="button"]'));for(const u of d)if(it(u)){l=u;break}if(!l){for(const u of d)if(!st(u)&&!at(u)){const b=(u.innerText||u.textContent||u.getAttribute("aria-label")||"").toLowerCase();if(!b.includes("more")&&!b.includes("menu")&&!b.includes("share")&&!b.includes("close")){l=u;break}}}}if(r.add(c.groupId),this.config.maxGroups>0&&this.state.joinedCount+this.state.requestedCount>=this.config.maxGroups){this.state.message=`Reached target limit of ${this.config.maxGroups} groups.`;break}if(l){this.state.status="JOINING",this.state.currentGroupName=c.name,c.status="JOINING",this.state.message=`Joining: "${c.name}"...`,this.broadcastState();try{i.scrollIntoView({behavior:"auto",block:"nearest"}),i.style.outline="3px solid #10b981",i.style.boxShadow="0 0 15px rgba(16, 185, 129, 0.45)",i.style.borderRadius="8px"}catch{}try{console.log(`[AGP:AutoJoiner] Triggering instant click on Join button for: "${c.name}"`),ze(l),this.config.autoAnswerQuestions&&await No(this.config.defaultAnswer),c.status="JOINED",c.joinedAt=Date.now(),this.state.joinedCount++,this.config.saveToGroups&&await this.saveGroupToDatabase(c),this.state.message=`Joined "${c.name}" (${c.status})`,this.broadcastState()}catch(u){console.error("[AGP:AutoJoiner] Join error on",c.name,u),c.status="FAILED",c.error=String(u),this.state.failedCount++,this.broadcastState()}finally{try{i.style.outline="2px solid rgba(16, 185, 129, 0.35)",i.style.boxShadow="none"}catch{}}const d=typeof this.config.delaySec=="number"?this.config.delaySec:0;if(d<=0)this.state.countdownSec=0,await new Promise(u=>setTimeout(u,30));else{for(let u=d;u>0&&!this.shouldStop;u--){for(;this.isPaused&&!this.shouldStop;)await new Promise(b=>setTimeout(b,200));if(this.shouldStop)break;this.state.countdownSec=u,this.state.message=`Waiting ${u}s before next group...`,this.broadcastState(),await new Promise(b=>setTimeout(b,1e3))}this.state.countdownSec=0}}}else{this.state.message="Loading more Facebook groups on this page...",this.broadcastState();const i=document.body.scrollHeight;if(window.scrollBy({top:1800,behavior:"auto"}),window.dispatchEvent(new Event("scroll",{bubbles:!0})),await new Promise(d=>setTimeout(d,120)),!Ge().some(d=>d.item.status==="READY_TO_JOIN"&&!r.has(d.item.groupId))&&document.body.scrollHeight===i){if(o++,o>=3)break}else o=0}}this.shouldStop||(this.state.status="COMPLETED",this.state.message=`Auto-join complete! Joined ${this.state.joinedCount} groups, requested ${this.state.requestedCount} groups.`)}catch(o){console.error("[AGP:AutoJoiner] Execution error:",o),this.state.status="ERROR",this.state.message=`Error: ${(o==null?void 0:o.message)||String(o)}`}finally{this.isRunning=!1,this.isPaused=!1,this.state.finishedAt=Date.now(),this.broadcastState()}return this.state}async saveGroupToDatabase(e){var n;try{const o=await xt();if(!o.some(s=>s.groupId&&s.groupId.toLowerCase()===e.groupId.toLowerCase()||s.url&&s.url.toLowerCase().includes(e.groupId.toLowerCase()))){const s={id:tt(),name:e.name,url:e.url,groupId:e.groupId,privacy:e.privacy,category:this.config.selectedCategory||"Auto Joined",enabled:!0,selected:!1,status:"READY",postCount:0,verified:!0,source:"facebook-ui",createdAt:Date.now(),updatedAt:Date.now()};await vt([...o,s]),console.log(`[AGP:AutoJoiner] Saved "${e.name}" (${e.groupId}) to My Facebook Groups database.`);try{typeof chrome<"u"&&((n=chrome.runtime)!=null&&n.sendMessage)&&chrome.runtime.sendMessage({type:"AUTO_JOIN_SAVE_GROUPS",payload:{group:s}})}catch{}}}catch(o){console.warn("[AGP:AutoJoiner] Save to database error:",o)}}};Ee(Pe,"instance");let V=Pe,j=null,h=null,A="",F=[],Je=!1,We=!1,He="POST_AND_JOIN",K=0,be=5,Ve=!1,Ct=!1,Wt=!1,v={isRunning:!1,isPaused:!1,status:"IDLE",message:"Ready to auto-join and post to Facebook groups from this search page.",total:0,completed:0,skipped:0,failed:0,currentGroupName:""},ce=null;function lt(t){return!t||typeof t!="string"?!1:t.startsWith("data:video")||t.includes("video/")||t.startsWith("blob:")||/\.(mp4|mov|webm|m4v|mkv|avi)($|\?)/i.test(t)}function Ht(t){return new Promise(e=>{if(t.type.startsWith("video/")||/\.(mp4|mov|webm|m4v|mkv|avi|3gp|flv)$/i.test(t.name)){const r=new FileReader;r.onload=s=>{var i;let a=((i=s.target)==null?void 0:i.result)||"";if(a&&(a.startsWith("data:application/octet-stream")||a.startsWith("data:;base64"))){let c="video/mp4";/\.webm$/i.test(t.name)?c="video/webm":/\.mov$/i.test(t.name)?c="video/quicktime":/\.mkv$/i.test(t.name)&&(c="video/x-matroska"),a=a.replace(/^data:[^;]*;base64/,`data:${c};base64`)}e(a)},r.onerror=()=>e(""),r.readAsDataURL(t);return}const o=new FileReader;o.onload=r=>{var i;const s=((i=r.target)==null?void 0:i.result)||"";if(!s)return e("");const a=new Image;a.onload=()=>{let c=a.width,l=a.height;const d=1280;(c>d||l>d)&&(c>l?(l=Math.round(l*d/c),c=d):(c=Math.round(c*d/l),l=d));const u=document.createElement("canvas");u.width=c,u.height=l;const b=u.getContext("2d");b?(b.drawImage(a,0,0,c,l),e(u.toDataURL("image/jpeg",.82))):e(s)},a.onerror=()=>e(s),a.src=s},o.onerror=()=>e(""),o.readAsDataURL(t)})}async function W(){var t;try{typeof chrome<"u"&&((t=chrome.storage)!=null&&t.local)&&await chrome.storage.local.set({agp_search_poster_caption:A,agp_search_poster_photos:F,agp_search_poster_delay:be,agp_search_poster_target:K})}catch(e){console.warn("[AGP:SearchPoster] Failed to save draft to storage:",e)}}async function Bo(){var t;if(!Wt){Wt=!0;try{if(typeof chrome<"u"&&((t=chrome.storage)!=null&&t.local)){const e=await chrome.storage.local.get(["agp_search_poster_caption","agp_search_poster_photos","agp_search_poster_delay","agp_search_poster_target"]);typeof(e==null?void 0:e.agp_search_poster_caption)=="string"&&(A=e.agp_search_poster_caption),Array.isArray(e==null?void 0:e.agp_search_poster_photos)&&(F=e.agp_search_poster_photos),typeof(e==null?void 0:e.agp_search_poster_delay)=="number"&&(be=e.agp_search_poster_delay),typeof(e==null?void 0:e.agp_search_poster_target)=="number"&&(K=e.agp_search_poster_target)}}catch(e){console.warn("[AGP:SearchPoster] Failed to load draft from storage:",e)}}}function ee(t){if(!h)return;const e=h.getElementById("agp-dock-toast");e&&e.remove();const n=document.createElement("div");n.id="agp-dock-toast",n.textContent=t,n.style.cssText=`
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
  `,h.appendChild(n),setTimeout(()=>n.remove(),2200)}function me(t){if(!t||!t.trim())return'<span style="color: #94a3b8; font-style: italic;">পোস্টের কোনো ক্যাপশন লেখা হয়নি। উপরে টুলবার দিয়ে ডিজাইন করুন অথবা টেক্সট পেস্ট করুন...</span>';const e=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),n=s=>{let a=e(s);return a=a.replace(/\*\*(.+?)\*\*/g,'<strong style="font-weight: 800; color: #ffffff;">$1</strong>'),a=a.replace(/\*([^*\n]+?)\*/g,'<em style="font-style: italic; color: #f1f5f9;">$1</em>'),a=a.replace(/~~(.+?)~~/g,'<s style="color: #94a3b8;">$1</s>'),a=a.replace(/&lt;u&gt;(.+?)&lt;\/u&gt;/g,'<u style="text-decoration: underline;">$1</u>'),a=a.replace(/`([^`\n]+?)`/g,'<code style="background: rgba(255,255,255,0.1); padding: 1px 4px; border-radius: 3px; font-family: monospace;">$1</code>'),a},o=t.split(`
`),r=[];for(let s=0;s<o.length;s++){const a=o[s],i=a.trim();if(!i){r.push('<div style="height: 8px;"></div>');continue}if(i.startsWith("# ")){r.push(`<h1 style="font-size: 15px; font-weight: 800; color: #60a5fa; margin: 4px 0 2px 0; line-height: 1.3;">${n(i.replace(/^#\s*/,""))}</h1>`);continue}if(i.startsWith("## ")||i.startsWith("### ")){r.push(`<h2 style="font-size: 13px; font-weight: 700; color: #93c5fd; margin: 3px 0 2px 0; line-height: 1.3;">${n(i.replace(/^#{2,3}\s*/,""))}</h2>`);continue}if(i.startsWith("> ")||i.startsWith("❝")){const c=i.replace(/^>\s*/,"").replace(/^[❝❞]\s*/,"");r.push(`<blockquote style="border-left: 3px solid #3b82f6; background: rgba(59, 130, 246, 0.12); padding: 4px 8px; margin: 4px 0; border-radius: 0 4px 4px 0; font-size: 11px; color: #e2e8f0;">${n(c)}</blockquote>`);continue}if(/^[•✓✔➤➔★⭐◆❖]/.test(i)||/^[\-*–—]\s+/.test(i)){const c=i.match(/^([•✓✔➤➔★⭐◆❖\-*–—]+)\s*(.*)$/),l=c?c[1]:"•",d=c?c[2]:i;r.push(`<div style="display: flex; align-items: flex-start; gap: 6px; padding-left: 4px; font-size: 11.5px; line-height: 1.4; color: #f1f5f9;"><span style="color: #60a5fa; font-weight: bold; flex-shrink: 0;">${e(l)}</span><span>${n(d)}</span></div>`);continue}if(/^(\d+)[\.\)]\s+/.test(i)){const c=i.match(/^(\d+)[\.\)]\s+(.*)$/),l=c?c[1]:"1",d=c?c[2]:i;r.push(`<div style="display: flex; align-items: flex-start; gap: 6px; padding-left: 4px; font-size: 11.5px; line-height: 1.4; color: #f1f5f9;"><span style="color: #93c5fd; font-weight: bold; flex-shrink: 0;">${e(l)}.</span><span>${n(d)}</span></div>`);continue}r.push(`<div style="font-size: 11.5px; line-height: 1.45; color: #e2e8f0;">${n(a)}</div>`)}return r.join("")}async function Pt(t){if(typeof document>"u")return;await Bo();const e=V.getInstance(),n=e.getState();if(!j){j=document.createElement("div"),j.id="agp-auto-joiner-root";const o=window.innerWidth<=640;j.style.cssText=`
      position: fixed;
      bottom: ${o?"10px":"24px"};
      right: ${o?"10px":"24px"};
      ${o?"left: 10px; max-width: calc(100vw - 20px);":""}
      z-index: 2147483646;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    `,h=j.attachShadow({mode:"open"}),document.body.appendChild(j),e.subscribe(r=>{L(r,t)}),Uo(t)}L(n,t),Do(t)}let Vt=null,Yt=-1,ct=null;function Oo(t){if(!h)return;const e=t.length,n=h.getElementById("btn-toggle-groups");if(n){const i=n.querySelector("strong");i&&(i.textContent=`${e} Groups`)}const o=h.querySelector('#agp-select-target option[value="0"]');o&&(o.textContent=`All Found (${e})`);const r=h.getElementById("btn-start-campaign");if(r&&!v.isRunning){const i=K>0?K:e;r.innerHTML=`<span>🚀</span> Start Join & Post (${i} Groups)`}const s=h.querySelector(".groups-list-box");s&&(t.length>0?s.innerHTML=t.map(i=>`
        <div class="group-row">
          <span style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${i.item.name}">
            ${i.item.name}
          </span>
          <span class="group-badge" style="background: ${i.item.privacy==="PUBLIC"?"rgba(16, 185, 129, 0.2)":"rgba(245, 158, 11, 0.2)"}; color: ${i.item.privacy==="PUBLIC"?"#34d399":"#fbbf24"};">
            ${i.item.privacy}
          </span>
        </div>
      `).join(""):s.innerHTML='<div style="text-align: center; color: #64748b; font-size: 11px; padding: 10px;">Scrolling page to detect group cards...</div>');const a=h.querySelector(".stats-grid .stat-item:first-child .stat-num");a&&(a.textContent=String(e))}function Do(t){if(Vt)return;const e=()=>{var r;if(v.isRunning)return;const o=Ge();if(o.length!==Yt&&(Yt=o.length,Oo(o),!(((r=h==null?void 0:h.activeElement)==null?void 0:r.id)==="agp-caption-input")&&!Ve)){const a=V.getInstance();L(a.getState(),t)}};Vt=setInterval(e,1200),setTimeout(e,300),setTimeout(e,800),setTimeout(e,1600),setTimeout(e,3e3);let n=null;window.addEventListener("scroll",()=>{n&&clearTimeout(n),n=setTimeout(e,300)},{passive:!0}),typeof MutationObserver<"u"&&document.body&&(ct&&ct.disconnect(),ct=new MutationObserver(()=>{n&&clearTimeout(n),n=setTimeout(e,450)}),ct.observe(document.body,{childList:!0,subtree:!0}))}function Uo(t){var e;try{typeof chrome<"u"&&((e=chrome.runtime)!=null&&e.sendMessage)&&chrome.runtime.sendMessage({type:"GET_QUEUE_STATE"},n=>{var s,a;const o=(n==null?void 0:n.state)||((s=n==null?void 0:n.payload)==null?void 0:s.state),r=(n==null?void 0:n.stats)||((a=n==null?void 0:n.payload)==null?void 0:a.stats);if(n!=null&&n.success&&(o!=null&&o.isRunning)){v.isRunning=!0,v.isPaused=!!o.isPaused,v.status=o.isPaused?"PAUSED":"RUNNING",v.total=(r==null?void 0:r.total)||0,v.completed=(r==null?void 0:r.completed)||0,v.failed=(r==null?void 0:r.failed)||0,v.skipped=(r==null?void 0:r.skipped)||0,v.currentGroupName=o.expectedGroupName||"Facebook Group",v.message=`Auto-posting in progress (${v.completed}/${v.total} done)...`,Kt();const i=V.getInstance();L(i.getState(),t)}})}catch{}}function Kt(){ce&&clearInterval(ce),ce=setInterval(()=>{var t;try{typeof chrome<"u"&&((t=chrome.runtime)!=null&&t.sendMessage)&&chrome.runtime.sendMessage({type:"GET_QUEUE_STATE"},e=>{var s,a;if(chrome.runtime.lastError||!(e!=null&&e.success))return;const n=(e==null?void 0:e.state)||((s=e==null?void 0:e.payload)==null?void 0:s.state),o=(e==null?void 0:e.stats)||((a=e==null?void 0:e.payload)==null?void 0:a.stats);if(!n||!o)return;n.isRunning?(v.isRunning=!0,v.isPaused=!!n.isPaused,v.status=n.isPaused?"PAUSED":"RUNNING",v.total=o.total||0,v.completed=o.completed||0,v.failed=o.failed||0,v.skipped=o.skipped||0,v.currentGroupName=n.expectedGroupName||"",v.message=v.isPaused?"Campaign paused by user.":`🚀 Posting to: "${v.currentGroupName||"Group"}" (${v.completed}/${v.total} done)...`):v.isRunning&&(v.isRunning=!1,v.isPaused=!1,v.status="COMPLETED",v.completed=o.completed||v.completed,v.total=o.total||v.total,v.message=`🎉 Campaign Finished! Successfully posted to ${v.completed} groups.`,clearInterval(ce),ce=null);const r=V.getInstance();L(r.getState())})}catch{ce&&(clearInterval(ce),ce=null)}},1e3)}function L(t,e){if(!h)return;const n=Jt(window.location.href),o=Ge(),r=o.length||t.totalFound,s=F.filter(g=>!lt(g)).length,a=F.filter(g=>lt(g)).length;let i="0 Media";s>0&&a>0?i=`${s} Photos + ${a} Video${a>1?"s":""}`:a>0?i=`${a} Video${a>1?"s":""}`:s>0&&(i=`${s} Photo${s>1?"s":""}`);const c=t.status==="SEARCHING"||t.status==="JOINING",l=v.isRunning&&!v.isPaused,d=v.isPaused,u=c||l,b=l?"#10b981":d?"#f59e0b":t.status==="JOINING"?"#10b981":t.status==="SEARCHING"?"#3b82f6":t.status==="PAUSED"?"#f59e0b":v.status==="COMPLETED"?"#10b981":"#6366f1";if(Ct){j&&(j.style.left="auto",j.style.width="auto",j.style.right=window.innerWidth<=640?"12px":"24px",j.style.bottom=window.innerWidth<=640?"12px":"24px");const g=v.isRunning?`Posting: ${v.completed}/${v.total}`:c?`Joining: ${t.joinedCount}`:`Auto-Poster: ${r} Groups`;h.innerHTML=`
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
          ${u?"animation: pulse 1.5s infinite;":""}
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
    `;const p=h.getElementById("agp-dock-expand");p&&(p.onclick=()=>{Ct=!1,L(t,e)});return}if(j){const g=window.innerWidth<=640;j.style.left=g?"8px":"auto",j.style.right=g?"8px":"24px",j.style.bottom=g?"8px":"24px",j.style.width=g?"calc(100vw - 16px)":"auto"}const f=v.total>0?Math.min(100,Math.round(v.completed/v.total*100)):0;h.innerHTML=`
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
        ${u?"animation: pulse 1.5s infinite;":""}
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
            <span>${l?"POSTING":d?"PAUSED":c?"JOINING":t.status}</span>
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
              ${A?'<button id="btn-clear-caption" class="action-link">Clear</button>':""}
              <span class="char-count" style="margin-top: 0;">${A.length} chars</span>
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
                  ${zt.map(g=>`<option value="${g.id}">${g.icon} ${g.name}</option>`).join("")}
                </select>
                <select id="tb-select-borders" class="tb-select" title="Insert Decorative Borders">
                  <option value="" disabled selected>➖ Borders</option>
                  ${$o.map(g=>`<option value="${g.value}">${g.name}</option>`).join("")}
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
          >${A}</textarea>

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
                ${me(A)}
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
              <span>📸🎥 Product Photos & Videos (${i} Added)</span>
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
            ${F.map((g,p)=>{const m=lt(g);return`
                  <div class="photo-thumb-wrapper ${m?"is-video":""}" title="${m?"Video":"Photo"} #${p+1}">
                    ${m?`
                        <video src="${g}#t=0.1" class="photo-thumb-img photo-thumb-video" muted playsinline preload="metadata" onloadedmetadata="this.currentTime=0.1"></video>
                        <div class="media-video-overlay">
                          <span class="media-video-badge">▶ VIDEO</span>
                        </div>
                        `:`
                        <img src="${g}" class="photo-thumb-img" alt="Photo ${p+1}" />
                        `}
                    <span class="media-index-pill">#${p+1}</span>
                    <button class="photo-remove-btn" data-index="${p}" title="Remove">✕</button>
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
              <option value="0" ${K===0?"selected":""}>All Found (${r})</option>
              <option value="5" ${K===5?"selected":""}>Top 5 Groups</option>
              <option value="10" ${K===10?"selected":""}>Top 10 Groups</option>
              <option value="20" ${K===20?"selected":""}>Top 20 Groups</option>
            </select>
          </div>
          <div>
            <div class="form-label" style="margin-bottom: 4px;">Pacing Delay</div>
            <select id="agp-select-delay" class="select-box">
              <option value="0" ${be===0?"selected":""}>Turbo (0s Delay)</option>
              <option value="5" ${be===5?"selected":""}>5 Sec (Recommended)</option>
              <option value="10" ${be===10?"selected":""}>10 Seconds</option>
              <option value="20" ${be===20?"selected":""}>20 Seconds</option>
              <option value="30" ${be===30?"selected":""}>30 Seconds</option>
            </select>
          </div>
        </div>

        <!-- Discovered Groups Accordion -->
        <div id="btn-toggle-groups" class="groups-preview-toggle">
          <span>👥 Found on Search Page: <strong style="color: #60a5fa;">${r} Groups</strong></span>
          <span>${Ve?"▲ Hide":"▼ View List"}</span>
        </div>
        ${Ve?`
          <div class="groups-list-box">
            ${o.length>0?o.map(g=>`
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
            <div class="progress-bar" style="width: ${f}%;"></div>
          </div>
        `:""}

        <!-- Status Message Box -->
        <div class="message-box">
          ${v.message}
        </div>

        <!-- Action Buttons -->
        <div class="btn-row">
          ${!v.isRunning&&!d?`<button id="btn-start-campaign" class="btn btn-post-primary">
                   <span>🚀</span> Start Join & Post (${K>0?K:r} Groups)
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
  `,Ro(t,e)}function Ro(t,e){var u,b,f,g,p,m,S,y,E,T,N,I,oe,z,de,R,X,ae,Ie,_e,se,Z,ye,xe,$,H,ge;if(!h)return;(u=h.getElementById("agp-dock-close"))==null||u.addEventListener("click",()=>{j&&(j.remove(),j=null,h=null)}),(b=h.getElementById("agp-dock-min"))==null||b.addEventListener("click",()=>{Ct=!0,L(t,e)}),(f=h.getElementById("btn-view-groups"))==null||f.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})}catch{}}),(g=h.getElementById("tab-post"))==null||g.addEventListener("click",()=>{He="POST_AND_JOIN",L(t,e)}),(p=h.getElementById("tab-join"))==null||p.addEventListener("click",()=>{He="JOIN_ONLY",L(t,e)});const n=h.getElementById("agp-caption-input");n&&(n.addEventListener("input",()=>{A=n.value,W();const x=h==null?void 0:h.querySelector(".char-count");x&&(x.textContent=`${A.length} chars`);const k=h==null?void 0:h.getElementById("agp-preview-body");k&&(k.innerHTML=me(A))}),n.addEventListener("paste",x=>{var P;const k=(P=x.clipboardData)==null?void 0:P.getData("text/html");if(k&&(/<(h[1-6]|b|strong|i|em|s|u|ul|ol|li|blockquote)[\s>]/i.test(k)||/data-lexical/i.test(k))){x.preventDefault();const C=To(k),B=n.selectionStart,J=n.selectionEnd,q=n.value.substring(0,B),ne=n.value.substring(J);A=q+C+ne,n.value=A,W(),n.focus(),n.setSelectionRange(B+C.length,B+C.length),ee("📋 Styled text pasted with full design!");const re=h==null?void 0:h.querySelector(".char-count");re&&(re.textContent=`${A.length} chars`);const ue=h==null?void 0:h.getElementById("agp-preview-body");ue&&(ue.innerHTML=me(A))}}));const o=(x,k)=>{if(!n)return;const P=n.selectionStart,C=n.selectionEnd;if(P!==C){const q=n.value.substring(P,C),ne=x(q);A=n.value.substring(0,P)+ne+n.value.substring(C),n.value=A,W(),n.focus(),n.setSelectionRange(P,P+ne.length)}else if(k!==void 0){A=n.value.substring(0,P)+k+n.value.substring(C),n.value=A,W(),n.focus();const q=P+Math.floor(k.length/2);n.setSelectionRange(q,q)}else A.trim()&&(A=x(A),n.value=A,W(),n.focus());const B=h==null?void 0:h.querySelector(".char-count");B&&(B.textContent=`${A.length} chars`);const J=h==null?void 0:h.getElementById("agp-preview-body");J&&(J.innerHTML=me(A))};(m=h.getElementById("tb-h1"))==null||m.addEventListener("click",()=>{if(!n)return;const x=n.selectionStart,k=n.selectionEnd;if(x!==k)o(B=>rt(B,1));else{const B=n.value.substring(0,x),J=n.value.substring(k),q=B.lastIndexOf(`
`),ne=J.indexOf(`
`),re=q===-1?0:q+1,ue=ne===-1?n.value.length:x+ne,Tt=n.value.substring(re,ue),$t=rt(Tt,1);A=n.value.substring(0,re)+$t+n.value.substring(ue),n.value=A,W(),n.focus()}ee("🏷️ Heading 1 (H1)");const P=h==null?void 0:h.querySelector(".char-count");P&&(P.textContent=`${A.length} chars`);const C=h==null?void 0:h.getElementById("agp-preview-body");C&&(C.innerHTML=me(A))}),(S=h.getElementById("tb-h2"))==null||S.addEventListener("click",()=>{if(!n)return;const x=n.selectionStart,k=n.selectionEnd;if(x!==k)o(B=>rt(B,2));else{const B=n.value.substring(0,x),J=n.value.substring(k),q=B.lastIndexOf(`
`),ne=J.indexOf(`
`),re=q===-1?0:q+1,ue=ne===-1?n.value.length:x+ne,Tt=n.value.substring(re,ue),$t=rt(Tt,2);A=n.value.substring(0,re)+$t+n.value.substring(ue),n.value=A,W(),n.focus()}ee("🏷️ Heading 2 (H2)");const P=h==null?void 0:h.querySelector(".char-count");P&&(P.textContent=`${A.length} chars`);const C=h==null?void 0:h.getElementById("agp-preview-body");C&&(C.innerHTML=me(A))}),(y=h.getElementById("tb-bold"))==null||y.addEventListener("click",()=>{o(x=>Co(x),"****"),ee("𝐁 Bold (**text**)")}),(E=h.getElementById("tb-italic"))==null||E.addEventListener("click",()=>{o(x=>Po(x),"**"),ee("𝘐 Italic (*text*)")}),(T=h.getElementById("tb-strike"))==null||T.addEventListener("click",()=>{o(x=>le(x,"strikethrough")),ee("Strikethrough / কাটা দাগ")}),(N=h.getElementById("tb-bullets"))==null||N.addEventListener("click",()=>{o(x=>ko(x),`
  • `),ee("• Bullets")}),(I=h.getElementById("tb-numbers"))==null||I.addEventListener("click",()=>{o(x=>Io(x),`
  1. `),ee("1. Numbered List")}),(oe=h.getElementById("tb-quote"))==null||oe.addEventListener("click",()=>{o(x=>_o(x),`
> `),ee("❞ Quote")});const r=h.getElementById("tb-select-style");r==null||r.addEventListener("change",()=>{r.value&&(o(x=>le(x,r.value)),ee(`Applied ${r.value}!`),r.value="")}),(z=h.getElementById("tb-auto-design"))==null||z.addEventListener("click",()=>{if(!A.trim()){ee("⚠️ আগে ক্যাপশন লিখুন (Type caption first)");return}A=Lo(A),n&&(n.value=A),W(),ee("✨ 1-Click Auto-Design Applied!");const x=h==null?void 0:h.querySelector(".char-count");x&&(x.textContent=`${A.length} chars`);const k=h==null?void 0:h.getElementById("agp-preview-body");k&&(k.innerHTML=me(A))});const s=h.getElementById("tb-select-sales");s==null||s.addEventListener("change",()=>{if(s.value&&n){const x=zt.find(k=>k.id===s.value);if(x){const k=x.content.replace("{price}","১,৫০০ ৳").replace("{location}","ঢাকা / সারা বাংলাদেশ").replace("{contact_info}","ইনবক্স করুন / 017xxxxxxxx"),P=n.selectionStart,C=n.selectionEnd,B=n.value.substring(0,P),J=n.value.substring(C),q=B.length===0||B.endsWith(`

`)?"":B.endsWith(`
`)?`
`:`

`;A=B+q+k+`
`+J,n.value=A,W(),ee(`Inserted ${x.name}!`),n.focus(),n.setSelectionRange(P+q.length+k.length+1,P+q.length+k.length+1);const re=h==null?void 0:h.querySelector(".char-count");re&&(re.textContent=`${A.length} chars`);const ue=h==null?void 0:h.getElementById("agp-preview-body");ue&&(ue.innerHTML=me(A))}s.value=""}});const a=h.getElementById("tb-select-borders");a==null||a.addEventListener("change",()=>{if(a.value&&n){const x=a.value,k=n.selectionStart,P=n.selectionEnd,C=n.value.substring(0,k),B=n.value.substring(P),J=C.length===0||C.endsWith(`
`)?"":`
`,q=B.startsWith(`
`)?"":`
`;A=C+J+x+q+B,n.value=A,W(),ee("➖ Border inserted!"),n.focus(),n.setSelectionRange(k+J.length+x.length+q.length,k+J.length+x.length+q.length);const ne=h==null?void 0:h.querySelector(".char-count");ne&&(ne.textContent=`${A.length} chars`);const re=h==null?void 0:h.getElementById("agp-preview-body");re&&(re.innerHTML=me(A)),a.value=""}}),(de=h.getElementById("tb-btn-preview"))==null||de.addEventListener("click",()=>{We=!We,L(t,e)}),(R=h.getElementById("btn-clear-caption"))==null||R.addEventListener("click",()=>{A="",W(),L(t,e)});const i=h.getElementById("agp-file-input");(X=h.getElementById("btn-trigger-upload"))==null||X.addEventListener("click",()=>{i==null||i.click()}),i&&i.addEventListener("change",async()=>{if(i.files&&i.files.length>0){Je=!0,L(t,e);const x=Array.from(i.files),k=[];for(const P of x)try{const C=await Ht(P);C&&k.push(C)}catch(C){console.warn("[AGP:SearchPoster] File convert error:",C)}F=[...F,...k],await W(),Je=!1,i.value="",L(t,e)}});const c=h.getElementById("agp-media-container");c&&(c.addEventListener("dragover",x=>{x.preventDefault(),c.classList.add("drag-over")}),c.addEventListener("dragleave",x=>{x.preventDefault(),c.classList.remove("drag-over")}),c.addEventListener("drop",async x=>{var k;if(x.preventDefault(),c.classList.remove("drag-over"),(k=x.dataTransfer)!=null&&k.files&&x.dataTransfer.files.length>0){Je=!0,L(t,e);const P=Array.from(x.dataTransfer.files),C=[];for(const B of P)try{const J=await Ht(B);J&&C.push(J)}catch(J){console.warn("[AGP:SearchPoster] Drag drop convert error:",J)}F=[...F,...C],await W(),Je=!1,L(t,e)}})),h.querySelectorAll(".photo-remove-btn").forEach(x=>{x.addEventListener("click",k=>{k.stopPropagation();const P=x.getAttribute("data-index");if(P!==null){const C=parseInt(P,10);!isNaN(C)&&C>=0&&C<F.length&&(F.splice(C,1),W(),L(t,e))}})}),(ae=h.getElementById("btn-clear-photos"))==null||ae.addEventListener("click",()=>{F=[],W(),L(t,e)});const l=h.getElementById("agp-select-target");l&&l.addEventListener("change",()=>{K=parseInt(l.value,10)||0,W(),L(t,e)});const d=h.getElementById("agp-select-delay");d&&d.addEventListener("change",()=>{be=parseInt(d.value,10)||0,W()}),(Ie=h.getElementById("btn-toggle-groups"))==null||Ie.addEventListener("click",()=>{Ve=!Ve,L(t,e)}),(_e=h.getElementById("btn-start-campaign"))==null||_e.addEventListener("click",()=>{qo(t,e)}),(se=h.getElementById("btn-pause-campaign"))==null||se.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&(chrome.runtime.sendMessage({type:"PAUSE_QUEUE"}),v.isPaused=!0,v.status="PAUSED",v.message="Posting campaign paused.",L(t,e))}catch{}}),(Z=h.getElementById("btn-resume-campaign"))==null||Z.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&(chrome.runtime.sendMessage({type:"RESUME_QUEUE"}),v.isPaused=!1,v.status="RUNNING",v.message="Resuming campaign...",L(t,e))}catch{}}),(ye=h.getElementById("btn-stop-campaign"))==null||ye.addEventListener("click",()=>{var x;try{typeof chrome<"u"&&((x=chrome.runtime)!=null&&x.sendMessage)&&(chrome.runtime.sendMessage({type:"STOP_QUEUE"}),v.isRunning=!1,v.isPaused=!1,v.status="IDLE",v.message="Campaign stopped.",ce&&(clearInterval(ce),ce=null),L(t,e))}catch{}}),(xe=h.getElementById("btn-start-join"))==null||xe.addEventListener("click",()=>{V.getInstance().start(e||{searchUrl:window.location.href,delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0})}),($=h.getElementById("btn-pause-join"))==null||$.addEventListener("click",()=>{V.getInstance().pause()}),(H=h.getElementById("btn-resume-join"))==null||H.addEventListener("click",()=>{V.getInstance().resume()}),(ge=h.getElementById("btn-stop-join"))==null||ge.addEventListener("click",()=>{V.getInstance().stop()})}async function qo(t,e){var g;if(!A.trim()&&F.length===0){v.message="⚠️ অনুগ্রহ করে পোস্টের ক্যাপশন অথবা অন্তত একটি ছবি/ভিডিও যুক্ত করুন (Please add caption, photos or video).",L(t,e);return}v.status="SCANNING",v.message="🔍 Scanning search results for Facebook groups...",L(t,e);const n=K>0?K:10;let o=Ge(),r=0;for(;o.length<n&&r<6;)r++,v.message=`🔍 Scanning search results... Found ${o.length}/${n} groups...`,L(t,e),window.scrollBy({top:1e3,behavior:"smooth"}),await new Promise(p=>setTimeout(p,800)),o=Ge();if(o.length===0){v.status="ERROR",v.message="⚠️ কোনো ফেসবুক গ্রুপ পাওয়া যায়নি। পেজটি স্ক্রোল করুন অথবা সার্চ লিঙ্ক চেক করুন।",L(t,e);return}const s=K>0?o.slice(0,K):o;v.message=`Saving ${s.length} groups to database...`,L(t,e);const a=await xt(),i=new Map(a.map(p=>[p.groupId?p.groupId.toLowerCase():p.id.toLowerCase(),p])),c=[],l=[];for(const p of s){const m=p.item.groupId||p.item.id,S=p.item.url||`https://www.facebook.com/groups/${encodeURIComponent(m)}/`;let y=i.get(m.toLowerCase());y||(y={id:tt("grp"),groupId:m,name:p.item.name||"Facebook Group",url:S,category:"Search Result",privacy:p.item.privacy,enabled:!0,selected:!0,status:"READY",postCount:0,verified:!0,source:"facebook-ui",createdAt:Date.now(),updatedAt:Date.now()},c.push(y),i.set(m.toLowerCase(),y)),l.push(y.id)}const d=[...a,...c];c.length>0&&await vt(d);const u=`search_post_${Date.now()}`,b={id:u,title:A.slice(0,40)||"Product Post",productName:A.slice(0,30)||"Product",caption:A,description:A,images:F,createdAt:Date.now(),updatedAt:Date.now()},f=await mo();await ho([b,...f.filter(p=>p.id!==u)]),v.isRunning=!0,v.isPaused=!1,v.status="RUNNING",v.total=l.length,v.completed=0,v.failed=0,v.skipped=0,v.message=`🚀 Campaign started! Visiting & posting to ${l.length} groups...`,L(t,e);try{typeof chrome<"u"&&((g=chrome.runtime)!=null&&g.sendMessage)&&chrome.runtime.sendMessage({type:"CREATE_AND_START_QUEUE",payload:{groupIds:l,postId:u,delaySec:be,groups:d,post:b}},p=>{p!=null&&p.success?(console.log("[AGP:SearchPoster] Campaign successfully queued."),Kt()):(v.status="ERROR",v.isRunning=!1,v.message=`Failed to start campaign: ${(p==null?void 0:p.error)||"Unknown error"}`,L(t,e))})}catch(p){v.status="ERROR",v.isRunning=!1,v.message=`Error starting campaign: ${String(p)}`,L(t,e)}}console.log("[AGP:Content] Facebook Assistant Content Script initialized.");let we=null,_=null,w=null,Ce=!1,dt=!1,Me=null,ut=!1;function It(){D&&(clearInterval(D),D=null),Q=!1,he=!0,ut=!0;try{chrome.runtime.sendMessage({type:"STOP_QUEUE"})}catch{}we&&(we.remove(),we=null,_=null),M("🛑 Auto-Posting বন্ধ করা হয়েছে (Stopped & Closed)")}async function jo(t){try{return await navigator.clipboard.writeText(t),!0}catch{const n=document.createElement("textarea");n.value=t,document.body.appendChild(n),n.select();const o=document.execCommand("copy");return document.body.removeChild(n),o}}async function Qt(t,e){try{if(navigator.clipboard&&window.ClipboardItem){const n=new Blob([t],{type:"text/plain"}),o=new Blob([e],{type:"text/html"});return await navigator.clipboard.write([new window.ClipboardItem({"text/plain":n,"text/html":o})]),!0}}catch{}try{const n=r=>{var s,a;r.preventDefault(),(s=r.clipboardData)==null||s.setData("text/plain",t),(a=r.clipboardData)==null||a.setData("text/html",e)};document.addEventListener("copy",n);const o=document.execCommand("copy");if(document.removeEventListener("copy",n),o)return!0}catch{}return jo(t)}function M(t,e=!1){if(_){const n=_.getElementById("agp-toast");n&&n.remove();const o=document.createElement("div");o.id="agp-toast",o.innerText=t,o.style.cssText=`
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
    `,document.body.appendChild(o),requestAnimationFrame(()=>{o.style.opacity="1",o.style.transform="translateY(0)"}),setTimeout(()=>{o.style.opacity="0",o.style.transform="translateY(-10px)",setTimeout(()=>o.remove(),400)},3e3)}}let Q=!1,O="Preparing auto-post...",D=null,he=!1;const U=t=>new Promise(e=>setTimeout(e,t));async function Fo(t,e="media_1"){try{if(!t||typeof t!="string")return null;let n="image/jpeg",o=null;if(t.startsWith("data:")||t.startsWith("blob:")||t.startsWith("http://")||t.startsWith("https://"))try{const d=await fetch(t);(d.ok||t.startsWith("data:")||t.startsWith("blob:"))&&(o=await d.blob(),o&&o.size>0&&(n=(o.type||"").toLowerCase()||"image/jpeg"))}catch(d){console.warn("[AGP:AutoPost] fetch blob parsing failed, falling back to manual decode:",d)}if(!o||o.size===0){let d=t;if(t.startsWith("data:")){const u=t.indexOf(",");if(u!==-1){const b=t.slice(0,u);d=t.slice(u+1);const f=b.match(/:(.*?);/);n=f?f[1].toLowerCase():"image/jpeg"}}try{const u=atob(d.trim().replace(/\s/g,"")),b=new Uint8Array(u.length);for(let f=0;f<u.length;f++)b[f]=u.charCodeAt(f);if(b.length===0)return null;b.length>8&&b[4]===102&&b[5]===116&&b[6]===121&&b[7]===112&&(n="video/mp4"),o=new Blob([b.buffer],{type:n})}catch(u){return console.warn("[AGP:AutoPost] base64 decode failed:",u),null}}if(!o||o.size===0)return null;const r=n.startsWith("video/");let s="jpg";n.includes("video/mp4")||n.includes("mp4")?s="mp4":n.includes("video/webm")||n.includes("webm")?s="webm":n.includes("video/quicktime")||n.includes("mov")?s="mov":n.includes("video/x-m4v")||n.includes("m4v")?s="m4v":n.includes("video/mkv")||n.includes("matroska")?s="mkv":r?s="mp4":n.includes("png")?s="png":n.includes("webp")?s="webp":n.includes("gif")&&(s="gif");const a=Date.now(),i=e.replace(/\D/g,"")||"1",l=`${r?"VID":"IMG"}_${a}_${i}.${s}`;return new File([o],l,{type:n,lastModified:a})}catch(n){return console.warn("[AGP:AutoPost] mediaToFile error:",n),null}}function te(t){if(!t)return!1;if(t.offsetParent!==null)return!0;try{const e=window.getComputedStyle(t);if(e.display==="none"||e.visibility==="hidden"||e.opacity==="0")return!1;const n=t.getBoundingClientRect();return n.width>0&&n.height>0}catch{return!1}}function Ne(){const t=Array.from(document.querySelectorAll('[data-pagelet="GroupInlineComposer"], [data-pagelet="FeedInlineComposer"], [data-pagelet="GroupComposer"], [data-pagelet*="Composer" i]'));for(const n of t){if(n.closest('[role="article"], [data-pagelet*="FeedUnit"], [data-pagelet*="Comment"], form'))continue;const o=n.querySelector('[role="button"]');if(o&&te(o))return o}const e=Array.from(document.querySelectorAll('[role="main"] [role="button"], [role="button"]'));for(const n of e){if(n.closest('[role="article"], [data-pagelet*="FeedUnit"], [data-pagelet*="Comment"], form'))continue;const o=(n.getAttribute("aria-label")||"").toLowerCase(),r=(n.textContent||"").trim().toLowerCase();if((o.includes("create a public post")||o.includes("write something")||o.includes("create a post")||o.includes("কিছু লিখুন")||o.includes("পোস্ট তৈরি করুন")||o.includes("একটি পাবলিক পোস্ট")||o.includes("আপনার মনে কী আছে")||o.includes("কী ভাবছেন")||o.includes("write discussion")||o.includes("start discussion")||r==="create a public post..."||r==="write something..."||r==="create a post..."||r==="create post"||r==="write discussion"||r==="discussion"||r.includes("কিছু লিখুন")||r.includes("পোস্ট তৈরি করুন")||r.includes("পাবলিক পোস্ট")||r.includes("আপনার মনে কী আছে")||r.includes("কী ভাবছেন")||r.includes("আলোচনা"))&&te(n))return n}return null}function Be(){const t=Array.from(document.querySelectorAll('[role="dialog"]'));for(const e of t)if(te(e)){if(e.closest('[role="article"]')||e.querySelector('[data-pagelet*="ChatTab"], [aria-label*="Messenger" i]'))continue;const n=(e.textContent||"").toLowerCase(),o=(e.getAttribute("aria-label")||"").toLowerCase();if(o.includes("create post")||o.includes("create a public post")||o.includes("পোস্ট তৈরি করুন")||n.includes("create post")||n.includes("create a public post")||n.includes("add to your post")||n.includes("পোস্ট তৈরি করুন")||n.includes("আপনার পোস্টে যোগ করুন")||!!e.querySelector('[aria-label*="Add to your post" i], [aria-label*="আপনার পোস্টে যোগ করুন" i], [aria-label*="Photo/video" i]'))return e}return null}function Ye(){const t=(document.body?document.body.innerText:"").toLowerCase(),e=(document.title||"").toLowerCase();return window.location.href.toLowerCase().includes("/groups/grp_")||t.includes("this content isn't available right now")||t.includes("this content isn't available")||t.includes("content isn't available right now")||t.includes("the link you followed may be broken")||t.includes("page may have been removed")||t.includes("এই কন্টেন্টটি এখন উপলব্ধ নয়")||t.includes("এই লিঙ্কটি হয়তো ত্রুটিপূর্ণ")||e.includes("page not found")||e.includes("content not found")||!!document.querySelector('[role="main"] [aria-label*="Go to Feed" i], [role="main"] a[href="/"][role="button"]')}async function zo(){if(Ye())return null;let t=Be();if(t)return t;let e=Ne();if(!e){const o=Date.now();for(;Date.now()-o<3500;){if(t=Be(),t)return t;if(e=Ne(),e)break;await U(10)}}if(!e)return console.log("[AGP:AutoPost] Composer trigger not found on page."),null;if(e.scrollIntoView({behavior:"instant",block:"center"}),e.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,cancelable:!0})),e.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0,cancelable:!0})),e.click(),t=Be(),t)return t;const n=Date.now();for(;Date.now()-n<3500;){if(t=Be(),t)return t;await U(10)}return null}async function Xt(t,e){if(!e||!e.trim())return!0;const n=Go(yt(e)).replace(/\r\n/g,`
`).replace(/\r/g,`
`),o=n.split(`
`);Qt(n.trim(),Et(n)).catch(()=>{});let r=null;const s=Date.now(),a=['div[role="textbox"][contenteditable="true"]','div[data-lexical-editor="true"][contenteditable="true"]','div[contenteditable="true"]:not([aria-label*="comment" i]):not([aria-label*="মন্তব্য" i])','div[data-editor="true"]','div[aria-label*="Create a public post" i][contenteditable="true"]','div[aria-label*="Write something" i][contenteditable="true"]','div[aria-label*="কিছু লিখুন" i][contenteditable="true"]','div[aria-label*="পাবলিক পোস্ট" i][contenteditable="true"]','div[aria-placeholder*="Create a public post" i]','div[aria-placeholder*="Write something" i]'];for(;Date.now()-s<4e3;){for(const m of a){const S=t.querySelector(m)||document.querySelector(`[role="dialog"] ${m}`);if(S&&te(S)){r=S;break}}if(r)break;await U(10)}if(!r)return console.warn("[AGP:AutoPost] Create post editor not found inside modal."),!1;const i=(r.textContent||"").trim(),c=n.trim().slice(0,30);if(i.length>=n.trim().length*.7&&(!c||i.includes(c)))return console.log("[AGP:AutoPost] Editor already contains caption. Skipping duplicate injection."),!0;r.scrollIntoView({behavior:"instant",block:"center"}),window.focus(),r.focus();const l={bubbles:!0,cancelable:!0,view:window};r.dispatchEvent(new PointerEvent("pointerdown",l)),r.dispatchEvent(new MouseEvent("mousedown",l)),r.dispatchEvent(new PointerEvent("pointerup",l)),r.dispatchEvent(new MouseEvent("mouseup",l)),r.dispatchEvent(new MouseEvent("click",l)),r.dispatchEvent(new FocusEvent("focus",{bubbles:!1})),r.dispatchEvent(new FocusEvent("focusin",{bubbles:!0}));try{const m="agp_inj_"+Date.now()+"_"+Math.random().toString(36).slice(2,7),S=new Promise(E=>{const T=N=>{N.data&&N.data.type==="AGP_MAIN_INJECT_CAPTION_RESPONSE"&&N.data.messageId===m&&(window.removeEventListener("message",T),E(!!N.data.success))};window.addEventListener("message",T),setTimeout(()=>{window.removeEventListener("message",T),E(!1)},250)});if(window.postMessage({type:"AGP_MAIN_INJECT_CAPTION",messageId:m,caption:n},"*"),await S&&(console.log("[AGP:AutoPost] MAIN world injection succeeded with exact layout!"),(r.textContent||"").trim().length>0))return!0}catch(m){console.warn("[AGP:AutoPost] MAIN world bridge error, using direct content injection:",m)}const d=(r.textContent||"").trim();if(d.length>=n.trim().length*.7&&(!c||d.includes(c)))return console.log("[AGP:AutoPost] Editor already populated by bridge. Skipping fallback Strategy 2."),!0;const u=window.getSelection();if(u){const m=document.createRange();m.selectNodeContents(r),u.removeAllRanges(),u.addRange(m),r.dispatchEvent(new InputEvent("beforeinput",{bubbles:!0,cancelable:!0,inputType:"deleteContentBackward"}))}document.execCommand("selectAll",!1),document.execCommand("delete",!1),await U(10);const b=r.querySelector("p")||r;if(b.dispatchEvent(new MouseEvent("mousedown",l)),b.dispatchEvent(new MouseEvent("mouseup",l)),b.click(),u){const m=document.createRange();b.childNodes.length>0?(m.setStart(b,0),m.setEnd(b,b.childNodes.length)):m.selectNodeContents(b),m.collapse(!0),u.removeAllRanges(),u.addRange(m)}document.dispatchEvent(new Event("selectionchange"));let f=!1;const g=Et(n);try{const m=new DataTransfer;m.setData("text/plain",n),m.setData("text/html",g);const S=new ClipboardEvent("paste",{bubbles:!0,cancelable:!0,clipboardData:m});r.dispatchEvent(S),await U(20);let y=(r.textContent||"").trim();if((!y||y.length<5)&&(r.dispatchEvent(new InputEvent("beforeinput",{bubbles:!0,cancelable:!0,inputType:"insertFromPaste",dataTransfer:m})),await U(15),y=(r.textContent||"").trim()),!y||y.length<5)try{document.execCommand("insertHTML",!1,g),await U(15),y=(r.textContent||"").trim()}catch{}const E=r.querySelectorAll("p, h1, h2, h3, ul, ol, li, blockquote"),T=r.querySelectorAll("h1, h2, ul, ol, blockquote").length>0;y.length>0&&(!n.includes(`
`)||E.length>1||T||y.length>=n.trim().length*.4)&&(console.log("[AGP:AutoPost] Direct Native Paste event succeeded. Block count:",E.length),f=!0)}catch(m){console.warn("[AGP:AutoPost] Native paste event error:",m)}if(!f)try{console.log("[AGP:AutoPost] Trying Strategy 3: Line-by-line Enter keystrokes with non-collapsing spacing..."),document.execCommand("selectAll",!1),document.execCommand("delete",!1),await U(10);for(let S=0;S<o.length;S++){const y=o[S],E=S===o.length-1;y.length>0?document.execCommand("insertText",!1,y):document.execCommand("insertText",!1," "),E||(r.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0,cancelable:!0})),r.dispatchEvent(new InputEvent("beforeinput",{inputType:"insertParagraph",bubbles:!0,cancelable:!0})),document.execCommand("insertParagraph",!1),r.dispatchEvent(new InputEvent("input",{inputType:"insertParagraph",bubbles:!0})),r.dispatchEvent(new KeyboardEvent("keyup",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0})))}await U(15),(r.textContent||"").trim().length>0&&(console.log("[AGP:AutoPost] Strategy 3 succeeded."),f=!0)}catch(m){console.warn("[AGP:AutoPost] Strategy 3 error:",m)}return r.dispatchEvent(new Event("input",{bubbles:!0})),r.dispatchEvent(new Event("change",{bubbles:!0})),document.dispatchEvent(new Event("selectionchange")),await U(15),(r.textContent||"").trim().length>0}function Jo(t){const e=t.querySelector('[aria-label*="Photo/video" i], [aria-label*="Photo / video" i], [aria-label*="Add photo" i], [aria-label*="Add Photos" i], [aria-label*="Add photos or videos" i], [aria-label*="Add video" i], [aria-label*="Add Photos/videos" i], [aria-label*="ফটো/ভিডিও" i], [aria-label*="Photo" i], [aria-label*="Video" i], [aria-label*="ছবি/ভিডিও" i], [aria-label*="ছবি" i], [aria-label*="ভিডিও" i], div[aria-label*="Photo" i], div[aria-label*="Video" i], div[aria-label*="ফটো" i], div[aria-label*="ভিডিও" i]');if(e&&te(e))return e;const n=Array.from(t.querySelectorAll('[role="button"], button, div[tabindex="0"]'));for(const r of n){const s=(r.getAttribute("aria-label")||"").toLowerCase();if((s.includes("photo")||s.includes("video")||s.includes("image")||s.includes("ফটো")||s.includes("ছবি")||s.includes("ভিডিও"))&&te(r))return r}const o=Array.from(t.querySelectorAll("span, div, p"));for(const r of o){const s=(r.textContent||"").trim().toLowerCase();if(s==="add to your post"||s==="আপনার পোস্টে যোগ করুন"||s.includes("add to your post")){const a=r.closest("div"),i=(a==null?void 0:a.parentElement)||a,c=i==null?void 0:i.querySelector('[role="button"], img, svg');if(c&&te(c))return c.closest('[role="button"]')||c}}return null}function Zt(t){return t.querySelector('input[type="file"][accept*="video"]')||t.querySelector('input[type="file"][accept*="image"]')||t.querySelector('input[type="file"]')||document.querySelector('[role="dialog"] input[type="file"]')||document.querySelector('input[type="file"]')}function Oe(t){var n;const e=(t.textContent||"").toLowerCase();if(e.includes("your file can't be uploaded")||e.includes("file can't be uploaded")||e.includes("আপলোড করা যাবে না")||e.includes("আপলোড করা যায়নি")||e.includes("couldn't be uploaded")||e.includes("error uploading")){const o=Array.from(t.querySelectorAll("span, div, p")).find(r=>{const s=(r.textContent||"").toLowerCase();return s.includes("your file can't be uploaded")||s.includes("file can't be uploaded")||s.includes("আপলোড করা যাবে না")||s.includes("আপলোড করা যায়নি")||s.includes("couldn't be uploaded")});return((n=o==null?void 0:o.textContent)==null?void 0:n.trim())||"Your file can't be uploaded"}return null}async function Wo(t,e){if(!e||e.length===0)return!0;const n=e.some(l=>l.includes("video")||l.includes(".mp4")||l.includes(".mov")||l.includes(".webm")||l.includes("data:video"));let o=Zt(t);if(!o){const l=Jo(t);if(l){l.scrollIntoView({behavior:"instant",block:"center"}),l.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0})),l.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0,cancelable:!0})),l.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,cancelable:!0})),l.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0,cancelable:!0})),l.click();const d=Date.now();for(;Date.now()-d<2500&&(o=Zt(t),!o);)await U(20)}}if(!o)return console.warn("[AGP:AutoPost] File input not found inside create post modal."),!1;const r=new DataTransfer,s=await Promise.all(e.map((l,d)=>Fo(l,`media_${d+1}`)));for(const l of s)l&&l.size>0&&(r.items.add(l),console.log(`[AGP:AutoPost] Prepared media file: ${l.name} (${l.type}, ${l.size} bytes)`));if(r.files.length===0)return console.warn("[AGP:AutoPost] No valid non-empty files prepared from mediaList."),!1;o.files=r.files;const a=o._valueTracker;a&&a.setValue(""),o.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0})),o.dispatchEvent(new Event("input",{bubbles:!0,cancelable:!0}));const i=n?12e3:4e3,c=Date.now();for(;Date.now()-c<i;){const l=Oe(t);if(l)return console.warn("[AGP:AutoPost] Facebook upload error detected:",l),!1;if(!!t.querySelector('video, img[src*="blob:"], img[src*="data:"], img[src*="fbcdn.net"], div[aria-label*="Video" i], div[aria-label*="Photo" i], div[data-pagelet*="MediaViewer"], div[aria-label*="Edit" i], button[aria-label*="Edit" i], div[aria-label*="Remove" i], div[role="button"][aria-label*="Edit" i]')){console.log("[AGP:AutoPost] Media preview mounted immediately in composer.");break}await U(10)}return!Oe(t)}function eo(t,e){return t.includes("joined")||t.includes("যোগ দিয়েছেন")||t.includes("মেম্বার")||t.includes("member")||t.includes("leave group")||t.includes("গ্রুপ ত্যাগ")||e.includes("joined")||e.includes("যোগ দিয়েছেন")||e.includes("member")}function De(){const t=['[aria-label*="Join group" i]','[aria-label*="Join Group" i]','[aria-label*="গ্রুপে যোগ দিন" i]','[aria-label*="যোগ দিন" i]','[aria-label*="গ্রুপে যুক্ত হন" i]','[aria-label*="Request to join" i]','[aria-label*="Request to Join" i]','[aria-label*="গ্রুপে যোগ দেওয়ার অনুরোধ" i]','[aria-label*="যোগ দেওয়ার অনুরোধ" i]','[aria-label*="গ্রুপে যোগদানের অনুরোধ" i]','div[role="button"][aria-label*="Join" i]','div[role="button"][aria-label*="যোগ" i]','button[aria-label*="Join" i]','button[aria-label*="যোগ" i]'];for(const n of t){const o=document.querySelector(n);if(o&&te(o)){const r=(o.innerText||o.textContent||"").trim().toLowerCase(),s=(o.getAttribute("aria-label")||"").toLowerCase();if(!eo(r,s))return o}}const e=Array.from(document.querySelectorAll('div[role="main"] [role="button"], div[role="main"] button, div[role="region"] [role="button"], [role="banner"] [role="button"], div[role="button"], button'));for(const n of e){if(!te(n))continue;const o=(n.innerText||n.textContent||"").trim().toLowerCase(),r=(n.getAttribute("aria-label")||"").toLowerCase();if(!eo(o,r)&&(o==="join group"||o==="join"||o==="গ্রুপে যোগ দিন"||o==="যোগ দিন"||o==="গ্রুপে যুক্ত হন"||o==="request to join"||o==="request to join group"||o==="যোগ দেওয়ার অনুরোধ"||o==="যোগ দেওয়ার অনুরোধ জানান"||o.includes("join group")||o.includes("গ্রুপে যোগ দিন")))return n}return null}function _t(){const t=!!De(),e=!!Ne();return t&&!e}async function to(){const t=De();if(!t)return{success:!1,isInstantMember:!1,reason:"Join button not found"};console.log("[AGP:AutoJoin] Found Join button. Executing automatic join click..."),O="⚡ Auto-joining group (গ্রুপে যোগ দেওয়া হচ্ছে)...",G(),M("⚡ Auto-joining group...",!0),t.scrollIntoView({behavior:"instant",block:"center"}),await U(10);const e={bubbles:!0,cancelable:!0,view:window};t.dispatchEvent(new PointerEvent("pointerdown",e)),t.dispatchEvent(new MouseEvent("mousedown",e)),t.dispatchEvent(new PointerEvent("pointerup",e)),t.dispatchEvent(new MouseEvent("mouseup",e)),t.click();const n=Date.now();let o=null;for(;Date.now()-n<350&&(o=document.querySelector('div[role="dialog"]'),!(o&&te(o)));){const c=Ne();if(c&&te(c))break;await U(15)}if(o&&te(o)){console.log("[AGP:AutoJoin] Rules agreement or membership question dialog detected. Handling...");const c=Array.from(o.querySelectorAll('input[type="checkbox"], div[role="checkbox"]'));for(const u of c)u.getAttribute("aria-checked")==="true"||u.checked||u.click();const l=Array.from(o.querySelectorAll('textarea, input[type="text"]'));for(const u of l)(!u.value||!u.value.trim())&&(u.value="Agree",u.dispatchEvent(new Event("input",{bubbles:!0})),u.dispatchEvent(new Event("change",{bubbles:!0})));const d=Array.from(o.querySelectorAll('button, [role="button"], input[type="submit"]')).find(u=>{const b=(u.innerText||u.textContent||u.getAttribute("aria-label")||"").trim().toLowerCase();return b==="submit"||b==="send"||b==="agree"||b==="confirm"||b==="সাবমিট"||b==="জমা দিন"||b==="সম্মতি দিচ্ছি"||b.includes("submit")||b.includes("সাবমিট")});if(d&&te(d)){console.log("[AGP:AutoJoin] Clicking modal submit button..."),d.click();const u=Date.now();for(;Date.now()-u<600&&document.querySelector('div[role="dialog"]');)await U(20)}}const r=Date.now();for(;Date.now()-r<3500;){let c=Ne();if(c&&te(c))return console.log("[AGP:AutoJoin] Instant membership granted! Composer available."),M("✅ Joined group! Post box ready.",!0),{success:!0,isInstantMember:!0,reason:"Instant member"};Date.now()-r>1e3&&window.scrollY<200&&window.scrollBy({top:300,behavior:"instant"}),await U(25)}const s=(document.body?document.body.innerText:"").toLowerCase();return s.includes("requested")||s.includes("pending")||s.includes("অনুরোধ করা হয়েছে")||s.includes("cancel request")||s.includes("অনুরোধ বাতিল")?(console.log("[AGP:AutoJoin] Join request sent (Pending admin approval)."),{success:!0,isInstantMember:!1,reason:"Join request pending admin approval"}):Ne()?{success:!0,isInstantMember:!0,reason:"Instant member"}:De()?{success:!0,isInstantMember:!1,reason:"Join submitted"}:(console.log("[AGP:AutoJoin] Join button disappeared. Group is joined, proceeding to post..."),{success:!0,isInstantMember:!0,reason:"Instant member"})}function oo(){if(Ye())return{forbidden:!0,reason:"Group unavailable or broken link"};const t=(document.body?document.body.innerText:"").toLowerCase();return t.includes("only admins can post")||t.includes("শুধুমাত্র অ্যাডমিনরা এই গ্রুপে পোস্ট করতে পারবেন")||t.includes("শুধুমাত্র অ্যাডমিনরা পোস্ট করতে পারবেন")||t.includes("posting is paused for this group")||t.includes("posting is turned off")||t.includes("এই গ্রুপের জন্য পোস্ট করা সাময়িকভাবে বন্ধ আছে")||t.includes("posting in this group has been paused")?{forbidden:!0,reason:"Posting is paused or admin-only in this group"}:t.includes("you can't post to this group")||t.includes("you've been temporarily blocked")||t.includes("you have been muted")||t.includes("আপনার অ্যাকাউন্ট সাময়িকভাবে ব্লক করা হয়েছে")||t.includes("আপনাকে এই গ্রুপে পোস্ট করা থেকে সাময়িকভাবে নিষিদ্ধ করা হয়েছে")?{forbidden:!0,reason:"Account restricted or muted in this group"}:{forbidden:!1,reason:""}}let no=!1;async function Y(t){if(!(no||!(w!=null&&w.queueItem))){no=!0,Q=!1,D&&(clearInterval(D),D=null);try{window.onbeforeunload=null}catch{}console.warn(`[AGP:AutoPost] Auto-skipping group: ${t}`),O=`⚡ Auto-skipping: ${t}...`,G(),M(`⚡ Auto-skipping: ${t}...`,!0),await U(200),chrome.runtime.sendMessage({type:"SKIP_CURRENT_ITEM",payload:{itemId:w.queueItem.id,reason:t}})}}async function Ho(t,e=15e3){const n=Date.now();let o=0;for(;Date.now()-n<e;){const r=[t,...Array.from(document.querySelectorAll('[role="dialog"]'))];for(const s of r){const a=Array.from(s.querySelectorAll('[role="button"], button'));for(const i of a){const c=(i.getAttribute("aria-label")||"").toLowerCase().trim(),l=(i.textContent||"").toLowerCase().trim(),d=i.getAttribute("aria-disabled")==="true"||i.disabled||i.classList.contains("aria-disabled")||i.classList.contains("disabled");if((c==="post"||c==="publish"||c==="submit"||c==="submit for review"||c==="পোস্ট"||c==="সাবমিট"||c==="পোস্ট করুন"||c==="সাবমিট করুন"||c.includes("post to group")||c.includes("গ্রুপে পোস্ট")||c.includes("submit for review")||c.includes("রিভিউ")||l==="post"||l==="পোস্ট"||l==="publish"||l==="submit"||l==="submit for review"||l==="পোস্ট করুন"||l==="সাবমিট"||l==="সাবমিট করুন"||l==="post to group"||l==="পাবলিশ"||l.includes("submit for review")||l.includes("রিভিউয়ের জন্য সাবমিট"))&&!d)return i.scrollIntoView({behavior:"instant",block:"center"}),i.style.outline="3px solid #10b981",i.dispatchEvent(new PointerEvent("pointerdown",{bubbles:!0,cancelable:!0})),i.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0,cancelable:!0})),i.dispatchEvent(new PointerEvent("pointerup",{bubbles:!0,cancelable:!0})),i.dispatchEvent(new MouseEvent("mouseup",{bubbles:!0,cancelable:!0})),i.click(),!0}}if(Date.now()-o>2500){o=Date.now();const s=Math.round((Date.now()-n)/1e3);s>=4&&(O=`⚡ Step 4/4: Media processing & uploading (${s}s)...`,G())}await U(20)}return!1}async function pt(){if(Q||!w||!w.queueItem)return;if(Ye()){await Y("Group unavailable on Facebook");return}if(!w.isGroupMatch){await Y("Wrong group URL detected");return}if(_t()||De()){Q=!0,O="⚡ Step 0/4: Auto-joining group (গ্রুপে যোগ দেওয়া হচ্ছে)...",G(),M("⚡ Auto-joining group...",!0);const e=await to();if(e.isInstantMember)console.log("[AGP:AutoPost] Successfully auto-joined group! Proceeding with post immediately..."),O="⚡ Joined! Step 1/4: Opening Post Box...",G(),M("✅ Joined! Now opening post box...",!0);else{O=`⚡ ${e.reason}. Advancing to next group...`,G(),M(`⚡ ${e.reason}`,!0),await U(100),await Y(e.reason);return}}const t=oo();if(t.forbidden){await Y(t.reason);return}Q=!0,O="⚡ Step 1/4: Opening Post Box...",G();try{const e=await zo();if(!e){if(Ye()){await Y("Group unavailable on Facebook");return}await Y("Could not open Facebook post box");return}O="⚡ Step 2/4: Typing caption...",G();const n=w.caption||w.formattedPost||"";n&&n.trim()&&(await Xt(e,n)||(console.warn("[AGP:AutoPost] Caption injection check returned false, but clipboard has caption. Proceeding to photos..."),M("⚠️ Caption in clipboard (Ctrl+V ready)")));const o=w.media||[],r=o.some(p=>p.includes("video")||p.includes(".mp4")||p.includes(".mov")||p.includes(".webm")||p.includes("data:video")),s=o.filter(p=>!p.includes("video")&&!p.includes(".mp4")&&!p.includes(".mov")&&!p.includes(".webm")&&!p.includes("data:video")).length,a=o.length-s;if(o.length>0){let p=`${o.length} files`;if(s>0&&a>0?p=`${s} photos + ${a} video`:a>0?p=`${a} video`:p=`${s} photos`,O=`⚡ Step 3/4: Attaching ${p}...`,G(),!await Wo(e,o)){const S=Oe(e);if(S){console.warn("[AGP:AutoPost] Upload rejected by Facebook:",S),O=`❌ Upload failed: ${S}`,G(),await Y(`Media rejected by Facebook: ${S}`);return}console.warn("[AGP:AutoPost] Media attachment warning - continuing post workflow")}}if(O=r?"⚡ Step 4/4: Video uploading & submitting post... (ভিডিও আপলোড হচ্ছে)":"⚡ Step 4/4: Submitting post...",G(),!await Ho(e,r?9e4:2e4)){const p=Oe(e);p?await Y(`Facebook upload error: ${p}`):await Y("Post button disabled or timed out");return}O="⚡ Post submitted! Shifting to next group...",G();const l=Date.now();let d=!1;const u=r?25e3:3500;for(;Date.now()-l<u;){const p=Be();if(!p){console.log("[AGP:AutoPost] Composer dialog closed cleanly. Post submitted successfully!"),d=!0;break}const m=Oe(p);if(m){console.warn("[AGP:AutoPost] Post aborted due to Facebook file error:",m),O=`❌ Upload error: ${m}`,G(),await Y(`Facebook upload error: ${m}`);return}const S=Array.from(document.querySelectorAll('[role="dialog"]'));for(const y of S){const E=(y.textContent||"").toLowerCase();if(E.includes("pending")||E.includes("approval")||E.includes("admin")||E.includes("অনুমোদনের অপেক্ষায়")||E.includes("অনুমোদন")||E.includes("সাবমিট করা হয়েছে")||E.includes("আপনার পোস্টটি জমা দেওয়া হয়েছে")){const T=Array.from(y.querySelectorAll('[role="button"], button')).find(N=>{const I=(N.textContent||"").toLowerCase().trim();return I==="done"||I==="ok"||I==="ঠিক আছে"||I==="close"||I==="বন্ধ করুন"||I==="got it"});if(T){T.click(),d=!0;break}}}if(d)break;await U(10)}if(!d){const p=Be();if(p){const m=Oe(p);if(m){console.warn("[AGP:AutoPost] Facebook upload error remained:",m),O=`❌ Upload failed: ${m}`,G(),await Y(`Facebook upload error: ${m}`);return}if(!!p.querySelector('[aria-disabled="true"], button[disabled]')){console.warn("[AGP:AutoPost] Post button remained disabled after wait"),O="❌ Post button stayed disabled",G(),await Y("Post button disabled or upload blocked by Facebook");return}}}try{window.onbeforeunload=null}catch{}O="⚡ Post submitted! Moving to next group...",G();const b=w.queueIndex,f=w.totalQueueItems,g=(w.postedCount||b-1)+1;M(`⚡ Auto-Posted to Group #${b}! (${g}/${f} done)`),chrome.runtime.sendMessage({type:"MARK_AS_POSTED",payload:{itemId:w.queueItem.id}})}catch(e){const n=e instanceof Error?e.message:String(e);console.log("[AGP:AutoPost] Routine caught error, auto-skipping:",n),await Y(n||"Posting failed")}}function Vo(){if(he||Q||!(w!=null&&w.queueItem))return;if(Ye()){O="⚡ Group unavailable on Facebook. Auto-skipping...",G(),setTimeout(()=>{Y("Group unavailable on Facebook")},10);return}if(!w.isGroupMatch){O="⚡ Wrong group detected. Auto-skipping to next group...",G(),M("⚠️ Wrong group detected. Auto-skipping...",!0),setTimeout(()=>{he||Y("Wrong group URL detected")},20);return}if(_t()||De()){O="⚡ Not joined: Auto-joining group...",G(),M("⚡ Auto-joining group...",!0),D&&clearInterval(D),D=null,setTimeout(()=>{!he&&!Q&&pt()},0);return}const t=oo();if(t.forbidden){O=`⚡ Cannot post: ${t.reason}. Auto-skipping...`,G(),setTimeout(()=>{Y(t.reason)},20);return}O="⚡ Instant Auto-Posting in progress...",G(),D&&clearInterval(D),D=null,setTimeout(()=>{!he&&!Q&&pt()},0)}function G(){var g,p,m,S,y,E,T,N,I,oe,z,de,R,X,ae,Ie,_e,se,Z,ye,xe;if(ut||!_)return;const t=Ae(),e=qe();if(!t.isGroupPage){const $=!!(Me!=null&&Me.isRunning),H=!!(Me!=null&&Me.isPaused),ge=0,x=0,k=0;_.innerHTML=`
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

      ${Ce?`
        <div class="launcher-pill" id="agp-launcher-btn" title="Click to open AI Group Poster Assistant">
          <div class="badge-logo">AI</div>
          <span class="launcher-title">AI Group Poster</span>
          ${$?`
            <span class="status-pill running">
              <span class="pulse-dot"></span>
              Auto-Posting (${ge}/${x})
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
                  <span>Posting: <strong>${ge} of ${x}</strong> Groups</span>
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
    `,(g=_.getElementById("agp-launcher-btn"))==null||g.addEventListener("click",P=>{var C;(C=P.target)!=null&&C.closest("#agp-launcher-close")||(Ce=!1,G())}),(p=_.getElementById("agp-toggle-btn"))==null||p.addEventListener("click",()=>{Ce=!0,G()}),(m=_.getElementById("agp-close-btn"))==null||m.addEventListener("click",P=>{P.stopPropagation(),It()}),(S=_.getElementById("agp-launcher-close"))==null||S.addEventListener("click",P=>{P.stopPropagation(),It()}),(y=_.getElementById("btn-focus-tab"))==null||y.addEventListener("click",()=>{}),(E=_.getElementById("btn-pause-queue"))==null||E.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"PAUSE_QUEUE"},()=>{M("Auto-posting paused"),Ke()})}),(T=_.getElementById("btn-resume-queue"))==null||T.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"RESUME_QUEUE"},()=>{M("Resuming auto-posting..."),Ke()})}),(N=_.getElementById("btn-start-queue"))==null||N.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"START_QUEUE"},()=>{M("Starting auto-posting queue..."),Ke()})}),(I=_.getElementById("btn-sync-groups"))==null||I.addEventListener("click",()=>{window.location.href="https://www.facebook.com/groups/joins/?nav_source=tab"}),(oe=_.getElementById("btn-open-dashboard"))==null||oe.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})});return}const n=w==null?void 0:w.group,o=w==null?void 0:w.post,r=(w==null?void 0:w.queueIndex)||1,s=(w==null?void 0:w.totalQueueItems)||1,a=(w==null?void 0:w.postedCount)??Math.max(0,r-1),i=s>0?Math.round(a/s*100):0,c=(w==null?void 0:w.formattedPost)||(o==null?void 0:o.description)||"",l=(w==null?void 0:w.caption)||(o==null?void 0:o.caption)||(o==null?void 0:o.description)||"",d=w!=null&&w.media?w.media.length:o!=null&&o.images?o.images.length:0,u=w?w.isGroupMatch:!0,b=(w==null?void 0:w.expectedGroupName)||(n==null?void 0:n.name)||"Expected Group",f=t.groupName||"Current Page";_.innerHTML=`
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
        display: ${Ce?"none":"block"};
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
            ${Ce?"▲ Expand":"▼ Minimize"}
          </button>
          <button class="icon-btn close-btn" id="agp-close-btn" title="Stop & Close (ডাইরেক্ট অফ)">✕</button>
        </div>
      </div>

      <div class="panel-body">
        ${u?"":`
          <div class="warning-box">
            <strong>⚠️ Wrong Group Detected!</strong><br/>
            Expected: <strong>${b}</strong><br/>
            Current page: <em>${f}</em><br/>
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
            <span>${Q?"Auto-Posting in Progress":he?"Auto-Pilot Paused":"Auto-Pilot Running"}</span>
          </div>
          <div class="autopost-status-text">${O}</div>
        </div>

        <div class="meta-row">
          <span class="group-name" title="${b}">${b}</span>
          <span class="queue-badge">Queue ${r} / ${s}</span>
        </div>

        <div class="post-card">
          <div class="post-title">${(o==null?void 0:o.productName)||(o==null?void 0:o.title)||"Prepared Listing"}</div>
          ${d>0?((o==null?void 0:o.images)||(w==null?void 0:w.media)||[]).some($=>$.includes("video")||$.includes("data:video")||$.endsWith(".mp4")||$.endsWith(".webm")||$.endsWith(".mov"))?`<div class="media-badge" style="background:#065f46;color:#6ee7b7;border:1px solid #059669;">🎬 Video Attached (${d})</div>`:`<div class="media-badge">📷 ${d} Photos attached</div>`:""}
          <div class="post-preview">${l||c||"No prepared caption."}</div>
        </div>

        <button class="auto-btn ${Q?"running":""}" id="btn-auto-post">
          ${Q?"⏸️ Pause Auto-Posting":"🤖 Auto-Post Now"}
        </button>

        ${_t()||De()?`<button class="action-btn" id="btn-auto-join" style="background:#2563eb;color:#ffffff;font-weight:700;margin-top:6px;width:100%;justify-content:center;box-shadow:0 2px 4px rgba(37,99,235,0.3);">
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
  `,(z=_.getElementById("agp-toggle-btn"))==null||z.addEventListener("click",()=>{Ce=!Ce,G()}),(de=_.getElementById("agp-close-btn"))==null||de.addEventListener("click",$=>{$.stopPropagation(),It()}),(R=_.getElementById("btn-auto-post"))==null||R.addEventListener("click",()=>{Q?(he=!0,Q=!1,O="Auto-posting paused by user",D&&clearInterval(D),M("Auto-posting paused"),G()):(he=!1,D&&clearInterval(D),pt())}),(X=_.getElementById("btn-auto-join"))==null||X.addEventListener("click",async()=>{const $=_==null?void 0:_.getElementById("btn-auto-join");$&&($.textContent="⏳ Joining..."),(await to()).isInstantMember&&pt()}),(ae=_.getElementById("btn-toggle-caption"))==null||ae.addEventListener("click",()=>{dt=!dt,G()}),(Ie=_.getElementById("btn-copy-caption"))==null||Ie.addEventListener("click",async()=>{const H=yt(l||c).replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),ge=Et(H);await Qt(H,ge)&&M("📋 Caption & Design copied (Ctrl+V ready)!")}),(_e=_.getElementById("btn-paste-caption"))==null||_e.addEventListener("click",async()=>{const H=yt(l||c).replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),ge=document.querySelector('[role="dialog"]')||document.body;M("✨ Pasting caption with exact styling..."),await Xt(ge,H)?M("✅ Caption pasted with exact design!"):M("⚠️ Click inside post box and press Ctrl+V",!0)}),(se=_.getElementById("btn-mark-posted"))==null||se.addEventListener("click",()=>{var $;D&&clearInterval(D);try{window.onbeforeunload=null}catch{}chrome.runtime.sendMessage({type:"MARK_AS_POSTED",payload:{itemId:($=w==null?void 0:w.queueItem)==null?void 0:$.id}},()=>{M("Marked as Posted! Moving to next group...")})}),(Z=_.getElementById("btn-skip"))==null||Z.addEventListener("click",()=>{var $;D&&clearInterval(D);try{window.onbeforeunload=null}catch{}chrome.runtime.sendMessage({type:"SKIP_CURRENT_ITEM",payload:{itemId:($=w==null?void 0:w.queueItem)==null?void 0:$.id,reason:"Skipped by user"}},()=>{M("Skipped group. Moving to next...")})}),(ye=_.getElementById("btn-pause"))==null||ye.addEventListener("click",()=>{D&&clearInterval(D),he=!0,Q=!1,chrome.runtime.sendMessage({type:"PAUSE_QUEUE"},()=>{M("Posting Session Paused")})}),(xe=_.getElementById("btn-open-dashboard"))==null||xe.addEventListener("click",()=>{chrome.runtime.sendMessage({type:"OPEN_DASHBOARD"})})}function Yo(){ut||(we||(we=document.createElement("div"),we.id="ai-group-poster-dock-root",document.body.appendChild(we),_=we.attachShadow({mode:"open"})),G())}function Ke(){var n;if(ut)return;const t=Ae(),e=qe();e.isLoggedIn&&chrome.runtime.sendMessage({type:"FB_USER_PROFILE_DETECTED",payload:e}),t.isGroupPage?(chrome.runtime.sendMessage({type:"FB_PAGE_DETECTED",payload:{url:t.canonicalUrl,groupIdOrSlug:t.groupIdOrSlug,pageTitle:t.groupName}}),chrome.runtime.sendMessage({type:"GET_ACTIVE_POST_FOR_TAB",payload:{url:t.canonicalUrl}},o=>{chrome.runtime.lastError||o!=null&&o.isUserTab||o&&o.payload&&(w=o.payload,Yo(),w&&w.queueItem&&Vo())})):Mo()&&(console.log("[AGP:Content] Facebook Group Search Page detected."),Pt(),typeof chrome<"u"&&((n=chrome.storage)!=null&&n.local)&&chrome.storage.local.get(["agp_pending_auto_join","agp_auto_join_config"],o=>{const r=o==null?void 0:o.agp_pending_auto_join,s=o==null?void 0:o.agp_auto_join_config;if(r&&r.active&&Date.now()-(r.requestedAt||0)<9e4){console.log("[AGP:Content] Detected pending Auto-Join request. Starting auto-joiner..."),chrome.storage.local.remove("agp_pending_auto_join");const a=r.config||s||{searchUrl:window.location.href,delaySec:0,maxGroups:0,autoAnswerQuestions:!0,defaultAnswer:"Yes, I agree to the group rules and guidelines.",saveToGroups:!0};Pt(a),setTimeout(()=>{V.getInstance().start(a)},1500)}}))}let Qe=!1;function ro(t=0,e){if(typeof document>"u"||!document.body)return;Qe=!1;const n=document.getElementById("agp-sync-window-overlay");n&&n.remove();const o=document.createElement("div");o.id="agp-sync-window-overlay",o.innerHTML=`
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
  `,document.body.appendChild(o);const r=document.getElementById("agp-sync-finish-btn");r&&(r.onclick=()=>{Qe=!0,r.innerHTML="<span>Saving...</span>",r.style.opacity="0.7",r.style.pointerEvents="none"});const s=document.getElementById("agp-sync-cancel-btn");s&&(s.onclick=()=>{Qe=!0,Xe()})}function ft(t,e){const n=document.getElementById("agp-sync-counter-badge");n&&(n.innerText=e?`${t} / ${e} Found`:`${t} Found`);const o=document.getElementById("agp-sync-btn-count");o&&(o.innerText=String(t));const r=document.getElementById("agp-sync-status-text");r&&t>0&&(r.innerText=`Found ${t} groups. Scrolling for more...`)}function Xe(){const t=document.getElementById("agp-sync-window-overlay");t&&t.remove()}let gt=null;chrome.runtime.onMessage.addListener((t,e,n)=>{if(t.type==="START_GROUP_DISCOVERY")return(async()=>{try{console.log("[AGP:Content] Starting deep group discovery scan on current Facebook page...");const o=qe(),r=o.userId||o.name||void 0;ro(),io();const s=await Mt({maxRounds:350,stagnantLimit:35,scrollDelayMs:300,accountContext:r,shouldStop:()=>Qe,onBatchDiscovered:async(l,d,u)=>{gt=u;const b=bt(),f=[...l];for(const g of b)f.find(p=>p.groupId.toLowerCase()===g.groupId.toLowerCase())||f.push(g);ft(f.length);try{chrome.runtime.sendMessage({type:"GROUP_BATCH_DISCOVERED",payload:{liveGroups:f,verifiedCount:f.length,duplicatesRemoved:(u==null?void 0:u.duplicatesRemoved)||0,debugMetrics:u}})}catch{}try{await nt(f,{syncMode:"merge",accountContext:r})}catch(g){console.warn("[AGP:Content] Progressive batch merge error:",g)}},onProgress:(l,d,u,b)=>{gt=b;const f=fe.size,g=Math.max(l,f);ft(g,u);try{chrome.runtime.sendMessage({type:"GROUP_DISCOVERY_PROGRESS",payload:{foundCount:g,status:d,targetCount:u,debugMetrics:b}})}catch{}}}),a=bt();if(a.length>0)try{await nt(a,{syncMode:"merge",accountContext:r})}catch{}const i=[...s.groups];for(const l of a)i.find(d=>d.groupId.toLowerCase()===l.groupId.toLowerCase())||i.push(l);const c=Math.max(s.totalFound,i.length);gt=s.debugMetrics,Xe(),n({success:!0,payload:{groups:i,sourceUrl:window.location.href,isLoggedIn:s.isLoggedIn,totalFoundOnPage:c,profile:o,outcome:s.outcome,completionReason:s.completionReason,isPartial:s.isPartial,debugMetrics:s.debugMetrics}})}catch(o){Xe();const r=o instanceof Error?o.message:String(o);n({success:!1,error:r})}})(),!0;if(t.type==="CANCEL_GROUP_DISCOVERY")return Xe(),M("AI Group Poster: Discovery cancelled.",!0),n({success:!0}),!1;if(t.type==="GET_DEBUG_METRICS")return n({success:!0,debugMetrics:gt}),!1;if(t.type==="CHECK_FACEBOOK_SESSION"){const o=et(),r=qe();return n({success:!0,isLoggedIn:o,profile:r,currentUrl:window.location.href}),!1}if(t.type==="GET_FACEBOOK_USER_INFO")return(async()=>{try{const o=et(),r=qe();let a=ht(r.userId||r.name||void 0).items;n({success:!0,isLoggedIn:o,profile:r,groups:a,totalGroups:a.length,currentUrl:window.location.href})}catch(o){const r=o instanceof Error?o.message:String(o);n({success:!1,error:r})}})(),!0;if(t.type==="START_AUTO_JOIN"||t.type==="AUTO_JOIN_START_ON_PAGE")return(async()=>{try{const o=t.payload||{},r={...o,delaySec:typeof o.delaySec=="number"?o.delaySec:0};Pt(r);const s=await V.getInstance().start(r);n({success:!0,state:s})}catch(o){const r=o instanceof Error?o.message:String(o);n({success:!1,error:r})}})(),!0;if(t.type==="PAUSE_AUTO_JOIN"||t.type==="AUTO_JOIN_PAUSE_ON_PAGE")return V.getInstance().pause(),n({success:!0}),!1;if(t.type==="RESUME_AUTO_JOIN"||t.type==="AUTO_JOIN_RESUME_ON_PAGE")return V.getInstance().resume(),n({success:!0}),!1;if(t.type==="STOP_AUTO_JOIN"||t.type==="AUTO_JOIN_STOP_ON_PAGE")return V.getInstance().stop(),n({success:!0}),!1;if(t.type==="GET_AUTO_JOIN_STATE"){const o=V.getInstance().getState();return n({success:!0,state:o}),!1}});let Lt=!1,fe=new Map;function io(){if(typeof window>"u"||window.__agpFetchIntercepted)return;window.__agpFetchIntercepted=!0;const t=window.fetch;window.fetch=async function(...e){var o;const n=await t.apply(this,e);try{const r=typeof e[0]=="string"?e[0]:((o=e[0])==null?void 0:o.url)||"";(r.includes("/api/graphql")||r.includes("graphql"))&&n.clone().text().then(a=>{a.includes("Group")&&(a.includes("/groups/")||a.includes('__typename":"Group"'))&&Ko(a)}).catch(()=>{})}catch{}return n},console.log("[AGP:Content] GraphQL response interceptor installed")}function Ko(t){try{const e=/"__typename"\s*:\s*"Group"[^}]*?"id"\s*:\s*"(\d+)"[^}]*?"name"\s*:\s*"([^"]+)"/g;let n;for(;(n=e.exec(t))!==null;){const r=n[1],s=n[2].trim();r&&s&&s.length>=2&&fe.set(r,{name:s,id:r})}const o=/"node"\s*:\s*\{\s*"__typename"\s*:\s*"Group"\s*,\s*"id"\s*:\s*"(\d+)"\s*,\s*"name"\s*:\s*"([^"]+)"/g;for(;(n=o.exec(t))!==null;){const r=n[1],s=n[2].trim();r&&s&&s.length>=2&&fe.set(r,{name:s,id:r})}fe.size>0&&console.log(`[AGP:Content] GraphQL interceptor: total ${fe.size} groups captured`)}catch{}}function bt(){const t=[];for(const[e,n]of fe)t.push({name:n.name,url:`https://www.facebook.com/groups/${e}/`,groupId:e,privacy:"UNKNOWN",imageUrl:n.imageUrl});return t}async function so(){const t=window.location.href.toLowerCase();if((t.includes("/groups/joins")||t.includes("category=membership"))&&!Lt){Lt=!0,console.log("[AGP:Content] Detected Your Groups page (/groups/joins/)! Starting full auto-scan of all joined groups..."),M("AI Group Poster: Auto-scanning your joined groups..."),io(),ro(0);try{const e=await Mt({maxRounds:350,stagnantLimit:35,scrollDelayMs:300,shouldStop:()=>Qe,onBatchDiscovered:async(r,s)=>{const a=bt(),i=[...r];for(const c of a)i.find(l=>l.groupId===c.groupId)||i.push(c);ft(i.length);try{await nt(i,{syncMode:"merge"})}catch(c){console.warn("[AGP:Content] Batch save err:",c)}},onProgress:(r,s,a)=>{const i=fe.size,c=Math.max(r,i);ft(c,a),M(`AI Group Poster: Found ${c}${a?` / ${a}`:""} groups...`);try{chrome.runtime.sendMessage({type:"GROUP_DISCOVERY_PROGRESS",payload:{foundCount:c,status:s,targetCount:a}})}catch{}}}),n=bt();if(n.length>0)try{await nt(n,{syncMode:"merge"}),console.log(`[AGP:Content] Final merge: added ${n.length} intercepted groups`)}catch{}const o=Math.max(e.totalFound,fe.size);M(`AI Group Poster: Sync complete! Found ${o} groups.`)}catch(e){console.warn("[AGP:Content] Auto-scan err:",e)}finally{Lt=!1,setTimeout(Xe,1500)}}}window.addEventListener("message",t=>{if(!(t.source!==window||!t.data)){if(t.data.type==="AGP_MAIN_GRAPHQL_GROUPS"&&Array.isArray(t.data.groups)){for(const e of t.data.groups)e.id&&e.name&&fe.set(e.id,{name:e.name,id:e.id});console.log(`[AGP:Content] Intercepted ${fe.size} groups from MAIN world GraphQL`)}t.data.type==="AGP_MAIN_URL_CHANGED"&&Ze()}}),chrome.runtime.onMessage.addListener(t=>{t&&t.type==="AGP_NAVIGATE_TO_GROUP"&&Ze()}),lo(),Ke(),setTimeout(so,100);let ao=window.location.href;function Ze(){window.location.href!==ao&&(ao=window.location.href,lo(),Ke(),setTimeout(so,100))}function lo(){const t=window.location.hostname.toLowerCase();if(t.startsWith("m.")||t.includes("mbasic.")){if(document.getElementById("agp-mobile-banner"))return;const e=document.createElement("div");e.id="agp-mobile-banner",e.style.cssText=`
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
    `,document.body.appendChild(e);const n=document.getElementById("agp-switch-desktop-btn");n&&(n.onclick=()=>{window.location.href=window.location.href.replace("://m.","://www.").replace("://mbasic.","://www.")});const o=document.getElementById("agp-close-banner-btn");o&&(o.onclick=()=>e.remove())}}window.addEventListener("popstate",Ze,{passive:!0}),window.addEventListener("hashchange",Ze,{passive:!0}),setInterval(Ze,1e3),setInterval(()=>{if(Q||w&&w.queueItem)try{chrome.runtime.sendMessage({type:"KEEPALIVE_PING"},()=>{chrome.runtime.lastError})}catch{}},1e4)})();
