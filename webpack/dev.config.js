const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name:'img/[name][hash:8].[ext]'
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
    contentBase: './dist'
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './index.html'
    })
  ],
};