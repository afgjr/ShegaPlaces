import React, { useContext, useState } from 'react'
import Modal from '../../share/components/UiComponents/Modal'
import Card from '../../share/components/UiComponents/Card'
import Button from '../../share/components/FormElements/Button'
import ErrorModal from '../../share/components/UiComponents/ErrorModal'
import LoadingSpinner from '../../share/components/UiComponents/LoadingSpinner'
import { AuthContext } from '../../share/Context/auth-context'
import { useHttpClient } from '../../share/hooks/http-hook'

import './PlaceItem.css'

const PlaceItem = (props) => {
  const auth = useContext(AuthContext)
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const [showMap, setShowMap] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const openMapHandler = () => setShowMap(true)
  const closeMapHandler = () => setShowMap(false)

  const showDeleteWarningHandler = () => setShowConfirmModal(true)
  const cancelDeleteHandler = () => setShowConfirmModal(false)

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false)
    try {
      await sendRequest(
        `${import.meta.env.VITE_API_URL}/places/${props.id}`,
        'DELETE',
        null,
        { Authorization: 'Bearer ' + auth.token }
      )
      props.onDelete(props.id)
    } catch (err) {
      // handled by hook
    }
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <p style={{ textAlign: 'center', padding: '1rem' }}>
            📍 {props.address}
          </p>
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>CANCEL</Button>
            <Button danger onClick={confirmDeleteHandler}>DELETE</Button>
          </>
        }
      >
        <p>Do you want to proceed and delete this place? This action cannot be undone.</p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img
              src={`${import.meta.env.VITE_ASSET_URL}/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>EDIT</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>
            )}
          </div>
        </Card>
      </li>
    </>
  )
}

export default PlaceItem