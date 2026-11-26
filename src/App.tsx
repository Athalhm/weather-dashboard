import { cities, searchCities } from './lib/cities'

console.log('Total kota:', cities.length)
console.log('5 pertama:', cities.slice(0, 5))
console.log('Cari bandung:', searchCities('bandung'))
console.log('Makassar:', searchCities('makassar'))
console.log('Ada Merak?', cities.some((c) => c.name.includes('Merak')))
console.log('Provinsi unik:', [...new Set(cities.map((c) => c.province))])

export default function App() {
  return <div className="p-4">Cek console (F12)</div>
}