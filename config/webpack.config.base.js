const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const utils = require('./utils.js')

module.exports = {
  target: 'node',
  entry: {
    server: path.join(utils.APP_PATH, 'index.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: utils.DIST_PATH,
  },
  resolve: { ...utils.getWebpackResolveConfig },
  module: {
    rules: [
      {
        test: /\.js|jsx$/,
        use: { loader: 'babel-loader' },
        exclude: [path.join(__dirname, '/node_modules')],
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin(),
    /**
     * DefinePlugin:允许我们在打包的时候定义一个全局的常量
     */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV:
          process.env.NODE_ENV === 'production' ||
          process.env.NODE_ENV === 'prod'
            ? "'production'"
            : "'development'",
      },
    }),
  ],
}
