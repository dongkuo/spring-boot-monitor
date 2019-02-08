const express = require('express')
const router = express.Router()

const EXCLUDE_URLS = ['/login']

// 请求权限拦截
router.use((req, res, next) => {
  if (EXCLUDE_URLS.indexOf(req.url) === -1 && !req.session['login_info']) {
    res.json({code: -1, msg: '请先登录'})
    return
  }

  next()
})

// 登录认证
router.post('/login', function (req, res, next) {
  let result = {code: -2, msg: '用户名或密码有误', data: null}
  if (req.body.username && req.body.password && req.body.password === req.app.context.config.auth[req.body.username]) {
    req.session['login_info'] = {date: new Date(), ip: parseRemoteAddress(req)}
    result = {code: 1, msg: '登录成功', data: req.session['login_info']}
  }
  res.json(result)
})

function parseRemoteAddress(req) {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress || ''
}

module.exports = router
