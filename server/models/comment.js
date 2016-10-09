import mongoose, { Schema } from 'mongoose'

const CommentSchema = new Schema({
  track: {
    type: Schema.Types.ObjectId,
    ref: 'Track',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  replay: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  content: {
    type: String,
    required: true
  }
})

export default mongoose.model('Comment', CommentSchema)
