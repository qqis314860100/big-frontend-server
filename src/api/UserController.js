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
    let newRecord = {}
    let result = ''
    if (record !== null) {
      // 有历史的签到数据
    } else {
      //没有签到数据,保存一次签到数据(签到次数+积分数据)
      await User.updateOne(
        { _id: obj._id },
        // $set:将查询出obj.id数据中的count设置为1，
        // $inc:increase 将favs(积分)增加5
        { $set: { count: 1 }, $inc: { favs: 5 } }
      )
      newRecord = new SignRecord({
        uid: obj._id,
        favs: 5,
        lastSign: moment().format('YYYY-MM-DD HH:mm:ss'),
      })
      // 保存
      await newRecord.save()
      result = {
        favs: 5,
        count: 1,
      }
    }
    ctx.body = {
      code: 200,
      msg: '请求成功',
      ...result,
    }
  }
}

export default new UserController()
