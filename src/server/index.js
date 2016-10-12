import express from 'express'
import mongoose from 'mongoose'
import config from '../config'

mongoose.connect(config.db)
mongoose.connect.on('error', () => {
  throw new Error(`Unable to connect to databse: ${config.db}`)
})

const app = express()
