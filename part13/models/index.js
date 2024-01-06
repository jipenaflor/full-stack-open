const User = require('./user')
const Blog = require('./blog')
const ReadingList = require('./reading_list')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_marked' })

module.exports = {
  User, Blog, ReadingList
}