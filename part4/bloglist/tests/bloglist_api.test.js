const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./helper')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})   // clear database
    
    const blogObjects = helper.blogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('bloglist_api test', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.blogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(r => r.title)
        expect(titles).toContain(
            'First class tests'
        )
    })

    test('id of blog posts are defined', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Dependecy Injection Demystified',
            author: 'James Shore',
            url: 'https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified',
            likes: 6
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsInDb = await helper.blogsInDb()
        expect(blogsInDb).toHaveLength(helper.blogs.length + 1)

        const titles = blogsInDb.map(r => r.title)
        expect(titles).toContain(
            'Dependecy Injection Demystified'
        )
    })

    test('a blog post without likes is defaulted to 0', async () => {
        const newBlog = {
            title: 'Dependecy Injection Demystified',
            author: 'James Shore',
            url: 'https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsInDb = await helper.blogsInDb()
        expect(blogsInDb).toHaveLength(helper.blogs.length + 1)

        const titles = blogsInDb.map(r => r.title)
        expect(titles).toContain(
            'Dependecy Injection Demystified'
        )
    })

    test('a blog post without a title or a url returns a bad request', async () => {
        const newBlog = {
            author: 'James Shore',
            url: 'https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified',
            likes: 6
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        
        const blogsInDb = await helper.blogsInDb()
        expect(blogsInDb).toHaveLength(helper.blogs.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})