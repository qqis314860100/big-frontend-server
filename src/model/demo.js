import User from './test'

const user = {
  name: 'tomtong',
  age: 25,
  email: 'ban9ban9da@qq.com',
}

const insert = async () => {
  const data = new User(user)
  const result = await data.save()
  console.log(result)
}

insert()

const find = async () => {
  const result = await User.find()
  console.log(result)
}
find()

const update = async () => {
  const data = await User.updateOne(
    { name: 'tomtong' },
    { email: '314850100@qq.com' }
  )
}
update()
