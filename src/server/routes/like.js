import express from 'express'
import co from 'co'
import likeCtrl from '../controllers/like'

const router = express.Router()

router.route('/')
  .post(likeCtrl.create)
  .delete(likeCtrl.remove)

export default router
