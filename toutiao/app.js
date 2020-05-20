const AV = require('./lib/leancloud-storage/av-live-query-weapp')
const adapter = require('./lib/toutiao-adapter/index')

AV.useAdapters(adapter)

AV.init({
  appId: 'oY2aqSxhKvtL2URCcKNehatA-gzGzoHsz',
  appKey: 'yr6xMoCYahu75yy1uRug7Vmv',
  serverURL: 'https://oy2aqsxh.lc-cn-n1-shared.com',
})

App({})
