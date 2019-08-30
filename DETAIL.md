* 如果设置了 box-shadow 则截图的开始位置是从 box-shadow 上、左值边际开始计算
* 动态属性（不能通过节点属性表示，如 input[checkbox] 的 indeterminate）设置的效果不显示

##### Chrome（75.0.3770.100），Firefox（68.0.1）
* button、input 系列，不能正确的显示默认样式（原因：1、默认 CSS 不能通过 getPropertyValue 正确获取到；2、shadow dom 影响）
* （Firefox）input[type=radio|checkbox] 不显示
* 避免出现浏览器滚动条（1、Firefox 不显示滚动条；2、Chrome 由于 getPropertyValue 计算 width 或 height 受 box-sizing 影响，有可能获取到不正确值）
* （Firefox）input[type=date|time] 不显示 value
* input[type=file] 不显示 value
* ::placeholder 设置的样式无效
* input[type=color] 会造成截图失败
* （Firefox）使用 columns 排版产生错乱
* （Firefox）截图 vedio 时偶尔会出现空白

##### Chrome（76.0.3809.100）
* （Chrome）使用跨域字体在无缓存刷新后第一次截图会出现空白