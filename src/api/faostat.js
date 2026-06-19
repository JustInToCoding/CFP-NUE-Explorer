const BASE = '/faostat'

// In-memory token cache
let _token = null
let _tokenExpiry = 0

const login = async () => {
  const username = import.meta.env.VITE_FAOSTAT_USERNAME
  const password = import.meta.env.VITE_FAOSTAT_PASSWORD
  if (!username || !password) return null

  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }).toString(),
  })
  if (!res.ok) throw new Error(`FAOSTAT login failed: ${res.status} ${res.statusText}`)
  const data = await res.json()
  _token = data.AuthenticationResult?.AccessToken ?? null
  const expiresIn = data.AuthenticationResult?.ExpiresIn ?? 3600
  _tokenExpiry = Date.now() + expiresIn * 1000
  return _token
}

const getToken = async () => {
  if (_token && Date.now() < _tokenExpiry - 60_000) return _token
  return login()
}

const faoGet = async (path, params = {}) => {
  const token = await getToken()
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
  ).toString()
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(`${BASE}${path}${qs ? `?${qs}` : ''}`, { headers })
  if (!res.ok) throw new Error(`FAOSTAT ${res.status}: ${res.statusText}`)
  return res.json()
}

export const getFaostatCodes = (domain, dimension) =>
  faoGet(`/en/codes/${dimension}/${domain}`)

export const getFaostatData = (domain, params) =>
  faoGet(`/en/data/${domain}`, { output_type: 'objects', ...params })
