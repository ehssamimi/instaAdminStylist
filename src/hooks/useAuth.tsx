"use client"
import { useState } from 'react'
import { removeToken, updateAccessToken } from '@/lib/jwt-utils'

type AuthState = {
  user: string | null;
  token: string | null;
};
const getAuth = () => {
  if (typeof window !== 'undefined') {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      return { user: 'Authenticated User', token: storedToken };
    }
  }
  return { user: null, token: null }
}
const useAuth = () => {
  const [auth, setAuth] = useState<AuthState>(getAuth());

  const login = (token: string) => {
    updateAccessToken(token);
    setAuth({ user: 'Authenticated User', token });
  };

  const logout = () => {
    removeToken()
    setAuth({ user: null, token: null });
  };

  const isAuthenticated = () => {
    return !!auth.token;
  };

  return { auth, login, logout, isAuthenticated };
};

export default useAuth;