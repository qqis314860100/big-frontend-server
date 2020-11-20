import mongoose from 'mongoose'
import { DB_URL } from './index'

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to :' + DB_URL)
})

mongoose.connection.on('error', (err) => {
  console.log('mongoose connection error:' + err)
})

mongoose.connection.on('disconnected', () => {
  console.log('mongoose connection disconnected')
})

export default mongoose
