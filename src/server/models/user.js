import Promise from 'bluebird'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import APIError from '../helpers/APIError'

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next()
  this.password = this.encryptPassword(this.password)
  next()
  return null
})

UserSchema.method({
  authenticate(plainTextPword) {
    return bcrypt.compareSync(plainTextPword, this.password)
  },
  encryptPassword(plainTextPword) {
    if (!plainTextPword) {
      return ''
    } else {
      var salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(plainTextPword, salt);
    }
  }
})

UserSchema.statics = {
  checkUserNotExists(username, email) {
    const checkUserNameExists = this.findOne({ username }).exec().then(user => !!user)
    const checkEmailExists = this.findOne({ email }).exec().then(user => !!user)
    return Promise.all([checkUserNameExists, checkEmailExists]).then(values => {
      if(values[0]) {
        const err = new APIError('Username has been taken!', httpStatus.UNAUTHORIZED, true)
        return Promise.reject(err)
      }
      else if(values[1]) {
        const err = new APIError('Email has been taken!', httpStatus.UNAUTHORIZED, true)
        return Promise.reject(err)
      }
      return true
    })
  },
  authorize(identity, password) {
    return this.findOne({ $or: [{ username: identity }, { email: identity }] })
      .exec().then((user) => {
        if(!user) {
          const err = new APIError('Incorrect username or email!', httpStatus.UNAUTHORIZED, true)
          return Promise.reject(err)
        }
        else if(!user.authenticate(password)) {
          const err = new APIError('Incorrect password!', httpStatus.UNAUTHORIZED, true)
          return Promise.reject(err)
        }
        else {
          return user
        }
      })
  },
  get(id) {
    return this.findById(id)
      .exec().then((user) => {
        if (user) {
          return user
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND)
        return Promise.reject(err)
      })
  },
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
  }
}

export default mongoose.model('User', UserSchema)