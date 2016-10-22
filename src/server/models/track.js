import mongoose, { Schema } from 'mongoose'
import co from 'co'
import moment from 'moment'

const TrackSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: {
      name: {
        type: String,
        required: true
      }
    }
  },
  description: {
    type: String,
    required: true
  },
  artwork: {
    type: {
      url: {
        type: String,
        required: true
      }
    }
  },
  source: {
    type: {
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  like_count: {
    type: Number,
    default: 0
  },
  comment_count: {
    type: Number,
    default: 0
  },
  updated_at: {
    type: Date,
    default: Date.now()
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
})

TrackSchema.statics = {
  get(id) {
    return co(function* () {
      const track = yield this.findById(id).exec()
      if(!track) {
        const err = new APIError('No such track exists!', httpStatus.NOT_FOUND)
        return Promise.reject(err)
      }
      return track
    }.bind(this))
  },
  list({ page = 0, filter = 'popular' } = {}) {
    return this.find({
      created_at: {
        $gte: moment().subtract(page, 'days').startOf('day'),
        $lt: moment().subtract(page, 'days').endOf('day')
      }
    }).exec()
  }
}

export default mongoose.model('Track', TrackSchema)
