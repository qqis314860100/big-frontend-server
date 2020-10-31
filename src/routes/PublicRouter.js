import Router from 'koa-router';
import PublicController from '../api/PublicController';

const router = new Router();

router.get('/demo', PublicController.getCaptcha);

export default router;
