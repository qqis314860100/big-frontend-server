import moment from 'dayjs'
import { send } from '../config/MainConfig'
import { v4 as uuid } from 'uuid'
import SignRecord from '../model/SignRecord'
import { getJWTPayload } from '../common/utils'
import User from '../model/User'
import dayjs from 'dayjs'
import jwt from 'jsonwebtoken'
import { setValue } from '../config/RedisConfig'
import { JWT_SECRET } from '../config/index'

class UserController {
  // 用户签到接口
  async userSign(ctx) {
    // 取用户的ID
    const obj = await getJWTPayload(ctx.header.authorization)
    // 查询用户上一次签到的记录
    const record = await SignRecord.findByUid(obj._id)
    // 找到用户记录
    const user = await User.findByID(obj._id)
    let newRecord = {}
    let result = ''
    if (record !== null) {
      // 有历史的签到数据
      // 判断用户上一次签到记录的创建时间是否与今天相同
      // 如果相同，代表用户实在连续签到
      // 如果当前时间的日期与用户上一次的签到日期相同,说明用户已经签到
      // 第n+1天签到的时候，应该和第n天的签到时候比较
      if (
        moment(record.created).format('YYYY-MM-DD') ===
        moment().format('YYYY-MM-DD')
      ) {
        ctx.body = {
          code: 500,
          favs: user.favs,
          count: user.count,
          lastSign: record.created,
          msg: '已经签到',
        }
        return
      } else {
        // 有上一次的签到记录,并且不与今天相同,进行连续签到的判断
        // 如果相同,代表用户是在连续签到
        let count = user.count
        let fav = 0
        const today = moment(record.created).format('YYYY-MM-DD')
        const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')
        if (today === yesterday) {
          count += 1
          // 记录最后的日期相等于今天的日期减去一天的时间,即连续签到
          if (count < 5) {
            fav = 5
          } else if (count >= 5 && count < 15) {
            fav = 10
          } else if (count >= 15 && count < 30) {
            fav = 15
          } else if (count >= 30 && count < 100) {
            fav = 20
          } else if (count >= 100 && count < 365) {
            fav = 30
          } else if (count > 365) {
            fav = 50
          }
          await User.updateOne(
            { _id: obj._id },
            {
              $inc: { favs: fav, count: 1 },
            }
          )
          result = { favs: user.favs + fav, count: 1 }
        } else {
          // 用户中断签到
          fav = 5
          await User.updateOne(
            { _id: obj.id },
            { $set: { count: 1 }, $inc: { favs: fav } }
          )
          result = { favs: user.favs + fav, count: 1 }
        }
        // 更新签到记录表
        newRecord = new SignRecord({
          uid: obj._id,
          favs: fav,
        })
        await newRecord.save()
      }
    } else {
      //没有签到数据,保存一次签到数据(签到次数 +积分数据)
      await User.updateOne(
        { _id: obj._id },
        // $set:将查询出obj.id数据中的count设置为1，
        // $inc:increase 将favs(积分)增加5
        { $set: { count: 1 }, $inc: { favs: 5 } }
      )
      newRecord = new SignRecord({
        uid: obj._id,
        favs: 5,
      })
      // 保存
      await newRecord.save()
      result = {
        favs: user.favs + 5,
        count: 1,
      }
    }
    ctx.body = {
      code: 200,
      msg: '请求成功',
      ...result,
      lastSign: newRecord.created,
    }
    return
  }

  // 更新用户基本信息接口
  async updateUserInfo(ctx) {
    const { body } = ctx.request
    const obj = await getJWTPayload(ctx.header.authorization)
    const user = await User.findOne({ _id: obj._id })
    const key = uuid()
    setValue(key, jwt.sign({ _id: obj.id }, JWT_SECRET), 30 * 60 * 1000)
    if (body.username && body.username !== user.username) {
      // 用户修改了邮箱
      // 发送reset邮件
      const result = await send({
        type: 'email',
        key: uuid(),
        code: '',
        expire: dayjs().add(30, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        user: user.name,
        data: { key, username: body.username }, // receive
        email: user.username, // to
      })
      ctx.body = {
        code: 500,
        data: result,
        msg: '发送验证邮件成功,请点击链接确认修改',
      }
    } else {
      const arr = ['username', 'mobile', 'password']
      arr.map((item) => {
        delete body[item]
      })
      const result = await User.update({ _id: obj.id }, body)
      if (result.ok === 1 && result.n === 1) {
        ctx.body = {
          code: 200,
          msg: '更新成功',
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '更新失败',
        }
      }
    }
  }
}

export default new UserController()
