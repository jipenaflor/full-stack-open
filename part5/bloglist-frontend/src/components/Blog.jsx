import { useState } from 'react'

const Blog = ({ blog, increaseLikes, username, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [view, setView] = useState(false)
  const [blogObject, setBlogObject] = useState(blog)

  const hideWhenViewed = { display: view ? 'none' : '' }
  const showWhenViewed = { display: view ? '' : 'none' }

  const toggleView = () => {
    setView(!view)
  }

  const handleLikes = (event) => {
    event.preventDefault()
    const updatedBlog = ({
      ...blog,
      likes: blog.likes + 1
    })
    increaseLikes(updatedBlog)
    setBlogObject(updatedBlog)
  }

  const handleRemove = () => removeBlog(blog)

  return (
    <div className='blog'>
      <div style={{ ...blogStyle, ...hideWhenViewed }}>
        {blog.title} by {blog.author} {' '}
        <button id='view' onClick={ toggleView }>view</button>
      </div>
      <div style={{ ...blogStyle, ...showWhenViewed }}>
        <div id='titleAndAuthor'>
          {blog.title} by {blog.author} {' '}
          <button id='hide' onClick={ toggleView }>hide</button>
        </div>
        <div id='url'>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div id='likes'>
          likes {blogObject.likes} {' '}
          <button id='like' onClick={ handleLikes }>like</button>
        </div>
        <div id='user_name'>
          {blog.user.name}
        </div>
        {blog.user.username === username && 
          <div>
            <button id='remove' onClick={ handleRemove }>remove</button>
          </div>
        }
      </div>
    </div>
  )
}

export default Blog