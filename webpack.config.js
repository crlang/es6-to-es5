const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TimeStamp = new Date().getTime();

module.exports = {
  entry: {
    entry: path.join(__dirname, 'src/index.js'),
    vue: 'vue'
  },
  output: {
    filename: 'js/[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: { // 合并公用 js
          test: /[\\/]node_modules[\\/]/,
          name: 'common',
          priority: 10,
          chunks: 'all'
        },
        styles: { // 合并 css
          name: 'styles',
          test: /\.css$/,
          chunks: 'all', // merge all the css chunk to one file, if you need
          enforce: true
        }
      }
    },
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({}) // use OptimizeCSSAssetsPlugin
    ]
  },
  module: {

    rules: [{
      test: require.resolve('./src/jquery-3.3.1.min.js'),
      use: [{
        loader: 'expose-loader',
        options: '$'
      }]
    }, { // js 打包转换为es5
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader",
        options: {
          presets: [
            ["env", {
              "targets": {
                "browsers": ["last 15 versions", "safari >= 4", "not ie < 9", "iOS >= 7"]
              }
            }],
          ],
        }
      }]
    }, { // 样式打包分离兼容
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            config: {
              path: path.resolve(__dirname, './postcss.config.js')
            }
          },
        }
      ]
    }]
  },
  resolve: {
    alias: {
      "vue": "vue/dist/vue.js" // 指定vue位置
    }
  },
  externals: { // 额外的引用jq
    // "lodash": {
    // amd: "$",//如果我们的库使用require.js等加载,等价于 define(["lodash"], factory);
    // jquery: "window.jQuery"//如果我们的库在浏览器中使用，需要提供一个全局的变量‘_’，等价于 var _ = (window._) or (_);
    // }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProvidePlugin({ // 按需加载内容
      vue: 'vue' // vue
    }),
    new MiniCssExtractPlugin({ // 分离css
      filename: "./css/[name].css",
      chunkFilename: "./css/[id].css"
    })
  ]
}