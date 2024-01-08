require('dotenv').config()
const { User, ActiveSession } = require('../models')
const jwt = require('jsonwebtoken') 

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, process.env.SECRET)
      if (decodedToken) {
        req.decodedToken = decodedToken
      } else {
        return res.status(401).json({ error: 'token expired' })
      }
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const validateToken = async (req, res, next) => {
  const user = await ActiveSession.findOne({
    where: {
      userId: req.decodedToken.id
    }
  })
  if (!user) {
    return res.status(401).json({ error: 'login again' })
  }
  next()
}

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not permitted' })
  }
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(400).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: error.message })
  }
  if (error.name === 'SequelizeDatabaseError') {
    return response.status(500).json({ error: error.message })
  }
  if (error.name === 'TypeError') {
    return response.status(500).json({ error: error.message })
  }
  if (error.name === 'SequelizeValidationError') {
    return response.status(500).json({ error: error.message })
  }
  next(error)
}

module.exports = {
  tokenExtractor,
  validateToken,
  isAdmin,
  unknownEndpoint,
  errorHandler
}