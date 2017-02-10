var path = require('path');
var webpack = require('webpack');
var node_modules_dir = '../../../../node_modules';

var config = {
  entry: {
    app: path.resolve(__dirname, './src/app.js'),
    vendors: ['react'] // And other vendors
  },
  output: {
    path: path.resolve(__dirname, 'dist2'),
    filename: '[name].js' // Notice we use a variable
  },
  devtool: 'cheap-module-source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: [
        node_modules_dir,
        /node_modules/
      ],
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({minimize: true})
  ]
};

module.exports = config;