const personsRouter = require('express').Router()
const Person = require('../models/person')

// route info
personsRouter.get('/info', (request, response) => {
    const date = new Date()
    Person.find({}).then((person) => {
        response.send(`<p>Phonebook has info for ${person.length} people</p>
        <p>${date}</p>`)
    })
})

// fetch persons
personsRouter.get('/', (request, response) => {
    //response.json(persons)
    Person.find({}).then((person) => {
        response.json(person)
    })
})

// fetch single person
personsRouter.get('/:id', (request, response, next) => {
    /*const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    */
    Person.findById(request.params.id).then((person) => {
        if (person) {
            response.json(person)
        } else {                // not matching object
            response.status(404).end()
        }
    }).catch((error) => {       // rejected promise
        next(error)
    })
})

// delete a person
personsRouter.delete('/:id', (request, response, next) => {
    /*
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
    */
    Person.findByIdAndDelete(request.params.id).then(() => {
        response.status(204).end()
    }).catch((error) => {
        next(error)
    })
})

// add a person
personsRouter.post('/', (request, response, next) => {
    const { name, number } = request.body

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
        name,
        number,
        //id: generateId()
    })

    /*
    persons = persons.concat(person)
    response.json(person)
    */
    person.save().then((savedPerson) => {
        response.json(savedPerson)
    }).catch((error) => {
        next(error)
    })
})

// update person
personsRouter.put('/:id', (request, response, next) => {
    const { name, number } = request.body

    if (!name && !number) {
        return response.status(400).json({
            error: 'the name or number is missing'
        })
    }

    const person = {
        name,
        number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true , runValidators: true, context: 'query'})
        .then((updatedPerson) => {
            response.json(updatedPerson)
        }).catch((error) => next(error))
})

module.exports = personsRouter



