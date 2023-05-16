const bcrypt = require('bcrypt')
const {
  Connection,
  Post,
  Comment,
  Profile,
  User
} = require('./models')

function createUser (name) {
  return bcrypt.hash('123456', 10)
    .then(password =>
      new User({ user: name, password }).save()
        .then(barba => new Profile({ name, user: barba._id }).save()
          .then(profile => User.findByIdAndUpdate(barba._id, { profile: profile._id })
            .then(() => profile)
          )
        )
    )
}

function createPost (profile) {
  return new Post({ title: 'post1', description: 'post 1', profile: profile._id }).save()
    .then(post => new Comment({ description: 'comment 1', post: post._id, profile: profile._id }).save()
      .then(comment => Post.findByIdAndUpdate(post._id, { $push: { comments: comment._id } }))
    )
}

function follow (profile1, profile2) {
  return Profile.findByIdAndUpdate(profile1._id, { $push: { following: profile2._id } })
    .then(() => Profile.findByIdAndUpdate(profile2._id, { $push: { followers: profile1._id } }))
}

module.exports = Connection
  .then(() => Promise.all([
    'barba',
    'Gabriel Mancini de Campos',
    'Danilo Rocha',
    'Teste teste3',
    'Teste teste4',
    'Teste teste5555555',
    'Teste test4555e3',
    'Testes tes',
    'Testes te',
    'Testeaeae 1'
  ].map(name => createUser(name)))
    .then(([profile1, profile2]) => follow(profile1, profile2).then(() => ([profile1, profile2])))
    .then(([profile1, profile2]) => Promise.all([createPost(profile1), createPost(profile2)]))
  )
  .then(() => console.log('mongo is seeded'))
