const path = require('path')
const fs = require('fs')

const nodeModules = {}

fs.readdirSync('node_modules')
  .filter(file => !file.includes('.bin'))
  .forEach(module => nodeModules[module] = `commonjs ${module}`)

module.exports = {
  context: path.join(__dirname, '../src'),
  entry: './index.js',
  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'app.js',
    libraryTarget: 'commonjs2'
  },
  externals: 'nodeModules',
  target: 'node',
  resolve: {
    extensions: ['', '.js', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
}
