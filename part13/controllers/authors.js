const authorsRouter = require('express').Router()
const { User, Blog } = require('../models')
const { Op } = require('sequelize')
const { sequelize } = require('../util/db')

authorsRouter.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('author')), 'blogs'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
    ],
    group: ['author'],
    order: [
      [sequelize.col('likes'), 'DESC']
    ]
  })
  res.json(authors)
})

module.exports = authorsRouter