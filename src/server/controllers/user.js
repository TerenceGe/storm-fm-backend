import co from 'co'
import User from '../models/user'

function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user // eslint-disable-line no-param-reassign
      return next()
    })
    .catch(e => next(e))
}

function get(req, res) {
  console.log(req.user)
  return res.json(req.user)
}

function create(req, res, next) {
  co(function* () {
    yield User.checkUserExists(req.body.username, req.body.email)
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
  const user = req.user
  user.password = req.body.password
  user.updated_at = Date.now()
  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e))
}

function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e))
}

function remove(req, res, next) {
  const user = req.user
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e))
}

export default { load, get, create, update, list, remove }
