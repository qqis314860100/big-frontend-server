import fs from 'fs'
import { v4 as uuid } from 'uuid'
import dayjs from 'dayjs'
import { uploadPath } from '../config'
import { dirExists } from '../common/utils'

class ContentController {
  async getPostList() {}
  // 本周热议
  async getTopWeek(ctx) {}

  // 上传图片
  async uploadImg(ctx) {
    const file = ctx.request.files.file
    // 图片名称、图片格式、存储的位置，返回前台可以读取的路径
    const ext = file.name.split('.').pop()
    const dir = `${uploadPath}/${dayjs().format('YYYYMMDD')}`
    // 判断路径是否存在，不存在则创建
    await dirExists(dir)
    // 存储文件到置顶的路径
    // 给文件一个唯一的名称
    const picname = uuid()
    const destPath = `${dir}/${picname}.${ext}`
    const reader = fs.createReadStream(file.path)
    const upStream = fs.createWriteStream(destPath)
    const filePath = `/${dayjs().format('YYYYMMDD')}/${picname}.${ext}`

    // 写文件 method1
    reader.pipe(upStream)

    // 写文件 method2
    // let totalLength = 0
    // reader.on('data', (chunk) => {
    //   totalLength += chunk.totalLength
    //   if (upStream.write(chunk) === false) {
    //     reader.pause()
    //   }
    // })

    // reader.on('drain', () => {
    //   reader.resume()
    // })

    // reader.on('end', () => {
    //   upStream.end()
    // })

    ctx.body = {
      code: 200,
      msg: '文件上传成功',
      src: filePath,
    }
  }
}

export default new ContentController()
