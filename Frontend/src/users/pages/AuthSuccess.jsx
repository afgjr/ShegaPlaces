import React, { useEffect, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { AuthContext } from '../../share/Context/auth-context'

const AuthSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  useEffect(() => {
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')

    if (token && userId) {
      auth.login(userId, token)
      navigate('/')
    } else {
      navigate('/auth')
    }
  }, [searchParams, navigate, auth])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Authenticating via Google... Please wait.</h2>
    </div>
  )
}

export default AuthSuccess
