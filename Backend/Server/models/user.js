import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false, minlength: 6 },
  googleId: { type: String, required: false },
  image: { type: String, required: true },
  places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }],
  resetToken: { type: String },
  resetTokenExpiration: { type: Date }
}, { timestamps: true })

userSchema.plugin(uniqueValidator)

export const User = mongoose.model('User', userSchema)