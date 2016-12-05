# fie-plugin-ut

## 说明

生成单测环境，支持`browser`和`nodejs`。

很多时候觉得单测很难在项目中做起来，很大一部分原因是因为搭建单测环境比较繁复，配置项比较多，要看许多文档，开始写第一个测试之前还要做那么多工作的话，很容易会放弃。

我们提取了一份较为通用的测试环境配置，能够一键生成测试环境，免去环境搭建的烦恼。



> __支持在已有项目展开__
>
> `package.json`, `.babelrc`等json文件都会merge到已有文件（增量merge，已有属性不会被merge）



### 开启你的TDD之路

#### Browser

生成一个单元测试环境, 集成了Karma, Mocha, Chai & expect.js, Sinon和Webpack

* 支持测试覆盖率报告（基于`babel-plugin-__coverage__`）
* 支持es6, react及其他webpack项目


#### Nodejs

* 支持测试覆盖率报告（基于`istanbul `）
* 添加mocha, chai, sinon依赖, 并稍作集成

## 用法

#### init [env]

生成单测环境目录和配置文件, 添加开发依赖

```bash
$ fie ut init  # 如果没有指定项目类型, 则会进行询问


? Please choose the template type (Use arrow keys)
❯ Browser
  Node
```


```bash
$ fie ut init node  # 直接生成node版本环境

$ fie ut init browser  # 直接生成browser版本环境
```



#### add

添加一个用例文件，开始编写测试用例

```bash
$ fie ut add lib/foo
```

将会在`test`目录下生成一个`lib/foo-spec.js`文件


#### test

执行测试（默认使用本地的chrome, 并执行监听, 文件变化后自动执行测试）

```
# 以下命令效果相同

$ fie ut        # 默认执行测试

$ fie ut test

$ fie test      
```

也可以直接用npm命令:

```
$ npm test

```

## fie.config.js 配置

如果你的`webpack.config.js`导出的内容不是常规webpack配置对象，或者分别试用了几个webpack配置文件，可以在`fie.config.js`中添加一个`ut.getWebpackConfig()`方法，给karma配置一个可用的webpack配置：

```
{
    ut: {
        getWebpackConfig() {
            return require('./webpack.prod.config');
        }
    }    
}
```

## 关于单元测试

首先要了解单元测试要做些什么事情，可以先从了解我们所使用的工具入手：

* 测试框架：[mocha](mochajs.org)
* 断言库：[chai](http://chaijs.com/)
* mock工具：[sinon](http://sinonjs.org/)
* react测试工具：[enzyme](https://github.com/airbnb/enzyme)

目前还没有找到非常好的中文资源，大家有相关好文请在issue里推荐，我们会更新到文档里。

后续也会考虑开始写系列化的单测教程。

