require('dotenv').config()
const usersRouter = require('express').Router()
const { User, Blog } = require('../models')
const { tokenExtractor } = require('../util/middleware')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  try {
    const { username, name, password } = req.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({ username, name, passwordHash })
    res.json(user)
  } catch (error) {
    return res.status(400).json({ error })
  }
})

usersRouter.put('/:username', tokenExtractor, async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken) {
      return res.status(401).json({
        error: 'invalid token'
      })
    }
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (user.username === decodedToken.username) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    return res.status(401).json({
      error: 'invalid user'
    })
  }
})

module.exports = usersRouter