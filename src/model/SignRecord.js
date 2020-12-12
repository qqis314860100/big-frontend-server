import mongoose from '../config/DBHelper'
import moment from 'dayjs'

const Schema = mongoose.Schema

const SignRecordSchema = new Schema({
  uid: { type: String, ref: 'users' },
  created: { type: Date },
  favs: { type: Number }, // 签到积分
  lastSign: { type: Date }, //最后一次签到日期
})

// 每当用户保存的时候
SignRecordSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

SignRecordSchema.statics = {
  findByUid: function (uid) {
    // 倒序排列
    return this.findOne({ uid }).sort({ created: -1 })
  },
  getLastSign: function (page, limit) {
    return this.find({})
      .populate({ path: 'uid', select: '_id name pic' })
      .skip(page * limit)
      .limit(limit)
      .sort({ created: -1 })
  },
  getTopSign: function (page, limit) {
    return this.find({
      created: { $gte: moment().format('YYYY-MM-DD 00:00:00') },
    })
      .populate({ path: 'uid', select: '_id name pic' })
      .skip(page * limit)
      .limit(limit)
      .sort({ created: 1 })
  },
  getSignCount: function () {
    return this.find({}).countDocuments()
  },
  getTopSignCount: function () {
    return this.find({
      created: { $gte: moment().format('YYYY-MM-DD 00:00:00') },
    }).countDocuments()
  },
}

const SignRecord = mongoose.model('sign_record', SignRecordSchema)
export default SignRecord
