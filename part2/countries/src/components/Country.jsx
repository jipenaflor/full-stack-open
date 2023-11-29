export const Country = ({country, handleSearchChange}) => {
    //console.log(country.name.common)
    return (
        <div>
            {country.name.common}
            <button value={country.name.common} onClick={handleSearchChange}>show</button>
        </div>
    )
}

export default Country