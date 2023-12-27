import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm tests', () => {
  const addBlogHandler = jest.fn()

  test('event handler is called if a valid blog is entered', async () => {
    const user = userEvent.setup()

    const component = render(
      <BlogForm createBlog={ addBlogHandler }/>
    )

    const title = component.container.querySelector('#title')
    const author = component.container.querySelector('#author')
    const url = component.container.querySelector('#url')
    const button = component.getByText('create')

    await user.type(title, 'Dependency Injection Demystified')
    await user.type(author, 'James Shore')
    await user.type(url, 'https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified')
    await user.click(button)
    expect(addBlogHandler.mock.calls).toHaveLength(1)
    expect(addBlogHandler.mock.calls[0][0].title).toBe('Dependency Injection Demystified')
  })
})