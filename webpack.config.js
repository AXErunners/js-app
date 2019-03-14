const path = require('path');

const commonJSConfig = {
  entry: ['@babel/polyfill', './lib/AxePlatformProtocol.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'AxePlatformProtocol.min.js',
    library: 'AxePlatformProtocol',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

module.exports = [commonJSConfig];
