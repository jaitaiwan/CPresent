var path          = require('path'),
    webpack       = require('webpack'),
    htmlWebpack   = require('html-webpack-plugin'),
    BUILD_DIR     = path.resolve(__dirname, 'dist'),
    APP_DIR       = path.resolve(__dirname, 'src'),
    PORT          = process.env.PORT || "8033",
    HOST          = process.env.HOST || "0.0.0.0",
    sassDirs      = [APP_DIR + '/'],
    reactDirs     = [APP_DIR + '/'];

// Export the webpack configuration
module.exports = {

  // Enable source maps as a devtool
  devtool: 'eval-source-map',

  // Setup the entry point for the react application
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://${HOST}:${PORT}`,
    'webpack/hot/dev-server',
    APP_DIR + '/init.jsx',
  ],

  // Find files with the following extensions
  resolve: {
    root: [].concat(reactDirs),
    extensions: ['', '.js', '.jsx'],
  },

  // Setup where we want the resulting vanilla js to go
  output: {
    path: BUILD_DIR,
    file: 'bundle.js',
    publicPath: '/'
  },

  // List plugins we use to compile and run our app
  module: {
    loaders: [
      // Compile all jsx files to vanilla js using babel
      { test: /\.jsx?/, include: APP_DIR + '/', loader: 'babel' },
      // Minify and include all css files that have been imported
      { test: /\.css?/, loader: "style-loader!css-loader?sourceMap" },
      // Compile and minify all sass files
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader'},
      { test: /\.sass?/, loader: "style-loader!css-loader?sourceMap,modules,localIdentName=[name]__[local]__[hash:base64:24]!sass-loader?sourceMap" },
      { test: /\.scss?/, loader: "style-loader!css-loader?sourceMap,modules,localIdentName=[name]__[local]__[hash:base64:24]!sass-loader?sourceMap" }
    ]
  },

  // Sass loader specific config
  sassLoader: {
    // Setup a easier route to sass files
    includePaths: [
      APP_DIR + '/'
    ]
  },

  // Configuration for the dev server started by `npm start`
  devServer: {
    contentBase: BUILD_DIR, // Location of built files
    hot: true, // Turn on hot-reload
    port: PORT, // Use the port specified at runtime
    historyApiFallback: true, // Let the react app handle 404s
    inline: false,
  },

  // Add plugins to webpack
  plugins: [
    new webpack.NoErrorsPlugin(), // Allows compilation to continue for other modules even if one fails
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpack({ // Creates a dynamic html that includes css js etc on demand when added to jsx files
      template: APP_DIR + "/layouts/template.html"
    })
  ]
};
