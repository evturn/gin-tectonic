const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'dist'),
  publicPath: '/dist/'
}

module.exports = {
  entry: {
    app: [
      './src/js',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'
    ]
  },
  output: {
    path: PATHS.dest,
    filename: 'bundle.js',
    publicPath: PATHS.publicPath
  },
  devServer: {
    outputPath: PATHS.dest,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    hot: true,
    inline: true,
    progress: true,
    stats: 'errors-only',
    port: 3000,
    host: 'localhost'
  },
  module: {
    loaders: [
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: PATHS.src
      },{
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader'),
      },{
        test: /\.(eot|ttf|woff|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader'
      },{
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
    ],
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.less'],
    moduleDirectories: ['app', 'node_modules']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new WriteFilePlugin(),
    new ExtractTextPlugin('dist/app.css')
  ]
}