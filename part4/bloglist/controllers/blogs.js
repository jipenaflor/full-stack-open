const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog.find({})
        .then((blogs) => {
            response.json(blogs)
        })
})

blogsRouter.post('/', (request, response) => {
    const body = request.body

    if (!body.title || !body.url) {
        return response.status(400).json({
            error: 'title or url is missing'
        })
    }

    const blog = new Blog(request.body)

    blog.save()
        .then((result) => {
            response.status(201).json(result)
        }).catch((error) => {
            next(error)
        })
})

module.exports = blogsRouter