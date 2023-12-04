const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')

// using mongodb
require('dotenv').config()
const Person = require('./models/person')

// middleware functions used before routes since we want them to be executed
// before the route handlers are called
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

/* //hardcoded objects
let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]
*/

// middleware functions used before routes since we want them to be executed
// before the route handlers are called
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens['request-body'](req, res)
    ].join(' ')
}))

morgan.token('request-body', (req, res) => {
    return JSON.stringify(req.body)
})

// fetch persons
app.get('/api/persons', (request, response) => {
  //response.json(persons)
  Person.find({}).then(person => {
    response.json(person)
  })
})

// route info
app.get('/info', (request, response) => {
    const date = new Date()
    Person.find({}).then(person => {
        response.send(`<p>Phonebook has info for ${person.length} people</p>
        <p>${date}</p>`)
    })
})

// fetch single person
app.get('/api/persons/:id', (request, response, next) => {
    /*const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    */
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {    // not matching object
            response.status(404).end()
        }
    }).catch(error => {     // rejected promise
        next(error)
    })
})

// delete a person
app.delete('/api/persons/:id', (request, response, next) => {
    /*
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
    */
   Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()
   }).catch(error => next(error))
})

// helper function
/*
const generateId = () => {
    return Math.floor(Math.random() * 1000)
}
*/

// add a person
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    /*
    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'the name or number is missing'
        })
    }

    
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'the name already exists in the phonebook'
        })
    }
    */

    const person = new Person({
        name: body.name,
        number: body.number,
        //id: generateId()
    })

    /*
    persons = persons.concat(person)
    response.json(person)
    */
    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => {
        next(error)
    })
})

// update person
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    if (!body.name && !body.number) {
        return response.status(400).json({
            error: 'the name or number is missing'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true , runValidators: true, context: 'query'})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// using middlewares after route if no route handles the http request
// placed last because any request would return 404 if this is placed first
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// using middleware to handle error
const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    
    if (error.name === 'CastError') {   // invalid object id
        return response.status(400).send({ error: 'malformatted id'})
    } else if (error.name === 'ValidationError')    // invalid input
        return response.status(400).json({ error: error.message})

    next(error)
}

app.use(errorHandler)



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})