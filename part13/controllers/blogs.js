const blogsRouter = require('express').Router()
const { Blog } = require('../models')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})
  
blogsRouter.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body)
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
  
blogsRouter.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  await Blog.destroy({
    where: {
      id: blog.id
    } 
  })
  return res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    blog.likes = req.body.likes
    await blog.save()
    res.json(blog)
})

module.exports = blogsRouter