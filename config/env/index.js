import path from 'path'

const env = process.env.NODE_ENV || 'development'
const config = require(`./${env}`) // eslint-disable-line import/no-dynamic-require

config.root = path.join(__dirname, '/..')

export default config
