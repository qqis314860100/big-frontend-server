import Router from 'koa-router'
import PublicController from '../../api/PublicController'

const router = new Router()

router.get('/public/getCaptcha', PublicController.getCaptcha)

export default router
