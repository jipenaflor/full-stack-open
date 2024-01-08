require('dotenv').config()
const usersRouter = require('express').Router()
const { User, Blog } = require('../models')
const { tokenExtractor, isAdmin } = require('../util/middleware')
const bcrypt = require('bcrypt')

const jwt = require('jsonwebtoken')

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog
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

usersRouter.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const updatedUser = await User.findOne({
    where: {
      username: req.params.username
    }
  })
  if (updatedUser) {
    try {
      updatedUser.disabled = req.body.disabled
      await updatedUser.save()
      res.json(updatedUser)
      // task 13.8 change username
      /*if (req.body.username) {
        if (user.username === req.decodedToken.username) {
          user.username = req.body.username
          await user.save()
          res.json(user)
        }
      */
    } catch (error) {
      return res.status(401).json({
        error: 'invalid request'
      })
    }
  }
})

usersRouter.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read) {
    where.read = req.query.read === 'true'
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id', 'passwordHash'] },
    include: {
      model: Blog,
      as: 'readings',
      attributes: {
        exclude: ['userId'],
        include: ['year']
      },
      through: {
        as: 'readinglists',
        attributes: [
          'read', 'id'
        ],
        where
      }
    },
  })
  res.json(user)
})

module.exports = usersRouter