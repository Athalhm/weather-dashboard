import raw from '../data/cities.json'

type RawCity = {
  id: string
  propinsi: string
  kota: string
  kecamatan: string
  lat: string
  lon: string
}

export type City = {
  slug: string
  name: string
  province: string
  lat: number
  lon: number
}

const fixProvince = (s: string) =>
  s
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2')

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')

export const cities: City[] = (() => {
  const map = new Map<string, City>()
  for (const r of raw as RawCity[]) {
    const kota = r.kota.trim()
    if (!/^(Kota|Kab\.)\s/.test(kota)) continue
    const name = kota
      .replace(/^Kab\.\s*/, 'Kabupaten ')
      .replace(/\bMakasar\b/, 'Makassar')
    const slug = slugify(name)
    if (map.has(slug)) continue
    const lat = Number(r.lat)
    const lon = Number(r.lon)
    if (Number.isNaN(lat) || Number.isNaN(lon)) continue
    map.set(slug, { slug, name, province: fixProvince(r.propinsi), lat, lon })
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
})()

export const searchCities = (q: string, limit = 8): City[] => {
  const s = q.toLowerCase().trim()
  if (!s) return []
  return cities
    .filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.province.toLowerCase().includes(s),
    )
    .slice(0, limit)
}