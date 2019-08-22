import formatDate from '../static/format-date.js';
import foreignObject from '../bin/index.js';

const $c = (tag) => document.createElement(tag);

const $f = () => document.createDocumentFragment();

const $id = (id) => document.getElementById(id);

const $s = (selector) => document.querySelector(selector);

const fetchJSON = (file) => fetch(file).then((res) => res.json());

const createInput = (option = {}) => {
  const input = $c('input');
  input.type = option.type || 'text';
  for(let key in option){
    if(key == 'type') continue;
    const value = option[key];
    const type = typeof value;
    if(type == 'string'){
      input.setAttribute(key, value);
    } else if(type != 'object'){
      input[key] = value;
    } else{
      let cache = new Function(`return ${value.value}`)();
      if(cache instanceof Date){
        const format = value.format;
        format && (cache = formatDate(cache, format));
      }
      input[key] = cache;
    }
  }
  return input;
};

fetchJSON('static/inputs.json').then((data) => {
  const caches = $f();
  data.forEach((item) => {
    const div = $c('div');
    const input = createInput(item);
    div.appendChild(input);
    caches.appendChild(div);
  });
  $id('Inputs').appendChild(caches);
});

((selector) => {
  const element = $s(selector);
  const matchs = element.textContent.match(/\[(?:'\w+'(?:,\s)?)+\]/g);
  const content = [
    '杨白花，风吹渡江水。',
    '坐令宫树无颜色，摇荡春光千万里。',
    '茫茫晓日下长秋，哀歌未断城鸦起。',
  ].map((text) => `<li>${text}</li>`).join('');
  const list = JSON.parse(matchs[0].replace(/'/g, '"'));
  element.innerHTML = list.map(name => `<ul class="ui-list-${name}">${content}</ul>`).join('');
})('.ui-list');

((id) => {
  const panel = $id(id);
  const thead = panel.querySelector('thead');
  const transform$thead = value => {
    thead.style.transform = `translate3d(0, ${value}px, 0)`;
  };
  panel.addEventListener('scroll', function(e){
    const value = this.scrollTop;
    if(typeof requestAnimationFrame == 'function'){
      requestAnimationFrame(() => transform$thead(value));
    } else{
      transform$thead(value);
    }
  }, false);
  const data = new Array(10).fill(0).map((item, index) => ({
    id: index,
    name: '张三',
    sex: index % 2 ? '男' : '女'
  }));
  panel.querySelector('tbody').innerHTML = `${
    data.map(item => {
      const tr = ['<tr>'];
      for(let key in item){
        tr.push(`<td>${item[key]}</td>`);
      }
      tr.push('</tr>');
      return tr.join('');
    }).join('')
  }`;
})('ScrollTranslate');

(() => {
  const node = $c('div');
  node.title = '截图快照';
  node.id = 'Snapshot';
  class Dialog{
    static create(hideCallback){
      const dialog = $c('div');
      dialog.id = 'Dialog';
      const clone = $c('i');
      clone.title = '关闭';
      clone.addEventListener('click', hideCallback, false);
      dialog.appendChild(clone);
      document.body.appendChild(dialog);
      return dialog;
    }

    constructor(){
      this.filter = false;
      this.dialog = Dialog.create(this.hide.bind(this));
    }

    append(canvas){
      this.clear();
      this.dialog.appendChild(canvas);
      this.cache = canvas;
      this.show();
    }

    clear(){
      const {
        cache,
      } = this;
      cache && cache.remove();
    }

    hide(){
      this.toggle(false);
    }

    show(){
      this.toggle(true);
    }

    toggle(isShow){
      document.body.classList[isShow ? 'add' : 'remove']('snapshot-mask');
      this.dialog.style.display = isShow ? '' : 'none';
    }
  }
  let disabled = false;
  let dialog;
  node.addEventListener('click', () => {
    if(disabled) return;
    disabled = true;
    foreignObject(document.querySelector('.test-list'), {
      download: false,
      test: true,
    }).then((canvas) => {
      dialog || (dialog = new Dialog());
      dialog.append(canvas);
      disabled = false;
    });
  }, false);
  document.body.appendChild(node);
})();

((cls) => {
  const wrap = $s(cls);
  const list = wrap.children;
  const first = list[0];
  const style = window.getComputedStyle(first);
  const width = parseInt(style.getPropertyValue('width'));
  const height = parseInt(style.getPropertyValue('height'));
  const draws = [
    [
      [width / 2, 0],
      [width, height / 2],
      [width / 2, height],
      [0, height / 2],
    ],
    [
      [width / 4, 0],
      [width / 2, height / 4],
      [width / 4 * 3, 0],
      [width, height / 4],
      [width / 4 * 3, height / 2],
      [width, height / 4 * 3],
      [width / 4 * 3, height],
      [width / 2, height / 4 * 3],
      [width / 4, height],
      [0, height / 4 * 3],
      [width / 4, height / 2],
      [0, height / 4],
    ],
  ];
  [].forEach.call(list, (canvas, index) => {
    canvas.width = width;
    canvas.height = height;
    const cvs = canvas.getContext('2d');
    const [move, ...lines] = draws[index];
    cvs.beginPath();
    cvs.moveTo(...move);
    for(let i = 0, j = lines.length; i < j; i++){
      cvs.lineTo(...lines[i]);
    }
    cvs.closePath();
    cvs.fillStyle = window.getComputedStyle(canvas).getPropertyValue('color');
    cvs.fill();
  });
})('.canvas-list');

((id) => {
  const wrap = $id(id);
  document.querySelector('canvas').toBlob((blob) => {
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    wrap.appendChild(img);
  }, 'image/png');
})('Mask');