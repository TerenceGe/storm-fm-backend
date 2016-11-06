import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import co from 'co'
import APIError from '../helpers/APIError'
import User from '../models/user'
import config from '../../config/env'

function login(req, res, next) {
  co(function* () {
    const user = yield User.authorize(req.body.identity, req.body.password)
    const token = jwt.sign({
      id: user.id
    }, config.jwtSecret, {
      expiresIn: config.jwtExpireTime
    })
    const { id, username, email, like_count, submit_count } = user
    return res.json({ token, id, username, email, like_count, submit_count })
  }).catch(e => next(e))
}

export default { login }
