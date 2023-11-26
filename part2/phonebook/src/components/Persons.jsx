import React from "react"
import Person from "./Person"

export const Persons = ({toShow}) => {
    const personsElements = toShow.map(person => <Person key={person.name} person={person}/>)
    return (
        <div>
            {personsElements}
        </div>
    )
}

export default Persons