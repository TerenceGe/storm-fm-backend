import express from 'express'
import expressJwt from 'express-jwt'
import config from '../../config/env'
import userRoutes from './user'
// import trackRoutes from './track'
// import likeRoutes from './like`'
// import commentRoutes from './comment'
import authRoutes from './auth'

const router = express.Router() // eslint-disable-line new-cap

router.get('/health-check', (req, res) => res.send('OK'))

router.use('/users', userRoutes)

// router.use('/likes', likeRoutes)

// router.use('/comments', commentRoutes)

router.use('/auth', authRoutes)

export default router
