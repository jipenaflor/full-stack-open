const _ = require('lodash')

const totalLikes = (blogs) => {
    if (blogs.length === 0) { return 0 }

    const total = blogs.reduce((a, b) => {
        return a + b.likes
    }, 0)
    return total
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) { return {} }

    const likes = blogs.map(blog => blog.likes)
    const fave = blogs[likes.indexOf(Math.max(...likes))]
    return {
        title: fave.title,
        author: fave.author,
        likes: fave.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) { return {} }

    const blogFrequency = _.countBy(blogs, 'author')            // [{author: count, author: count,...}]
    const maxBlogs = _.max(_.toPairs(blogFrequency), _.last)    // [[author, count], [author, count]...]
    return {
        author: maxBlogs[0],
        blogs: maxBlogs[1]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) { return {} }

    const likeFrequency = _(blogs).groupBy('author')    //{author: [blog, ...], author: [blog, ...]}
        .map((objs, key) => ({                          //{author: {key, totalLikes}, author: {key, totalLikes}}
            'author': key,
            'likes': _.sumBy(objs, 'likes')
        })).value()                                     //{{key, totalLikes}, {key, totalLikes}, ...}
    const maxLikes = _.maxBy(likeFrequency, 'likes')
    return maxLikes
}

module.exports = {
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}