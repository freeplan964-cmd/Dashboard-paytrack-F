export async function apiRequest(path, options) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) }, ...options })
  const payload = await response.json().catch(() => null)
  if (response.status === 401 && typeof window !== 'undefined') {
    const next = `${window.location.pathname}${window.location.search}`
    window.location.assign(`/login?next=${encodeURIComponent(next)}`)
  }
  if (!response.ok || payload?.success === false) throw new Error(payload?.error?.message || 'Request failed.')
  return payload?.data ?? payload
}
