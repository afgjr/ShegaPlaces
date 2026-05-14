import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router'

import Input from '../../share/components/FormElements/Input'
import Button from '../../share/components/FormElements/Button'
import Card from '../../share/components/UiComponents/Card'
import ErrorModal from '../../share/components/UiComponents/ErrorModal'
import LoadingSpinner from '../../share/components/UiComponents/LoadingSpinner'
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../share/util/validators'
import { useForm } from '../../share/hooks/form-hooks'
import { useHttpClient } from '../../share/hooks/http-hook'
import { AuthContext } from '../../share/Context/auth-context'

import './PlaceForm.css'

const UpdatePlace = () => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const { pid } = useParams()
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [loadedPlace, setLoadedPlace] = useState()

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: { value: '', isValid: false },
      description: { value: '', isValid: false }
    },
    false
  )

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_API_URL}/places/${pid}`
        )
        setLoadedPlace(responseData.place)
        setFormData(
          {
            title: { value: responseData.place.title, isValid: true },
            description: { value: responseData.place.description, isValid: true }
          },
          true
        )
      } catch (err) {
        // handled by hook
      }
    }
    fetchPlace()
  }, [sendRequest, pid, setFormData])

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      await sendRequest(
        `${import.meta.env.VITE_API_URL}/places/${pid}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      )
      navigate('/' + auth.userId + '/places')
    } catch (err) {
      // handled by hook
    }
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    )
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE PLACE
          </Button>
        </form>
      )}
    </>
  )
}

export default UpdatePlace