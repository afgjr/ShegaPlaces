import React, { useState } from 'react'
import { useParams, Link } from 'react-router'

import Card from '../../share/components/UiComponents/Card'
import Button from '../../share/components/FormElements/Button'
import Input from '../../share/components/FormElements/Input'
import LoadingSpinner from '../../share/components/UiComponents/LoadingSpinner'
import ErrorModal from '../../share/components/UiComponents/ErrorModal'
import { VALIDATOR_PASSWORD } from '../../share/util/validators'
import { useForm } from '../../share/hooks/form-hooks'
import { useHttpClient } from '../../share/hooks/http-hook'

import './Auth.css'

const ResetPassword = () => {
  const { token } = useParams()
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [success, setSuccess] = useState(false)

  const [formState, inputHandler] = useForm(
    {
      newPassword: { value: '', isValid: false }
    },
    false
  )

  const submitHandler = async (event) => {
    event.preventDefault()
    try {
      await sendRequest(
        `${import.meta.env.VITE_API_URL}/users/reset-password/${token}`,
        'POST',
        JSON.stringify({ newPassword: formState.inputs.newPassword.value }),
        { 'Content-Type': 'application/json' }
      )
      setSuccess(true)
    } catch (err) {
      // handled by hook
    }
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Reset Password</h2>
        <hr />
        {success ? (
          <div>
            <p style={{ color: '#16a34a', margin: '1rem 0' }}>
               Password has been successfully reset!
            </p>
            <Link to="/auth">
               <Button>LOG IN NOW</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={submitHandler}>
            <Input
              id="newPassword"
              element="input"
              type="password"
              label="New Password"
              placeholder="8+ chars, 1 Uppercase, 1 Number, 1 Spec Char"
              errorText="Password must be at least 8 char with 1 uppercase, 1 lowercase, 1 number, and 1 special character."
              validators={[VALIDATOR_PASSWORD()]}
              onInput={inputHandler}
              showCriteria={true}
            />
            <Button type="submit" disabled={!formState.isValid}>
              SET NEW PASSWORD
            </Button>
          </form>
        )}
      </Card>
    </>
  )
}

export default ResetPassword
