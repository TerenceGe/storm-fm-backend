import express from 'express'
import co from 'co'
import trackCtrl from '../controllers/track'

const router = express.Router() // eslint-disable-line new-cap

router.route('/')
  .get(trackCtrl.list)
  .post(trackCtrl.create)

router.route('/:id').get(trackCtrl.get)

export default router
