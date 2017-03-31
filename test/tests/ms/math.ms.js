let XYZ = require('xyz-core')
const fn = require('./../../mock.functions')
const RR = require('./../../../xyz.send.round.robin')

var mathMs = new XYZ({
  selfConf: {
    logLevel: 'verbose',
    name: 'math.ms',
    host: '127.0.0.1'
  },
  systemConf: {nodes: []}
})

setInterval(() => {
  mathMs.call({
    servicePath: 'string/up',
    sendStrategy: RR,
    payload: 'hello'}, (err, body, response) => {

  })
}, 10)

console.log(mathMs)
