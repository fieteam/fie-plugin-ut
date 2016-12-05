'use strict';

/* eslint no-console: 0 */

const chalk = require('chalk');
const spawn = require('cross-spawn');
const yeoman = require('yeoman-environment');

const env = yeoman.createEnv();

env.register(require.resolve('./generators/app'), 'ut');
env.register(require.resolve('./generators/add'), 'ut:add');

var Commands = {

  init: function(fie, options) {
    var clientArgs = options.clientArgs || [];
    var type = clientArgs[0];

    env.run('ut' + (type ? ' ' + type : ''), function(err) {
      if (err) {
        fie.logError(err);
        options.callback(err);
      } else {
        // 设置默认的 fie test 命令
        fie.setModuleConfig('tasks.test', [
          {command: 'fie ut test'}
        ]);

        fie.logSuccess('脚手架展开完毕');
        fie.logInfo('开始安装依赖');
        fie.tnpmInstall({}, function() {
          fie.logSuccess('初始化完毕');
          options.callback();
        });
      }
    });
  },

  add: function(fie, options) {
    var clientArgs = options.clientArgs || [];
    var fileName = clientArgs[0];

    if (!fileName) {
      fie.logError('fie ci add: need a case name argument');
      return;
    }

    env.run('ut:add ' + fileName, function(err) {
      if (err) {
        fie.logError(err);
      }
      options.callback();
    });
  },

  test: function() {
    spawn('tnpm', ['test'], {stdio: 'inherit'});
  },

  help: function() {

    var help = [
      '',
      'fie-plugin-ut 插件使用帮助:',
      ' $ fie ut init [type]           生成单测环境配置文件, type有browser和node两种',
      ' $ fie ut add caseName          添加用例文件, caseName可以带目录, 例如 lib/foo',
      ' $ fie ut test                  执行测试',
      ' $ fie ut help                  查看帮助信息',
      '',
      '关于 fie-plugin-ci 插件的配置可查看: http://fie.alibaba.net/doc2/plugin?name=@ali/fie-plugin-ci',
      '',
      ''
    ].join('\r\n');

    process.stdout.write(chalk.magenta(help));

  }
};

/**
 * @param fie fie接口集合
 * @param options
 * @param options.clientArgs , 若用户输入 fie ut nnn -m xxxx 则 cliArgs为 [ 'nnn', '-m', 'xxxx']
 * @param options.pluginConfig 强制重置 fie.config.js 里面的参数,如果有传入的值,则优先使用这个,在被其他插件调用的时候可能会传入
 * @param options.callback 操作后的回调, 在被其他插件调用时,可能会传入
 */
module.exports = function(fie, options) {

  var commandMethod = options.clientArgs.splice(0, 1).pop() || '';

  options.callback = options.callback || function() {};

  if (!commandMethod) {
    Commands.test(fie, options);
  }

  if (Commands[commandMethod]) {
    Commands[commandMethod](fie, options);
  } else {
    console.log(
      chalk.magenta('\r\n命令fie ut' + commandMethod + '不存在, 可以使用以下命令:')
    );
    Commands.help();
  }
};
