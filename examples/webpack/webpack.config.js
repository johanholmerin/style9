const path = require('path');
const Style9Plugin = require('style9/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts|js|mjs|jsx)$/,
        use: Style9Plugin.loader,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      }
    ]
  },
  plugins: [
    new Style9Plugin(),
    new MiniCssExtractPlugin({
      filename: 'index.css'
    })
  ]
};
