const BASE = 'https://faostatservices.fao.org/api/v1'

// In-memory JWT cache — keyed by username so stale tokens are dropped when credentials change
let _cache = { username: null, token: null, expiry: 0 }

const login = async () => {
  const username = localStorage.getItem('faostat_username') ?? ''
  const password = localStorage.getItem('faostat_password') ?? ''
  if (!username || !password) return null

  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }).toString(),
  })
  if (!res.ok) throw new Error(`FAOSTAT login failed: ${res.status} ${res.statusText}`)
  const data = await res.json()
  const token = data.AuthenticationResult?.AccessToken ?? null
  const expiresIn = data.AuthenticationResult?.ExpiresIn ?? 3600
  _cache = { username, token, expiry: Date.now() + expiresIn * 1000 }
  return token
}

const getToken = async () => {
  const username = localStorage.getItem('faostat_username') ?? ''
  if (_cache.token && _cache.username === username && Date.now() < _cache.expiry - 60_000)
    return _cache.token
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
