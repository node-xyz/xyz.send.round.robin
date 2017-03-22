let http = require('http')
let map = {}

let _roundRobinSendStrategy = function (params, next, done, xyz) {
  let msgConfig = params[0]

  let userPayload = msgConfig.payload
  let servicePath = msgConfig.servicePath
  let route = msgConfig.route
  let redirect = msgConfig.redirect

  let responseCallback = params[1]

  let foreignNodes = xyz.serviceRepository.foreignNodes
  let _transport = xyz.serviceRepository.transport

  let logger = xyz.logger
  let Path = xyz.path

  let _nodes = []
  let targetPath
  for (let node in foreignNodes) {
    let matches = Path.match(servicePath, foreignNodes[node])
    if (matches.length) {
      targetPath = matches[0]
      _nodes.push(node)
    }
  }

  // we have previously called this servicePath
  if (map[servicePath]) {
    map[servicePath].nodes = _nodes
    if (!map[servicePath].node) {
      map[servicePath].node = _nodes[0]
    }
  } else {
    map[servicePath] = {
      node: _nodes[0], nodes: _nodes
    }
  }

  if (map[servicePath].node) {
    let lastIndex = map[servicePath].nodes.indexOf(map[servicePath].node)
    map[servicePath].node = map[servicePath].nodes[lastIndex === map[servicePath].nodes.length - 1 ? 0 : lastIndex + 1]
    logger.verbose(`ROUND ROBIN :: determined node for service ${servicePath} : ${map[servicePath].node}`)
    _transport.send({
      node: map[servicePath].node,
      route: route,
      redirect: redirect,
      payload: {
        userPayload: userPayload,
        service: servicePath}
    }, responseCallback)
    done()
    return
  }

  // if no node matched
  logger.warn(`Sending a message to ${servicePath} from ROUND ROBIN strategy failed (Local Response)`)
  if (responseCallback) {
    responseCallback(http.STATUS_CODES[404], null, null)
    done()
    return
  }
}

module.exports = _roundRobinSendStrategy
