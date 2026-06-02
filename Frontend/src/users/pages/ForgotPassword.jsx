import React, { useState } from 'react'
import { Link } from 'react-router'

import Card from '../../share/components/UiComponents/Card'
import Button from '../../share/components/FormElements/Button'
import Input from '../../share/components/FormElements/Input'
import LoadingSpinner from '../../share/components/UiComponents/LoadingSpinner'
import ErrorModal from '../../share/components/UiComponents/ErrorModal'
import { VALIDATOR_EMAIL } from '../../share/util/validators'
import { useForm } from '../../share/hooks/form-hooks'
import { useHttpClient } from '../../share/hooks/http-hook'

import './Auth.css'

const ForgotPassword = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [message, setMessage] = useState('')

  const [formState, inputHandler] = useForm(
    {
      email: { value: '', isValid: false }
    },
    false
  )

  const submitHandler = async (event) => {
    event.preventDefault()
    const email = formState.inputs.email.value
    console.log(`[ForgotPassword] Sending reset request for email: ${email}`)
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_API_URL}/users/forgot-password`,
        'POST',
        JSON.stringify({ email }),
        { 'Content-Type': 'application/json' }
      )
      console.log(`[ForgotPassword] Success:`, responseData)
      setMessage(responseData.message)
    } catch (err) {
      console.error(`[ForgotPassword] Error:`, err.message)
    }
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Forgot Password</h2>
        <hr />
        {message ? (
          <div>
             <p style={{ color: '#16a34a', margin: '1rem 0' }}>{message}</p>
             <Link to="/auth">
                <Button>BACK TO LOGIN</Button>
             </Link>
          </div>
        ) : (
          <form onSubmit={submitHandler}>
            <p style={{ marginBottom: '1rem', color: '#64748b' }}>
              Enter your email address to receive a password reset link.
            </p>
            <Input
              id="email"
              element="input"
              type="email"
              label="E-Mail"
              placeholder="Enter your email"
              errorText="Please enter a valid email address."
              validators={[VALIDATOR_EMAIL()]}
              onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>
              SEND RESET LINK
            </Button>
            <div style={{ marginTop: '1rem' }}>
               <Link to="/auth" style={{ color: '#4f46e5', textDecoration: 'none' }}>
                  Back to Login
               </Link>
            </div>
          </form>
        )}
      </Card>
    </>
  )
}

export default ForgotPassword
