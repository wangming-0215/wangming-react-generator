const path = require('path');
const webpack = require('webpack');

const HOST = 'localhost';
const PORT = 3000;

module.exports = {
  entry: {
    app: [
      'react-hot-loader/patch',
      path.resolve(__dirname, '..', 'src', 'index.js')
    ]
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  },
  devServer: {
    host: HOST,
    port: PORT,
    hot: true,
    historyApiFallback: true
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.NamedModulesPlugin()
  ]
};
