let fn = require('./../../mock.functions')
var XYZ = require('xyz-core')

var stringMs = new XYZ({
  selfConf: {
    name: 'string.ms',
    seed: ['127.0.0.1:4000'],
    host: '127.0.0.1',
    transport: [{type: 'HTTP', port: 5000}]
  },
  systemConf: {
    nodes: []
  }
})

stringMs.register('/string/up', fn.up)
