import { mockRequest } from './mock'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const BASE = '/api'

const request = async (method, path, body) => {
  if (USE_MOCK) return mockRequest(method, path, body)

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${import.meta.env.VITE_CFP_API_TOKEN}`,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}${text ? `: ${text}` : ''}`)
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const get = (path) => request('GET', path)
export const post = (path, body) => request('POST', path, body)
export const put = (path, body) => request('PUT', path, body)
export const del = (path) => request('DELETE', path)
