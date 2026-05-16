import { Router } from 'express'
import { check } from 'express-validator'

import { getPlaceById, getPlacesByUserId, createPlace, updatePlace, deletePlace } from '../controllers/places.js'
import { checkAuth } from '../middleware/auth.js'
import fileUpload from '../middleware/file-upload.js'

const router = Router()

// Public routes
router.get('/:pid', getPlaceById)
router.get('/user/:uid', getPlacesByUserId)

// Protected routes (require auth)
router.use(checkAuth)

router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').notEmpty().withMessage('Please provide a valid title.'),
    check('description').isLength({ min: 5 }).withMessage('Please provide a valid description with at least 5 characters.'),
    check('address').notEmpty().withMessage('Please provide a valid address.')
  ],
  createPlace
)

router.patch(
  '/:pid',
  [
    check('title').optional().notEmpty().withMessage('Please provide a valid title.'),
    check('description').optional().isLength({ min: 5 }).withMessage('Please provide a valid description with at least 5 characters.')
  ],
  updatePlace
)

router.delete('/:pid', deletePlace)

export default router