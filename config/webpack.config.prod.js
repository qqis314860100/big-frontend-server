const webpackMerge = require('webpack-merge');
const terserWebpackPlugin = require('terser-webpack-plugin');

const baseConfig = require('./webpack.config.base');

const webpackProdConfig = webpackMerge(baseConfig, {
  mode: 'production',
  stats: { children: false, warnings: false },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 3,
          enforce: true,
        },
      },
    },
    minimizer: [
      new terserWebpackPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            warnings: false,
            drop_console: false,
            dead_code: true,
            drop_debugger: true,
          },
          output: {
            comments: false,
            beautify: false, //一行输出结构
          },
          mangle: true,
        },
        parallel: true,
        sourceMap: false,
      }),
    ],
  },
});

module.exports = webpackProdConfig;
