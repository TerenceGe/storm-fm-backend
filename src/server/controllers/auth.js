import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'
import User from '../models/user'

const config = require('../../config/env').default

function login(req, res, next) {
  User.authorize(req.body.identity, req.body.password)
    .then((user) => {
      const token = jwt.sign({
        id: user.id
      }, config.jwtSecret, { expiresIn: config.jwtExpireTime })
      return res.json({
        token,
        id: user.id
      })
    })
    .catch(e => next(e))
}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  })
}

export default { login, getRandomNumber }
