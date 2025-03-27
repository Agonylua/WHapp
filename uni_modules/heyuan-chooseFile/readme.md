# heyuan-chooseFile

## 功能
1. 本地文件选择，例如.txt文件、.json文件

uni-app自带的文件选择，只支持图片和视频，想要选择本地其他格式的文件，只能通过其他方法实现。

网上资料参差不齐，又杂乱，有说通过input标签实现，有说通过h5+实现，试了一下都不太合适。
最终也是通过结合这诸多资料整理出目前的方案。

基本实现方式是通过render.js是实现，自定义一个button，点击调用render.js里面的方法，往Dom里插入一个input标签，
并监听数据的变化。拿到input标签返回数据后回调给vue里面的方法，来进行数据处理。

## 快速集成

1. 点击右上角的 使用 HBuilder X 导入插件 按钮直接导入项目
2. 点击 下载插件 ZIP 按钮下载插件包并解压到项目的 uni_modules 目录下

## 使用方法

1. 在需要选择文件的页面，在Vue结构中引用hy-chooseFile，并定义readJSONFinish方法
```vue
  <heyuan-chooseFile @readJSONFinish="readFile"></heyuan-chooseFile>
```

2. 在js中定义readJSONFinish对应的方法，返回值res即为所选择文件的json内容
```javascript
  readFile(res) {
    console.log('文件内容', res)
}
```

