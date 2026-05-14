import { Routes, Route, Navigate } from 'react-router'
import { AuthContext } from './share/Context/auth-context'
import { useAuth } from './share/hooks/auth-hook'

import MainNavigation from './share/components/Navigation/MainNavigation'
import Users from './users/pages/Users'
import UserPlaces from './places/pages/UserPlaces'
import NewPlace from './places/pages/NewPlace'
import UpdatePlace from './places/pages/UpdatePlace'
import Auth from './users/pages/Auth'
import NotFound from './share/components/UiComponents/NotFound'

import './App.css'

function App() {
  const { token, login, logout, userId } = useAuth()

  let routes
  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:uid/places" element={<UserPlaces />} />
        <Route path="/places/new" element={<NewPlace />} />
        <Route path="/places/:pid" element={<UpdatePlace />} />
        <Route path="/auth" element={<Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:uid/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <MainNavigation />
      <main>{routes}</main>
    </AuthContext.Provider>
  )
}

export default App