import {  Routes, Route,Navigate } from "react-router";
import { useCallback, useState } from 'react'
import MainNavigation from "./share/components/Navigation/MainNavigation";
// import { BrowserRouter, Routes, Route } from "react-router";

import Newplace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import User from "./users/pages/Users";
import UpdatePlace from './places/pages/UpdatePlace'
import Auth from "./users/pages/Auth";
import { AuthContext } from "./share/Context/auth-context";
// import myImage from './assets/images.jpeg'
import './App.css'
// import { Navigate } from "react-router";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const login=useCallback(()=>{
    setIsLoggedIn(true)
  })
  const logout=useCallback(()=>{
    setIsLoggedIn(false)
  })
let routes

if (isLoggedIn){
  routes=(
    <Routes>
      <Route path="/" element={<User />} />
      <Route path="/:id/places" element={<UserPlaces/>}/>
      <Route path="/places/new" element={<Newplace/>}/>
      <Route path="/places/:id" element={<UpdatePlace/>}/>
      <Route path="/auth" element={<Navigate to='/'/>}/>
    </Routes>
  )
} else {
  routes=(
  <Routes>
    <Route path="/auth" element={<Auth/>}/>
    <Route path="/" element={<User />} />
    <Route path="/:id/places" element={<UserPlaces/>}/>
    <Route path="/logout" element={<Navigate to ='/auth'/>}/>
  </Routes>
  )
}
  return (
       <>
       <AuthContext.Provider value={{isLoggedIn:isLoggedIn,login:login,logout:logout}}>
          <MainNavigation/>
          <main>
            
              {routes}
          
          </main>
      </AuthContext.Provider>
     </>
  )
}

export default App













































    // <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>