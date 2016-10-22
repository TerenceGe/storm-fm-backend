import co from 'co'
import User from '../models/user'

function get(req, res, next) {
  co(function* (){
    console.log(req.params.id)
    console.log(req.user)
    const user = yield User.get(req.params.id, req.user && req.user.id === req.params.id)
    return res.json(user)
  }).catch(e => next(e))
}

function create(req, res, next) {
  co(function* () {
    yield User.checkExists(req.body.username, req.body.email)
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
    const savedUser = yield user.save()
    return res.json(savedUser)
  }).catch(e => next(e))
}

function update(req, res, next) {
  co(function* () {
    const user = yield User.get(req.user.id)
    user.password = req.body.password
    user.updated_at = Date.now()
    const savedUser = yield user.save()
    return res.json(savedUser)
  }).catch(e => next(e))
}

function list(req, res, next) {
  co(function* () {
    const { limit = 50, skip = 0 } = req.query
    const users = yield User.list({ limit, skip })
    return res.json(users)
  }).catch(e => next(e))
}

function remove(req, res, next) {
  co(function* () {
    const user = yield User.get(req.user.id)
    const deletedUser = yield user.remove()
    return res.json(deletedUser)
  }).catch(e => next(e))
}

export default { get, create, update, list, remove }
