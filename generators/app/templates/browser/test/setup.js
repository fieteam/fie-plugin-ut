// 在这个文件里引入所需的模块或做些初始化的工作
// import modules needed or make some initialization

// 如果你用到了许多新语法, 在跨浏览器测试时会需要polyfill
require('babel-polyfill');

// for sinon fakeServer IE9 issues https://github.com/sinonjs/sinon/issues/732
// 如果你没有IE9的issue 并且要用到useFakeXDomainRequest的话, 需要删掉此行
sinon.useFakeXDomainRequest = sinon.useFakeXMLHttpRequest;
