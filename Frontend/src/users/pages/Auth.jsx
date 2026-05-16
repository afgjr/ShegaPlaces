import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router'

import Card from '../../share/components/UiComponents/Card'
import Button from '../../share/components/FormElements/Button'
import Input from '../../share/components/FormElements/Input'
import ImageUpload from '../../share/components/FormElements/ImageUpload'
import LoadingSpinner from '../../share/components/UiComponents/LoadingSpinner'
import ErrorModal from '../../share/components/UiComponents/ErrorModal'
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE, VALIDATOR_PASSWORD } from '../../share/util/validators'
import { useForm } from '../../share/hooks/form-hooks'
import { useHttpClient } from '../../share/hooks/http-hook'
import { AuthContext } from '../../share/Context/auth-context'

import './Auth.css'

const Auth = () => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: '', isValid: false },
      password: { value: '', isValid: false }
    },
    false
  )

  const authSubmitHandler = async (event) => {
    event.preventDefault()

    if (isSignup) {
      try {
        const formData = new FormData()
        formData.append('name', formState.inputs.name.value)
        formData.append('email', formState.inputs.email.value)
        formData.append('password', formState.inputs.password.value)
        if (formState.inputs.image?.value) {
          formData.append('image', formState.inputs.image.value)
        }

        const responseData = await sendRequest(
          `${import.meta.env.VITE_API_URL}/users/signup`,
          'POST',
          formData
        )
        auth.login(responseData.userId, responseData.token)
        navigate('/')
      } catch (err) {
        // error handled by hook
      }
    } else {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_API_URL}/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          { 'Content-Type': 'application/json' }
        )
        auth.login(responseData.userId, responseData.token)
        navigate('/')
      } catch (err) {
        // error handled by hook
      }
    }
  }

  const switchModeHandler = () => {
    if (isSignup) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      )
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: '', isValid: false },
          image: { value: null, isValid: false }
        },
        false
      )
    }
    setIsSignup((prev) => !prev)
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isSignup ? 'Sign Up' : 'Login Required'}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {isSignup && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Name"
              placeholder="Enter your name"
              errorText="Please enter a valid name."
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
          )}
          {isSignup && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            />
          )}
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
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            placeholder={"Enter password"}
            errorText={isSignup ? "Password must be at least 8 chars with 1 uppercase, 1 lowercase, 1 number, and 1 special character." : "Please enter a valid password."}
            validators={isSignup ? [VALIDATOR_PASSWORD()] : [VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
            showCriteria={isSignup}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isSignup ? 'SIGN UP' : 'LOG IN'}
          </Button>
        </form>
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={switchModeHandler} style={{ cursor: 'pointer', color: '#4f46e5', fontWeight: '500' }}>
            {isSignup ? 'Log In' : 'Sign Up'}
          </span>
        </p>
        {!isSignup && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem' }}>
              Forgot Password?
            </Link>
          </div>
        )}
      </Card>
    </>
  )
}

export default Auth
