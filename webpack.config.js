/*
TO DO:
- Add img hashing and optimization, and implement src, href, data-src replacement
*/

const path = require('path');
const TerserJsPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
// const WebpackProvideGlobalPlugin = require('webpack-provide-global-plugin');

module.exports = {
  mode: "production",
  entry: ["./src/js/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'js/main.[contenthash].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/style.[contenthash].css'
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Lila Karpowicz, web developer',
      template: '!!ejs-compiled-loader-webpack4!src/index.template.ejs'
    }),
    new StylelintPlugin({
      context: path.resolve(__dirname, 'src/sass/'),
    }),
  ],
  optimization: {
    minimizer: [new TerserJsPlugin({}), new OptimizeCssAssetsPlugin({})]
  },
  module: {
    rules: [
      {
        test:/\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              syntax: 'postcss-scss',
              plugins: [
                require('postcss-import'),
                require('stylelint'),
                require('postcss-reporter'),
                require('autoprefixer'),
              ]
            }
          },
          'sass-loader',
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[ext]' /* TO DO: implement hashing */
          }
        }
      },
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader',
            options: 'jQuery'
          },
          {
            loader: 'expose-loader',
            options: '$'
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          },
          'eslint-loader'
        ]
      }
      // {
      //   test: /\.(html)$/,
      //   exclude: /node_modules/,
      //   use:
      //   {
      //     loader: "html-loader",
      //     options: {
      //       attrs: ["img:src", "link:href", ":data-src"]
      //     }
      //   }
      // }
    ]
  },
  watch: true,
  watchOptions: {
    ignored: /node_modules/
  }
}