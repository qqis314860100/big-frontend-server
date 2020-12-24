import Koa from 'koa'
import path from 'path'
import JWT from 'koa-jwt'
import Body from 'koa-body'
import Cors from '@koa/cors'
import pretty from 'koa-json'
import Static from 'koa-static'
import Helmet from 'koa-helmet'
import Compose from 'koa-compose'
import Compress from 'koa-compress'
import { JWT_SECRET } from './config'
import routes from './routes/routes'
import ErrorHandle from './common/ErrorHandle'

const app = new Koa()

const isDevMode = process.env.NODE_ENV === 'production' ? false : true

// 定义不需要jwt鉴权的公共路径
// unless 除了```之外
// 请求被保护的接口check the Authorization header for a bearer token.
const jwt = JWT({ secret: JWT_SECRET }).unless({
  path: [/^\/public/, /\/login/],
})

// 使用koa-compose 集成中间件
const middleware = Compose([
  Body({
    multipart: true, // 允许上传图片
    formidable: { keepExtensions: true, maxFieldsSize: 5 * 1024 * 1024 }, // 设置上传图片大小
    onError: (err) => {
      console.log('🚀 ~ file: index.js ~ line 32 ~ err', err)
    },
  }),
  Static(path.join(__dirname, '../public')), // 静态文件目录
  Cors(),
  pretty({ pretty: false, param: 'pretty', spaces: 2 }),
  Helmet(),
  ErrorHandle,
  jwt,
])

if (!isDevMode) {
  app.use(Compress())
}

app.use(middleware)
app.use(routes())
app.listen(3333)
