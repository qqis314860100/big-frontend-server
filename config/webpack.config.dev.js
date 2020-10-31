const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')

const webpackDevConfig = webpackMerge(baseConfig, {
  mode: 'development',
  devtool: 'eval-source-map',
  stats: { children: false },
})

module.exports = webpackDevConfig
