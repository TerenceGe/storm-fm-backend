import express from 'express'
import validate from 'express-validate'
import user from '../controllers/user'

const router = express.Router()

router.route(':userId')
  .get(user.get)
  .put(user.update)
  .delete(user.remove)

router.params('userId', user.load)

export default router
