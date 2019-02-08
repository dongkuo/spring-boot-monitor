const process = require('child_process')
const io = require('socket.io')()
const axios = require('axios')
const cookie = require('cookie')
const cookieParser = require('cookie-parser')
const readLastLines = require('read-last-lines')
const Tail = require('tail').Tail
const debug = require('debug')('socket')

const allServiceInfo = {}
const allServiceLog = {}
const socket = {}

socket.listen = function (server, context) {
  io.attach(server, context.config.socket)

  // 广播服务信息
  broadcastServiceInfo(context.config.services, context.config['push-service-info-interval'])

  // 广播服务日志
  broadcastServiceLog(context.config.services, context.config['max-log-line'])

  // 注册[连接]事件
  io.on('connection', (client) => {
    // 认证
    debug('cookie:', client.handshake.headers.cookie)
    let sid = cookie.parse(client.handshake.headers.cookie || '').sid
    debug('sid:', sid)
    let signedSid = cookieParser.signedCookie(sid, context.config.session.secret)
    debug('signedSid:', signedSid)
    if (!signedSid) {
      client.emit('forbidden', 'Please sign in first.')
      client.disconnect()
      return
    }
    context.sessionStore.get(signedSid, (error, session) => {
      if (error || !session['login_info']) {
        debug('auth fail')
        client.emit('forbidden', 'Please sign in first.')
        client.disconnect()
        return
      }
      onConnect(context, client)
    })
  })
}

function onConnect(context, client) {
  // 推送所有的服务信息
  let info = []
  for (let name in context.config.services) {
    if (!context.config.services.hasOwnProperty(name)) {
      continue
    }
    info.push(allServiceInfo[name])
  }
  debug(`push all service info to client [${client.id}]`)
  client.emit('all-service-info', info)

  // 注册[订阅]日志事件
  client.on('subscribe-service-log', function (name) {
    debug(`client [${client.id}] subscribe service [${name}] log`)
    client.join(name, function () {
      debug(`push service [${name}] log to client ${client.id}`)
      // 推送订阅的服务的最近N行日志
      client.emit('all-service-log', allServiceLog[name])
    })
  })

  // 注册[取消订阅]日志事件
  client.on('unsubscribe-service-log', function (name) {
    client.leave(name, () => {
      debug(`client [${client.id}] unsubscribe ${name}`)
    })
  })

  // 注册[重启服务]事件
  client.on('restart-service', function (name) {
    debug(`client [${client.id}] restart service [${name}]`)
    process.exec(`sh script/restart-service.sh ${name}`)
  })
}

/**
 * 广播服务信息
 * @param services
 * @param interval
 */
function broadcastServiceInfo(services, interval) {

  setInterval(loop(), interval)

  function loop() {
    for (let name in services) {
      if (!services.hasOwnProperty(name)) {
        continue
      }
      let service = services[name]
      axios.get(service['actuator'], {timeout: 1000 * 5})
        .then(resp => {
          allServiceInfo[name] = {name: name, status: 'UP', info: resp.data}
        })
        .catch(err => {
          debug(`request service [${name}] info error: ${err}`)
          allServiceInfo[name] = {name: name, status: 'DOWN'}
        })
        .finally(() => {
          debug('broadcast service info')
          io.emit('service-info', allServiceInfo[name])
        })
    }
    return loop
  }
}

/**
 * 广播服务日志
 * @param services
 * @param maxLine
 */
function broadcastServiceLog(services, maxLine) {

  for (let name in services) {
    if (!services.hasOwnProperty(name)) {
      continue
    }
    let service = services[name]
    // 读取最后N行
    readLastLines.read(service.log, maxLine)
      .then((lines) => {
          allServiceLog[name] = lines.split(/\n/)
          allServiceLog[name].pop()

          // 开始监听文件添加的行
          let tail = new Tail(service.log)
          tail.on("line", function (data) {
            if (!allServiceLog[name]) {
              allServiceLog[name] = []
            }
            if (allServiceLog[name].length >= maxLine) {
              allServiceLog[name].shift()
            }
            allServiceLog[name].push(data)
            debug(`broadcast service [${name}] log`)
            io.to(name).emit('service-log', data)
          })
        }
      )
  }
}

module.exports = socket