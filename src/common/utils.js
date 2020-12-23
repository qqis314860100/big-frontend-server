import { getValue } from '../config/RedisConfig'
import { JWT_SECRET } from '../config'
import jwt from 'jsonwebtoken'

// 验证token的有效性
const getJWTPayload = (token) => {
  return jwt.verify(token.split(' ')[1], JWT_SECRET)
}

const checkCode = async (key, value) => {
  const redisData = await getValue(key)
  if (redisData != null) {
    if (redisData.toLowerCase() === value.toLowerCase()) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

export { checkCode, getJWTPayload }
