import { getValue } from '../config/RedisConfig'
import { JWT_SECRET } from '../config'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

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

// 获取文件路径是否存在
const getStat = async (dir) => {
  return new Promise((resolve, reject) =>
    fs.stat(dir, (err, stats) => (err ? resolve(false) : resolve(stats)))
  )
}

// make-dir 包的原理

const mkdir = (dir) => {
  return new Promise((resolve) => {
    fs.mkdir(dir, (err) => (err ? resolve(false) : resolve(true)))
  })
}

//  循环遍历，递归判断如果上级目录不存在，则产生上级目录
const dirExists = async (dir) => {
  const isExists = await getStat(dir)
  // 如过文件路径存在，是目录或者是文件
  if (isExists && isExists.isDirectory()) {
    return true
  } else if (isExists) {
    // 目录名称和文件名称相同则创建失败
    return false
  }

  // 如果路径不存在
  //获取文件上级目录
  const tempDir = path.parse(dir).dir
  // 循环遍历，递归判断直到上级目录存在，再依次创建路径
  const status = await dirExists(tempDir)
  if (status) {
    return await mkdir(dir)
  } else {
    return false
  }
}

export { checkCode, getJWTPayload, dirExists }
