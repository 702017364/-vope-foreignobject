const e=/^data:image/i,t=/^(data:image\/svg\+xml,)(?:\<|\%3C)svg/i,n=/^-(?:ms|webkit|moz)-/g,o={woff2:!0,woff:!0,svg:(()=>{const e=navigator.userAgent;return!["Opera","Firefox","Chrome"].some(t=>e.includes(t))&&e.includes("Safari")})(),truetype:!0,opentype:!0},s=e=>{const t=Object.create({});return e.forEach(e=>{if(Array.isArray(e)){const n=e[0];e[1].forEach(e=>t[`${n}-${e}`]=!0)}else t[e]=!0}),t},r=(e="a")=>{return e+Math.random().toString().replace(".","")},a=(e,t)=>{const n=new Promise(t);return e.push(n),n},c=(e,t)=>{const n=document.createElement("a");n.download=e,n.href=t;const o=document.createEvent("MouseEvents");o.initEvent("click"),n.dispatchEvent(o)},i=({src:e,width:t,height:n,load:o})=>{const s=new Image;return void 0===t||(s.width=t),void 0===n||(s.width=n),"function"==typeof o&&(s.onload=(()=>o(s))),s.src=e instanceof HTMLCanvasElement?e.toDataURL("image/png",1):e,s},l=(e,t)=>{const n=t.map(({method:e,url:t,type:n})=>{return`${e}('${t}')${n?`format('${n}')`:""}`}).join(",");return n&&`@font-face{\n    font-family: '${e.family}';\n    src: ${n};\n    font-stretch: ${e.stretch};\n    font-style: ${e.style};\n    font-weight: ${e.weight};\n    unicode-range: ${e.unicodeRange};\n  }`},h=/^:{0,2}([^:]+)$/,u=(e,t)=>{let n;if(e instanceof HTMLElement){const o=t.match(h);if(!o)return!1;t=`::${o[1]}`,n=getComputedStyle(e,t)}else n=e;const o=n.getPropertyValue("content");return!["none","normal"].includes(o)&&"none"!=n.getPropertyValue("dispaly")},d=e=>{return`data:image/svg+xml;base64,${btoa(decodeURIComponent(e))}`},m=e=>fetch(e).then(e=>{if(200==e.status)return e.blob();throw new Error(e.statusText)}),f=s([["min",["width","height"]],["max",["width","height"]],["transition",["property","duration","timing-function","delay"]],["animation",["name","duration","timing-function","delay","iteration-count","direction","play-state","fill-mode"]],"cursor","ime-mode","pointer-events"]),g=s(["background-image","content","border-image-source","list-style-image","clip-path","filter","mask-box-image","-webkit-mask-image","mask-image","mask-box-image"]),w=(()=>{const e=window.getComputedStyle(document.documentElement),t=new Set(e);return["counter-increment","counter-reset","content"].forEach(e=>t.add(e)),Array.from(t)})();const p=/url\(/,y=/(none|[a-z-]+\((?:[^\(\)]|\([^\(\)]+\))+\))(?:,\s)?/g;const E=/\.\w+?$/,b=/(url|local)\("([^\(\)]+?)"\)(?:\sformat\("([a-z]+?)"\))?/g,v=/data:(\.+?);base64,([^'"\(\)]+)/,$=/^data:/i;export default(s,h)=>{return new class{constructor(e,t={}){const n=window.getComputedStyle(e).getPropertyValue("display");if(!n)throw new Error("截图元素必需加入文档");if("none"==n)throw new Error('截图元素（CSS）display 属性值不能为 "none"');this.element=e,this.option=Object.assign({clearPlaceholder:!1,download:!1,downloadName:null,downloadType:"png",ignoreFetchError:!0},t),this.fecthCaches={}}async drawCanvas(){const{element:e,option:t}=this;this.caches={};const n=this.queues=[];this.addFonts=await this.collectFonts();const o=this.clone=this.deepCloneElement(e);return this.loadFonts(o),new Promise(u=>Promise.all(n).then(()=>{s=o,a=e.offsetWidth,l=e.offsetHeight,h=(e=>{if(t.download){const n=t.downloadName||r(),o=t.downloadType||"png",s=n+o,a=e.toDataURL(o);c(s,a)}t.test&&(e.cloneElement=o),u(e)}),new Promise(e=>{if(s){const t=encodeURIComponent((new XMLSerializer).serializeToString(s));i({width:a,height:l,src:`data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${a}" height="${l}"><foreignObject width="100%" height="100%" x="0" y="0">${t}</foreignObject></svg>`,load:e})}else e()}).then(e=>{const t=document.createElement("canvas");t.width=a||10,t.height=l||10;const n=t.getContext("2d");e&&n.drawImage(e,0,0),h(t)})}));var s,a,l,h}loadFonts(){const e=this.element.ownerDocument;a(this.queues,async t=>{const n=await function(e,t,n){const s={};if(!e.length)return s;const r={};e.forEach(e=>{const t=e[0].family;r[t]=e});const a=e=>{const t=[];return[t,(s[e]||(s[e]=[])).push(t)]},c=(e,t="url")=>new FontFace("font",`${t}(${e})`).load();let i=[];return[].forEach.call(t,({cssRules:e,href:t})=>{t||(t=n);const s=t.lastIndexOf("/"),l=E.test(t)?t.slice(0,s+1):t;i=[].map.call(e,async({type:e,style:t})=>{if(5!=e||!t)return;const n=t.getPropertyValue("font-family"),s=r[n];if(!s)return;const i=t.getPropertyValue("src");let h,u;for(b.lastIndex=0;null!=(u=b.exec(i));){const[e,t,r,i]=u;if(i&&!o[i])continue;if(!h){let e;[h,e]=a(n),h.fontface=s[e-1]}const d=b.lastIndex;try{let e;if("url"==t)if($.test(r)){const t=r.match(v);if(t)return;const n=atob(t[2]),o=n.length,s=new Uint8Array(o);for(let e=0;e<o;e++)s[e]=n[e];const a=new Blob([s],{type:t[1]}),i=URL.createObjectURL(a);await c(i),URL.revokeObjectURL(i),e=r}else{const t=new URL(r,l).href,n=await m(t),o=URL.createObjectURL(n);await c(o),URL.revokeObjectURL(o),e=await new Promise(e=>{const t=new FileReader;t.readAsDataURL(n),t.onload=(()=>e(t.result))})}else"local"==t&&(await c(r,t),e=r);if(e){h.push({method:t,url:e,type:i});break}}catch(e){console.log(e)}finally{b.lastIndex=d}}})}),new Promise(e=>Promise.all(i).then(()=>e(s)))}(this.fonts,e.styleSheets,e.location.href),s=[];for(let e in n)n[e].forEach(e=>{const{fontface:t}=e;if("loaded"!=t.status)return;const n=l(t,e);s.push(n)});const r=document.createElement("style");r.textContent=s.join("\n"),this.clone.prepend(r),t()})}async collectFonts(){const e=await async function(e){const t={},n=[];let o,s=0;e.forEach(e=>{a(n,async n=>{const{family:r}=e;o===r?s++:(s=0,o=r),"loading"==e.status&&(e=await e.loaded),(t[r]||(t[r]=[]))[s]=e,n()})}),await Promise.all(n);const r={},c=/,\s?/g;return e=>{const n=[];return e.split(c).forEach(e=>{const o=t[e];o&&!r[e]&&(r[e]=!0,n.push(o))}),n}}(this.element.ownerDocument.fonts),t=this.fonts=[];return n=>[].push.apply(t,e(n))}deepCloneElement(e){if("none"===window.getComputedStyle(e).getPropertyValue("display"))return;const t=this.cloneNode(e);if(!t)return;const n=e.tagName.toLocaleLowerCase();return["textarea"].includes(n)||[].forEach.call(e.childNodes,e=>{let n;switch(e.nodeType){case 1:n=this.deepCloneElement(e);break;case 3:n=e.cloneNode()}n&&t.append(n)}),this.clonePseudoElements(e,t),t}cloneNode(n){const{clearPlaceholder:o}=this.option;let s,r=n.cloneNode();e:switch(n.tagName.toLocaleLowerCase()){case"input":switch(n.type){case"image":break;case"color":throw new Error('不支持 input[type="color"] 元素截图');case"checkbox":case"radio":const e=n.checked;e&&r.setAttribute("checked",e);break e;case"button":case"reset":case"submit":case"file":break e;default:o&&r.removeAttribute("placeholder"),r.setAttribute("value",n.value);break e}case"img":if(s=n.currentSrc||n.src,e.test(s)){const e=s.match(t);e&&(r.src=d(s.slice(e[1].length)))}else r.removeAttribute("src"),this.getImageBase64(s).then(e=>e&&(r.src=e));break;case"video":r.crossOrigin="Anonymous",r.src=n.currentSrc,r.currentTime=n.currentTime,r.autoplay=!1,r.loop=!1,a(this.queues,e=>{const t=()=>{r.removeEventListener("canplay",t,!1);const o=document.createElement("canvas"),s=o.width=n.videoWidth,a=o.height=n.videoHeight;o.getContext("2d").drawImage(r,0,0);const c=i({src:o,width:s,height:a});c.style.cssText=r.style.cssText,r.parentNode.replaceChild(c,r),e()};r.addEventListener("canplay",t,!1),r.onerror=(()=>{if(!this.option.ignoreFetchError)throw new Error(`加载视频 ${n.currentSrc} 错误`);e()})});break;case"canvas":r=i({width:n.width,height:n.height,src:n});break;case"iframe":r.removeAttribute("src");break;case"textarea":o&&r.removeAttribute("placeholder"),r.textContent=n.value}return r.style.cssText=this.cloneStyle(n,(e,t)=>r.style[e]=t),r}clonePseudoElements(e,t){const n=[];if(["before","after"].forEach(t=>u(e,t)&&n.push(t)),!n.length)return;const o=r("p");t.classList.add(o);const s=document.createElement("style"),a=[];n.forEach(n=>{const s=this.cloneStyle(e,(e,s)=>{const r=document.createElement("style");r.textContent=`.${o}::${n}{${e}: ${s};}`,t.append(r)},`::${n}`);a.push(`.${o}::${n}{${s}}`)}),s.textContent=a.join(""),t.append(s)}cloneStyle(o,s,r=null){const c=window.getComputedStyle(o,r),i=[];return w.forEach(o=>{const r=o.match(n),l=r?o.slice(r[0].length):o;if(l in f)return;const h=c.getPropertyValue(o);if(l in g&&"none"!==h&&p.test(h)){const n=function(n){const o=[];let s;const r=(e,t)=>{const n=t[1].length,o=e.slice(n);return`url(${d(o)})`};for(;null!=(s=y.exec(n));){let n=s[1];if("url"==n.slice(0,3)){const s=n.slice(5,-2);if(!e.test(s)){const e=this.getImageBase64(s);o.push(new Promise(t=>{e.then(e=>e?t(`url(${e})`):"none")}));continue}const a=s.match(t);a&&(n=r(s,a))}o.push(n)}return o}.call(this,h);if(n)return void a(this.queues,e=>Promise.all(n).then(t=>{s(o,t.join(",")),e()}))}else"font-family"==o&&this.addFonts(h);i.push(`${o}: ${h}`)}),i.join(";")}getImageBase64(e){const{fecthCaches:t}=this,n=t[e];if(n)return n;const o=new Promise(t=>{const n=new Image;n.crossOrigin="Anonymous",n.onload=(()=>{const e=document.createElement("canvas"),o=e.getContext("2d");e.width=n.width,e.height=n.height,o.drawImage(n,0,0);const s=e.toDataURL("image/png",1);t(s)}),n.onerror=(()=>{if(!this.option.ignoreFetchError)throw new Error(`加载图片 ${e} 错误`);t()}),n.src=e});return this.queues.push(o),t[e]=o,o}}(s,h).drawCanvas()};