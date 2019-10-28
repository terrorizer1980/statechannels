const path = require('path');

const typescript = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.ts']
  }
};

const cdnConfig = {
  ...typescript,
  target: 'web',
  mode: 'production',
  output: {
    filename: 'channel-provider.min.js',
    libraryTarget: 'window',
    path: path.resolve(__dirname, 'dist')
  }
};

const cdnDebugConfig = {
  ...typescript,
  ...cdnConfig,
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    ...cdnConfig.output,
    filename: 'channel-provider.js'
  }
};

module.exports = [cdnConfig, cdnDebugConfig];