import { useState } from 'react'

const Blog = ({ blog, increaseLikes, removeBlog }) => {
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
    <div>
      <div style={{ ...blogStyle, ...hideWhenViewed }}>
        {blog.title} by {blog.author} {' '}
        <button onClick={ toggleView }>view</button>
      </div>
      <div style={{ ...blogStyle, ...showWhenViewed }}>
        <div>
          {blog.title} by {blog.author} {' '}
          <button onClick={ toggleView }>hide</button>
        </div>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          likes {blogObject.likes} {' '}
          <button onClick={ handleLikes }>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div>
          <button onClick={ handleRemove }>remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog