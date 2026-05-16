import React, { useState } from 'react'
import { useParams, Link } from 'react-router'

import Card from '../../share/components/UiComponents/Card'
import Button from '../../share/components/FormElements/Button'
import Input from '../../share/components/FormElements/Input'
import LoadingSpinner from '../../share/components/UiComponents/LoadingSpinner'
import ErrorModal from '../../share/components/UiComponents/ErrorModal'
import { VALIDATOR_MINLENGTH } from '../../share/util/validators'
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
              placeholder="Enter new 6+ char password"
              errorText="Please enter a valid password (at least 6 characters)."
              validators={[VALIDATOR_MINLENGTH(6)]}
              onInput={inputHandler}
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
