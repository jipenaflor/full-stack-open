const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const helper = require('./helper')
const app = require('../app')

const api = supertest(app)
jest.setTimeout(20000)

const Blog = require('../models/blog')
const User = require('../models/user')

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
            url: 'https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified'
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

    test('a specific blog can be viewed through its id', async () => {
        const blogsInDb = await helper.blogsInDb()
        const blogToView = blogsInDb[0]
        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        expect(resultBlog.body).toEqual(blogToView)
    })

    test('a blog can be deleted', async () => {
        const blogsInDb = await helper.blogsInDb()
        const blogToDelete = blogsInDb[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)
        
        const remainingBlogs = await helper.blogsInDb()
        expect(remainingBlogs).toHaveLength(
            helper.blogs.length - 1
        )
        
        const remainingTitles = remainingBlogs.map(r => r.title)
        expect(remainingTitles).not.toContain(blogToDelete.title)
    })
})

describe('user_api test', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('hidden', 10)
        const user = new User({
            username: 'root',
            name: 'root',
            passwordHash
        })

        await user.save()
    })

    test('users are returned as json', async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('create new users with post method', async () => {
        const initialUsers = await helper.usersInDb()

        const newUser = {
            username: 'jipenaflor',
            name: 'Jerome Penaflor',
            password: 'secret'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersInDB = await helper.usersInDb()
        expect(usersInDB).toHaveLength(initialUsers.length + 1)

        const usernames = usersInDB.map(u => u.username)
        expect(usernames).toContain(newUser.username)

    })
})

afterAll(async () => {
    await mongoose.connection.close()
})