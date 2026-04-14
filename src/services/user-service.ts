export interface StoredUser {
  name: string
  [key: string]: unknown
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("user")
  if (!stored) return null
  try {
    return JSON.parse(stored) as StoredUser
  } catch {
    return null
  }
}

export function isSuperAdmin(): boolean {
  const user = getStoredUser()
  return user?.name === "Super Admin" || user?.email === "brett@getcover.com" || user?.email === "jesse@getcover.com" || user?.email === "mina.saleeb@nmscg.com" || user?.email === "developer@touchzenmedia.com"
}

