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

## 要避免的情况
[电车](./DETAIL.md)

## Changlog
[日志](./LOGS.md)