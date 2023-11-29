import axios from "axios"
import { useState, useEffect } from "react"

export const CountryData = ({country}) => {
    //console.log(Object.values(country.languages))
    const [weather, setWeather] = useState(null)
    const api_key = import.meta.env.VITE_WEATHER_KEY

    useEffect(() => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}`)
            .then(response => {
                //console.log(response.data)
                setWeather(response.data)
            })
    }, [country.capital[0]])

    if (weather !== null) {
        return (
            <div>
                <h2>{country.name.common}</h2>
                <div>capital {country.capital[0]}</div>
                <div>area {country.area}</div>

                <h3>languages</h3>
                <ul>
                    {Object.values(country.languages).map(lang => {
                        //console.log(lang)
                        return (
                            <li key={lang}>{lang}</li>
                        )
                    })}
                </ul>

                <div>
                    <img src={country.flags.png} width="200px"/>
                </div>

                <h2>Weather in {country.capital[0]}</h2>
                <div>
                    temperature {weather.main.temp - 273.15} Celsius
                </div>
                <div>
                    <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                        width="100px"/>
                </div>
                <div>
                    wind {weather.wind.speed} m/s
                </div>
            </div>
        )
    }
}

export default CountryData