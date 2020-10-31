import Koa from 'koa';
import path from 'path';
import Body from 'koa-body';
import Cors from '@koa/cors';
import pretty from 'koa-json';
import Static from 'koa-static';
import Helmet from 'koa-helmet';
import Compose from 'koa-compose';
import Compress from 'koa-compress';

const routes = require('./routes/routes');
const app = new Koa();

const isDevMode = process.env.NODE_ENV === 'production' ? false : true;

const middleware = Compose([
  Body(),
  Cors(),
  Helmet(),
  Static(path.join(__dirname, './public')),
  pretty({ pretty: true, param: 'pretty', spaces: 2 }),
]);

if (!isDevMode) {
  app.use(Compress());
}

app.use(middleware);
app.use(routes());
app.listen(3000);
