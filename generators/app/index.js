/**
 * @author 锂锌 <zinc.lx@alibaba-inc.com>
 */
const generators = require('yeoman-generator');
const _ = require('lodash');
const fs = require('fs');
const stripJsonComments = require('strip-json-comments');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    this.argument('type', {
      desc: 'template type: node or browser',
      required: false
    });
    this.config.save({
      type: this.type
    });
  },

  initializing() {

  },

  _mergeJSONFile(src, dest) {
    const srcJSON = this.fs.readJSON(src);
    const destJSON = JSON.parse(stripJsonComments(this.fs.read(dest)));

    _.defaultsDeep(destJSON, srcJSON);

    // 考虑到如果用户使用我们的模板, 就是希望使用我们提供的命令
    // 所以如果是package.json, 我们要覆盖scripts里原有的test相关的命令
    if (src.indexOf('package.json') > -1) {
      _.assign(destJSON.scripts, srcJSON.scripts);
    }

    this.fs.writeJSON(dest, destJSON);
  },

  _copyJSONFile(src, dest) {
    if (this.fs.exists(dest)) {
      this._mergeJSONFile(src, dest);
    } else {
      this.fs.copy(src, dest);
    }
  },

  prompting() {
    if (!this.type) {
      return this.prompt([{
        name: 'type',
        type: 'list',
        message: 'Please choose the template type',
        choices: [
          { name: 'Browser', value: 'browser' },
          { name: 'Node', value: 'node' }
        ],
        store: true
      }]).then((answers) => {
        this.type = answers.type;
      });
    }

    return Promise.resolve();
  },

  writing: {

    browser() {
      if (this.type === 'browser') {
        testDir(this, this.type);
        copyFile(this, 'karma.conf.js', this.type);
        copyFile(this, 'webpack.karma.config.js', this.type);
        copyJSONFile(this, '.babelrc', this.type);
        copyJSONFile(this, 'package.json', this.type);
        mergeIgnore(this, '_gitignore', this.type);
      }
    },

    node() {
      if (this.type === 'node') {
        testDir(this, this.type);
        copyJSONFile(this, 'package.json', this.type);
        copyFile(this, '.istanbul.yml', this.type);
        mergeIgnore(this, '_gitignore', this.type);
      }
    }
  },
});

function copyFile(context, fileName, type) {
  const templateName = type ? [type, fileName].join('/') : fileName;
  const from = context.templatePath(templateName);
  const to = context.destinationPath(fileName);

  context.fs.copy(from, to);
}

function copyJSONFile(context, fileName, type) {
  const templateName = type ? [type, fileName].join('/') : fileName;
  const from = context.templatePath(templateName);
  const to = context.destinationPath(fileName);

  context._copyJSONFile(from, to);
}

function testDir(context, type) {
  const from = context.templatePath(`${type}/test/**/*`);
  const to = context.destinationPath('test');

  context.fs.copy(from, to, { globOptions: { dot: true } });
}

function mergeIgnore(context, fileName, type) {
  const templateName = type ? [type, fileName].join('/') : fileName;
  const from = context.templatePath(templateName);
  const to = context.destinationPath(fileName.replace('_', '.'));

  fs.writeFileSync(to, fs.readFileSync(from, 'utf8'), {
    encoding: 'utf8',
    flag: 'a'
  });
}
