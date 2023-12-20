import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

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
    } catch (exception) {
      alert('Wrong credentials')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const handleTitle = (event) => {
    setTitle(event.target.value)
  }

  const handleAuthor = (event) => {
    setAuthor(event.target.value)
  }

  const handleUrl = (event) => {
    setUrl(event.target.value)
  }

  const handleAddBlog = async (event) => {
    event.preventDefault()
    try {
      const blogObject = {
        title: title,
        author: author,
        url: url
      }
      
      blogService.setToken(user.token)
      await blogService.create(blogObject)
  
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      alert('Invalid blog')
    }
  }
 
  if (user == null) {
    return(
      <div>
        <LoginForm username={ username } password={ password } handleUsername={ handleUsername }
          handlePassword={ handlePassword } handleLogin={ handleLogin }/>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <div>
        { user.name } logged in
        <button onClick={ handleLogout }>logout</button>
      </div>

      <BlogForm title={ title } author={ author } url={ url } 
        handleTitle={ handleTitle } handleAuthor={ handleAuthor } handleUrl={ handleUrl } 
        handleAddBlog={ handleAddBlog }/>

      {blogs.map(blog =>
        <Blog key={ blog.id } blog={ blog } />
      )}
    </div>
  )
}

export default App