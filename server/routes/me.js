import express from 'express'
import co from 'co'
import validate from 'express-validation'
import paramValidation from '../../config/param-validation'
import meCtrl from '../controllers/me'

const router = express.Router()

router.route('/')
  .get(meCtrl.get)
  .put(validate(paramValidation.updateUser), meCtrl.update)
  .delete(meCtrl.remove)

export default router
