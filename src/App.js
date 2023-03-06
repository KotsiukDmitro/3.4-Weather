import img from './img.png';
import './App.css';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const [city, setCity] = useState('Zaporizhzhia')
  function citySearch(event) {
    setCity(event.target.value)
  }
  function submit(event) {
    event.preventDefault()
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=ea2e638e299558709181a842b8507203`
    axios({
      method: 'get',
      url: url
    })
      .then(function (response) {
        weather(response)
        nextDay(response)
        console.log(response)
      })
  }

  const [weatherCity, setWeatherCity] = useState([])
  function weather(response) {
    const cityData = {}
    cityData.city = response.data.city.name
    cityData.country = response.data.city.country
    cityData.description = response.data.list[0].weather[0].description
    const iconId = response.data.list[0].weather[0].icon
    cityData.icon = `https://openweathermap.org/img/wn/${iconId}@2x.png`
    cityData.main = Math.round(response.data.list[0].main.temp - 273) + ' ' + '℃'
    setWeatherCity(cityData)
  }

  const [nextDays, setNextDays] = useState([])
  function nextDay(response) {
    const listDays = response.data.list.filter((elem) => {
      const date = new Date(elem.dt_txt)
      return (date.toDateString() !== new Date().toDateString() && date.getHours() === 12)
    })
      .slice(0, 5)
      .map(e => {

        const date = new Date(e.dt_txt)
        const allDay = response.data.list.filter((elem) => {
          return (new Date(elem.dt_txt).toDateString() === date.toDateString())
        })

        const tempMin = Math.round(allDay.map(element => element.main.temp_min).reduce((prev, cur) => Math.min(prev, cur), 1000) - 273)
        const tempMax = Math.round(allDay.map(element => element.main.temp_max).reduce((prev, cur) => Math.max(prev, cur), 0) - 273)

        const days = ['Sun', 'Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sut']
        const day = date.getDay()

        return {
          day: days[day],
          icon: `https://openweathermap.org/img/wn/${e.weather[0].icon}.png`,
          description: e.weather[0].description,
          tempMin: tempMin,
          tempMax: tempMax,
          key: e.dt
        }
      })
    setNextDays(listDays)
  }
  return (<div className="container">
    <form className="form">
      <div className="form-search">
        <input list="city" type="search" list='city' className="form-input" name="formSelect" value={city} onChange={citySearch} placeholder="search" />
        <button className="btn" onClick={submit}><img className="img" src={img} alt="logo" /></button>
        <datalist id='city'>
          <option value="Kyiv">Киев, Украина</option>
          <option value="Dnipro">Днепр, Украина</option>
          <option value="Zaporizhzhia">Запорожье, Украина</option>
          <option value="Kharkiv">Харьков, Украина</option>
          <option value="Crimea">Крым, Украина</option>
        </datalist>
      </div>
      <div className="header">
        <div className="temperature-now">{weatherCity.main}</div>
        <div>
          <div className="region">{weatherCity.city}, {weatherCity.country}</div>
          <div className="description-now">{weatherCity.description}</div>
        </div>
        <div className="icon-main"><img src={weatherCity.icon} /> </div>
      </div>
      <div className="widget">
        {nextDays.map(item => {
          return (<div className="widget-day" key={item.key}>
            <div className="day">{item.day}</div>
            <div className="icon"><img src={item.icon} /> </div>
            <div className="description" >{item.description}</div>
            <div className="temperature">
              <div className="temp-max">{item.tempMin}</div>
              <div className="temp-min">{item.tempMax}</div>
            </div>

          </div>)
        })}
      </div>
    </form>
  </div>)
}
export default App;
