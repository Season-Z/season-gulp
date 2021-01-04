let config = {
  dist: "dist",
  temp: "temp",
  src: "src",
  public: "public",
  styles: "src",
  script: "src",
  assets: "src/assets",
  html: 'public'
}

const cwd = process.cwd();
try {
  const loadConfig = require(`${cwd}/gulp.config.js`);
  config = Object.assign({}, config, loadConfig);
} catch (e) {
  console.log(e)
}

// const stylePath = `${config.paths.styles}/*.scss`;
// const scriptPath = `${config.paths.script}/*.js`;
// const pagePath = `${config.paths.pages}/*.html`;
// const imagePath = `${config.paths.images}/**`;
// const fontPath = `${config.paths.fonts}/**`;
// const publicPath = `${config.paths.public}/**`;
// const lessPath = `${config.paths.styles}/*.less`

// NODE_ENV
const IS_DEV = process.env.NODE_ENV === 'development'

module.exports = {
  PROJECT_PATH: cwd,
  IS_DEV,
  DIST_PATH: config.dist,
  TEMP_PATH: config.temp,
  SRC_PATH: config.src,
  PUBLIC_PATH: config.public,
  STYLE_PATH: config.styles,
  SCRIPT_PATH: config.script,
  ASSETS_PATH: config.assets,
  HTML_PATH: config.html
}

