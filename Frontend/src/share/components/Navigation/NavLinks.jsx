import React, { useContext } from 'react';
import { NavLink } from 'react-router';

import './NavLinks.css';
import { AuthContext } from '../../Context/auth-context';

const NavLinks = props => {
  const auth=useContext(AuthContext)
  return <ul className="nav-links">
    <li>
      <NavLink to="/" >ALL USERS</NavLink>
    </li>
    { auth.isLoggedIn&&
      <li>
        <NavLink to="/p1/places">MY PLACES</NavLink>
      </li>
    }
    { auth.isLoggedIn&&
      <li>
        <NavLink to="/places/new">ADD PLACE</NavLink>
      </li>
    }

    { !auth.isLoggedIn&&
      <li>
      <NavLink to="/auth">AUTHENTICATE</NavLink>
    </li>
    }
    {auth.isLoggedIn&&
      <li>
        <NavLink onClick={auth.logout} to='/logout'>LOGOUT</NavLink>
      </li>
    }
  </ul>
};

export default NavLinks;