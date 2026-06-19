import { post } from './client'

// Real API wraps soil class values in objects: { wrbSoilClassName: "Cambisols" }
// Normalise to plain strings so callers don't have to handle both shapes.
const extractStr = (val) => {
  if (!val) return null
  if (typeof val === 'string') return val
  return Object.values(val).find((v) => typeof v === 'string') ?? null
}

const normalize = (data) => ({
  ...data,
  ipccSoilClass: extractStr(data?.ipccSoilClass) ?? data?.ipccSoilClassName ?? null,
  wrbSoilClass:  extractStr(data?.wrbSoilClass)  ?? data?.wrbSoilClassName  ?? null,
})

export const fetchSoilCharacteristic = ({ latitude, longitude }) =>
  post('/soil-characteristic', { latitude, longitude }).then(normalize)
