import mongoose from '../config/DBHelper'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String, index: { unique: true }, sparse: true },
  password: { type: String },
  name: { type: String, default: 'unknown' },
  created: { type: Date },
  update: { type: Date },
  favs: { type: Number, default: 100 },
  gender: { type: String, default: '' },
  roles: { type: Array, default: ['user'] },
  pic: { type: String, default: '/img/header.jpg' },
  mobile: { type: String, match: /^1[3-9](\d{9})$/, default: '' },
  status: { type: String, default: '0' },
  remark: { type: String, default: '' },
  location: { type: String, default: '' },
  isVip: { type: String, default: '0' },
  count: { type: Number, default: 0 },
})

UserSchema.pre('save', function (next) {
  this.created = new Date()
  next()
})

UserSchema.pre('update', function (next) {
  this.updated = new Date()
  next()
})

UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Error: Monngoose has a duplicate key.'))
  } else {
    next()
  }
})

UserSchema.statics = {
  findByID: function (id) {
    return this.findOne({ _id: id }, { password: 0, username: 0, mobile: 0 })
  },
  getList: function (options, sort, page, limit) {
    let query = {}
    if (typeof options.search !== 'undefined') {
      if (typeof options.search === 'string' && options.search.trim() !== '') {
        if (['name', 'username'].includes(options.item)) {
          query[options.item] = { $regex: new RegExp(options.search) }
        } else {
          query[options.item] = options.search
        }
      }
      if (options.item === 'roles') {
        query = { roles: { $in: options.search } }
      }
      if (options.item === 'created') {
        const start = options.search[0]
        const end = options.search[1]
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      }
    }
    return this.find(query, { password: 0, mobile: 0 })
      .sort({ [sort]: -1 })
      .skip(page * limit)
      .limit(limit)
  },
  countList: function (options) {
    let query = {}
    if (typeof options.search !== 'undefined') {
      if (typeof options.search === 'string' && options.search.trim() !== '') {
        if (['name', 'username'].includes(options.item)) {
          //模糊匹配
          query[options.item] = { $regex: new RegExp(options.search) }
          // =》 { name: { $regex: /admin/ } } => mysql like %admin%
        } else {
          query[options.item] = options.search
        }
      }
      if (options.item === 'roles') {
        query = { roles: { $in: options.search } }
      }
      if (options.item === 'created') {
        const start = options.search[0]
        const end = options.search[1]
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      }
    }
    return this.find(query).countDocuments()
  },
  getTotalSign: function (page, limit) {
    return this.find({})
      .skip(page * limit)
      .limit(limit)
      .sort({ count: -1 })
  },
  getTotalSingCount: function (page, limit) {
    return this.find({}).countDocuments()
  },
}

// 连接了users数据库
const UserModel = mongoose.model('users', UserSchema)

export default UserModel
