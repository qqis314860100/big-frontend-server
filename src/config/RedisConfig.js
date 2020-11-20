const redis = require('redis')
const { REDIS } = require('../config')

const client = redis.createClient({
  ...REDIS,
  detect_buffers: true,
  // 重试
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  },
})

const setValue = (key, value, time) => {
  if (typeof value === 'undefined' || value === null || value === '') {
    return
  }
  if (typeof value === 'string') {
    if (time) {
      client.set(key, value, redis.print)
      client.expire(key, time)
    } else {
      client.set(key, value)
    }
  } else if (typeof value === 'object') {
    Object.keys(value).forEach((item) => {
      client.hset(key, item, value[item], redis.print)
    })
  }
}

const { promisify } = require('util')
const getAsync = promisify(client.get).bind(client)

const getValue = (key) => {
  return getAsync(key)
}

const getHValue = (key) => {
  return promisify(client.hgetall).bind(client)(key)
}

const delValue = (key) => {
  client.del(key)
}

export { client, setValue, getValue, getHValue, delValue }
