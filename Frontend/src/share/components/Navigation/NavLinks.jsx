import React, { useContext } from 'react'
import { NavLink } from 'react-router'

import './NavLinks.css'
import { AuthContext } from '../../Context/auth-context'

const NavLinks = () => {
  const auth = useContext(AuthContext)
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">PLACES</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">SIGN IN</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  )
}

export default NavLinks