import User from '../models/user'

function load(req, res, next, id) {
  User.get(id)
    .then(user => {
      req.user = user
      return next()
    })
    .catch(e => next(e))
}

function get(req, res) {
  return res.json(req.user)
}

function create(req, res, next) {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e))
}

function update(req, res, next) {
  const user = req.user
  user.username = req.body.username
  user.email = req.body.email
  user.password = req.body.password

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e))
}

function remove(req,, res, next) {
  const user = req.user
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e))
}

export default { load, get, create, update, remove }
