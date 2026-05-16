import { Router } from 'express'
import { body } from 'express-validator'

import { getUsers, signUp, login, forgotPassword, resetPassword } from '../controllers/users.js'
import fileUpload from '../middleware/file-upload.js'

const router = Router()

router.get('/', getUsers)

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    body('name').trim().notEmpty(),
    body('email').normalizeEmail().isEmail(),
    body('password').isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
  ],
  signUp
)

router.post('/login', login)

router.post(
  '/forgot-password',
  [body('email').normalizeEmail().isEmail()],
  forgotPassword
)

router.post(
  '/reset-password/:token',
  [body('newPassword').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1
  })],
  resetPassword
)

export default router