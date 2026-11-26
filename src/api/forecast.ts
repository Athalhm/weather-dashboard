const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

type OpenMeteoResponse = {
  timezone: string
  current: {
    time: string
    temperature_2m: number
    relative_humidity_2m: number
    weather_code: number
    wind_speed_10m: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: (number | null)[]
    wind_speed_10m: number[]
  }
  daily: {
    time: string[]
    weather_code: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
  }
}

export type CurrentWeather = {
  time: string
  temperature: number
  humidity: number
  weatherCode: number
  wind: number
}

export type HourlyPoint = {
  time: string
  temperature: number
  precipitation: number
  wind: number
}

export type DailyPoint = {
  date: string
  weatherCode: number
  tempMax: number
  tempMin: number
}

export type Forecast = {
  timezone: string
  current: CurrentWeather
  hourly: HourlyPoint[]
  daily: DailyPoint[]
}

const buildUrl = (lat: number, lon: number): string => {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,precipitation_probability,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '7',
  })
  return `${BASE_URL}?${params.toString()}`
}

export const toForecast = (res: OpenMeteoResponse): Forecast => ({
  timezone: res.timezone,
  current: {
    time: res.current.time,
    temperature: res.current.temperature_2m,
    humidity: res.current.relative_humidity_2m,
    weatherCode: res.current.weather_code,
    wind: res.current.wind_speed_10m,
  },
  hourly: res.hourly.time.map((time, i) => ({
    time,
    temperature: res.hourly.temperature_2m[i],
    precipitation: res.hourly.precipitation_probability[i] ?? 0,
    wind: res.hourly.wind_speed_10m[i],
  })),
  daily: res.daily.time.map((date, i) => ({
    date,
    weatherCode: res.daily.weather_code[i],
    tempMax: res.daily.temperature_2m_max[i],
    tempMin: res.daily.temperature_2m_min[i],
  })),
})

export const fetchForecast = async (
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<Forecast> => {
  const res = await fetch(buildUrl(lat, lon), { signal })
  if (!res.ok) {
    throw new Error(`Gagal memuat cuaca (status ${res.status})`)
  }
  const json = (await res.json()) as OpenMeteoResponse
  return toForecast(json)
}