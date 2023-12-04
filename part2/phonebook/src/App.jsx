import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])       
  const [newName, setNewName] = useState('')                // name
  const [newNumber, setNewNumber] = useState('')            // number
  const [showAll, setShowAll] = useState('')                // filter
  const [errorMessage, setErrorMessage] = useState(null)    // error message

  // retrieve json from server
  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

  // add Person object
  const addPerson = (event) => {
    event.preventDefault()
    const message = {
      type: null,
      content: null
    }
    if (persons.find(p => p.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const toChange = persons.find(p => p.name === newName)
        const changedPerson = {...toChange, number: newNumber}    // shallow copy with changed number
        personsService.update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            setErrorMessage({type: "success", content: `Changed ${newName}'s number`})
            setPersons(persons.map(p => p.id !== toChange.id? p : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
      }
    } else {
      const person = {
        name: newName,
        number: newNumber
      }
      personsService.create(person).then(newPerson => {
        setErrorMessage({type: "success", content: `Added ${newName}`})
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
      }).catch(error => {
        setErrorMessage({type: "error", content: error.response.data.error})
      })

      
    }
    setTimeout(() => {setErrorMessage(null)}, 5000)
  }

  // delete Person
  const deletePerson = id => {
    //console.log(`this is ${id}`)
    const toDelete = persons.find(person => person.id === id)
    //console.log(toDelete)
    if (window.confirm(`Delete ${toDelete.name}`)) {
      personsService.destroy(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !==id))
        })
        .catch(error => {
          setErrorMessage({type: "error", 
            content: `Information of ${toDelete.name} has already been removed from the server`})
          setTimeout(() => {setErrorMessage(null)}, 5000)
        })
    }
  }

  const handleNamechange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setShowAll(event.target.value)
  }
  
  // filter displayed contacts
  const numbersToShow = persons.filter(person => person.name.toLowerCase().includes(showAll.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      {/*Notification*/}
      <Notification message={errorMessage} />

      {/*filter form*/}
      <Filter value={showAll} onChange={handleFilterChange}/>

      {/*add person form*/}
      <h2>add a new</h2>
      <PersonForm 
        onSubmit ={addPerson} name ={newName} handleName={handleNamechange} 
        number={newNumber} handleNumber={handleNumberChange}
      />

      {/*display list of contacts*/}
      <h2>Numbers</h2>
      <Persons toShow={numbersToShow} deletePerson={deletePerson}/>
    </div>
  )
}

export default App