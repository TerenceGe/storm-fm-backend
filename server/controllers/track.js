import co from 'co'
import Track from '../models/track'

function get(req, res, next) {
  co(function* () {
    const track = yield Track.get(req.params.id)
    return res.json(track)
  }).catch(e => next(e))
}

function create(req, res, next) {
  co(function* () {
    const { title, artist, description, artwork, source } = req.body
    const track = new Track({ title, artist, description, artwork, source, user_id: req.user.id })
    const savedTrack = yield track.save()
    return res.json(savedTrack)
  }).catch(e => next(e))
}

function list(req, res, next) {
  co(function* () {
    const { filter = 'popular', page = 0 } = req.query
    const tracks = yield Track.list({ filter, page })
    return res.json(tracks)
  }).catch(e => next(e))
}

export default { get, create, list }
