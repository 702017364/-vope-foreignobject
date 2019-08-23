# @vope/foreignobject

## Install
```
npm install @vope/foreignobject
```

## NPM 命令
```bash
# 开发环境
npm run dev

# 发布
npm run build
```

## 说明
##### 测试环境：Chrome（75.0.3770.100），Firefox（68.0.1）
* button、input 系列，不能正确的显示默认样式（原因：1、默认 CSS 不能通过 getPropertyValue 正确获取到；2、shadow dom 影响）
* （Firefox）input[type=radio|checkbox] 不显示
* 动态属性（不能通过节点属性表示，如 input[checkbox] 的 indeterminate）设置的效果不显示
* 避免出现浏览器滚动条（1、Firefox 不显示滚动条；2、Chrome 由于 getPropertyValue 计算 width 或 height 受 box-sizing 影响，有可能获取到不正确值）
* input[type=date|time] 不显示 value（Firefox）
* input[type=file] 不显示 value
* ::placeholder 设置的样式无效
* input[type=color] 会造成截图失败
* 如果设置了 box-shadow 则截图的开始位置是从 box-shadow 上、左值边际开始计算
* （Firefox）使用 columns 排版产生错乱
* （Firefox）截图 vedio 时偶尔会出现空白

## Usage
```
import foreignObkect from '@vope/foreignobject';

foreignObkect(element, {
  clearPlaceholder: false, //是否删除 textarea 和 input （可输入系列）的 placeholder（防止空值时被填充）
  download: false, //设置是否自动下载
  downloadName: null, //下载文件名称，为空时会自动创建一个随机值（设置自动下载时有效）
  downloadType: 'png', //下载文件类型（设置自动下载时有效）
  ignoreFetchError: true, //是否忽略请求错误，如果设置为 false 则当请求出现错误时将会被抛出并且中断截图
}).then((canvas) => {...});
```

## Changlog
##### 1.0.2
  - 修复截图 canvas 元素
  - 修复截图 vedio 元素
  - 增加配置字段 ignoreFetchError
##### 1.0.1
  - 修复跨域图片设置错误