export default (ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      // 用户无权限访问
      ctx.status = 401
      ctx.body = {
        code: 401,
        msg: 'Protected resource, use Authorization header to get access\n',
      }
    } else {
      ctx.status = err.status || 500
      debugger

      ctx.body = Object.assign(
        {
          code: 500,
          msg: err.message,
        },
        process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}
      )
    }
  })
}
