import React from 'react'
import Button from '../FormElements/Button'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found center">
      <div className="not-found__content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Button to="/">Go Home</Button>
      </div>
    </div>
  )
}

export default NotFound
