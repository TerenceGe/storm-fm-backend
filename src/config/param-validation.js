import Joi from 'joi'

export default {
  // POST /api/users
  createUser: {
    body: {
      username: Joi.string().required(),
      email: Joi.string().regex(/\S+@\S+/).required(),
      password: Joi.string().regex(/^[a-zA-Z]\w{3,20}$/).required()
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      password: Joi.string().regex(/^[a-zA-Z]\w{3,20}$/).required()
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().regex(/^[a-zA-Z]\w{3,20}$/).required()
    }
  }
}
