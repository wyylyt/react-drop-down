// const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: './index.js',
  // output: {
  //   filename: 'bundle.js',
  //   path: path.resolve(__dirname, '../dist'),
  // },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name][hash:8].[ext]',
            },
          },
        ],
      },
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   use:[
      //     {
      //       loader: 'url-loader',
      //       options: {
      //           name: './img/[name].[ext]'
      //       },
      //     }
      //   ]
      // }
    ],
  },
  devServer: {
    // contentBase: './dist',
  },
  // autoOpenBroswer: true,
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new OpenBrowserPlugin({ url: 'http://localhost:8080' }),
  ],
};