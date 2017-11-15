const path = require('path');
const webpack = require('webpack');
const Uglyjs = require('uglifyjs-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssets = require('optimize-css-assets-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, '..', 'src/index.js')
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { modules: true }
            },
            { loader: 'sass-loader' },
            { loader: 'postcss-loader' }
          ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/[name].[contenthash].css',
      allChunks: true
    }),
    new OptimizeCssAssets({
      cssProcessor: require('cssnano'),
      cssProcessorOptions: {
        discardComments: { removeAll: true }
      },
      canPrint: false
    }),
    new CleanPlugin(['build'], { root: path.resolve(__dirname, '..') }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) =>
        resource &&
        resource.indexOf('node_modules') >= 0 &&
        resource.match(/\.js$/)
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      // optional, Infinity tells webpack not to move any modules to the resulting bundle
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new Uglyjs({
      uglifyOptions: {
        ie8: true,
        ecma: 8
      }
    })
  ]
};
