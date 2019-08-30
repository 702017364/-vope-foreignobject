const RE_BASE64_IMAGE = /^data:image/i; //匹配是否为（CSS）内嵌图片格式
const RE_BASE64_SVG = /^(data:image\/svg\+xml,)(?:\<|\%3C)svg/i; //匹配是否为（CSS）内嵌 svg 格式
const RE_BROWSER_PREFIX = /^-(?:ms|webkit|moz)-/g; //匹配（CSS）浏览器前缀

const COMPAT_FONTFACE = { //浏览器对服务器字体格式支持性
  woff2: true,
  woff: true,
  svg: (() => {
    const agent = navigator.userAgent;
    if(['Opera', 'Firefox', 'Chrome'].some((value) => agent.includes(value))){
      return false;
    } else{
      return agent.includes('Safari');
    }
  })(),
  truetype: true,
  opentype: true,
};

/**
 * 将数组格式数据转换为键值对集合，用于进行快速匹配
 * @param {Array} list -
 * @return {Object}
 */
const list2map = (list) => {
  const opt = Object.create({});
  list.forEach((item) => {
    if(Array.isArray(item)){
      const m = item[0];
      item[1].forEach((key) => opt[`${m}-${key}`] = true);
    } else{
      opt[item] = true;
    }
  });
  return opt;
};

/**
 * 创建一个 uuid
 * @param {String} p ['a'] uuid前缀
 * @return {String}
 */
const createUuid = (p = 'a') => {
  const value = Math.random().toString().replace('.', '');
  return p + value;
};

/**
 * 创建任务并加入队列中
 * @param {Array} queues 
 * @param {Function} callback
 * @return {Promine}
 */
const pushQueue = (queues, callback) => {
  const queue = new Promise(callback);
  queues.push(queue);
  return queue;
};

/**
 * 创建一个下载
 * @param {String} fileName 要下载的文件名
 * @param {String} src 要下载的文件地址
 */
const createDownload = (fileName, src) => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = src;
  const event = document.createEvent('MouseEvents');
  event.initEvent('click');
  link.dispatchEvent(event);
};

/**
 * 创建一个图片对象
 * @param {Object} 配置参数
 * @return {Image}
 */
const createImage = ({src, width, height, load}) => {
  const img = new Image();
  width === void 0 || (img.width = width);
  height === void 0 || (img.width = height);
  typeof load == 'function' && (img.onload = () => load(img));
  img.src = src instanceof HTMLCanvasElement ? src.toDataURL('image/png', 1) : src;
  return img;
}

/**
 * 输出 @font-face
 * @param {FontFace} fontface 
 * @param {Array} list
 * @return {String}
 */
const writeFontfaceStyle = (fontface, list) => {
  const src = list.map(({method, url, type}) => {
    const format = type ? `format('${type}')` : '';
    return `${method}('${url}')${format}`;
  }).join(',');
  return src && `@font-face{
    font-family: '${fontface.family}';
    src: ${src};
    font-stretch: ${fontface.stretch};
    font-style: ${fontface.style};
    font-weight: ${fontface.weight};
    unicode-range: ${fontface.unicodeRange};
  }`; 
};

const RE_PREUDO = /^:{0,2}([^:]+)$/; //匹配伪类
/**
 * 检测指定伪元素
 * @param {HTMLElement|CSSStyleDeclaration} element
 *  - 当类型为 HTMLElement 则检测节点是否含有指定伪元素
 *  - 当类型为 CSSStyleDeclaration 则检测该（伪元素）style 是否为有效值
 * @param {String} pseudo 只支持 ::before 和 ::after
 * @return {Boolean}
 */
const hasPseudoElement = (element, pseudo) => {
  let style;
  if(element instanceof HTMLElement){
    const matchs = pseudo.match(RE_PREUDO);
    if(!matchs) return false;
    pseudo = `::${matchs[1]}`;
    style = getComputedStyle(element, pseudo);
  } else{
    style = element;
  }
  const detects = ['none', 'normal'];
  const content = style.getPropertyValue('content');
  return !detects.includes(content) && style.getPropertyValue('dispaly') != 'none';
};

/**
 * 将 svg 格式字符串转换成 base64 格式字符串
 * @param {String} content SVG 内容
 * @return {String}
 */
const svg2base64 = (content) => {
  const base64 = btoa(decodeURIComponent(content));
  return `data:image/svg+xml;base64,${base64}`;
};

/**
 * 加工 fetch（返回二进制数据）
 * @param {String} src 
 * @param {String} method ['blob']
 * @return {Promise} 
 */
const fetchMachin2blob = (src) => {
  return fetch(src).then((res) => {
    if(res.status == 200){
      return res.blob();
    } else{
      throw new Error(res.statusText);
    }
  });
};

//拷贝样式时，集合中的属性无需拷贝（对于截图而言，这些属性并不会影响界面显示，反而可能产生无法预知的情况）
const exception2CSSStyle = list2map([
  ['min', ['width', 'height']],
  ['max', ['width', 'height']],
  ['transition', ['property', 'duration', 'timing-function', 'delay']],
  ['animation', ['name', 'duration', 'timing-function', 'delay', 'iteration-count', 'direction', 'play-state', 'fill-mode']],
  'cursor',
  'ime-mode',
  'pointer-events',
]);

//可以内嵌 svg 的（CSS）属性
const embedSVG2CSSStyle = list2map([
  'background-image',
  'content',
  'border-image-source',
  'list-style-image',
  'clip-path',
  'filter',
  'mask-box-image',
  '-webkit-mask-image',
  'mask-image',
  'mask-box-image',
]);

//CSSStyleDeclaration 列表（转换成 Array 格式）
const list2CSSStyle = (() => {
  const style = window.getComputedStyle(document.documentElement);
  const list = new Set(style);
  [ //在 Chrome 浏览器中，该部分 CSS 属性不存在 CSSStyleDeclaration 对象中
    'counter-increment',
    'counter-reset',
    'content',
  ].forEach(key => list.add(key));
  return Array.from(list);
})();

/**
 * 创建截图
 * @param {HTMLElement} cloneElement 节点（拷贝）对象
 * @param {Number} width 节点的宽度
 * @param {Number} height 节点的高度
 * @param {Function} callback 创建成功后的回调
 */
function createForeignObject(cloneElement, width, height, callback){
  new Promise((resolve) => {
    if(cloneElement){
      const foreignContext = encodeURIComponent(new XMLSerializer().serializeToString(cloneElement));
      createImage({
        width,
        height,
        src: `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><foreignObject width="100%" height="100%" x="0" y="0">${foreignContext}</foreignObject></svg>`,
        load: resolve,
      });
    } else{
      resolve();
    }
  }).then(image => {
    const canvas = document.createElement('canvas');
    canvas.width = width || 10;
    canvas.height = height || 10;
    const ctx = canvas.getContext('2d');
    image && ctx.drawImage(image, 0, 0);
    callback(canvas);
  });
}

const RE_URL = /url\(/; //匹配是否符合（CSS）函数 url 的格式
const RE_EXEC_URLS = /(none|[a-z-]+\((?:[^\(\)]|\([^\(\)]+\))+\))(?:,\s)?/g; //从可使用图片的（CSS）属性中提取每个值（部分属性如 background-image 存在多个值的情况）

/**
 * 格式化（CSS）url 函数的值
 *  1、对引用地址的背景图片做 base64 位处理
 *  2、将 svg 格式的引用转换为 base64 引用
 * @param {String} value
 * @return {Array}
 */
function handleURL8CSSStyle(value){
  const list = [];
  let execs;
  const transcodSVG = (src, matchs) => {
    const start = matchs[1].length;
    const slice = src.slice(start);
    const value = svg2base64(slice);
    return `url(${value})`;
  };
  while((execs = RE_EXEC_URLS.exec(value)) != null){
    let val = execs[1];
    if(val.slice(0, 3) == 'url'){
      const src = val.slice(5, -2);
      if(!RE_BASE64_IMAGE.test(src)){
        const queue = this.getImageBase64(src);
        list.push(new Promise((resolve) => {
          queue.then(value => value ? resolve(`url(${value})`) : 'none');
        }));
        continue;
      }
      const matchs = src.match(RE_BASE64_SVG);
      matchs && (val = transcodSVG(src, matchs));
    }
    list.push(val);
  }
  return list;
}

const RE_NET_FILE = /\.\w+?$/; //匹配当前路径是否包含了文件名
const RE_FACEFONT_SRC = /(url|local)\("([^\(\)]+?)"\)(?:\sformat\("([a-z]+?)"\))?/g; //查询 @fontface src 属性设置的信息
const RE_FACEFONT_BASE64 = /data:(\.+?);base64,([^'"\(\)]+)/;
const RE_BASE64 = /^data:/i; //匹配是否为 base64

/**
 * 
 * @param {Array} fonts 要查找的字体信息
 * @param {StyleSheetList} styleSheets StyleSheet 列表
 * @param {String} defHref 默认的地址
 * @return {Promise}
 */
function loadFontfaces(fonts, styleSheets, defHref){
  const size = fonts.length;
  const options = {};
  if(!size) return options;
  const caches = {};
  fonts.forEach((list) => {
    const family = list[0].family;
    caches[family] = list;
  });
  const getState = (family) => {
    const states = options[family] || (options[family] = []);
    const state = [];
    const size = states.push(state);
    return [state, size];
  };
  const verifyFont = (url, method = 'url') => {
    const fontface = new FontFace('font', `${method}(${url})`);
    return fontface.load();
  };
  let queues = [];
  [].forEach.call(styleSheets, ({cssRules, href}) => {
    href || (href = defHref);
    const lastIndex = href.lastIndexOf('/');
    const base = RE_NET_FILE.test(href) ? href.slice(0, lastIndex + 1) : href;
    queues = [].map.call(cssRules, async ({type, style}) => {
      if(type != 5 || !style) return;
      const family = style.getPropertyValue('font-family');
      const cache =  caches[family];
      if(!cache) return;
      const src = style.getPropertyValue('src');
      let list;
      let execs;
      RE_FACEFONT_SRC.lastIndex = 0;
      while((execs = RE_FACEFONT_SRC.exec(src)) != null){
        const [$, method, url, type] = execs;
        //检测指定的类型是否为符合类型
        if(type && !COMPAT_FONTFACE[type]) continue;
        if(!list){
          let size;
          [list, size] = getState(family);
          list.fontface = cache[size - 1];
        }
        const index = RE_FACEFONT_SRC.lastIndex;
        try{
          let value;
          if(method == 'url'){
            if(RE_BASE64.test(url)){
              const matchs = url.match(RE_FACEFONT_BASE64);
              if(matchs) return;
              const str = atob(matchs[2]);
              const length = str.length;
              const u8 = new Uint8Array(length);
              for(let i = 0; i < length; i++){
                u8[i] = str[i];
              }
              const blob = new Blob([u8], {
                type: matchs[1],
              });
              const blobUrl = URL.createObjectURL(blob);
              await verifyFont(blobUrl);
              URL.revokeObjectURL(blobUrl);
              value = url;
            } else{
              const path = new URL(url, base).href;
              const blob = await fetchMachin2blob(path);
              const blobUrl = URL.createObjectURL(blob);
              await verifyFont(blobUrl);
              URL.revokeObjectURL(blobUrl);
              value = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onload = () => resolve(reader.result);
              });
            }
          } else if(method == 'local'){
            await verifyFont(url, method);
            value = url;
          }
          if(value){
            list.push({method, url: value, type});
            break;
          }
        } catch(e){
          console.log(e);
        } finally{
          RE_FACEFONT_SRC.lastIndex = index;
        }
      }
    });
  });
  return new Promise((resolve) => Promise.all(queues).then(() => resolve(options)));
}

/**
 * 收集服务器字体
 * @param {FontFaceSet} 要收集字体所在文档的 fonts 属性
 * @return {Function} 用于收集字体的方法
 * - @param {String} （CSS）font-family 值
 * - @return {Array} 收集到的字体列表
 */
async function collectFonts(fontfaces){
  const caches = {};
  const queues = [];
  let old;
  let count = 0;
  fontfaces.forEach((font) => {
    pushQueue(queues, async (resolve) => {
      const {
        family,
      } = font;
      old === family ? count++ : (count = 0, old = family);
      font.status == 'loading' && (font = await font.loaded);
      const cache = caches[family] || (caches[family] = []);
      cache[count] = font;
      resolve();
    });
  });
  await Promise.all(queues);
  const marks = {};
  const RE = /,\s?/g;
  return (family) => {
    const fonts = [];
    family.split(RE).forEach((key) => {
      const cache = caches[key];
      if(!cache || marks[key]) return;
      marks[key] = true;
      fonts.push(cache);
    });
    return fonts;
  };
};

class ForeignObject{
  /**
   * 构造函数
   * @param {HTMLElement} element 进行截图的节点
   * @param {Object} option 对截图功能进行配置
   * @throw
   */
  constructor(element, option = {}){
    const style = window.getComputedStyle(element);
    const value = style.getPropertyValue('display');
    if(!value){
      throw new Error('截图元素必需加入文档');
    } else if(value == 'none'){
      throw new Error('截图元素（CSS）display 属性值不能为 "none"');
    }
    this.element = element; //截图元素
    this.option = Object.assign({
      clearPlaceholder: false,
      download: false,
      downloadName: null,
      downloadType: 'png',
      ignoreFetchError: true,
    }, option); //配置项
    this.fecthCaches = {}; //数据缓存（主要为图片，fontface 本身有做去重处理）
  }

  /**
   * 截图
   * @return {Promise}
   */
  async drawCanvas(){
    const {
      element,
      option,
    } = this;
    this.caches = {};
    const queues = this.queues = [];
    this.addFonts = await this.collectFonts();
    const clone = this.clone = this.deepCloneElement(element);
    this.loadFonts(clone);
    return new Promise((resolve) => Promise.all(queues).then(() => {
      createForeignObject(clone, element.offsetWidth, element.offsetHeight, (canvas) => {
        if(option.download){
          const downloadName = option.downloadName || createUuid();
          const downloadType = option.downloadType || 'png';
          const name = downloadName + downloadType;
          const value = canvas.toDataURL(downloadType);
          createDownload(name, value);
        }
        option.test && (canvas.cloneElement = clone);
        resolve(canvas);
      });
    }));
  }

  /**
   * 加载服务器字体
   */
  loadFonts(){
    const doc = this.element.ownerDocument;
    pushQueue(this.queues, async (resolve) => {
      const opts = await loadFontfaces(this.fonts, doc.styleSheets, doc.location.href);
      const caches = [];
      for(let key in opts){
        opts[key].forEach((item) => {
          const {
            fontface,
          } = item;
          if(fontface.status != 'loaded') return;
          const css = writeFontfaceStyle(fontface, item);
          caches.push(css);
        });
      }
      const style = document.createElement('style');
      style.textContent = caches.join('\n');
      this.clone.prepend(style);
      resolve();
    });
  }

  /**
   * 收集服务器字体
   * @return {Function} 用于收集字体的方法
   */
  async collectFonts(){
    const callback = await collectFonts(this.element.ownerDocument.fonts);
    const fonts = this.fonts = [];
    return (family) => [].push.apply(fonts, callback(family));
  }

  /**
   * 深度拷贝节点
   * @param {HTMLElement} element 
   * @return {HTMLElement}
   */
  deepCloneElement(element){
    const style = window.getComputedStyle(element);
    const display = style.getPropertyValue('display');
    if(display === 'none') return;
    const clone = this.cloneNode(element);
    if(!clone) return;
    const tag = element.tagName.toLocaleLowerCase();
    //排除不能拷贝子节点的元素
    ['textarea'].includes(tag) || [].forEach.call(element.childNodes, (node) => {
      let cloneNode;
      switch(node.nodeType){
        case 1:
          cloneNode = this.deepCloneElement(node);
          break;
        case 3:
          cloneNode = node.cloneNode();
          break;
      }
      if(!cloneNode) return;
      clone.append(cloneNode);
    });
    this.clonePseudoElements(element, clone);
    return clone;
  }

  /**
   * 拷贝节点
   * @param {HTMLElement} element
   * @return {HTMLElement}
   */
  cloneNode(element){
    const {
      clearPlaceholder,
    } = this.option;
    let clone = element.cloneNode();
    let src;
    tag:
    switch(element.tagName.toLocaleLowerCase()){
      case 'input':
        switch(element.type){
          case 'image':
            break;
          case 'color':
            throw new Error('不支持 input[type="color"] 元素截图');
          case 'checkbox':
          case 'radio':
            const checked = element.checked;
            checked && clone.setAttribute('checked', checked);
            break tag;
          case 'button':
          case 'reset':
          case 'submit':
          case 'file':
            break tag;
          default:
            clearPlaceholder && clone.removeAttribute('placeholder');
            clone.setAttribute('value', element.value);
            break tag;
        }
      case 'img':
        src = element.currentSrc || element.src;
        if(!RE_BASE64_IMAGE.test(src)){
          clone.removeAttribute('src');
          this.getImageBase64(src).then(value => value && (clone.src = value));
        } else{
          const matchs = src.match(RE_BASE64_SVG);
          if(matchs){
            clone.src = svg2base64(src.slice(matchs[1].length));
          }
        }
        break;
      case 'video':
        clone.crossOrigin = 'Anonymous';
        clone.src = element.currentSrc;
        clone.currentTime = element.currentTime;
        clone.autoplay = false;
        clone.loop = false;
        pushQueue(this.queues, (resolve) => {
          const canplayEvent = () => {
            clone.removeEventListener('canplay', canplayEvent, false);
            const canvas = document.createElement('canvas');
            const width = canvas.width = element.videoWidth;
            const height = canvas.height = element.videoHeight;
            const cvs = canvas.getContext('2d');
            cvs.drawImage(clone, 0, 0);
            const img = createImage({
              src: canvas,
              width,
              height
            });
            img.style.cssText = clone.style.cssText;
            clone.parentNode.replaceChild(img, clone);
            resolve();
          };
          clone.addEventListener('canplay', canplayEvent, false);
          clone.onerror = () => {
            if(this.option.ignoreFetchError){
              resolve();
            } else{
              throw new Error(`加载视频 ${element.currentSrc} 错误`);
            }
          };
        });
        break;
      case 'canvas':
        clone = createImage({
          width: element.width,
          height: element.height,
          src: element,
        });
        break;
      case 'iframe':
        clone.removeAttribute('src');
        break;
      case 'textarea':
        clearPlaceholder && clone.removeAttribute('placeholder');
        clone.textContent = element.value;
    }
    clone.style.cssText = this.cloneStyle(element, (key, value) => clone.style[key] = value);
    return clone;
  }

  /**
   * 拷贝伪类
   * @param {HTMLElement} element 原始元素
   * @param {HTMLElement} cloneElement 拷贝元素
   */
  clonePseudoElements(element, cloneElement){
    const pseudos = [];
    ['before', 'after'].forEach((pseudo) => hasPseudoElement(element, pseudo) && pseudos.push(pseudo));
    if(!pseudos.length) return;
    const uuid = createUuid('p');
    cloneElement.classList.add(uuid);
    const style = document.createElement('style');
    const list = [];
    pseudos.forEach((pseudo) => {
      const value = this.cloneStyle(element, (key, value) => {
        const style = document.createElement('style');
        style.textContent = `.${uuid}::${pseudo}{${key}: ${value};}`;
        cloneElement.append(style);
      }, `::${pseudo}`);
      list.push(`.${uuid}::${pseudo}{${value}}`);
    });
    style.textContent = list.join('');
    cloneElement.append(style);
  }

  /**
   * 拷贝样式
   * @param {HTMLElement} element
   * @param {Function} callback 如果存在背景图（非data:image模式），则回调设置
   * @param {String} pseudo [null] 设置伪类
   * @return {String}
   */
  cloneStyle(element, callback, pseudo = null){
    const style = window.getComputedStyle(element, pseudo);
    const list = [];
    list2CSSStyle.forEach((key) => {
      const matchs = key.match(RE_BROWSER_PREFIX); //处理浏览器前缀
      const real = matchs ? key.slice(matchs[0].length) : key;
      if(real in exception2CSSStyle) return;
      const value = style.getPropertyValue(key);
      if(
        real in embedSVG2CSSStyle
          && value !== 'none'
          && RE_URL.test(value)
      ){
        const list = handleURL8CSSStyle.call(this, value);
        if(list){
          pushQueue(this.queues, (resolve) => Promise.all(list).then((list) => {
            callback(key, list.join(','));
            resolve();
          }));
          return;
        }
      } else if(key == 'font-family'){
        this.addFonts(value);
      }
      list.push(`${key}: ${value}`);
    });
    return list.join(';');
  }

  /**
   * 获取图片数据
   * @param {String} src
   * @return {Promise}
   */
  getImageBase64(src){
    const {
      fecthCaches,
    } = this;
    const cache = fecthCaches[src];
    if(cache) return cache;
    const queue = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const cvs = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        cvs.drawImage(img, 0, 0);
        const value = canvas.toDataURL('image/png', 1);
        resolve(value);
      };
      img.onerror = () => {
        if(this.option.ignoreFetchError){
          resolve();
        } else{
          throw new Error(`加载图片 ${src} 错误`);
        }
      };
      img.src = src;
    });
    this.queues.push(queue);
    fecthCaches[src] = queue;
    return queue;
  }
}

export default (element, option) => {
  const obj = new ForeignObject(element, option);
  return obj.drawCanvas();
};