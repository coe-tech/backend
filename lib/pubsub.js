const Rascal = require('rascal')
const defaultConfig = require('../config.json')
defaultConfig.vhosts['/'].connection.url = process.env.AMQP_URL || defaultConfig.vhosts['/'].connection.url
const config = Rascal.withDefaultConfig(defaultConfig)
const publisher = Object.keys(defaultConfig.vhosts['/'].publications)[0]
const consumer = Object.keys(defaultConfig.vhosts['/'].subscriptions)[0]
module.exports = {
  pub: (req, res, next) => Rascal.Broker.create(Rascal.withDefaultConfig(config), function (err, broker) {
    if (err) next(err)
    req.publish = (type, keys, value) => new Promise((resolve, reject) => {
      const msg = {
        type,
        payload: value,
        keys
      }
      broker.publish(publisher, msg, function (err, publication) {
        if (err) reject(err)
        publication.on('error', reject)
        // console.log('publish ok')
        resolve(value)
      })
    })
    next()
  }),
  // sub: () => new Promise((resolve, reject) => {
  //   Rascal.Broker.create(Rascal.withDefaultConfig(config), function (err, broker) {
  //     if (err) reject(err)
  //     broker.subscribe(consumer, function (err, subscription) {
  //       if (err) reject(err)
  //       console.log(subscription)
  //       subscription.on('error', reject)
  //       subscription.on('cancel', reject)
  //       resolve(subscription)
  //     })
  //     broker.on('error', reject)
  //   })
  // })
  sub: () => Promise.resolve(Rascal.withDefaultConfig(config))
    .then((conf) => new Promise((resolve, reject) => Rascal.Broker.create(conf, (err, broker) => {
      if (err) {
        if (err.code === 'ECONNREFUSED') {
          console.error(err)
          process.exit(1)
        } else {
          reject(err)
        }
      }
      resolve(broker)
    })))
    .then(broker => new Promise((resolve, reject) => broker.subscribe(consumer, (err, subscription) => {
      if (err) reject(err)
      resolve(subscription)
    })))
    .then(subscription => {
      subscription.on('error', (err) => { throw err })
      subscription.on('cancel', (err) => { throw err })
      return subscription
    })

}

// (req, res, next) => Rascal.Broker.create(Rascal.withDefaultConfig(config), function (err, broker) {
//   if (next) { // api
//     if (err) next(err)
//     req.publish = (key, value) => new Promise((resolve, reject) => {
//       broker.publish('demo_pub', JSON.stringify(value), function (err, publication) {
//         if (err) reject(err)
//         publication.on('error', reject)
//         resolve(value)
//       })
//     })
//     next()
//   } else {
//     if (err) res(err)
//     if (!req.nsp.server.subscription) {
//       req.nsp.server.subscription = new Promise((resolve, reject) => {
//         broker.subscribe('demo_sub', function (err, subscription) {
//           if (err) throw reject(err)
//           resolve(subscription)
//           subscription.on('error', reject)
//           subscription.on('cancel', reject)
//         })
//         broker.on('error', res)
//       })
//     }
//     res()
//     console.log(req.nsp.server.subscribe)
//   }

//   setTimeout(function () {
//     broker.subscribe('demo_sub', function (err, subscription) {
//       if (err) throw err
//       subscription.on('message', function (message, content, ackOrNack) {
//         console.log(message)
//         console.log(content)
//         ackOrNack()
//       })
//       subscription.on('error', console.error)
//       subscription.on('cancel', console.warn)
//     })
//     broker.on('error', console.error)
//   }, 1000 * 10)

//   let i = 0
//   setInterval(function () {
//     i++
//     broker.publish('demo_pub', `${i} ${new Date().toISOString()} : hello world`, function (err, publication) {
//       if (err) throw err
//       publication.on('error', console.error)
//       console.log(`pub ${i}`)
//     })
//   }, 100)
// })
