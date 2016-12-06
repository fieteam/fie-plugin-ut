'use strict';

const helpers = require('yeoman-test');
const assert = require('yeoman-assert');
const fs = require('fs-extra');
const path = require('path');
const spawn = require('child_process').spawn;

const app = path.join(__dirname, '../generators/app');

describe('yo ut', () => {
  describe('browser', () => {
    describe('files', () => {
      it('应该初始化必须的文件', (done) => {
        helpers.run(app)
          // Clear the directory and set it as the CWD
          .inDir(path.join(__dirname, './tmp'), (dir) => {
            fs.copySync(path.join(__dirname, './templates/normal'), dir);
            fs.copySync(path.join(__dirname, './templates/.gitignore'), path.resolve(dir, '.gitignore'));
          })
          .withArguments('browser')
          .toPromise()
          .then(() => {
            assert.file(['karma.conf.js', 'package.json', '.babelrc', '.gitignore']);
            done();
          })
          .catch(done);
      });
    });

    describe('environment', () => {
      let cwd;

      before((done) => {
        helpers.run(app)
          // Clear the directory and set it as the CWD
          .inDir(path.join(__dirname, './tmp'), (dir) => {
            cwd = dir;
            fs.copySync(path.join(__dirname, './templates/normal'), dir);
          })
          .withArguments('browser')
          .toPromise()
          .then(() => {
            const p = spawn('npm', ['i'], { cwd, stdio: 'inherit' });

            p.on('close', (code) => {
              if (code === 0) {
                done();
              } else {
                done(new Error('安装依赖失败'));
              }
            });
          }).catch(done);
      });

      it('正确配置时, 应该能跑通测试', (done) => {
        const p = spawn('npm', ['run', 'test', '--', '--single-run', '--browsers', 'PhantomJS'], { cwd, stdio: 'inherit' });

        p.on('close', (code) => {
          if (code === 0) {
            done();
          } else {
            done(new Error('单测环境错误'));
          }
        });
      });
    });

    describe('.gitignore', () => {
      it('当项目中没有.gitignore文件时, 要生成一个配好的文件', (done) => {
        helpers.run(app)
          // Clear the directory and set it as the CWD
          .inDir(path.join(__dirname, './tmp'), (dir) => {
            fs.copySync(path.join(__dirname, './templates/normal'), dir);
          })
          .withArguments('browser')
          .toPromise()
          .then(() => {
            assert.fileContent('.gitignore', /coverage/);
            done();
          })
          .catch(done);
      });

      it('当项目中已有.gitignore文件时, 要对已有文件追加测试相关的配置', (done) => {
        helpers.run(app)
          // Clear the directory and set it as the CWD
          .inDir(path.join(__dirname, './tmp'), (dir) => {
            fs.copySync(path.join(__dirname, './templates/normal'), dir);
            fs.copySync(path.join(__dirname, './templates/.gitignore'), path.resolve(dir, '.gitignore'));
          })
          .withArguments('browser')
          .toPromise()
          .then(() => {
            assert.fileContent('.gitignore', /foo/);
            assert.fileContent('.gitignore', /coverage/);
            done();
          })
          .catch(done);
      });
    });

    describe('package.json', () => {
      it('当原package.json的scripts中有test相关命令时, 需要进行覆盖', (done) => {
        helpers.run(app)
          // Clear the directory and set it as the CWD
          .inDir(path.join(__dirname, './tmp'), (dir) => {
            fs.copySync(path.join(__dirname, './templates/normal'), dir);
          })
          .withArguments('browser')
          .toPromise()
          .then(() => {
            assert.fileContent('package.json', /"test":\s"\.\/node_modules\/\.bin\/karma\s.*/);
            done();
          })
          .catch(done);
      });
    });

    describe('.babelrc', () => {
      it('当文件有注释时, 应该可以正常读取', (done) => {
        helpers.run(app)
          // Clear the directory and set it as the CWD
          .inDir(path.join(__dirname, './tmp'), (dir) => {
            fs.copySync(path.join(__dirname, './templates/normal'), dir);
            fs.copySync(path.join(__dirname, './templates/.babelrc'), path.resolve(dir, '.babelrc'));
          })
          .withArguments('browser')
          .toPromise()
          .then(() => {
            assert.fileContent('.babelrc', /"foo":\s"bar"/);
            done();
          })
          .catch(done);
      });
    });
  });

  describe('node', () => {
    describe('environment', () => {
      let cwd;

      before((done) => {
        helpers.run(app)
          // Clear the directory and set it as the CWD
          .inDir(path.join(__dirname, './tmp'), (dir) => {
            cwd = dir;
            fs.copySync(path.join(__dirname, './templates/node'), dir);
          })
          .withArguments('node')
          .toPromise()
          .then(() => {
            const p = spawn('npm', ['i'], { cwd, stdio: 'inherit' });

            p.on('close', (code) => {
              if (code === 0) {
                done();
              } else {
                done(new Error('安装依赖失败'));
              }
            });
          }).catch(done);
      });

      after(() => {
        // 回到当前源码根目录（由于generator更改了cwd，会影响到mocha输出测试结果文件的路径）
        process.chdir(path.resolve(__dirname, '../'));
      });

      it('应该初始化必须的文件', () => {
        assert.file(['package.json', '.gitignore', '.istanbul.yml']);
      });

      it('正确配置时, 应该能跑通测试', (done) => {
        // 由于npm test导致进程不管单测能否跑通都会返回 0
        // 所以使用npm run test
        const p = spawn('npm', ['run', 'test', '--', '--require', './test/setup'], { cwd, stdio: 'inherit' });

        p.on('close', (code) => {
          if (code === 0) {
            done();
          } else {
            done(new Error('单测环境错误'));
          }
        });
      });
    });
  });
});
