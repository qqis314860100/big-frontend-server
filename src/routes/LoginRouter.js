import Router from 'koa-router'
import LoginController from '../api/LoginController'

const router = new Router()

router.post('/forget', LoginController.forgetSendMail)
router.post('/login', LoginController.login)

export default router
