const test = require('./../common').test
const expect = require('chai').expect
const _send = test.sendMessage

let processes
let identifiers = []
let TESTER
const TOTAL = 1
before(function (done) {
  this.timeout(15 * 1000)
  test.setUpTestEnv((p) => {
    processes = p
    identifiers = Object.keys(processes)
    TESTER = test.getTester()
    setTimeout(done, 10 * 1000)
  }, 'xyztestrc.json')
})

it('sender message rate', function (done) {
  _send('network', processes[identifiers[0]], (data) => {
    // 100 should it be
    expect(data.snd).to.be.above(75)
    done()
  })
})

it('receiver message rate', function (done) {
  _send('network', processes[identifiers[1]], (data) => {
    // 33 should it be
    expect(data.rcv).to.be.above(20)
    _send('network', processes[identifiers[2]], (data) => {
      expect(data.rcv).to.be.above(20)
      done()
    })
  })
})

after(function () {
  for (let p in processes) {
    processes[p].kill()
  }
})
