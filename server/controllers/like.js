import co from 'co'
import Like from '../models/like'
import Track from '../models/track'
import User from '../models/user'

function create(req, res, next) {
  co(function* () {
    const { track_id } = req.body
    const user_id = req.user.id
    let like = yield Like.add(user_id, track_id)
    if(!like) {
      const newLike = new Like({ user_id, track_id })
      like = yield newLike.save()
    }
    const track = yield Track.like(track_id, 1)
    const user = yield User.like(req.user.id, 1)
    return res.json({ user, track })
  }).catch(e => next(e))
}

function remove(req, res, next) {
  co(function* () {
    const { track_id } = req.body
    const user_id = req.user.id
    const like = yield Like.trash(user_id, track_id)
    const track = yield Track.like(track_id, -1)
    const user = yield User.like(req.user.id, -1)
    return res.json({ user, like, track })
  }).catch(e => next(e))
}

export default { create, remove }
