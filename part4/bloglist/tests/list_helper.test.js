const listHelper = require('../utils/list_helper')
const helper = require('./helper')

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = listHelper.totalLikes([])
        expect(result).toBe(0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(helper.listWithOneBlog)
        expect(result).toBe(5)
    })

    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(helper.blogs)
        expect(result).toBe(36)
    })
})

describe('favorite blog', () => {
    test('in an empty list is none', () => {
        const result = listHelper.favoriteBlog([])
        expect(result).toEqual({})
    })

    test('when list has only one blog, equals that blog', () => {
        const result = listHelper.favoriteBlog(helper.listWithOneBlog)
        expect(result).toEqual({
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            likes: 5,
        })
    })

    test('in a bigger list is the most liked', () => {
        const result = listHelper.favoriteBlog(helper.blogs)
        expect(result).toEqual({
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            likes: 12,
        })
    })
})

describe('most blogs', () => {
    test('in an empty list is none', () => {
        const result = listHelper.mostBlogs([])
        expect(result).toEqual({})
    })

    test('when list has only one blog, equals that blog', () => {
        const result = listHelper.mostBlogs(helper.listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            blogs: 1
        })
    })

    test('in a bigger list is the most frequent author', () => {
        const result = listHelper.mostBlogs(helper.blogs)
        expect(result).toEqual({
            author: "Robert C. Martin",
            blogs: 3
        })
    })
})

describe('most likes', () => {
    test('in an empty list is none', () => {
        const result = listHelper.mostLikes([])
        expect(result).toEqual({})
    })

    test('when list has only one blog, equals that blog', () => {
        const result = listHelper.mostLikes(helper.listWithOneBlog)
        expect(result).toEqual({
            author: 'Edsger W. Dijkstra',
            likes: 5
        })
    })

    test('in a bigger list has the largest total likes', () => {
        const result = listHelper.mostLikes(helper.blogs)
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            likes: 17
        })
    })
})