import moment from 'dayjs'
import SignRecord from '../model/SignRecord'
import { getJWTPayload } from '../common/utils'
import User from '../model/User'

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
          msg: '用户今日已经签到',
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
    }
    return
  }
}

export default new UserController()
