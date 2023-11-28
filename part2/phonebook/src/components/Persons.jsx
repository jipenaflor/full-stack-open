import React from "react"
import Person from "./Person"

export const Persons = ({toShow, deletePerson}) => {
    const personsElements = toShow.map(person => 
        <Person key={person.id} person={person} deletePerson={() => deletePerson(person.id)}/>)
    return (
        <div>
            {personsElements}
        </div>
    )
}

export default Persons