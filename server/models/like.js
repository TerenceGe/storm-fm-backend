import mongoose, { Schema } from 'mongoose'
import co from 'co'
import httpStatus from 'http-status'
import APIError from '../helpers/APIError'

const LikeSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  track_id: {
    type: Schema.Types.ObjectId,
    ref: 'Track',
    required: true
  },
  trashed: {
    type: Boolean,
    default: false
  }
})

LikeSchema.statics = {
  get(user_id, track_id) {
    return this.findOne({ user_id, track_id }).exec()
  },
  add(user_id, track_id) {
    return co(function* () {
      const liked = yield this.findOne({ user_id, track_id }).exec()
      if(liked) {
        if(!liked.trashed) {
          const err = new APIError('Already liked!', httpStatus.CONFLICT, true)
          return Promise.reject(err)
        }
        const like = yield this.findOneAndUpdate(
          { user_id, track_id },
          { $set: { trashed: false } },
          { new: true }
        ).exec()
        return like
      }
      return null
    }.bind(this))
  },
  trash(user_id, track_id) {
    return co(function* () {
      const liked = yield this.findOne({ user_id, track_id }).exec()
      if(!liked || liked.trashed ) {
        const err = new APIError('Already unliked!', httpStatus.CONFLICT, true)
        return Promise.reject(err)
      }
      const like = yield this.findOneAndUpdate(
        { user_id, track_id },
        { $set: { trashed: true } },
        { new: true }
      ).exec()
      return like
    }.bind(this))
  }
}

export default mongoose.model('Like', LikeSchema)
