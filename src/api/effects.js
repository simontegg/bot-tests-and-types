// main
const debug = require('debug')('api:effects')
const pull = require('pull-stream')
const { assign, concat } = require('lodash')
const { map, includes, filter, flow, findIndex } = require('lodash/fp')
const delay = require('pull-delay')

// modules
const {
  BAIT,
  BEGIN_JOURNEY,
  CATCH,
  DROP,
  PICKUP,
  STOP,
  TURN,
  turnId
} = require('../data/payloads')

const { Text } = require('../facebook/templates')
const User = require('../data/user')
const gameSchema = require('../data/game-schema')
const reset = require('../data/reset-location')
const {
  baited,
  begun,
  dropped,
  pickedUp,
  stopped
} = require('../data/responses')
const { getSenderId } = require('../getters')

module.exports = {
  // fetch name and set user as active
  [BEGIN_JOURNEY]: ({ context, getProfile, db }, callback) => {
    const { getOrSave, getOtherActive } = db
    const senderId = getSenderId(context)

    return pull(
      pull.once(1),
      pull.asyncMap((_, cb) => db.getActive(cb)),
      pull.asyncMap((users, cb) => {
        if (users.length === 0) { // no other users!
          return db.setInitialState(gameSchema, err => {
            if (err) return cb(err)
            console.log('set state')
            cb(null, senderId)
          })
        }

        cb(null, senderId)
      }),
      pull.asyncMap(getProfile),
      pull.asyncMap((profile, cb) => {
        const { first_name } = profile
        console.log({ first_name })
        return getOrSave(senderId, User(senderId, first_name), cb)
      }),
      pull.map(({ name }) => {
        console.log({ name })
        // context = assign(context, { notification: begun(name) })
        context = assign(context, { notification: begun('Someone') })

        debug({ name })
        return senderId
      }),
      pull.asyncMap(getOtherActive),
      pull.map(userIds => {
        console.log({userIds})
        const { notification } = context

        // notify other users that user has joined the game
        context = assign(context, {
          notifications: map(id => ({ id, notification }))(userIds)
        })

        return context
      }),
      pull.onEnd(callback)
    )
  },

  // TODO: set user traps to last loction
  [STOP]: ({ context, db }, callback) => {
    console.log(STOP)
    const userId = getSenderId(context)
    console.log({ userId })

    return pull(
      pull.once(userId),
      pull.asyncMap((userId, cb) => db.get('User', userId, cb)),
      pull.filter(),
      pull.map(({ name }) => {
        // context = assign(context, { notification: stopped(name) })
        context = assign(context, { notification: stopped('Someone') })
        return userId
      }),
      pull.asyncMap(db.deleteUser),
      delay(10), // weird does not delete error
      pull.asyncMap((_, cb) => db.getOtherActive(userId, cb)), // try gettting others
      pull.filter(userIds => {
        console.log({ userIds })
        const { notification } = context

        if (userIds.length > 0) {
          const notifyStopped = map(id => ({ id, notification }))
          context = assign(context, {
            notifications: notifyStopped(userIds)
          })
        }

        if (userIds.length === 0) return true // no more active users! -> reset
        else return false
      }),
      pull.asyncMap((_, cb) => db.update('Turn', turnId, { value: 0 }, cb)),
      pull.asyncMap((_, cb) => db.getAll('Location', cb)),
      pull.flatten(),
      pull.asyncMap((location, cb) => {
        console.log('reset', reset(location))
        db.update('Location', location.id, reset(location), cb)
      }),
      pull.onEnd(err => {
        if (err) return callback(err)
        callback(null)
      })
    )
  },

  [TURN]: function (db, turn, users, callback) {
    let notifications = []
    const lastLocations = map(({ lastLocation }) => {
      return lastLocation
    })(users)

    return pull(
      pull.once(1),
      pull.asyncMap((_, cb) => db.moveRats(cb)),
      pull.asyncMap((_, cb) => db.getAll('Location', cb)),
      pull.asyncMap((locations, cb) => {
        const index = findIndex(location => location.ratNest)(locations)
        console.log({ index })

        console.log('spawning', turn, index)
        if (turn % 3 === 0 && index !== -1) {
          const { id, rats } = locations[index]
          const update = { rats: rats + 1 }

          return db.update('Location', id, update, (err, updated) => {
            if (err) return cb(err)

            // already have locations in memory
            const spawned = map(location => {
              if (location.id === id) return updated
              else return location
            })

            return cb(null, spawned(locations))
          })
        }

        console.log('to check nest')
        cb(null, locations)
      }),
      pull.flatten(),
      pull.filter(location => location.rats > 0), // locations with rats
      pull.map(location => {
        console.log('checkNest', location.kakaNest)
        if (location.kakaNest) {
          const notifyKakaNest = map(({ id }) => (
            { id, notification: 'A rat has stolen a kaka egg!' }
          ))

          notifications = concat(notifications, notifyKakaNest(users))
        }

        return location
      }),
      pull.map(location => {
        console.log('checkNearby', location.id, lastLocations)
        const nearMap = {}

        if (includes(location.id)(lastLocations)) {
          const notifyNear = flow(
            filter(({ lastLocation, id }) => {
              if (!nearMap[id] && lastLocation === location.id) {
                nearMap[id] = true
                return true
              } else {
                return false
              }
            }),
            map(({ id }) => ({ id, notification: 'A rat is nearby!' }))
          )

          notifications = concat(notifications, notifyNear(users))
        }

        return location
      }),
      pull.filter(location => {
        if (includes(1)(location.traps)) {
          const notifyCaught = map(({ id }) => (
            { id, notification: `A trap at ${location.description} caught a rat!` }
          ))

          notifications = concat(notifications, notifyCaught(users))

          return location.id //
        }

        return false
      }),
      pull.asyncMap(id => {
        db.trapAction(id, CATCH, (err, updatedLocation) => {
          if (err) return callback(err)
          callback(null)
        })
      }),
      pull.onEnd(err => {
        if (err) return callback(err)
        return callback(null, notifications)
      })
    )
  },

  [BAIT]: function ({ context, db }, callback) {
    debug(BAIT)
    const senderId = getSenderId(context)

    return pull(
      pull.once(senderId),
      pull.asyncMap((userId, cb) => db.get('User', userId, cb)),
      pull.asyncMap((user, cb) => db.trapAction(user.lastLocation, BAIT, cb)),
      pull.map(({ description }) => {
        context = assign(context, {
          responses: [Text(getSenderId(context), baited(description))]
        })
      }),
      pull.onEnd(callback)
    )
  },

  [DROP]: function ({ context, db }, callback) {
    debug(DROP)
    const senderId = getSenderId(context)

    return pull(
      pull.once(senderId),
      pull.asyncMap((userId, cb) => db.get('User', userId, cb)),
      pull.asyncMap((user, cb) => {
        const trapCount = user.trapCount - 1
        console.log(DROP, { trapCount })

        db.update('User', user.id, { trapCount }, (err, updated) => {
          if (err) return cb(err)
          cb(null, updated)
        })
      }),
      pull.asyncMap(({ lastLocation, trapCount }, cb) => {
        db.get('Location', lastLocation, (err, { description, ratNest }) => {
          if (err) return cb(err)
          const senderId = getSenderId(context)

          context = assign(context, {
            responses: [
              Text(senderId, dropped(description, trapCount))
            ]
          })

          if (ratNest) {
            context = assign(context, {
              responses: concat(
                context.responses,
                [Text(senderId, `You killed the Rat Nest at ${description}`)]
              )
            })
          }

          cb(null, lastLocation)
        })
      }),
      pull.asyncMap((locationId, cb) => db.trapAction(locationId, DROP, cb)),
      pull.onEnd(callback)
    )
  },

  [PICKUP]: function ({ context, db }, callback) {
    debug(PICKUP)
    const senderId = getSenderId(context)

    return pull(
      pull.once(senderId),
      pull.asyncMap((userId, cb) => db.get('User', userId, cb)),
      pull.asyncMap((user, cb) => {
        const trapCount = user.trapCount + 1
        console.log(PICKUP, { trapCount })

        db.update('User', user.id, { trapCount }, (err, updated) => {
          if (err) return cb(err)
          cb(null, updated)
        })
      }),
      pull.asyncMap(({ lastLocation, trapCount }, cb) => {
        db.get('Location', lastLocation, (err, { description }) => {
          if (err) return cb(err)

          context = assign(context, {
            responses: [
              Text(getSenderId(context), pickedUp(description, trapCount))
            ]
          })

          cb(null, lastLocation)
        })
      }),
      pull.asyncMap((locationId, cb) => db.trapAction(locationId, PICKUP, cb)),
      pull.onEnd(callback)
    )
  }
}
