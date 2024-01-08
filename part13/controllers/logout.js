const logoutRouter = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const { User, ActiveSession } = require('../models')

logoutRouter.delete('/', tokenExtractor, async (req, res) => {
  try {
    await ActiveSession.destroy({
      where: {
        userId: req.decodedToken.id
      }
    })
    res.status(204).end()
  } catch (error) {
    res.status(401).json({
      error: 'session expired'
    })
  }
})

module.exports = logoutRouter
