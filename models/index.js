/**
 * @typedef Login
 * @property {string} user.required
 * @property {string} password.required
 */
/**
 * @typedef Registry
 * @property {string} name
 * @property {string} user.required
 * @property {string} password.required
 */

const mongoose = require('mongoose')
const connect = mongoose.connect(
    `${(process.env.MONGO_URL || 'mongodb://localhost:27017/mydb')}_${process.env.NODE_ENV || 'development'}`
)
exports.Post = require('./post.js')
exports.Comment = require('./comment.js')
exports.Profile = require('./profile.js')
exports.User = require('./user.js')

mongoose.connection.on('error', (args) => {
  console.error(`Mongo not connected: ${JSON.stringify(args)}`)
  process.exit(1)
})
mongoose.connection.on('connected', (args) => {
  console.warn(`Mongo connected: ${JSON.stringify(args)}`)
})
mongoose.connection.on('disconnected', (args) => {
  console.error(`Mongo disconnected: ${JSON.stringify(args)}`)
})

exports.Connection = connect
