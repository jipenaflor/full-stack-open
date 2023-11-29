import { useEffect, useState } from "react"
import axios from "axios"
import Search from "./components/Search"
import Countries from "./components/Countries"

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios.get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then(response => {
        //console.log(response.data)
        setCountries(response.data)
      })
  }, [])

  const handleSearchChange = (event) => {
    setSearch(event.target.value.toLowerCase())
  }

  const countriesToShow = search.length === 0 ? countries: countries.filter(country => 
    country.name.common.toLowerCase().includes(search.toLowerCase())) 

  return (
    <div>
      <Search value={search} onChange={handleSearchChange}/>
      <Countries search={search} 
        countries={countriesToShow}
        handleSearchChange={(e) => handleSearchChange(e)}/>
    </div>
  )
}

export default App