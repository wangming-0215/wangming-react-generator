const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.json', '.png', '.jpg', '.gif'],
    modules: [path.resolve(__dirname, '../src'), 'node_modules'],
    alias: {
      images: path.resolve(__dirname, '../src/assets/images')
    }
  },
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../build'),
    filename: 'js/[name].[hash:base64:5].js',
    chunkFilename: 'js/[name].[chunkhash:base64:5].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: 'eslint-loader',
        options: {
          failOnWarning: true,
          failOnError: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'images/[name].[hash:base64:5].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(ttf|woff2?|eot)/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:base64:5].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlPlugin({
      title: 'react',
      filename: 'index.html',
      favicon: path.resolve(__dirname, '../src/assets/favicon.ico')
    })
  ]
};
