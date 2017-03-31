# xyz.send.round.robin
Round Robin Send Strategy for xyz Edit

[![Build Status](https://travis-ci.org/node-xyz/xyz.send.round.robin.svg?branch=master)](https://travis-ci.org/node-xyz/xyz.send.round.robin) [![npm version](https://badge.fury.io/js/xyz.send.round.robin.svg)](https://badge.fury.io/js/xyz.send.round.robin)

---

This repository demonstrates how a send strategy can be used to implement an **internal load balancing**. Keep in mind that client messages will usually go through an **external load balancer**, then a **front** microservice that translates a possible client requests into an internal message. This is another story for another day. At this point we want to handle this simple issue:

> A given node, say our faviorite **string.ms** has been scaled from one instance into three instances. How can we distribute the load so that we actually reap a benefit from this scaling?

The answer is this module.

# Description

`xyz.send.round.robin` will keep track of all nodes that it has already sent messages to. when it receives a message that can be sent to three nodes based on **path**, it sends the message to **one of them** (the module is basically an extension to `firstFind`) in a **sequential** manner.

> note that this module is a **node-based** balancer and does not resolve paths. Hence, any wildcard is not allowed.

To further clarify this, in the following topology, if all `string.ms` nodes share the same functions including `/string/up` and `math.ms` tries to send 3 messages to `/string/up`, each `string.ms` will receive one message.

![](https://github.com/node-xyz/xyz.send.round.robin/blob/master/media/2.png?raw=true)

This can be further justified in `xyz-cli`. If you run the test cases using `$ xyz dev -c ./xyztestrc.json`, the example explained above will be launched. As you see, the outgoing traffic of `math.ms`, **~90 msg/sec**, is distributed fairly among three nodes, each receiving **~30 msg/sec**.

![example](https://github.com/node-xyz/xyz.send.round.robin/blob/master/media/1.png?raw=true)


# Usage

The module can be installed using:

```bash
$ np install xyz.send.round.robin
```

It can be used both as the defaultSendStrategy:

```javascript
const RR = require('xyz.send.round.robin')
var ms = new XYZ({
  selfConf: {
    logLevel: 'verbose',
    name: 'math.ms',
    host: '127.0.0.1',
    defaultSendStrategy: RR
  },
  systemConf: {nodes: []}
})

```

or per call

```javascript
ms.call({
  servicePath: 'string/up',
  payload: 'yo',
  sendStrategy: RR,
  payload: 'hello'}, (err, body, response) => {
    //
})
```

The `test` folder further explain this.
