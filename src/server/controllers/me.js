import co from 'co'
import User from '../models/user'

function get(req, res, next) {
  co(function* (){
    const user = yield User.get(req.user.id)
    return res.json(user)
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

function remove(req, res, next) {
  co(function* () {
    const user = yield User.get(req.user.id)
    const deletedUser = yield user.remove()
    return res.json(deletedUser)
  }).catch(e => next(e))
}

export default { get, update, remove }
