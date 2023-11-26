import { useState } from 'react'
import Filter from './components/Filter'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456'}
  ]) 
  const [newName, setNewName] = useState('')      // name
  const [newNumber, setNewNumber] = useState('')  // number
  const [showAll, setShowAll] = useState('')      // filter

  const handleNamechange = (event) => {
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setShowAll(event.target.value)
  }

  // add Person object
  const addPerson = (event) => {
    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber
    }
    if (persons.find(p => p.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      setPersons(persons.concat(person))
      setNewName('')
      setNewNumber('')
    }
  }

  // filter displayed contacts
  const numbersToShow = persons.filter(person => person.name.toLowerCase().includes(showAll.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      {/*filter form*/}
      <Filter value={showAll} onChange={handleFilterChange}/>

      {/*add person form*/}
      <h2>add a new</h2>
      <PersonForm onSubmit ={addPerson} name ={newName} handleName={handleNamechange} number={newNumber} handleNumber={handleNumberChange}/>

      {/*display list of contacts*/}
      <h2>Numbers</h2>
      <Persons toShow={numbersToShow}/>
    </div>
  )
}

export default App