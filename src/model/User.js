import mongoose from '../config/DBHelper'

const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String },
  password: { type: String },
})

// 连接了users数据库
const UserModel = mongoose.model('users', UserSchema)

export default UserModel
