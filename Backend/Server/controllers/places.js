import { validationResult } from 'express-validator'
import mongoose from 'mongoose'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import { geocodeAddress } from '../util/location.js'

import { HttpError } from '../models/http-error.js'
import { Place } from '../models/places.js'
import { User } from '../models/user.js'

export const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    return next(new HttpError('Something went wrong, could not find a place.', 500))
  }

  if (!place) {
    return next(new HttpError('Could not find place for the provided id!', 404))
  }

  res.json({ place: place.toObject({ getters: true }) })
}

export const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid

  let userWithPlaces
  try {
    userWithPlaces = await User.findById(userId).populate('places')
  } catch (err) {
    return next(new HttpError('Fetching places failed, please try again later.', 500))
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError('Could not find places for the provided user id!', 404))
  }

  res.json({
    places: userWithPlaces.places.map(place => place.toObject({ getters: true }))
  })
}

export const createPlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check your data!', 422))
  }

  const { title, description, address } = req.body

  let coordinates;
  try {
    coordinates = await geocodeAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    image: req.file ? req.file.path : 'uploads/images/default.png',
    address,
    location: coordinates,
    creator: req.userData.userId
  })

  let user
  try {
    user = await User.findById(req.userData.userId)
  } catch (err) {
    return next(new HttpError('Creating place failed, please try again later!', 500))
  }

  if (!user) {
    return next(new HttpError('Could not find user for provided id!', 404))
  }

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await createdPlace.save({ session: sess })
    user.places.push(createdPlace)
    await user.save({ session: sess })
    await sess.commitTransaction()
  } catch (err) {
    console.error(err)
    return next(new HttpError('Creating place failed, please try again later!', 500))
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) })
}

export const updatePlace = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check your data!', 422))
  }

  const { title, description } = req.body
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId)
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update place.', 500))
  }

  if (!place) {
    return next(new HttpError('Could not find place for the provided id!', 404))
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError('You are not allowed to edit this place.', 401))
  }

  place.title = title || place.title
  place.description = description || place.description

  try {
    await place.save()
  } catch (err) {
    return next(new HttpError('Something went wrong, could not update place.', 500))
  }

  res.status(200).json({ place: place.toObject({ getters: true }) })
}

export const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid

  let place
  try {
    place = await Place.findById(placeId).populate('creator')
  } catch (err) {
    return next(new HttpError('Something went wrong, could not delete place.', 500))
  }

  if (!place) {
    return next(new HttpError('Could not find place for the provided id!', 404))
  }

  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError('You are not allowed to delete this place.', 401))
  }

  const imagePath = place.image

  try {
    const sess = await mongoose.startSession()
    sess.startTransaction()
    await place.deleteOne({ session: sess })
    place.creator.places.pull(place._id)
    await place.creator.save({ session: sess })
    await sess.commitTransaction()
  } catch (err) {
    return next(new HttpError('Something went wrong, could not delete place.', 500))
  }

  // Delete associated image file
  if (imagePath && imagePath !== 'uploads/images/default.png') {
    if (imagePath.startsWith('http')) {
      try {
        const splitUrl = imagePath.split('/');
        const publicId = splitUrl[splitUrl.length - 2] + '/' + splitUrl[splitUrl.length - 1].split('.')[0];
        cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Cloudinary deletion failed:', err);
      }
    } else {
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Failed to delete image:', err)
      })
    }
  }

  res.status(200).json({ message: 'Deleted place.' })
}
