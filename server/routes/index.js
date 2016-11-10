import express from 'express'
import expressJwt from 'express-jwt'
import authRoutes from './auth'
import meRoutes from './me'
import userRoutes from './user'
import trackRoutes from './track'
import config from '../../config/env'

const router = express.Router() // eslint-disable-line new-cap

router.get('/hello', (req, res) => res.send('goodbye'))
router.use('/auth', authRoutes)
router.use('/me', meRoutes)
router.use('/users', userRoutes)
router.use('/tracks', trackRoutes)

export default router
