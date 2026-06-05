import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import dns from 'dns'


import { HttpError } from '../models/http-error.js'
import { User } from '../models/user.js'

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

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
  tls: {
    servername: 'smtp.gmail.com'
  },
  lookup: (hostname, options, callback) => {
    return dns.lookup(hostname, { family: 4 }, callback)
  }
});

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  console.log(`[forgotPassword] Request received for email: ${email}`);

  // Check email config early
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error('[forgotPassword] MISSING EMAIL CONFIG - EMAIL_USER or EMAIL_APP_PASSWORD not set in .env');
    return next(new HttpError('Server email configuration is incomplete.', 500));
  }

  let user;
  try {
    user = await User.findOne({ email });
    console.log(`[forgotPassword] User lookup: ${user ? 'found' : 'not found'} (${email})`);
  } catch (err) {
    console.error(`[forgotPassword] DB error finding user ${email}:`, err.message, err.stack);
    return next(new HttpError('Something went wrong, please try again.', 500));
  }

  if (!user) {
    console.warn(`[forgotPassword] No user found with email: ${email}`);
    return next(new HttpError('Could not find a user with that email.', 404));
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetToken = resetToken;
  user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
  console.log(`[forgotPassword] Reset token generated for ${email}, expires in 1 hour`);

  try {
    await user.save();
    console.log(`[forgotPassword] Reset token saved to DB for ${email}`);
  } catch (err) {
    console.error(`[forgotPassword] Failed to save reset token for ${email}:`, err.message, err.stack);
    return next(new HttpError('Something went wrong, saving token failed.', 500));
  }

  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"ShegaPlaces Team" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Password Reset Request',
    html: `
      <h2>Password Reset Request</h2>
      <p>Hello ${user.name}, you recently requested to reset your password for your ShegaPlaces account.</p>
      <p>Click the link below to securely set a new password. This link will safely expire in 1 hour.</p>
      <a href="${resetLink}" style="display:inline-block; padding:10px 20px; color:white; background-color:#4f46e5; border-radius:5px; text-decoration:none;">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
    `
  };

  console.log(`[forgotPassword] Attempting to send email to ${user.email} via ${process.env.EMAIL_USER}`);

  try {
    const verified = await transporter.verify();
    console.log(`[forgotPassword] SMTP transporter verified: ${JSON.stringify(verified)}`);

    const info = await transporter.sendMail(mailOptions);
    console.log(`[forgotPassword] Email sent successfully to ${user.email}: messageId=${info.messageId}, response=${info.response}`);
  } catch (err) {
    console.error(`[forgotPassword] EMAIL SEND FAILED for ${user.email}:`);
    console.error(`  message: ${err.message}`);
    console.error(`  code: ${err.code}`);
    console.error(`  command: ${err.command}`);
    console.error(`  response: ${err.response}`);
    console.error(`  responseCode: ${err.responseCode}`);
    console.error(`  stack: ${err.stack}`);

    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    console.log(`[forgotPassword] Reset token cleared for ${email} due to email failure`);
    return next(new HttpError('There was an error sending the email. Try again later.', 500));
  }

  console.log(`[forgotPassword] Flow completed successfully for ${email}`);
  res.status(200).json({ message: 'A password reset link has been successfully dispatched to your email!' });
}

export const resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn(`[resetPassword] Validation failed:`, errors.array());
    return next(new HttpError('Invalid password passed, check your data.', 422));
  }

  const { token } = req.params;
  const { newPassword } = req.body;
  console.log(`[resetPassword] Request received with token: ${token ? token.substring(0, 8) + '...' : 'MISSING'}`);

  let user;
  try {
    user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() }
    });
    console.log(`[resetPassword] Token lookup: ${user ? 'valid token found' : 'no matching token'}`);
  } catch (err) {
    console.error(`[resetPassword] DB error looking up token:`, err.message, err.stack);
    return next(new HttpError('Something went wrong, please try again.', 500));
  }

  if (!user) {
    console.warn(`[resetPassword] Invalid or expired token used: ${token ? token.substring(0, 8) + '...' : 'MISSING'}`);
    return next(new HttpError('Token is invalid or has expired.', 403));
  }

  console.log(`[resetPassword] Valid token found for user: ${user.email}, resetting password...`);

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log(`[resetPassword] New password hashed successfully`);
  } catch (err) {
    console.error(`[resetPassword] Bcrypt hashing failed:`, err.message, err.stack);
    return next(new HttpError('Could not hash password.', 500));
  }

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;

  try {
    await user.save();
    console.log(`[resetPassword] Password reset successfully for ${user.email}`);
  } catch (err) {
    console.error(`[resetPassword] Failed to save new password for ${user.email}:`, err.message, err.stack);
    return next(new HttpError('Could not save new password.', 500));
  }

  res.status(200).json({ message: 'Password has been safely reset!' });
}

export const googleAuthCallback = async (req, res, next) => {
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=google-auth-failed`)
  }

  let token
  try {
    token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    )
  } catch (err) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=token-generation-failed`)
  }

  // Redirect to frontend with token so React can retrieve it and login
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth-success?token=${token}&userId=${req.user.id}&email=${req.user.email}`)
}