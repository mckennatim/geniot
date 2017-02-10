const path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './src/app.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      include: __dirname,
      query:
      {
        presets:['es2015']
      } 
    },
    ]
  },
  devServer: {
    contentBase: './dist',
  },
  devtool: 'source-map',
  plugins: [
  ]    
}
