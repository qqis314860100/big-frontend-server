import path from 'path'

const DB_URL = 'mongodb://tomtong:123456@47.105.36.18:27017/big_frontend'

const REDIS = {
  host: '47.105.36.18',
  port: 15000,
  password: '123456',
}

// shuangshuangda 密钥
const JWT_SECRET = 'LDaTIKuFKwFWASsFwsXw90DFAxZ6ADb4KWVMWXUAbeE'

const baseUrl =
  process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3333'

const uploadPath =
  process.env.NODE_ENV === 'production'
    ? '/app/public'
    : path.join(path.resolve(__dirname), '../../public')

export { DB_URL, REDIS, JWT_SECRET, baseUrl, uploadPath }
