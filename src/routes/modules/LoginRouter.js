import Router from 'koa-router'
import LoginController from '../../api/LoginController'

const router = new Router()

router.prefix('/login')

// 忘记密码
router.post('/forget', LoginController.forget)

// 登录
router.post('/login', LoginController.login)

// 注册
router.post('/reg', LoginController.reg)

// 重置密码
router.post('/reset', LoginController.reset)
export default router
