import { useState, useCallback, useEffect } from 'react'

let logoutTimer

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [tokenExpiration, setTokenExpiration] = useState(null)
  const [userId, setUserId] = useState(null)

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token)
    setUserId(uid)
    const expDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    setTokenExpiration(expDate)
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: expDate.toISOString()
      })
    )
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setTokenExpiration(null)
    setUserId(null)
    localStorage.removeItem('userData')
  }, [])

  // Auto-logout when token expires
  useEffect(() => {
    if (token && tokenExpiration) {
      const remainingTime = tokenExpiration.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpiration])

  // Auto-login from localStorage on mount
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
  }, [login])

  return { token, login, logout, userId }
}
