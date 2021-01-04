const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')

const baseConfig = require('./webpack.common')
// const { PROJECT_PATH, SERVER_HOST, SERVER_PORT } = require('../constant')
// const proxyConfig = require('../../demo1/proxy.js')
// const smp = new SpeedMeasurePlugin();

// NODE_ENV
const env = process.env.NODE_ENV || 'development'
const condition = env === 'production'

const developmentConfig = merge(baseConfig, {
  mode: 'development',
  devtool: condition ? false : 'cheap-module-source-map',
  // devServer: {
  //   host: SERVER_HOST,
  //   port: SERVER_PORT,
  //   clientLogLevel: 'silent', // 日志
  //   hot: true, // 如果页面有报错，就不会启动自动刷新
  //   open: true,
  //   contentBase: path.resolve(PROJECT_PATH, 'dist'), // 指定额外的静态资源路径
  //   compress: true, // 对所有服务启用gzip压缩
  //   stats: 'errors-only', // 终端仅打印 error
  //   proxy: proxyConfig,
  // },
  plugins: [new webpack.HotModuleReplacementPlugin()],
})

// module.exports = smp.wrap(developmentConfig)
module.exports = developmentConfig
