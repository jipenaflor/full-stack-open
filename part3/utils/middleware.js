// using middlewares after route if no route handles the http request
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// using middleware to handle error
const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {   // invalid object id
        return response.status(400).send({ error: 'malformatted id' })
    }
    if (error.name === 'ValidationError') {   // invalid input
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

module.exports = {
    unknownEndpoint,
    errorHandler,
}