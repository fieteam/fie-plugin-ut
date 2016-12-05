const path = require('path');
const webpack = require('webpack');

const srcPath = path.resolve(__dirname, './src');
const outputPath = path.resolve(__dirname, './build');

module.exports = {

  context: srcPath,

    // webpack 编译的入口文件
  entry: {
    index: ['./index.scss', './index.jsx']
  },

    // 输出的文件配置
  output: {
    path: outputPath,
    filename: '[name].js',
    publicPath: '/build/'
  },

  resolve: {
    root: srcPath,
    extensions: ['', '.js', '.jsx'],
    alias: {
      '@alife/seller-close-order': srcPath,
      '@alife/seller-close-order/lib': srcPath
    }
  },

  externals: [{
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  }, {
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    }
  }],

  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loaders: ['babel']
    }]
  },
};
