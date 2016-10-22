import express from 'express'
import co from 'co'
import validate from 'express-validation'
import paramValidation from '../../config/param-validation'
import userCtrl from '../controllers/user'

const router = express.Router() // eslint-disable-line new-cap

router.route('/')
  .get(userCtrl.list)
  .post(validate(paramValidation.createUser), userCtrl.create)
  .put(validate(paramValidation.updateUser), userCtrl.update)
  .delete(userCtrl.remove)

router.route('/:id').get(userCtrl.get)

export default router
