import { useState } from 'react'
import { useForecast } from '@/hooks/useForecast'
import { searchCities, type City } from '@/lib/cities'
import { Button } from '@/components/ui/button'

const bandung = searchCities('kota bandung')[0]
const jayapura = searchCities('kota jayapura')[0]

export default function App() {
  const [city, setCity] = useState<City | null>(null)
  const { data, isPending, isFetching, isError, error, refetch } = useForecast(city)

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => setCity(bandung)}>Bandung</Button>
        <Button onClick={() => setCity(jayapura)}>Jayapura</Button>
        <Button variant="outline" onClick={() => setCity(null)}>Kosongkan</Button>
      </div>

      <p>Kota: {city?.name ?? '(belum dipilih)'} | fetching: {String(isFetching)}</p>

      {city === null ? (
        <p>Pilih kota dulu</p>
      ) : isPending ? (
        <p>Memuat...</p>
      ) : isError ? (
        <div>
          <p className="text-red-600">Error: {error.message}</p>
          <Button onClick={() => refetch()}>Coba lagi</Button>
        </div>
      ) : (
        <pre className="text-xs overflow-auto max-h-96 bg-muted p-2 rounded">
          {JSON.stringify(data.current, null, 2)}
        </pre>
      )}
    </div>
  )
}