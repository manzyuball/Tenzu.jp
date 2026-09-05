const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const root=document.documentElement;
const defaults=[
{name:"Google",url:"https://www.google.com/"},{name:"YouTube",url:"https://www.youtube.com/"},{name:"X",url:"https://x.com/"},{name:"ChatGPT",url:"https://chatgpt.com/"},{name:"Gemini",url:"https://gemini.google.com/"},
{name:"Wikipedia",url:"https://ja.wikipedia.org/"},{name:"GitHub",url:"https://github.com/"},{name:"Reddit",url:"https://www.reddit.com/"},{name:"Maps",url:"https://maps.google.com/"},{name:"News",url:"https://news.google.com/"}
];
const engines={
brave:{m:"B",u:q=>"https://search.brave.com/search?q="+encodeURIComponent(q)},
google:{m:"G",u:q=>"https://www.google.com/search?q="+encodeURIComponent(q)},
duck:{m:"D",u:q=>"https://duckduckgo.com/?q="+encodeURIComponent(q)},
startpage:{m:"S",u:q=>"https://www.startpage.com/sp/search?query="+encodeURIComponent(q)},
bing:{m:"B",u:q=>"https://www.bing.com/search?q="+encodeURIComponent(q)}
};
const cfg=(k,d)=>localStorage.getItem("lum."+k)??d, save=(k,v)=>localStorage.setItem("lum."+k,String(v));
function getJ(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}}
function setJ(k,v){localStorage.setItem(k,JSON.stringify(v))}
let shortcuts=getJ("m3e.shortcuts",defaults),editing=false,currentWall=cfg("currentWall",""),timer=null,toastTimer=null;

function clock(){const n=new Date();$("#time").textContent=n.toLocaleTimeString("ja-JP",{hour:"2-digit",minute:"2-digit"});$("#date").textContent=n.toLocaleDateString("ja-JP",{month:"long",day:"numeric",weekday:"short"})}
clock();setInterval(clock,20000);

function host(u){try{return new URL(/^https?:\/\//i.test(u)?u:"https://"+u).hostname}catch{return""}}
function origin(u){try{return new URL(/^https?:\/\//i.test(u)?u:"https://"+u).origin}catch{return""}}
const gf=u=>"https://www.google.com/s2/favicons?domain_url="+encodeURIComponent(u)+"&sz=128";
const df=u=>host(u)?"https://icons.duckduckgo.com/ip3/"+host(u)+".ico":"";
const direct=u=>origin(u)?origin(u)+"/favicon.ico":"";
function iconSources(it){
 if(it.icon)return[it.icon];
 const p=cfg("iconProvider","auto");
 if(p==="letter")return[];
 if(p==="google")return[gf(it.url)];
 if(p==="duck")return[df(it.url),gf(it.url)].filter(Boolean);
 return[direct(it.url),gf(it.url)].filter(Boolean)
}
function iconNode(it){
 const box=document.createElement("span");box.className="site-icon";
 const init=document.createElement("span");init.className="initial";init.textContent=([...(it.name||"?")][0]||"?").toUpperCase();box.append(init);
 const srcs=iconSources(it);if(!srcs.length)return box;
 let i=0;const im=document.createElement("img");im.alt="";im.decoding="async";im.referrerPolicy="no-referrer";
 const next=()=>{if(i>=srcs.length){im.remove();init.style.display="";return}im.src=srcs[i++]};
 im.onload=()=>init.style.display="none";im.onerror=next;box.append(im);next();return box
}
function render(){
 const g=$("#grid");g.innerHTML="";
 shortcuts.slice(0,21).forEach((it,i)=>{
   const el=document.createElement(editing?"button":"a");el.className="shortcut";
   if(editing){el.type="button";el.onclick=()=>edit(i)}else{el.href=it.url;el.rel="noopener"}
   const ic=iconNode(it);if(editing){const d=document.createElement("span");d.className="edit-dot";d.textContent="✎";ic.append(d)}
   const lab=document.createElement("span");lab.className="short-label";lab.textContent=it.name;if(cfg("showLabels","1")==="0")lab.style.display="none";
   el.append(ic,lab);g.append(el)
 });
 $("#editBtn").textContent=editing?"完了":"編集"
}
render();
$("#editBtn").onclick=()=>{editing=!editing;render()};$("#addBtn").onclick=()=>edit(null);
function edit(i){
 const e=Number.isInteger(i);$("#formTitle").textContent=e?"サイトを編集":"サイトを追加";$("#shortcutIndex").value=e?i:"";$("#shortcutName").value=e?shortcuts[i].name:"";$("#shortcutUrl").value=e?shortcuts[i].url:"";$("#shortcutIcon").value=e?(shortcuts[i].icon||""):"";$("#deleteShortcut").hidden=!e;openSheet($("#shortcutSheet"))
}
$("#shortcutForm").onsubmit=e=>{e.preventDefault();let u=$("#shortcutUrl").value.trim();if(!/^https?:\/\//i.test(u))u="https://"+u;const it={name:$("#shortcutName").value.trim(),url:u,icon:$("#shortcutIcon").value.trim()};const i=$("#shortcutIndex").value;if(i==="")shortcuts.push(it);else shortcuts[+i]=it;shortcuts=shortcuts.slice(0,21);setJ("m3e.shortcuts",shortcuts);render();closeSheets();pop("保存しました")};
$("#deleteShortcut").onclick=()=>{const i=+$("#shortcutIndex").value;shortcuts.splice(i,1);setJ("m3e.shortcuts",shortcuts);render();closeSheets();pop("削除しました")};

const looksUrl=s=>/^https?:\/\//i.test(s)||/^[^\s]+\.[^\s]{2,}(\/.*)?$/i.test(s);
$("#searchForm").onsubmit=e=>{e.preventDefault();const q=$("#query").value.trim();if(!q)return;if(looksUrl(q))location.href=/^https?:\/\//i.test(q)?q:"https://"+q;else location.href=engines[cfg("engine","brave")].u(q)};
function engineUI(){const k=cfg("engine","brave");$("#engineSelect").value=k;$("#engineBtn").textContent=engines[k].m}engineUI();
$("#engineBtn").onclick=()=>openSheet($("#settingsSheet"));$("#engineSelect").onchange=e=>{save("engine",e.target.value);engineUI();pop("検索エンジンを変更しました")};

function openSheet(s){$("#scrim").classList.add("on");s.classList.add("on")}function closeSheets(){$$(".sheet").forEach(s=>s.classList.remove("on"));$("#scrim").classList.remove("on")}
$("#settingsBtn").onclick=()=>openSheet($("#settingsSheet"));$("#wallBtn").onclick=()=>openSheet($("#settingsSheet"));$("#scrim").onclick=closeSheets;$$(".closeBtn").forEach(b=>b.onclick=closeSheets);
function pop(t){const e=$("#toast");e.textContent=t;e.classList.add("on");clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove("on"),1800)}

function slider(id,key,d,apply,unit){
 const el=$("#"+id),val=$("#"+id+"Value"),s=cfg(key,String(d));el.value=s;apply(+s);if(val)val.textContent=s+unit;
 el.oninput=e=>{save(key,e.target.value);apply(+e.target.value);if(val)val.textContent=e.target.value+unit}
}
slider("brightness","brightness",100,n=>root.style.setProperty("--wp-bright",n/100),"%");
slider("shadeRange","shade",18,n=>root.style.setProperty("--wp-shade",n/100),"%");
slider("wallBlur","wallBlur",0,n=>root.style.setProperty("--wp-blur",n+"px"),"px");
slider("glassAlpha","glassAlpha",50,n=>root.style.setProperty("--glass-alpha",n/100),"%");
slider("glassBlur","glassBlur",26,n=>root.style.setProperty("--glass-blur",n+"px"),"px");
slider("iconSize","iconSize",40,n=>root.style.setProperty("--tile-size",n+"px"),"px");
slider("gap","gap",7,n=>root.style.setProperty("--gap",n+"px"),"px");
$("#columns").value=cfg("columns","6");root.style.setProperty("--cols",$("#columns").value);$("#columns").onchange=e=>{save("columns",e.target.value);root.style.setProperty("--cols",e.target.value)};
$("#wallPosition").value=cfg("wallPosition","center");$("#wallpaperImg").style.objectPosition=$("#wallPosition").value;$("#wallPosition").onchange=e=>{save("wallPosition",e.target.value);$("#wallpaperImg").style.objectPosition=e.target.value};
$("#iconProvider").value=cfg("iconProvider","auto");$("#iconProvider").onchange=e=>{save("iconProvider",e.target.value);render()};
$("#showLabels").checked=cfg("showLabels","1")==="1";$("#showLabels").onchange=e=>{save("showLabels",e.target.checked?"1":"0");render()};
$("#showClock").checked=cfg("showClock","1")==="1";$("#clockBox").style.display=$("#showClock").checked?"":"none";$("#showClock").onchange=e=>{save("showClock",e.target.checked?"1":"0");$("#clockBox").style.display=e.target.checked?"":"none"};
$("#accentMode").value=cfg("accentMode","auto");$("#accentMode").onchange=e=>{save("accentMode",e.target.value);if(e.target.value!=="auto")root.style.setProperty("--h",e.target.value);else refreshAccent()};

const DB="lumen-s26",STORE="walls";
function openDb(){return new Promise((res,rej)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:"id"})};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function allWalls(){const d=await openDb();return new Promise((res,rej)=>{const r=d.transaction(STORE).objectStore(STORE).getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function putWall(o){const d=await openDb();return new Promise((res,rej)=>{const t=d.transaction(STORE,"readwrite");t.objectStore(STORE).put(o);t.oncomplete=res;t.onerror=()=>rej(t.error)})}
async function clearDb(){const d=await openDb();return new Promise((res,rej)=>{const t=d.transaction(STORE,"readwrite");t.objectStore(STORE).clear();t.oncomplete=res;t.onerror=()=>rej(t.error)})}
function fileData(file){return new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(r.error);r.readAsDataURL(file)})}
async function optimize(file){
 const raw=await fileData(file);
 const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=raw});
 const max=2200,s=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight)),w=Math.max(1,Math.round(img.naturalWidth*s)),h=Math.max(1,Math.round(img.naturalHeight*s));
 const c=document.createElement("canvas");c.width=w;c.height=h;c.getContext("2d",{alpha:false}).drawImage(img,0,0,w,h);
 let data=c.toDataURL("image/webp",.88);if(!data.startsWith("data:image/"))data=c.toDataURL("image/jpeg",.88);return data
}
function pick(a,ex){const p=a.length>1?a.filter(x=>x.id!==ex):a;return p[Math.floor(Math.random()*p.length)]}
async function applyWall(w,fade=true){
 if(!w)return;const im=$("#wallpaperImg");
 if(fade)im.classList.remove("loaded");
 im.onload=()=>{im.classList.add("loaded");currentWall=w.id;save("currentWall",w.id);save("lastChange",Date.now());if(cfg("accentMode","auto")==="auto")extractAccent(im);renderThumbs()};
 im.onerror=()=>pop("壁紙の表示に失敗しました");
 im.src=w.data
}
function extractAccent(img){
 try{const c=document.createElement("canvas");c.width=c.height=36;const x=c.getContext("2d",{willReadFrequently:true});x.drawImage(img,0,0,36,36);const d=x.getImageData(0,0,36,36).data;let best={s:-999,r:160,g:118,b:240};for(let i=0;i<d.length;i+=16){const r=d[i],g=d[i+1],b=d[i+2],M=Math.max(r,g,b),m=Math.min(r,g,b),sat=M-m,lum=(M+m)/2,sc=sat-Math.abs(lum-150)*.2;if(sat>25&&lum>45&&lum<235&&sc>best.s)best={s:sc,r,g,b}}root.style.setProperty("--h",Math.round(rgbHue(best.r,best.g,best.b)))}catch{}
}
function rgbHue(r,g,b){r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m;if(!d)return276;let h=M===r?((g-b)/d)%6:M===g?(b-r)/d+2:(r-g)/d+4;return(h*60+360)%360}
async function refreshAccent(){const a=await allWalls(),w=a.find(x=>x.id===currentWall);if(!w)return;const i=new Image();i.onload=()=>extractAccent(i);i.src=w.data}
async function renderThumbs(){
 const a=await allWalls(),s=$("#wallStrip");s.innerHTML="";$("#wallCount").textContent=a.length+"枚";
 if(!a.length){const e=document.createElement("div");e.style.cssText="font-size:9px;color:var(--fg2);padding:7px 3px";e.textContent="壁紙なし";s.append(e);return}
 a.forEach(w=>{const b=document.createElement("button");b.className="thumb"+(w.id===currentWall?" active":"");const im=document.createElement("img");im.src=w.data;b.append(im);b.onclick=()=>applyWall(w);s.append(b)})
}
async function randomWall(){const a=await allWalls();if(!a.length)return pop("先に壁紙を追加してください");applyWall(pick(a,currentWall))}
$("#shuffleBtn").onclick=randomWall;
$("#wallInput").onchange=async e=>{
 const fs=[...e.target.files];if(!fs.length)return;pop("壁紙を読み込んでいます…");let first=null;
 for(const f of fs){try{const data=await optimize(f),w={id:Date.now()+"-"+crypto.randomUUID(),name:f.name,data};await putWall(w);if(!first)first=w}catch(err){console.error(err)}}
 e.target.value="";await renderThumbs();if(first)await applyWall(first,false);pop(fs.length+"枚追加しました")
};
$("#clearWalls").onclick=async()=>{if(!confirm("登録した壁紙をすべて削除しますか？"))return;await clearDb();currentWall="";save("currentWall","");$("#wallpaperImg").removeAttribute("src");$("#wallpaperImg").classList.remove("loaded");await renderThumbs();pop("削除しました")};
$("#rotation").value=cfg("rotation","open");$("#rotation").onchange=e=>{save("rotation",e.target.value);setupTimer();pop("切り替え設定を変更しました")};
async function bootWall(){
 const a=await allWalls();await renderThumbs();if(!a.length)return;
 const id=cfg("currentWall",""),cur=a.find(x=>x.id===id),mode=cfg("rotation","open"),last=+cfg("lastChange","0");
 if(mode==="open")return applyWall(pick(a,id),false);
 if(mode==="daily"){const t=new Date().toISOString().slice(0,10),d=cfg("day","");if(t!==d||!cur){save("day",t);return applyWall(pick(a,id),false)}return applyWall(cur,false)}
 if(["15","30","60"].includes(mode)){const due=Date.now()-last>=+mode*60000;return applyWall(due?pick(a,id):(cur||pick(a,"")),false)}
 return applyWall(cur||pick(a,""),false)
}
function setupTimer(){clearInterval(timer);const m=cfg("rotation","open");if(["15","30","60"].includes(m))timer=setInterval(randomWall,+m*60000)}
let touch=null;$("#hero").ontouchstart=e=>{const t=e.changedTouches[0];touch={x:t.clientX,y:t.clientY}};$("#hero").ontouchend=e=>{if(!touch)return;const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.3)randomWall();touch=null};
bootWall().then(setupTimer);
