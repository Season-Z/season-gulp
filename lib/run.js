const { src, dest, parallel, series, watch } = require("gulp");

// TODO 样式打包未完成
const del = require("del");
const bs = require("browser-sync");

const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackDev = require('../webpack/webpack.development')
const webpackProd = require('../webpack/webpack.production')

const loadPlugins = require("gulp-load-plugins");
const plugins = loadPlugins();


const { SRC_PATH, SCRIPT_PATH, STYLE_PATH, PUBLIC_PATH, ASSETS_PATH, HTML_PATH, DIST_PATH, TEMP_PATH, IS_DEV } = require('../config');

const scssPath = `${STYLE_PATH}/*.scss`;
const scriptPath = `${SCRIPT_PATH}/*.(tsx|jsx|ts|js)`;
const pagePath = `${HTML_PATH}/*.html`;
const imagePath = `${ASSETS_PATH}/**`;
const fontPath = `${ASSETS_PATH}/**`;
const publicPath = `${PUBLIC_PATH}/**`;
const lessPath = `${STYLE_PATH}/*.less`


const clean = () => del([DIST_PATH, TEMP_PATH]); // temp为临时目录

const scss = () => {
  return src(scssPath, { base: SRC_PATH })
    .pipe(plugins.sass({ outputStyle: "expanded" }))
    .pipe(dest(TEMP_PATH))
    .pipe(bs.reload({ stream: true })); // 文件变化时，将文件的流推到浏览器
};

const less = () => {
  return src(lessPath, { base: SRC_PATH })
    .pipe(plugins.less({ outputStyle: "expanded" }))
    .pipe(dest(TEMP_PATH))
    .pipe(bs.reload({ stream: true })); // 文件变化时，将文件的流推到浏览器
};

const script = () => {
  return src(scriptPath, { base: SRC_PATH })
    .pipe(plugins.babel({ presets: [require("@babel/preset-env")] }))
    .pipe(plugins.if(IS_DEV, webpackStream(webpackDev, webpack)))
    .pipe(plugins.if(!IS_DEV, webpackStream(webpackProd, webpack)))
    .pipe(dest(TEMP_PATH))
    .pipe(bs.reload({ stream: true }));
}

const page = () => {
  return src(pagePath, { base: SRC_PATH })
    .pipe(plugins.swig({ data: {}, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
    .pipe(dest(TEMP_PATH))
    .pipe(bs.reload({ stream: true }));
};

const image = () => {
  return src(imagePath, { base: SRC_PATH })
    .pipe(plugins.imagemin())
    .pipe(dest(DIST_PATH));
};

const font = () => {
  return src(fontPath, { base: SRC_PATH })
    .pipe(plugins.imagemin())
    .pipe(dest(DIST_PATH));
};

const extra = () => {
  return src(publicPath, { base: PUBLIC_PATH }).pipe(dest(DIST_PATH));
};

const useref = () => {
  // 对打包后的html文件的资源依赖进行整合，将第三方的依赖打包到一个新的文件中。资源的路径也不再引用node_modules里面
  return (
    src(`${TEMP_PATH}/*.html`, { base: TEMP_PATH })
      .pipe(plugins.useref({ searchPath: [TEMP_PATH, "."] }))
      // 对html js css 进行压缩操作
      .pipe(plugins.if(/\.js$/, plugins.uglify()))
      .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
      .pipe(
        plugins.if(
          /\.html$/,
          plugins.htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
          })
        )
      )
      .pipe(dest(DIST_PATH))
  ); // 对资源整合以及代码压缩后需要打包到一个新的文件中。如果还是放在dist目录的话容易造成一边读一边写的情况，造成混乱代码丢失
};

const serve = () => {
  watch(scssPath, scss);
  watch(lessPath, less);
  watch(scriptPath, script);
  watch(pagePath, page);

  watch([imagePath, fontPath, publicPath], bs.reload);

  bs.init({
    notify: false,
    port: 2000,
    // open: false,
    // files: 'dist/**',  // 每次文件内容变化时，gulp的watch方法都能接收到，所以也不需要一定设置files属性
    server: {
      baseDir: [TEMP_PATH, DIST_PATH, SRC_PATH, PUBLIC_PATH], // 服务会从左到右查找资源，先查dist最后public。如此配置因为图片文字等不需要在开发阶段打包影响效率
      routes: {
        // 优先baseDir执行，如果有配置先走这个
        "/node_modules": "./node_modules",
      },
    },
  });
};

const compile = parallel(scss, less, script,);
const build = series(
  clean,
  parallel(series(compile, useref), image, font, extra)
);
const start = series(compile, serve);

module.exports = {
  clean,
  build,
  start,
};
