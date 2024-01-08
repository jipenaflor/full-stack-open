require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { User, ActiveSession } = require('../models')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({
    where: {
        username: username
    }
  })
  const passwordCorrect = user === null ?
    false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

  await ActiveSession.create({ userId: user.id, token: token })

  res.status(200).send({
    token,
    username: user.username,
    name: user.name
  })
})

module.exports = loginRouter