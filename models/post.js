const { Schema, model } = require('mongoose')
/**
 * @typedef Post
 * @property {string} _id
 * @property {string} title.required - title
 * @property {string} description.required - description
 * @property {Profile} profile.required - profile
 * @property {Array.<Comment>} comments - comments
 */
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 2
  },
  description: {
    type: String,
    required: true,
    minLength: 2
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  image: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updateAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = model('Post', postSchema)
