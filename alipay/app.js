const adapter = require('@leancloud/platform-adapters-alipay')
const AV = require('leancloud-storage/live-query')

AV.setAdapters(adapter)

AV.init({
  appId: 'oY2aqSxhKvtL2URCcKNehatA-gzGzoHsz',
  appKey: 'yr6xMoCYahu75yy1uRug7Vmv',
  serverURL: 'https://oy2aqsxh.lc-cn-n1-shared.com',
})

App({});
