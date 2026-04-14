import { useState, useEffect } from 'react'
import { getUserFromToken } from '@/lib/jwt-utils'
import { type User } from '@/models/login'

interface UseUserReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  refreshUser: () => void
}

/**
 * Custom hook to get user data from JWT token in localStorage
 * @returns User data, loading state, authentication status, and refresh function
 */
export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = () => {
    setIsLoading(true)
    const userFromToken = getUserFromToken()
    setUser(userFromToken)
    setIsLoading(false)
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refreshUser,
  }
}
