import AV from './lib/av-live-query-core-min'
const adapters = require('./lib/wechat-adapters')

AV.setAdapters(adapters)
AV.init({
  appId: 'oY2aqSxhKvtL2URCcKNehatA-gzGzoHsz',
  appKey: 'yr6xMoCYahu75yy1uRug7Vmv',
  serverURLs: 'https://oy2aqsxh.lc-cn-n1-shared.com',
});

//app.js
App({})
