const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(400).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {
        return response.status(400).send({ error: error.message })
    }
    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: error.message })
    }
    next(error)
}

module.exports = {
    tokenExtractor,
    unknownEndpoint,
    errorHandler
}