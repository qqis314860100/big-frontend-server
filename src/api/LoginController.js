import moment from 'moment'
import jsonwebtoken from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import SignRecord from '../model/SignRecord'
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
    if (isValid) {
      // 验证用户账户密码是否正确
      let checkUserPasswd = false
      // 查找数据库获取用户信息
      const user = await User.findOne({ username })
      if (user.password === password) {
        checkUserPasswd = true
      }
      if (checkUserPasswd) {
        // 验证通过，返回token数据
        const userObj = user.toJSON()
        const arr = ['password', 'username']
        arr.map((item) => {
          delete userObj[item]
        })
        // 密码验证通过生成token,设置密钥和时效性
        const token = jsonwebtoken.sign({ _id: userObj._id }, JWT_SECRET, {
          expiresIn: '1d',
        })
        // 加入isSing属性
        const signRecord = await SignRecord.findByUid(userObj._id)
        if (signRecord !== null) {
          if (
            moment(signRecord.created).format('YYYY-MM-DD') ===
            moment().format('YYYY-MM-DD')
          ) {
            userObj.isSign = true
          } else {
            userObj.isSign = false
          }
          userObj.lastSign = signRecord.created
        } else {
          // 用户签到无记录
          userObj.isSign = false
        }
        ctx.body = {
          code: 200,
          data: userObj,
          token: token,
        }
      } else {
        //用户名密码验证失败,返回提示
        ctx.body = {
          code: 404,
          msg: '用户名或者密码错误,请检查',
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

  async reg(ctx) {
    // 接受客户端数据
    const { body } = ctx.request
    // 校验验证码的内容（时效性和有效性）
    let { sid, code, username, password } = body
    let msg = {}
    // 验证图片的时效性正确性
    let isValid = await checkCode(sid, code)

    // 用户名存在数据库中
    let exist = true
    if (isValid) {
      // 查库，看username是否被注册
      let user1 = await User.findOne({ username: username })
      if (user1 && typeof user1.username !== 'undefined') {
        msg.username = ['此邮箱已经注册，可以通过邮箱找回密码']
        exist = false
      }

      // 查库，看name是否被注册
      let user2 = await User.findOne({ name: body.name })
      if (user2 && typeof user2.username !== 'undefined') {
        msg.username = ['此昵称已经被注册，请修改']
        exist = false
      }
      // 写入数据到数据库
      if (exist) {
        body.password = await bcrypt.hash(body.password, 5)
        let user = new User({
          username: body.username,
          name: body.name,
          password: body.password,
          created: moment().format('YYYY-MM-DD HH:mm:ss'),
        })
        let result = await user.save()
        ctx.body = {
          code: 200,
          data: result,
          msg: '注册成功',
        }
        return
      }
    } else {
      msg.code = ['验证码已经失效，请重新获取']
    }
    ctx.body = {
      code: 500,
      msg,
    }
  }
}

export default new LoginController()
