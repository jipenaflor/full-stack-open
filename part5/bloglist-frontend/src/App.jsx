import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)

  useLayoutEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      getAllBlogs()
    }
  }, [])

  const getAllBlogs = async () => {
    const allBlogs = await blogService.getAll()
    setBlogs(allBlogs)
  }

  const handleUsername = (event) => {
    setUsername(event.target.value)
  }

  const handlePassword = (event) => {
    setPassword(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setNotification({
        type: "error", content: 'invalid username or password'
      })
      setTimeout(() => {setNotification(null)}, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))
      
      setNotification({
        type: "success", content: "The new blog was added"
      })
      
    } catch (error) {
      setNotification({
        type: "error", content: "Invalid blog"
      })
    }
    setTimeout(() => {setNotification(null)}, 5000)
  }

  const blogForm = () => {
    return (
      <Togglable buttonLabel="new blog" ref={ blogFormRef }>
      <BlogForm createBlog={ addBlog }/>
      </Togglable>
    )
  }

  const updateBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject)
      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
    } catch (error) {
      setNotification({
        type: "error", content: error.response.data.error
      })
      setTimeout(() => {setNotification(null)}, 5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
        await blogService.remove(blogObject)
        setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
        setNotification({
          type: "success", content: "The blog was successfully removed"
        })
      }
    } catch (error) {
      setNotification({
        type: "error", content: "The blog has already been removed from the server"
      })
    }
    setTimeout(() => {setNotification(null)}, 5000)
  }
 
  if (user == null) {
    return(
      <div>
        <h2>Log in to Application</h2>
        <Notification message={notification}/>
        <LoginForm username={ username } password={ password } handleUsername={ handleUsername }
          handlePassword={ handlePassword } handleLogin={ handleLogin }/>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification}/>
      <div>
        { user.name } logged in {' '}
        <button onClick={ handleLogout }>logout</button>
      </div>

      {blogForm()}

      {blogs.sort((b1, b2) => b1.likes - b2.likes).map(blog =>
        <Blog key={ blog.id } blog={ blog } increaseLikes={ updateBlog } removeBlog={ deleteBlog } />
      )}
    </div>
  )
}

export default App