require('dotenv').config()
const blogsRouter = require('express').Router()
const { User, Blog } = require('../models')
const { tokenExtractor, validateToken } = require('../util/middleware')
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

blogsRouter.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: req.query.search
        }
      },
      {
        author: {
          [Op.iLike]: req.query.search
        }
      }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC']
    ]
  })
  res.json(blogs)
})
  
blogsRouter.post('/', tokenExtractor, validateToken, async (req, res) => {
  try {
    console.log(req.decodedToken)
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id, date: new Date() })
    return res.json(blog)
  } catch (error) {
    return res.status(400).json({ error })
  }
})
  
blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    req.status(404).end()
  }
})
  
blogsRouter.delete('/:id', tokenExtractor, validateToken, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog.userId === req.decodedToken.id) {
    await Blog.destroy({
      where: {
        id: blog.id
      } 
    })
    return res.status(204).end()
  } else {
    return res.status(401).json({
      error: 'invalid user'
    })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  blog.likes = req.body.likes
  await blog.save()
  res.json(blog)
})

module.exports = blogsRouter