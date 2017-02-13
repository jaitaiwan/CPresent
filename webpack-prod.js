var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var APP_DIR = path.resolve(__dirname, 'src') + '/';

module.exports = {
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    APP_DIR + 'init.jsx'
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'app.min.js',
    publicPath: '/'
  },
  resolve: {
    root: [].concat(APP_DIR),
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'app/layouts/index.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new ExtractTextPlugin('style.min.css'),
    new webpack.optimize.UglifyJsPlugin({
      // compress: {
      //   warnings: false,
      //   screw_ie8: true
      // }
      compress: false,
      manage: false,
      beautify: true
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel',
    }, {
      test: /\.css$/,
      include: /flexboxgrid/,
      loader: ExtractTextPlugin.extract('style', 'css-loader?sourceMap,modules')
    },
    { test: /\.sass?/, loader: ExtractTextPlugin.extract('style', "css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:24]!sass-loader?sourceMap") }
  ]
  },
  // Sass loader specific config
  sassLoader: {
    // Setup a easier route to sass files
    includePaths: [
      APP_DIR
    ]
  },
};
