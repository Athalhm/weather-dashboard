import { useQuery } from '@tanstack/react-query'
import { fetchForecast } from '@/api/forecast'
import type { City } from '@/lib/cities'

const TEN_MINUTES = 10 * 60 * 1000

export const useForecast = (city: City | null) =>
  useQuery({
    queryKey: ['forecast', city?.slug],
    queryFn: ({ signal }) => {
      if (!city) throw new Error('Kota belum dipilih')
      return fetchForecast(city.lat, city.lon, signal)
    },
    enabled: city !== null,
    staleTime: TEN_MINUTES,
  })