const webpack = require('webpack');
const PROD = process.env.NODE_ENV === 'production';


module.exports = {
  entry: __dirname + "/src/index.es6",
  devtool: "source-map",
  output: {
    path: __dirname + "/build/",
    filename: PROD ? "elitejax.min.js" : "elitejax.js"
  },
  module: {
    preLoaders: [
      { test: /\.es6?$/, exclude: /node_modules/, loader: 'eslint-loader', include: __dirname + '/' }
    ],
    loaders: [
      { test: /\.es6$/, exclude: /node_modules/, loader: "babel" }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.es6']
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ] : []
}
