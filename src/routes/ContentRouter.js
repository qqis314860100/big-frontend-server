import Router from 'koa-router'
import ContentController from '../api/ContentController'

const router = new Router()
router.prefix('/content')

// 获取文章列表
router.get('/list', contentController.getPostList)

// 本周热议
router.get('/tips', contentController.getTopWeek)
