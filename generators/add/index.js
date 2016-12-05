/**
 * @author 锂锌 <zinc.lx@alibaba-inc.com>
 */
const generators = require('yeoman-generator');
const path = require('path');

module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    this.config.save();

    this.argument('targetFile', { required: true });
  },

  initializing() {

  },

  writing() {
    this.fs.copyTpl(
      this.templatePath('spec.js'),
      this.destinationPath(`test/${this.targetFile}-spec.js`),
      { module: path.basename(this.targetFile) });
  }
});
