// @flow
// main
const debug = require('../debug')('api:check-in')
const pull = require('pull-stream')
const { get } = require('object-path')
const { assign, concat } = require('lodash')
const { find, includes, map } = require('lodash/fp')

// modules
const effects = require('./effects')
const { DROP, BAIT, PICKUP, TURN } = require('../data/payloads')
const { Text, ButtonTemplate, Button } = require('../facebook/templates')
const {
  buttonTitles,
  hasFound,
  found,
  notRecognized,
  trapsHere,
  youSentMe
} = require('../data/responses')

const {
  getActions,
  getSenderId,
  getTextFromAnnotation,
  getUserName
} = require('../getters')

module.exports = checkIn

// : (Object, Object) : Function
function checkIn ({ detectText, annotateRequest, formatText }, db) {
  return function (context, callback) {
    const image = get(context, 'message.image')
    const annotationRequest = annotateRequest(
      'TEXT_DETECTION',
      image.toString('base64')
    )

    return pull(
      pull.once(annotationRequest),
      pull.asyncMap(detectText),
      pull.map(getTextFromAnnotation),
      pull.filter(text => {
        debug('filter', { text })
        if (!text || text === '') {
          context = assign(context, {
            responses: context.responses.concat([
              Text(getSenderId(context), notRecognized)
            ])
          })

          return false // proceed no further
        }

        return text
      }),
      pull.map(formatText),
      pull.asyncMap((text, cb) => {
        debug('getAll locations', { text })
        db.getAll('Location', (err, locations) => {
          if (err) return cb(err)

          const matchingLocation = find(({ id }) => id.includes(text))
          context = assign(context, { text })
          return cb(null, matchingLocation(locations))
        })
      }),
      pull.filter(matchedLocation => {
        console.log({ matchedLocation })
        if (!matchedLocation) {
          const { text } = context

          context = assign(context, {
            responses: context.responses.concat([
              Text(getSenderId(context), youSentMe(text))
            ])
          })

          return false // proceed no further
        }

        return matchedLocation
      }),
      pull.asyncMap((matchedLocation, cb) => {
        const { id } = matchedLocation
        const senderId = getSenderId(context)
        console.log('update user', matchedLocation)

        return db.update('User', senderId, { lastLocation: id }, err => {
          if (err) return cb(err)
          return cb(null, matchedLocation)
        })
      }),
      // matchingLocation -> advance turn
      pull.asyncMap((matchedLocation, cb) => {
        db.incrementTurn((err, turn) => {
          if (err) return cb(err)

          db.getAll('User', (err, users) => {
            if (err) return cb(err)

            effects[TURN](db, turn, users, (err, notifications) => {
              if (err) return cb(err)

              if (notifications.length > 0) {
                context = assign(context, {
                  notifications: concat(context.notifications, notifications)
                })
              }

              cb(null, matchedLocation)
            })
          })
        })
      }),
      pull.map(matchedLocation => {
        debug({ matchedLocation })
        const { description, info, traps, ratNest, kakaNest } = matchedLocation
        const senderId = getSenderId(context)

        // location info to user
        context = assign(context, {
          responses: [Text(senderId, found(description)), Text(senderId, info)]
        })

        if (kakaNest) {
          context = assign(context, {
            responses: concat(
              context.responses,
              [Text(senderId, 'You have discovered the Kaka nest. Drop a trap here to protect it!')]
            )
          })
        }

        if (ratNest) {
          context = assign(context, {
            responses: concat(
              context.responses,
              [Text(senderId, 'You have discovered the Rat Nest! Drop a trap here to kill the nest!')]
            )
          })
        }

        // trap present -> pickup?
        if (traps.length > 0) {
          assign(context, {
            actions: assign(context.actions, { pickup: PICKUP }),
            trapCount: traps.length
          })
        }

        // trap needs baiting -> bait
        if (includes(0)(traps)) {
          assign(context, {
            actions: assign(context.actions, { bait: BAIT })
          })
        }

        return description
      }),
      pull.asyncMap((description, cb) => {
        db.get('User', getSenderId(context), (err, { trapCount }) => {
          if (err) return cb(err)

          // user has traps -> drop
          if (trapCount > 0) {
            assign(context, {
              actions: assign(context.actions, { drop: DROP })
            })
          }

          cb(null, description)
        })
      }),
      pull.asyncMap((description, cb) => {
        db.getOtherActive(getSenderId(context), (err, userIds) => {
          if (err) return cb(err)
          if (userIds.length > 0) {
            const userName = getUserName(context)
            const toNotify = map(id => ({
              id,
              notification: hasFound(userName, description)
            }))

            context = assign(context, {
              notifications: concat(context.notifications, toNotify(userIds))
            })
          }

          cb(null, description)
        })
      }),
      pull.filter(_ => {
        if (getActions(context).length === 0) {
          const { responses, trapCount } = context
          const senderId = getSenderId(context)

          context = assign(context, {
            responses: concat(responses, [
              Text(senderId, trapsHere(trapCount))
            ])
          })

          return false // no actions to take!
        }

        return true
      }),
      pull.map(_ => {
        const { actions, trapCount, responses } = context
        const senderId = getSenderId(context)
        const buttons = map(payload => Button(buttonTitles[payload], payload))(
          actions
        )

        context = assign(context, {
          responses: concat(responses, [
            ButtonTemplate(
              senderId,
              trapsHere(trapCount),
              buttons
            )
          ])
        })

        return _
      }),
      pull.onEnd(callback)
    )
  }
}
