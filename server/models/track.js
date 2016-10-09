import mongoose, { Schema } from 'mongoose'

const TrackSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  artUrl: {
    type: String,
    required: true
  },
  sourceUrl: {
    type: String,
    required: true
  },
  hunter: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    required: true,
    default: 0
  },
  comments: {
    type: Number,
    required: true,
    default: 0
  },
  createAt: {
    type: Date,
    default: Date.now()
  }
})

export default mongoose.model('Track', TrackSchema)
