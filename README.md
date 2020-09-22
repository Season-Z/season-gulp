# season-gulp

## 介绍

对 gulp 的工作流进行封装。整合了 3 个命令：打包、开发环境运行和清空打包后的文件夹。

使用时，目标项目不需要安装 gulp 相关的库，直接使用本脚手架来运行就好具体如下：

- `season-gulp build`：该命令为打包
- `season-gulp develop`：该命令为开发环境运行
- `season-gulp clean`：该命令为清空打包输出的文件夹

## 使用

`yarn add season-gulp`

### 自定义配置

在项目的根目录添加文件：`gulp.config.js`，可修改如下配置

```json
{
  "data": {}, // 项目的静态数据，可通过ejs模板来引入到页面
  "dist": "dist", // 打包后的文件夹
  "temp": "temp", // 开发环境打包的临时文件夹
  "src": "src", // 项目的入口
  "public": "public",
  "paths": {
    "styles": "src/assets/styles",
    "script": "src/assets/scripts",
    "pages": "src",
    "images": "src/assets/images",
    "fonts": "src/assets/fonts",
    "public": "public"
  }
}
```

## 查看 demo 示例

因为本地有点问题，无法发布到 npm。使用 yarn link 来查看

```js
yarn

yarn link

cd demo

yarn

yarn link "season-gulp"

....使用命令
```
