const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  // change to .tsx if necessary
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    filename: './bundle.js',
    publicPath: '/',
  },
  resolve: {
    // changed from extensions: [".js", ".jsx"]
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      // changed from { test: /\.jsx?$/, use: { loader: 'babel-loader' }, exclude: /node_modules/ },
      {
        test: /\.(t|j)sx?$/,
        use: { loader: 'ts-loader' },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(jpe?g|gif|png|eot|svg|woff|woff2|ttf)$/,
        loader: 'file-loader',
      },

      // addition - add source-map support
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'source-map-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Nothing',
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],

  // addition - add source-map support
  devtool: 'source-map',
};
