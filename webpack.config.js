/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');

module.exports = (_, { mode }) => {
  const isProduction = mode === 'production';

  return ({
    entry: './src/js/main.js',

    output: {
      path: `${__dirname}/dist`,
      filename: 'js/main.js',
      crossOriginLoading: 'anonymous',
    },

    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [{ loader: 'babel-loader' }],
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.s[ac]ss$/,
          use: [MiniCssExtractPlugin.loader, { loader: 'css-loader' }, { loader: 'sass-loader', options: { sourceMap: true } }],
        },
        {
          test: /\.(svg|jpe?g|gif|png|eot|woff|ttf)$/,
          use: ['url-loader'],
        },
      ],
    },

    resolve: {
      modules: [
        path.resolve(__dirname, './src'),
        'node_modules',
      ],
      extensions: ['.js', '.json'],
      alias: {
        '@app': path.resolve(__dirname, './src'),
      },
    },

    plugins: [
      new HtmlWebpackPlugin({
        hash: isProduction,
        template: './src/index.html',
      }),

      new SriPlugin({
        hashFuncNames: ['sha256', 'sha384'],
        enabled: isProduction,
      }),

      new MiniCssExtractPlugin({
        filename: 'css/main.css',
      }),


      new PurgecssPlugin({
        paths: glob.sync(`${path.resolve(__dirname, './src')}/**/*`,  { nodir: true }),
      }),
    ],

    devServer: {
      contentBase: './dist',
    },
  })
};
