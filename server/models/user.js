import Promise from 'bluebird'
import mongoose from 'mongoose'
import httpStatus from 'http-status'
import bcrypt from 'bcrypt'
import co from 'co'
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
  like_count: {
    type: Number,
    default: 0
  },
  submit_count: {
    type: Number,
    default: 0
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

UserSchema.pre('save', function(next) {
  if(this.isModified('password')) {
    this.password = this.encryptPassword(this.password)
  }
  return next()
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
  checkExists(username, email) {
    return co(function* () {
      if(yield this.findOne({ username }).exec()) {
        const err = new APIError('Username has been taken!', httpStatus.UNAUTHORIZED, true)
        return Promise.reject(err)
      }
      if(yield this.findOne({ email }).exec()) {
        const err = new APIError('Email has been taken!', httpStatus.UNAUTHORIZED, true)
        return Promise.reject(err)
      }
      return null
    }.bind(this))
  },
  authorize(identity, password) {
    return co(function* () {
      const user = yield this.findOne({ $or: [{ username: identity }, { email: identity }] }).exec()
      if(!user) {
        const err = new APIError('Incorrect username or email 😕', httpStatus.UNAUTHORIZED, true)
        return Promise.reject(err)
      }
      else if(!user.authenticate(password)) {
        const err = new APIError('Incorrect password 😕', httpStatus.UNAUTHORIZED, true)
        return Promise.reject(err)
      }
      return user
    }.bind(this))
  },
  get(id) {
    return co(function* () {
      const user = yield this.findById(id, { password: 0 }).exec()
      if(!user) {
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND)
        return Promise.reject(err)
      }
      return user
    }.bind(this))
  },
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
  },
  like(_id, inc) {
    return this.findOneAndUpdate(
      { _id },
      { $inc: { like_count: inc } },
      { new: true, select: { password: 0 } }
    ).exec()
  }
}

export default mongoose.model('User', UserSchema)
