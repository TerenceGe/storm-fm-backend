import express from 'express'
import Promise from 'bluebird'
import mongoose from 'mongoose'
import util from 'util'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import methodOverride from 'method-override'
import cors from 'cors'
import httpStatus from 'http-status'
import expressWinston from 'express-winston'
import expressValidation from 'express-validation'
import helmet from 'helmet'
import expressJwt from 'express-jwt'
import winstonInstance from './config/winston'
import routes from './server/routes'
import config from './config/env'
import APIError from './server/helpers/APIError'

const app = express()

if (config.env === 'development') {
  app.use(logger('dev'))
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compress())
app.use(methodOverride())
app.use(helmet())
app.use(cors())

if (config.env === 'development') {
  expressWinston.requestWhitelist.push('body')
  expressWinston.responseWhitelist.push('body')
  app.use(expressWinston.logger({
    winstonInstance,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true
  }))
}

app.use('/api', expressJwt({
  secret: config.jwtSecret
}).unless({
  path: [
    { url: '/api/users', methods: ['POST'] },
    { url: /^\/api\/users\/.*/, methods: ['GET'] },
    { url: '/api/auth/login' }
  ]
}), routes)

app.use((err, req, res, next) => {
  if (err instanceof expressValidation.ValidationError) {
    const unifiedErrorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ')
    const error = new APIError(unifiedErrorMessage, err.status, true)
    return next(error)
  } else if (!(err instanceof APIError)) {
    const apiError = new APIError(err.message, err.status, err.isPublic)
    return next(apiError)
  }
  return next(err)
})

app.use((req, res, next) => {
  const err = new APIError('API not found', httpStatus.NOT_FOUND)
  return next(err)
})

if (config.env !== 'test') {
  app.use(expressWinston.errorLogger({
    winstonInstance
  }))
}

app.use((err, req, res, next) => {
  const stack = config.env === 'development' ?  { stack: err.stack } : {}
  res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    ...stack
  })
})

const debug = require('debug')('stormfm:index')

mongoose.Promise = Promise

mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } })
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db}`)
})

if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc)
  })
}

app.listen(config.port, () => {
  debug(`server started on port ${config.port} (${config.env})`)
})

export default app
