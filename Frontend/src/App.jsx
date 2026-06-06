import { Routes, Route, Navigate } from 'react-router'
import { AuthContext } from './share/Context/auth-context'
import { useAuth } from './share/hooks/auth-hook'

import React, { Suspense } from 'react'

import MainNavigation from './share/components/Navigation/MainNavigation'
import LoadingSpinner from './share/components/UiComponents/LoadingSpinner'

// Lazy-loaded pages (Code Splitting)
const Users = React.lazy(() => import('./users/pages/Users'))
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'))
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'))
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'))
const Auth = React.lazy(() => import('./users/pages/Auth'))
const ForgotPassword = React.lazy(() => import('./users/pages/ForgotPassword'))
const ResetPassword = React.lazy(() => import('./users/pages/ResetPassword'))
const AuthSuccess = React.lazy(() => import('./users/pages/AuthSuccess'))
const PrivacyPolicy = React.lazy(() => import('./users/pages/PrivacyPolicy'))
const NotFound = React.lazy(() => import('./share/components/UiComponents/NotFound'))

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
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/auth" element={<Navigate to="/" />} />
        <Route path="/forgot-password" element={<Navigate to="/" />} />
        <Route path="/reset-password/:token" element={<Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/:uid/places" element={<UserPlaces />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
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
      <main>
        <Suspense fallback={<div className="center"><LoadingSpinner /></div>}>
          {routes}
        </Suspense>
      </main>
    </AuthContext.Provider>
  )
}

export default App
