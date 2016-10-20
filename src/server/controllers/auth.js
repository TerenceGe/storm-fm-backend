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
    return res.json({ token, id: user.id})
  }).catch(e => next(e))
}

function getRandomNumber(req, res) {
  return res.json({
    user: req.user,
    num: Math.random() * 100
  })
}

export default { login, getRandomNumber }
