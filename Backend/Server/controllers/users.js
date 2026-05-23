import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Resend } from 'resend'

import { HttpError } from '../models/http-error.js'
import { User } from '../models/user.js'

// Resend uses HTTPS (port 443) instead of SMTP (port 465/587),
// which works on cloud hosts like Render that block outbound SMTP.
const resend = new Resend(process.env.RESEND_API_KEY)

export const getUsers = async (req, res, next) => {
  let users
  try {
    users = await User.find({}, '-password')
  } catch (err) {
    return next(new HttpError('Fetching users failed, please try again later.', 500))
  }

  res.status(200).json({
    users: users.map(user => user.toObject({ getters: true }))
  })
}

export const signUp = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check your data!', 422))
  }

  const { name, email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again later.', 500))
  }

  if (existingUser) {
    return next(new HttpError('User exists already, please login instead.', 422))
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    return next(new HttpError('Could not create user, please try again.', 500))
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file ? req.file.path : 'uploads/images/default.png',
    places: []
  })

  try {
    await createdUser.save()
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again later.', 500))
  }

  let token
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )
  } catch (err) {
    return next(new HttpError('Signing up failed, please try again later.', 500))
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token
  })
}

export const login = async (req, res, next) => {
  const { email, password } = req.body

  let existingUser
  try {
    existingUser = await User.findOne({ email })
  } catch (err) {
    return next(new HttpError('Login failed, please try again later.', 500))
  }

  if (!existingUser) {
    return next(new HttpError('Invalid credentials, could not log you in.', 403))
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password)
  } catch (err) {
    return next(new HttpError('Login failed, please try again later.', 500))
  }

  if (!isValidPassword) {
    return next(new HttpError('Invalid credentials, could not log you in.', 403))
  }

  let token
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )
  } catch (err) {
    return next(new HttpError('Login failed, please try again later.', 500))
  }

  res.status(200).json({
    userId: existingUser.id,
    email: existingUser.email,
    token
  })
}

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body

  let user
  try {
    user = await User.findOne({ email })
  } catch (err) {
    return next(new HttpError('Something went wrong, please try again.', 500))
  }

  if (!user) {
    return next(new HttpError('Could not find a user with that email.', 404))
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  user.resetToken = resetToken
  user.resetTokenExpiration = Date.now() + 3600000 // 1 hour

  try {
    await user.save()
  } catch (err) {
    return next(new HttpError('Something went wrong, saving token failed.', 500))
  }

  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'ShegaPlaces Team <onboarding@resend.dev>',
      to: [user.email],
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.name}, you recently requested to reset your password for your ShegaPlaces account.</p>
        <p>Click the link below to securely set a new password. This link will safely expire in 1 hour.</p>
        <a href="${resetLink}" style="display:inline-block; padding:10px 20px; color:white; background-color:#4f46e5; border-radius:5px; text-decoration:none;">Reset Password</a>
        <p>If you did not request a password reset, please ignore this email.</p>
      `
    })

    if (error) {
      throw new Error(error.message)
    }

    console.log('Password reset email sent to:', user.email, '| Resend ID:', data?.id)
  } catch (err) {
    console.error('Email send failure:', err.message)
    // If we fail to send email, clear the token so user can try again
    user.resetToken = undefined
    user.resetTokenExpiration = undefined
    await user.save()
    return next(new HttpError('There was an error sending the email. Try again later.', 500))
  }

  res.status(200).json({ message: 'A password reset link has been successfully dispatched to your email!' })
}

export const resetPassword = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid password passed, check your data.', 422))
  }

  const { token } = req.params
  const { newPassword } = req.body

  let user
  try {
    user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    })
  } catch (err) {
    return next(new HttpError('Something went wrong, please try again.', 500))
  }

  if (!user) {
    return next(new HttpError('Token is invalid or has expired.', 403))
  }

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12)
  } catch (err) {
    return next(new HttpError('Could not hash password.', 500))
  }

  user.password = hashedPassword
  user.resetToken = undefined
  user.resetTokenExpiration = undefined

  try {
    await user.save()
  } catch (err) {
    return next(new HttpError('Could not save new password.', 500))
  }

  res.status(200).json({ message: 'Password has been safely reset!' })
}
