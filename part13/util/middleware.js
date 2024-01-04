const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  } else {
    req.token = null
    
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
  unknownEndpoint,
  errorHandler
}