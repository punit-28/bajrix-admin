const BASE = '/api/products'

async function request(url, options = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const err = new Error(data?.message || 'Something went wrong. Please try again.')
    err.fieldErrors = data?.errors || {}
    throw err
  }
  return data
}

export const api = {
  list: (params) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null))
    return request(`${BASE}?${qs}`)
  },
  stats: () => request(`${BASE}/stats`),
  categories: () => request(`${BASE}/categories`),
  create: (body) => request(BASE, { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),
}
