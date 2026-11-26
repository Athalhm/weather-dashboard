import { useEffect } from 'react'
import { fetchForecast } from './api/forecast'
import { searchCities } from './lib/cities'

export default function App() {
  useEffect(() => {
    const controller = new AbortController()
    const bandung = searchCities('kota bandung')[0]
    const jayapura = searchCities('kota jayapura')[0]

    fetchForecast(bandung.lat, bandung.lon, controller.signal)
      .then((data) => console.log('Bandung:', data))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err)
      })

    fetchForecast(jayapura.lat, jayapura.lon, controller.signal)
      .then((data) => console.log('Jayapura:', data))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err)
      })

    return () => controller.abort()
  }, [])

  return <div className="p-4">Cek console (F12)</div>
}