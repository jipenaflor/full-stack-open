import Country from "./Country"
import CountryData from "./CountryData"

export const Countries = ({search, countries, handleSearchChange}) => {
    //console.log(search)
    //console.log(countries)
    let display = ""

    if (search.length > 0) {
        if (countries.length === 1) {
            display = <CountryData country={countries[0]} />
        } else if (countries.length <= 10) {
            display = countries.map(country => { return (
                <Country key={country.name.common} 
                    country={country}
                    handleSearchChange={handleSearchChange}/>)
            })
        } else {
            display = "Too many matches, specify another filter"
        } 
    }

    return (
        <div>
            {display}
        </div>
    )
}

export default Countries