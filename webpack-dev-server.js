const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.js');

config.entry.app.unshift(
  'webpack-dev-server/client?http://localhost:3000/',
  'webpack/hot/dev-server'
);

const compiler = webpack(config);
const server = new webpackDevServer(compiler, {
    hot: true,
    inline: true
  }
);

server.listen(3000);