import { useState } from "react"

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [view, setView] = useState(false)

  const hideWhenViewed = {display: view ? 'none' : ''}
  const showWhenViewed = {display: view ? '' : 'none'}

  const toggleView = () => {
    setView(!view)
  }

  return (
    <div>
      <div style={{...blogStyle, ...hideWhenViewed}}>
        {blog.title} by {blog.author} {' '}
        <button onClick={ toggleView }>view</button>
      </div>
      <div style={{...blogStyle, ...showWhenViewed}}>
        <div>
          {blog.title} {blog.author}
          <button onClick={ toggleView }>hide</button>
        </div>
        <div>
          <a href={blog.url}>{blog.url}</a>
        </div>
        <div>
          likes {blog.likes} {' '}
          <button>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
      </div>  
    </div>
  )
}

export default Blog