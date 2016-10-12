import mongoose, { Schema } from 'mongoosee'
import bcrypt from 'bcrypt'

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+/, 'The value of path {PATH} ({VALUE}) is not a valid email address.']
  },
  password: {
    type: String,
    requird: true
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String
  },
  createAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
})

UserSchema.pre('save', (next) => {
  if (this.isModified('password')) {
    this.password = this.encryptPassword(this.password)
  }
  next()
})

UserSchema.methods = {
  authenticate: (plainTextPassword) => {
    return bcrypt.compareSync(plainTextPassword, this.password)
  },
  encryptPassword: (plainTextPassword) => {
    if (plainTextPassword) {
      const salt = bcrypt.genSaltSync(10)
      return bcrypt.hashSync(plainTextPassword, salt)
    }
    return ''
  }
}

export default mongoose.model('User', UserSchema)
