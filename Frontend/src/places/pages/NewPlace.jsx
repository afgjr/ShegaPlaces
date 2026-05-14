import React, { useContext } from 'react'
import { useNavigate } from 'react-router'

import Input from '../../share/components/FormElements/Input'
import Button from '../../share/components/FormElements/Button'
import ImageUpload from '../../share/components/FormElements/ImageUpload'
import ErrorModal from '../../share/components/UiComponents/ErrorModal'
import LoadingSpinner from '../../share/components/UiComponents/LoadingSpinner'
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../share/util/validators'
import { useForm } from '../../share/hooks/form-hooks'
import { useHttpClient } from '../../share/hooks/http-hook'
import { AuthContext } from '../../share/Context/auth-context'

import './PlaceForm.css'

const NewPlace = () => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const [formState, inputHandler] = useForm(
    {
      title: { value: '', isValid: false },
      description: { value: '', isValid: false },
      address: { value: '', isValid: false },
      image: { value: null, isValid: false }
    },
    false
  )

  const placeSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const formData = new FormData()
      formData.append('title', formState.inputs.title.value)
      formData.append('description', formState.inputs.description.value)
      formData.append('address', formState.inputs.address.value)
      formData.append('image', formState.inputs.image.value)

      await sendRequest(
        `${import.meta.env.VITE_API_URL}/places`,
        'POST',
        formData,
        { Authorization: 'Bearer ' + auth.token }
      )
      navigate('/' + auth.userId + '/places')
    } catch (err) {
      // error handled by hook
    }
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          errorText="Please enter a valid title."
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Description"
          errorText="Please enter a valid description (at least 5 characters)."
          validators={[VALIDATOR_MINLENGTH(5)]}
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          errorText="Please enter a valid address."
          validators={[VALIDATOR_REQUIRE()]}
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  )
}

export default NewPlace