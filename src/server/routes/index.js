import express from 'express'
import expressJwt from 'express-jwt'
import authRoutes from './auth'
import userRoutes from './user'
import trackRoutes from './track'
// import likeRoutes from './like`'
// import commentRoutes from './comment'
import config from '../../config/env'

const router = express.Router() // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'))

router.use('/auth', authRoutes)

router.use('/users', expressJwt({
  secret: config.jwtSecret,
  credentialsRequired: false
}), userRoutes)

router.use('/tracks', trackRoutes)

// router.use('/likes', likeRoutes)

// router.use('/comments', commentRoutes)

export default router
