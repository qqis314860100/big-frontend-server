1.中间件
@koa/cors 处理跨域中间件
koa-body 解析中间件
koa-json 格式化中间件
koa-combine-routers 合并路由
koa-helmet 添加安全请求头
koa-static 静态资源服务器
koa-compose 组合中间件
koa-compress 压缩中间件用来提高传输速率

2.文件目录（按照功能模块进行区分）

3.插件
nodemon 监听 node 代码

4.webpack
webpack-node-externals：对 bundle 排除某些不要的依赖
@babel/node
@babel/preset-env:新语法支持
clean-webpack-plugin
@babel/core
@babel/node
babel-loader cross-env
webpack
webpack-cli
webpack-merge
terser-webpack-plugin

webpack 优化：
SplitChunksPlugin 避免重复依赖

5.调试
vscode 调试：launch.json
chrome 调试："webpack:debug":"node --inspect-brk ./node_modules/.bin/webpack --inline --progress"
npm-check-updates 检查 npm 依赖包是否有最新版本 命令:ncu
