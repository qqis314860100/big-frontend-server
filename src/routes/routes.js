import combineRoutes from 'koa-combine-routers'
import publicRouter from './PublicRouter'
import loginRouter from './LoginRouter'
import userRouter from './userRouter'

export default combineRoutes(publicRouter, loginRouter, userRouter)
