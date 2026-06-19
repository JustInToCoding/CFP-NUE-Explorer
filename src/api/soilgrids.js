const PROPS = ['soc', 'phh2o', 'clay', 'sand']
const DEPTH = '0-5cm'

export const fetchSoilGridsProps = async ({ latitude, longitude }) => {
  const qs = new URLSearchParams({ lon: longitude, lat: latitude, value: 'mean' })
  PROPS.forEach((p) => qs.append('property', p))
  qs.append('depth', DEPTH)

  const res = await fetch(`https://rest.isric.org/soilgrids/v2.0/properties/query?${qs}`)
  if (!res.ok) throw new Error(`SoilGrids ${res.status}: ${res.statusText}`)
  return res.json()
}

export const parseSoilGridsProps = (raw) => {
  const layers = raw?.properties?.layers ?? []
  const get = (name) => {
    const layer = layers.find((l) => l.name === name)
    const mean = layer?.depths?.find((d) => d.label === DEPTH)?.values?.mean
    if (mean == null) return null
    return mean / (layer?.unit_measure?.d_factor ?? 1)
  }
  return {
    soc:  get('soc'),    // g/kg
    ph:   get('phh2o'),  // pH units
    clay: get('clay'),   // %
    sand: get('sand'),   // %
  }
}
