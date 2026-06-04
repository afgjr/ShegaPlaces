import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import PlaceList from '../components/PlaceList'
import ErrorModal from '../../share/components/UiComponents/ErrorModal'
import LoadingSpinner from '../../share/components/UiComponents/LoadingSpinner'
import { useHttpClient } from '../../share/hooks/http-hook'

const UserPlaces = () => {
  const { uid } = useParams()
  const { isLoading, error, sendRequest, clearError } = useHttpClient()
  const [loadedPlaces, setLoadedPlaces] = useState()

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_API_URL}/places/user/${uid}`
        )
        setLoadedPlaces(responseData.places)
      } catch (err) {
        // handled by hook
      }
    }
    fetchPlaces()
  }, [sendRequest, uid])

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    )
  }

  return (
    <>
   
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
      {!isLoading && !loadedPlaces && <PlaceList items={[]} />}
    </>
  )
}

export default UserPlaces