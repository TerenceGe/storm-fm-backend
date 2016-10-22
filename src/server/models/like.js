import mongoose, { Schema } from 'mongoosee'

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

export default mongoose.model('Like', LikeSchema)
