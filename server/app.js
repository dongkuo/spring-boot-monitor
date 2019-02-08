const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const compression = require('compression')
const FileStore = require('session-file-store')(session);
const favicon = require('express-favicon')
const debug = require('debug')('http')
const yargs = require('yargs')
const http = require('http')
const history = require('connect-history-api-fallback')
const socket = require('./routes/socket')
const authRouter = require('./routes/auth')
const {merge} = require('./util/utils')

// 命令行参数
const argv = yargs
  .usage('Usage: $0 [options]')
  .alias('c', 'config')
  .alias('h', 'help')
  .alias('v', 'version')
  .describe('c', 'apply a config file')
  .help('h')
  .argv

let config = {
  "host": "0.0.0.0",
  "port": 3000,
  "auth": {
    "admin": "123456"
  },
  "services": {},
  "push-service-info-interval": 3000,
  "max-log-line": 1000
}

if (argv.config) {
  let configData = require('fs').readFileSync(argv.config, 'utf8')
  config = merge(config, JSON.parse(configData))
}

const app = express()
const sessionStore = new FileStore({secret: config.session.secret})
const server = http.createServer(app)


app.context = {sessionStore, config}

app.set('host', config.host)
app.set('port', config.port)

app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(session({
  secret: config.session.secret,
  name: 'sid',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
  store: sessionStore,
}))

app.use(favicon(__dirname + '/public/img/logo.png'))

// 认证
app.use('/api', authRouter)

// 其他请求一律转调到根路径下以进行前端路由
app.use(history())

// 静态文件
app.use(express.static('public'))

app.use((req, res) => {
  res.json({code: -99, msg: 'Oops, something went wrong.'})
})


socket.listen(server, app.context)
server.listen(config.port, config.host, () => {
  debug(`the server is running at http://${config.host}:${config.port}`)
})

