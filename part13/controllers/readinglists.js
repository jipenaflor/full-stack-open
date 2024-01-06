require('dotenv').config()
const readinglistsRouter = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor } = require('../util/middleware')
const jwt = require('jsonwebtoken')

readinglistsRouter.get('/', async (req, res) => {
  const readinglists = await ReadingList.findAll({})
  return res.json(readinglists)
})

readinglistsRouter.post('/', tokenExtractor, async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken) {
      return res.status(401).json({
        error: 'invalid token'
      })
    }

    if (req.body.userId === decodedToken.id) {
      const readingEntry = await ReadingList.create({...req.body})
      return res.json(readingEntry)
    } else {
      return res.status(401).json({
        error: 'invalid user'
      })
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
})

readinglistsRouter.put('/:id', tokenExtractor, async (req, res) => {
  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!decodedToken) {
      return res.status(401).json({
        error: 'invalid token'
      })
    }
    const readingEntry = await ReadingList.findByPk(req.params.id)
    if (readingEntry.userId === decodedToken.id) {
      readingEntry.read = req.body.read
      await readingEntry.save()
      res.json(readingEntry)
    } else {
      return res.status(401).json({
        error: 'invalid user'
      })
    }
  } catch (error) {
    return res.status(400).json({ error })
  }
})

module.exports = readinglistsRouter