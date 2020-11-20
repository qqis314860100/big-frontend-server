import combineRoutes from 'koa-combine-routers'
import publicRouter from './PublicRouter'
import loginRouter from './LoginRouter'

module.exports = combineRoutes(publicRouter, loginRouter)
