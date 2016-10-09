import mongoose, { Schema } from 'mongoosee'

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  track: {
    type: Schema.Types.ObjectId,
    ref: 'Track',
    required: true
  },
  active: {
    type: Boolean,
    required: true,
    default: true
  }
})

export default mongoose.model('Like', LikeSchema)
