require('dotenv').config()
const readinglistsRouter = require('express').Router()
const { ReadingList } = require('../models')
const { tokenExtractor, validateToken } = require('../util/middleware')
const jwt = require('jsonwebtoken')

readinglistsRouter.get('/', async (req, res) => {
  const readinglists = await ReadingList.findAll({})
  return res.json(readinglists)
})

readinglistsRouter.post('/', tokenExtractor, validateToken, async (req, res) => {
  try {
    if (req.body.userId === req.decodedToken.id) {
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

readinglistsRouter.put('/:id', tokenExtractor, validateToken, async (req, res) => {
  try {
    const readingEntry = await ReadingList.findByPk(req.params.id)
    if (readingEntry.userId === req.decodedToken.id) {
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