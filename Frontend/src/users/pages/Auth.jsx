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
            validators={isSignup ? [VALIDATOR_PASSWORD()] : [VALIDATOR_MINLENGTH(8)]}
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

        <div className="auth-divider">or</div>

        <a
          href={`${import.meta.env.VITE_API_URL}/users/auth/google`}
          className="google-btn"
        >
          {/* Official Google "G" logo SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.18 2.84l6.08-6.08C34.46 3.1 29.5 1 24 1 14.82 1 7.07 6.48 3.85 14.18l7.08 5.5C12.6 13.16 17.85 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.15 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.46c-.54 2.88-2.16 5.32-4.6 6.96l7.08 5.5C42.88 37.3 46.15 31.4 46.15 24.5z"/>
            <path fill="#FBBC05" d="M10.93 28.32A14.5 14.5 0 0 1 9.5 24c0-1.5.26-2.95.72-4.32l-7.08-5.5A23.94 23.94 0 0 0 0 24c0 3.86.92 7.51 2.55 10.72l8.38-6.4z"/>
            <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.94l-7.08-5.5C28.57 38.1 26.4 39 24 39c-6.15 0-11.4-3.66-13.07-8.68l-8.38 6.4C6.07 43.52 14.5 47 24 47z"/>
          </svg>
          Continue with Google
        </a>
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
