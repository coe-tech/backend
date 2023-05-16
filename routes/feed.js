const express = require('express')
const router = express.Router()
const { Post, Profile, Connection } = require('../models')

router
  .route('/')
  .all((req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => next())
    .catch(err => next(err))
  )
/**
 * This function get posts
 * @route GET /feed?page={page}
 * @param {integer} page.query - current page.
 * @group Feed - api
 * @returns {Array.<Post>} 200 - An array of posts
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
  .get((req, res, next) => Promise.resolve()
    .then(() => Profile.findById(req.user.profile.id))
    .then((profile) => Post
      .find({ profile: { $in: [...profile.following, req.user.profile._id] } })
      .populate('profile')
      .limit(10)
      .skip((req.query.page || 0) * 10)
      .sort({ createdAt: 'desc' })
    )
    .then((data) => data.map(post => Object.assign(post, { description: post.image ? `${process.env.BUCKET_HOST}${post.description}` : post.description })))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err))
  )
module.exports = router
