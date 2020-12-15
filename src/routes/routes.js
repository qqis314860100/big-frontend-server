import combineRoutes from 'koa-combine-routers'
const path = require('path')
const requireContext = require('../config/requireContext')

// 加载目录中的router中间件
const moduleFiles = requireContext(
  path.resolve(__dirname, './modules'),
  true,
  /\.js$/
)

// reduce方法拼接 koa-combine-router所需的数据结构
const modules = moduleFiles.keys().reduce((items, path) => {
  const value = moduleFiles(path)
  items.push(value.default)
  return items
}, [])

export default combineRoutes(modules)
