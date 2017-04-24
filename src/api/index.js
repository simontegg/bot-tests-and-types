// @flow
// main
const debug = require('../debug')('api:index')
const compose = require('http-compose')
const request = require('superagent')
const { get } = require('object-path')
const { assign } = require('lodash')

// modules
const { destination } = require('../../data') // TODO: consolidate in data/index.js
const { navigationResponse } = require('../data/responses') // TODO: consolidate in data/index.js
const { getNavigation, getGeo } = require('../geo')
const payloadResponse = require('../data/payload-response')
const effects = require('./effects')
const checkIn = require('./check-in')
const { GET_STARTED } = require('../data/payloads')
const { Text } = require('../facebook/templates')
const { getMessage, getPayload, getSenderId } = require('../getters')
const locations = require('../data/locations')

//: (Object) : Function
module.exports = function ({ fb, images, db, config }) {
  const handlers = [
    httpControl(fb),
    seed(db),
    parseMessage,
    isUserActive(db),
    postbackEffect(fb, db),
    parsePostback,
    parseAttachments(fb),
    parseNavigation,
    pullImage,
    hasImageAndActive(images, db),
    // TODO: if activeUser = 0A, wipe journey
    respondToActive,
    defaultResponse,
    notifications(fb),
    respond(fb)
  ]

  return compose(handlers)
}

function httpControl (fb) {
  return function (req, res, context, next) {
    if (req.method === 'GET') return handleGet(fb)(req, res, context, next)
    else next()
  }
}

function seed (db) {
  return function (req, res, context, next) {
    console.log(req.query)
    if (req.method === 'POST' && req.query.seed) {
      return db.seedLocations(locations, err => {
        if (err) return next(err)
        res.send('seeded')
      })
    } else {
      next()
    }
  }
}

function handleGet ({ verifyToken }) {
  return function (req, res, context, next) {
    const token = req.query['hub.verify_token']
    const challenge = req.query['hub.challenge']

    debug({ verifyToken, token, challenge })

    if (token === verifyToken) res.send(challenge)
    else res.send('Error, wrong validation token')
  }
}

function parseMessage (req, res, context, next) {
  context = assign(context, { message: getMessage(req) })
  console.log('parseMessage', getMessage(req), JSON.stringify(req.body))

  next()
}

function isUserActive (db) {
  return function (req, res, context, next) {
    const senderId = getSenderId(context)
    console.log('isUserActive', context.isUserActive)

    if (senderId && !context.isUserActive) {
      console.log({ senderId })
      return db.get('User', senderId, (err, user) => {
        if (err) return next(err)

        // NOTE: two sources of truth for isUserActive
        // db (async) and context (sync)
        if (user) {
          context = assign(context, {
            isUserActive: true,
            username: user.name
          })
        }

        next()
      })
    }

    next()
  }
}

function postbackEffect ({ getProfile }, db) {
  return function (req, res, context, next) {
    const payload = getPayload(context)
    const options = { context, getProfile, db }
    console.log('postbackEffect', { payload })

    if (payload && effects[payload]) {
      return effects[payload](options, err => {
        if (err) return next(err)
        next()
      })
    }

    next()
  }
}

function parsePostback (req, res, context, next) {
  const payload = getPayload(context)
  const senderId = getSenderId(context)

  if (payload && payloadResponse[payload]) {
    const update = payloadResponse[payload](senderId)
    context = assign(context, { responses: update })
  }

  next()
}

function parseAttachments ({ getAttachments }) {
  return function (req, res, context, next) {
    const attachments = get(context, 'message.message.attachments')
    debug('parseAttachments')

    if (attachments && attachments.length > 0) {
      context = assign(context, {
        message: assign(context.message, {
          attachments: getAttachments(attachments) // set map
        })
      })
    }

    next()
  }
}

function parseNavigation (req, res, context, next) {
  const location = get(context, 'message.attachments.location.payload')

  if (location) {
    const { coordinates } = location
    const { distance, compassDirection } = getNavigation(
      getGeo(coordinates).coordinates,
      destination.geometry.coordinates
    )

    context = assign(context, {
      responses: [
        {
          recipient: { id: getSenderId(context) },
          message: {
            text: navigationResponse(
              distance,
              compassDirection.rough,
              destination.properties.name
            )
          }
        }
      ]
    })
  }

  next()
}

function pullImage (req, res, context, next) {
  const imageUrl = get(context, 'message.attachments.image.payload.url')
  console.log({ imageUrl })

  if (imageUrl) {
    return request(imageUrl, (err, res) => {
      if (err) return next(err)
      context.message.image = res.body
      next()
    })
  }

  next()
}

function hasImageAndActive (images, db) {
  return function (req, res, context, next) {
    const image = get(context, 'message.image')
    const { isUserActive } = context

    console.log('detectImageText', { isUserActive })
    if (isUserActive && image) {
      return checkIn(images, db)(context, err => {
        if (err) return next(err)
        console.log('calling next image effect')
        next()
      })
    }

    next()
  }
}

function respondToActive (req, res, context, next) {
  const { responses, isUserActive } = context
  debug('respondToActive')

  if (isUserActive && responses.length === 0) {
    context = assign(context, {
      responses: [Text(getSenderId(context), 'Hello')]
    })
  }

  next()
}

function defaultResponse (req, res, context, next) {
  const { responses, isUserActive } = context
  const senderId = getSenderId(context)

  if (senderId && !isUserActive && responses.length === 0) {
    // TODO generic response not fb specific
    context = assign(context, {
      responses: payloadResponse[GET_STARTED](senderId)
    })
  }

  next()
}

function notifications ({ notify }) {
  return function (req, res, context, next) {
    const { notifications } = context
    debug({ notifications })

    if (notifications && notifications.length > 0) {
      return notify(notifications, next)
    }

    next()
  }
}

function respond ({ sendResponse }) {
  return function (req, res, context, next) {
    debug('RESPOND', context.responses.length)
    debug('respond', context.responses)
    const { responses } = context

    if (responses.length > 0) {
      return sendResponse(context.responses, err => {
        if (err) return next(err)
        context.responses = [] // superstitious
        console.log('sent responses')
        res.status(200).end()
      })
    }

    next()
  }
}
