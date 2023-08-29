const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),
  devtool: 'inline-source-map',
  entry: './index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    assetModuleFilename: 'images/[hash][ext][query]',
  },
  // devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/i,
        use: [MiniCSSExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [ // для генерации сервис-воркера
    new HTMLWebpackPlugin({
      template: './index.html',
    }),
    new MiniCSSExtractPlugin({
      filename: '[name].css',
    }),
    // new CleanWebpackPlugin(),

    new WorkboxPlugin.GenerateSW({
      swDest: 'service-worker.js', // который указывает имя и путь к файлу сервис-воркера
      clientsClaim: true, // которые позволяют сервис-воркеру немедленно стать активным и управлять всеми вкладками с вашим веб-приложением
      skipWaiting: true,
    }),
  ],
};
