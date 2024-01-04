require('dotenv').config()
const blogsRouter = require('express').Router()
const { User, Blog } = require('../models')
const { tokenExtractor } = require('../util/middleware')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  res.json(blogs)
})
  
blogsRouter.post('/', tokenExtractor, async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken) {
      return res.status(401).json({
        error: 'invalid token'
      })
    }

    const user = await User.findByPk(decodedToken.id)
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
  
blogsRouter.delete('/:id', tokenExtractor, async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken) {
    return res.status(401).json({
      error: 'invalid token'
    })
  }
  const blog = await Blog.findByPk(req.params.id)
  if (blog.userId === decodedToken.id) {
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