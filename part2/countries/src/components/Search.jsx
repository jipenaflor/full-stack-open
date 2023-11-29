export const Search = ({value, onChange}) => {
    return (
        <form>
            <div>
                find countries <input value={value} onChange={onChange}/>
            </div>
        </form>
    )
}

export default Search