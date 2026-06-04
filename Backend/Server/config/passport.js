import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../models/user.js'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy_client_secret',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/users/auth/google/callback',
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if the user already exists via Google ID
        let existingUser = await User.findOne({ googleId: profile.id })
        
        if (existingUser) {
          return done(null, existingUser)
        }

        // 2. If not, check if a user exists with the same email (they signed up manually before)
        const email = profile.emails[0].value
        existingUser = await User.findOne({ email: email })

        if (existingUser) {
          // Link their googleId to their existing standard account
          existingUser.googleId = profile.id
          await existingUser.save()
          return done(null, existingUser)
        }

        // 3. User does not exist at all, create a new user bypassing the local password
        const newUser = new User({
          name: profile.displayName,
          email: email,
          googleId: profile.id,
          image: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : 'uploads/images/default.png',
          places: [] // Default empty places
        })

        await newUser.save()
        return done(null, newUser)
      } catch (err) {
        return done(err, false)
      }
    }
  )
)

export default passport
