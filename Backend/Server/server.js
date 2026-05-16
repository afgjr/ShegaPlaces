import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import userRouter from './routes/users-routes.js'
import placeRouter from './routes/places-routes.js'
import { HttpError } from './models/http-error.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = process.env.PORT || 3000
const app = express()

// Security & utility middleware
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(morgan('dev'))
app.use(express.json())

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api/', limiter)

// Serve uploaded images statically
app.use('/uploads/images', express.static(path.join(__dirname, 'uploads', 'images')))

// Routes
app.use('/api/places', placeRouter)
app.use('/api/users', userRouter)

// 404 handler
app.use((req, res, next) => {
  next(new HttpError("Could not find this route.", 404))
})

// Global error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  // If file was uploaded during a failed request, clean it up
  if (req.file && !req.file.path.startsWith('http')) {
    fs.unlink(req.file.path, (unlinkErr) => {
      if (unlinkErr) console.error('Failed to delete file:', unlinkErr)
    })
  }
  res.status(err.code || 500).json({
    message: err.message || 'An unknown error occurred!'
  })
})

// Connect to DB and start server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT} and connected to database!`)
    })
  })
  .catch(err => {
    console.error('Database connection failed:', err)
  })
