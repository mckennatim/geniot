var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.resolve(__dirname, 'node_modules');

var config = {
  entry: {
    app: path.resolve(__dirname, './src/app.js'),
    vendors: ['react'] // And other vendors
  },
  output: {
    path: path.resolve(__dirname, 'dist2'),
    filename: '[name].js' // Notice we use a variable
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: [node_modules_dir],
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')
  ]
};

module.exports = config;