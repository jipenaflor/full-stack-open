describe('Bloglist', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    const user = {
      name: 'Jerome Penaflor',
      username: 'jipenaflor',
      password: 'secret'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    const other = {
      name: 'other',
      username: 'other',
      password: 'other'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, other)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('jipenaflor')
      cy.get('#password').type('secret')
      cy.get('#login_button').click()

      cy.contains('Jerome Penaflor logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('jipenaflor')
      cy.get('#password').type('hidden')
      cy.get('#login_button').click()

      cy.get('#error').should('contain', 'invalid username or password')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('html').should('not.contain', 'Jerome Penaflor logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'jipenaflor', password: 'secret' })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Dependency Injection Demystified')
      cy.get('#author').type('James Shore')
      cy.get('#url').type('https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified')
      cy.get('#create').click()

      cy.contains('Dependency Injection Demystified by James Shore')
    })

    describe('a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Dependency Injection Demystified',
          author: 'James Shore',
          url: 'https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified'
        })
      })

      it('and the user can like it', function() {
        cy.contains('Dependency Injection Demystified by James Shore')
          .get('#view').click()
          .get('#like').click()
        cy.get('#likes').should('contain', 'likes 1')
      })

      it('and the user who created it can delete it', function() {
        cy.contains('Dependency Injection Demystified by James Shore')
          .get('#view').click()
          .get('#remove').click()
        cy.get('html').should('not.contain', 'Dependency Injection Demystified by James Shore')
      })
    })

    describe('list of blogs exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Blog1', author: 'Jerome Penaflor', url: 'https://test1.com'})
        cy.createBlog({ title: 'Blog2', author: 'Jerome Penaflor', url: 'https://test2.com'})
        cy.createBlog({ title: 'Blog3', author: 'Jerome Penaflor', url: 'https://test3.com'})

        cy.contains('Blog1').parent().contains('view').as('blog1')
        cy.contains('Blog2').parent().contains('view').as('blog2')
        cy.contains('Blog3').parent().contains('view').as('blog3')

        cy.get('@blog1').click().get('#like').as('like1')
        cy.get('@blog2').click().get('#like').as('like2')
        cy.get('@blog3').click().get('#like').as('like3')

        cy.get('@like1').click()
          .wait(500).click()
          .wait(500).click()
        cy.get('@like2').click()
          .wait(500).click()
        cy.get('@like3').click()
          

        cy.get('@like3').click()
      })

      it('and it is arranged based on likes', function() {
        cy.get('.blog').eq(0).should('contain', 'Blog3')
        cy.get('.blog').eq(1).should('contain', 'Blog2')
        cy.get('.blog').eq(2).should('contain', 'Blog1')
      })

    })
  })

  describe('When other user is logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'jipenaflor', password: 'secret' })
      cy.createBlog({
        title: 'Dependency Injection Demystified',
        author: 'James Shore',
        url: 'https://www.jamesshore.com/v2/blog/2006/dependency-injection-demystified'
      })
      cy.contains('logout').click()
      cy.login({ username: 'other', password: 'other' })
    })

    it('they cannot see the delete button of other user\'s blog', function() {
      cy.contains('Dependency Injection Demystified by James Shore')
        .get('#view').click()
        .should('not.contain', 'remove')
    })
  })
})