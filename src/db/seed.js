const db = require('./../models')
const bcrypt = require('bcryptjs')

try {
  db.User.findOrCreate({
    where: { username: 'admin' },
    defaults: {
      name: 'Admin',
      role: 'ADMIN',
      password: bcrypt.hashSync('admin')
    }
  })
} catch (error) {
  console.log('Terjadi kesalahan saat melakukan seed')
  console.log(error)
}