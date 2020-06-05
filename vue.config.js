'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
require('uglifyjs-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue Element Admin' // page title
const isDev = process.env.NODE_ENV === 'development'
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // change xxx-api/login => mock/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_PROXY_URL,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
  configureWebpack: (config) => { // 配置webpack
    config.name = name
    if (!isDev) {
      // 清除console
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true

      // 开启zip
      config.plugins.push(new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      })
      )
    }
    // config.externals = {
    //   BMap: 'BMap'
    // }
    /* config.module.rules.push(
      {
        test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf)$/i,
        include: [resolve('src')],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }) */
  },

  chainWebpack(config) {
    // 修复HMR
    config.resolve.symlinks(true)
    config.resolve.alias
      .set('@', resolve('src'))

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{ // 让 js 加载方式支持 Async 或 defer
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
        }
      )

    if (!isDev) {
      // 删除预加载
      config.plugins.delete('preload')
      config.plugins.delete('prefetch')

      // 压缩代码
      config.optimization.minimize(true)
      // 分割代码
      config.optimization.splitChunks({
        chunks: 'all'
      })
    }
  }
}
