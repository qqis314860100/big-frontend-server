import UserController from '../../api/UserController'
import Router from 'koa-router'
import PublicController from '../../api/PublicController'

const router = new Router()

router.prefix('/public')

// 获取图片验证码
router.get('/getCaptcha', PublicController.getCaptcha)

// 确认修改邮件
router.get('/reset-email', UserController.updateUsername)

export default router
