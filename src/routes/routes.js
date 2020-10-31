import combineRoutes from 'koa-combine-routers';
import publicRouter from './PublicRouter';

module.exports = combineRoutes(publicRouter);
