import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog tests', () => {
  const blog = {
    title: 'Dependency Injection Demystified',
    author: 'James Shore',
    url: 'https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified',
    likes: 6,
    user: {
      username: 'jipenaflor',
      name: 'Jerome Penaflor'
    }
  }

  const likeHandler = jest.fn()
  const removeHandler = jest.fn()

  test('renders title and author', () => {
    const { container } = render(
      <Blog blog={ blog } increaseLikes={ likeHandler } removeBlog={ removeHandler }/>
    )
    expect(container).toHaveTextContent(
      'Dependency Injection Demystified by James Shore'
    )
  })

  test('renders url and likes when view button is clicked', async () => {
    const component = render(
      <Blog blog={ blog } increaseLikes={ likeHandler } removeBlog={ removeHandler }/>
    )
    const user = userEvent.setup()
    const button = component.getByText('view')
    await user.click(button)

    expect(component.container).toHaveTextContent(
      'https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified'
    )

    expect(component.container).toHaveTextContent(
      '6'
    )
  })

  test('event handler for like is called twice if the button is clicked twice', async () => {
    const component = render(
      <Blog blog={ blog } increaseLikes={ likeHandler } removeBlog={ removeHandler }/>
    )
    const user = userEvent.setup()
    const viewButton = component.getByText('view')
    await user.click(viewButton)
    const likeButton = component.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(likeHandler.mock.calls).toHaveLength(2)
  })
})

