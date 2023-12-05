// mongoose is a higher level api than mongodb driver library
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://jipenaflor:${password}@cluster0.twnad0r.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

// add contact
const addPerson = (name, number) => {
    const person = new Person({
        name,
        number,
    })

    person.save().then(()=> {
        console.log(`Added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}

// fetch contacts
const fetchPersons = () => {
    Person.find({}).then((result) => {
        console.log('phonebook:')
        result.forEach((person) => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length === 5) {
    addPerson(process.argv[3], process.argv[4])
} else if (process.argv.length === 3) {
    fetchPersons()
}
