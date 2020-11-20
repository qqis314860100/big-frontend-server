import svgCaptcha from 'svg-captcha'
import { getHValue, getValue, setValue, delValue } from '../config/RedisConfig'

class PublicController {
  async getCaptcha(ctx) {
    const body = ctx.request.query
    const newCaptcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0oO1ilLI',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38,
    })
    // 验证码以键值对方式存储倒redis
    setValue(body.sid, newCaptcha.text, 60 * 10)

    ctx.body = {
      code: 200,
      data: newCaptcha.data,
    }
  }
}

export default new PublicController()
