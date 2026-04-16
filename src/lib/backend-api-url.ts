/**
 * Single source of truth for building upstream URLs from `NEXT_PUBLIC_API_URL`.
 *
 * Accepts either an API origin (`http://host:8000`) or the same with an `/api` suffix
 * (`http://host:8000/api`). Returns origin only (no trailing slash).
 *
 * All real traffic should use `backendApiBaseFromEnv()` → `${origin}/api` + route path.
 */
export function normalizeBackendApiOrigin(raw: string | undefined): string {
  if (!raw?.trim()) return ''
  let s = raw.trim().replace(/\/+$/, '')
  const forParse = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(s) ? s : `http://${s}`
  try {
    const u = new URL(forParse)
    let path = u.pathname.replace(/\/+$/, '')
    if (path === '/api') {
      u.pathname = ''
    }
    const pathOut = (u.pathname || '').replace(/\/+$/, '')
    return `${u.origin}${pathOut}`
  } catch {
    return s.endsWith('/api') ? s.slice(0, -4).replace(/\/+$/, '') : s
  }
}

/** e.g. `http://localhost:8000/api` — use for `${base}/admin/...`, `${base}/auth/...` */
export function backendApiBaseFromEnv(): string {
  const o = normalizeBackendApiOrigin(process.env.NEXT_PUBLIC_API_URL)
  return o ? `${o}/api` : ''
}
