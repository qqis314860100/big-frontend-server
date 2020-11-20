import moment from 'moment'
import jsonwebtoken from 'jsonwebtoken'
import { send } from '../config/MainConfig'
import { JWT_SECRET } from '../config'
import { checkCode } from '../common/utils'
import User from '../model/User'

class LoginController {
  constructor() {}
  async forgetSendMail(ctx) {
    try {
      const { body } = ctx.request.query
      const sendInfo = {
        code: '1234',
        expire: moment().add(30, 'm').format('YYYY-MM-DD HH:mm:ss'),
        email: body.username,
        user: body.name,
      }
      const result = await send(sendInfo)
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功',
      }
    } catch (error) {
      console.log(error)
    }
  }
  async login(ctx) {
    // 接受用户的数据
    // 验证图片验证码的时效性,正确性
    // 返回token
    const { sid, code, username, password } = ctx.request.body
    const isValid = await checkCode(sid, code)
    debugger
    if (isValid) {
      // 验证用户账户密码是否正确
      let checkUserPasswd = false
      const user = await User.findOne({ username })
      if (user.password === password) {
        checkUserPasswd = true
      }
      if (checkUserPasswd) {
        // 密码验证通过返回token数据
        const token = jsonwebtoken.sign({ _id: 'tomtong' }, JWT_SECRET, {
          expiresIn: '1d',
        })
        ctx.body = {
          code: 200,
          token,
        }
      } else {
        //用户名密码验证失败,返回提示
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误',
        }
      }
    } else {
      //图片验证码验证失败
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确,请检查!',
      }
    }
  }
}

export default new LoginController()
