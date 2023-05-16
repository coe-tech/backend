const http = require('http')
const socketio = require('socket.io')
const jwt = require('jsonwebtoken')
const { User: UserModel } = require('./models')

const pubsub = require('./lib/pubsub')
const app = require('./app')

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'assesstokenlalalalal'

const server = http.Server(app)
const io = socketio(server, {
  // Specifying CORS
  cors: {
    origin: '*'
  }
})

const liveData = io.of('/v1')

liveData.use((socket, next) => {
  if (socket.handshake.auth && socket.handshake.auth.token) {
    jwt.verify(socket.handshake.auth.token, ACCESS_TOKEN_SECRET, function (err, user) {
      if (err) return next(new Error('Authentication error'))
      UserModel.findById(user._id).populate('profile')
        .then(u => {
          // console.log('sio middleware')
          if (u) {
            socket.profile = u.profile
            next()
          } else {
            next(new Error('Authentication error'))
          }
        })
    })
  } else {
    next(new Error('Authentication error'))
  }
})

// // Socket event
liveData.on('connection', function (socket) {
  console.warn(`a user connected live ${socket.profile.name}`)

  socket.on('disconnect', () => {
    console.log(socket.connected) // false
  })
  socket.on('error', (err) => {
    console.error(err)
  })
  socket.emit('connect_profile', socket.profile)
})

pubsub.sub().then((sub) => {
  sub.on('message', function (message, content, ackOrNack) {
    ackOrNack()
    Object.entries(Object.fromEntries(liveData.sockets))
      .filter(([, v]) => content.keys.includes(v.profile._id.toString()))
      .map(([k, v]) => v.emit(content.type, content.payload))
  })
}).catch(console.error)

// Post request on home page
// app.post('/v1', (req, res) => {
//   console.warn('post')
//   liveData.emit('new-data', req.body.message) // Emitting event.
// })

server.listen(process.env.PORT || 4000, () => {
  console.warn(`server listen on http://localhost:${process.env.PORT || 4000}/api-docs`)
})
