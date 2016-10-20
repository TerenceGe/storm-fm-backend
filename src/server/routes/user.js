import express from 'express'
import co from 'co'
import validate from 'express-validation'
import expressJwt from 'express-jwt'
import paramValidation from '../../config/param-validation'
import userCtrl from '../controllers/user'
import config from '../../config/env'

const router = express.Router() // eslint-disable-line new-cap

router.route('/')
  .get(userCtrl.list)
  .post(validate(paramValidation.createUser), userCtrl.create)

router.route('/:userId')
  .get(userCtrl.get)
  .put(validate(paramValidation.updateUser), userCtrl.update)
  .delete(userCtrl.remove)

router.param('userId', userCtrl.load)

export default router
