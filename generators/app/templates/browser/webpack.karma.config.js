'use strict';

/* eslint "no-console": 0 */
const path = require('path');
const _ = require('lodash');

/**
 * 按照顺序尝试加载webpack配置, 并返回一个为enzyme做过适配的配置对象
 *
 * @param webpackConfig
 * @returns {*}
 */
module.exports = function(webpackConfig) {
  let result;
  const config = webpackConfig || getProjectConfig(__dirname);

  if (config && config.module) {
    result = adapt(config);
  } else {
    console.error('未提供webpack配置');
    console.log('请参考文档检查是否正确的配置了webpack');
    console.log('https://github.com/fieteam/fie-plugin-ut');
    process.exit(1);
  }

  return result;
};

function getProjectConfig(cwd) {
  let result;

  if (!result) {
    result = readFieConfigAdapter(cwd);
  }

  if (!result) {
    result = readNormalConfig(cwd);
  }

  return result;
}

function readNormalConfig(cwd) {
  let result;

  try {
    result = require(path.resolve(cwd, './webpack.config'));
  } catch (e) {

  }

  // 判断是否是一个常规的webpack配置
  if (!result || !result.module) {
    result = null;
  }

  return result;
}

function readFieConfigAdapter(cwd) {
  let result;

  try {
    result = require(path.resolve(cwd, './fie.config')).ut.getWebpackConfig();
  } catch (e) {

  }

  return result;
}

function adapt(config) {
  let jsonLoader = {
    test: /\.json$/,
    loader: 'json',
  };

  // 确保配置了一个json loader
  if (config.module && config.module.loaders) {
    let hasJSONLoader = false;
    config.module.loaders.forEach(function(item) {
      if ('json' === item.loader) {
        hasJSONLoader = true;
      }
    });

    if (!hasJSONLoader) {
      config.module.loaders.push(jsonLoader);
    }
  }

  // for enzyme
  const externals = {
    'react/addons': true,
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true
  };

  Object.assign(config, {externals});

  // karma watches the test dir
  delete config.entry;
  delete config.output;

  // 删除一些干扰测试的插件
  deletePlugins(config);

  return config;
}

function deletePlugins(config) {
  _.remove(config.plugins || [], function(plugin) {
    let result = false;
    let pluginName = _.get(plugin, 'constructor.name', '');

    switch (pluginName) {
      // 先删了这货，影响了错误定位
      case 'UglifyJsPlugin':
        result = true;
        break;
      // 这个插件目前karma-webpack不支持 @see https://github.com/webpack/karma-webpack/issues/149
      case 'CommonsChunkPlugin':
        result = true;
        break;
      // 会影响到watch模式的后续测试运行
      case 'DedupePlugin':
        result = true;
        break;
    }

    return result;
  });
}
