import express from 'express'
import validate from 'express-validation'
import expressJwt from 'express-jwt'
import paramValidation from '../../config/param-validation'
import authCtrl from '../controllers/auth'
import config from '../../config/env'

const router = express.Router() // eslint-disable-line new-cap

router.route('/login').post(validate(paramValidation.login), authCtrl.login)

router.route('/random-number')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber)

export default router
