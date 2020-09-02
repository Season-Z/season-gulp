'use strict';

const { src, dest, parallel, series, watch } = require('gulp');
const del = require('del');
const bs = require('browser-sync');
const loadPlugins = require('gulp-load-plugins');
const plugins = loadPlugins();
const cwd = process.cwd();
let config = {
    data: {},
    dist: 'dist',
    temp: 'temp',
    src: 'src',
    public: 'public',
    paths: {
        styles: 'src/assets/styles',
        script: 'src/assets/scripts',
        pages: 'src',
        images: 'src/assets/images',
        fonts: 'src/assets/fonts',
        public: 'public'
    }
};
try {
    const loadConfig = require(`${cwd}/pages.config.js`);
    config = Object.assign({}, config, loadConfig);
}
catch (e) { }
const stylePath = `${config.paths.styles}/*.scss`;
const scriptPath = `${config.paths.script}/*.js`;
const pagePath = `${config.paths.pages}/*.html`;
const imagePath = `${config.paths.images}/**`;
const fontPath = `${config.paths.fonts}/**`;
const publicPath = `${config.paths.public}/**`;
const clean = () => {
    return del([config.dist, config.temp]); // temp为临时目录
};
const style = () => {
    return src(stylePath, { base: config.src })
        .pipe(plugins.sass({ outputStyle: 'expanded' }))
        .pipe(dest(config.temp))
        .pipe(bs.reload({ stream: true })); // 文件变化时，将文件的流推到浏览器
};
const script = () => {
    return src(scriptPath, { base: config.src })
        .pipe(plugins.babel({ presets: [require('@babel/preset-env')] }))
        .pipe(dest(config.temp))
        .pipe(bs.reload({ stream: true }));
};
const page = () => {
    return src(pagePath, { base: config.src })
        .pipe(plugins.swig({ data: config.data, defaults: { cache: false } })) // 防止模板缓存导致页面不能及时更新
        .pipe(dest(config.temp))
        .pipe(bs.reload({ stream: true }));
};
const image = () => {
    return src(imagePath, { base: config.src })
        .pipe(plugins.imagemin())
        .pipe(dest(config.dist));
};
const font = () => {
    return src(fontPath, { base: config.src })
        .pipe(plugins.imagemin())
        .pipe(dest(config.dist));
};
const extra = () => {
    return src(publicPath, { base: config.public })
        .pipe(dest(config.dist));
};
const useref = () => {
    return src(`${config.temp}/*.html`, { base: config.temp })
        .pipe(plugins.useref({ searchPath: [config.temp, '.'] }))
        // 对html js css 进行压缩操作
        .pipe(plugins.if(/\.js$/, plugins.uglify()))
        .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
        .pipe(plugins.if(/\.html$/, plugins.htmlmin({
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
    })))
        .pipe(dest(config.dist)); // 对资源整合以及代码压缩后需要打包到一个新的文件中。如果还是放在dist目录的话容易造成一边读一边写的情况，造成混乱代码丢失
};
const serve = () => {
    watch(stylePath, style);
    watch(scriptPath, script);
    watch(pagePath, page);
    watch([imagePath, fontPath, publicPath], bs.reload);
    bs.init({
        notify: false,
        // port: 2000,
        // open: false,
        // files: 'dist/**',  // 每次文件内容变化时，gulp的watch方法都能接收到，所以也不需要一定设置files属性
        server: {
            baseDir: [config.temp, config.src, config.public],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });
};
const compile = parallel(style, script, page);
const build = series(clean, parallel(series(compile, useref), image, font, extra));
const develop = series(compile, serve);
module.exports = {
    useref,
    clean,
    compile,
    build,
    develop
};
