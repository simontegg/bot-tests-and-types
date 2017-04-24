// main
const debug = require('debug')('steps')
const Yadda = require('yadda')
const English = Yadda.localisation.English
const snapshot = require('../helpers/snapshot')
const { assign, each, find } = require('lodash')
const { concat, filter, flow, map } = require('lodash/fp')
const assert = require('power-assert')

// modules
const sendBotMessage = require('../helpers/send-bot-message')
const setupProxy = require('../helpers/setup-proxy')
const setupBot = require('../helpers/setup-bot')

// data
const User = require('../../src/data/user')
const locations = require('../../src/data/locations')
const testImages = require('../data/test-images')
const testUsers = require('../data/test-users')
const {
  messageWithText,
  messageWithImage
} = require('../data/facebook-webhook')

const {
  GET_STARTED,
  BEGIN_JOURNEY,
  STOP,
  BAIT,
  DROP,
  PICKUP
} = require('../../src/data/payloads')

const payloadMap = {
  'Get Started': GET_STARTED,
  'Begin Journey': BEGIN_JOURNEY,
  Stop: STOP,
  Bait: BAIT,
  Drop: DROP,
  Pickup: PICKUP
}

const postback = require('../data/postback')
const quickReply = require('../data/quick-reply')

module.exports = (function () {
  const dictionary = new Yadda.Dictionary().define(
    'num',
    /(\d+)/,
    Yadda.converters.integer
  )

  return English.library(dictionary)
    .given('the user $name has not started', function (name, next) {
      next()
    })
    .given('no other users are active', function () {})
    .given('$name has $num traps', function (name, num, next) {
      const userId = testUsers[name].id
      const update = { trapCount: num }
      this.ctx.db.update('User', userId, update, next)
    })
    .given('the scenario: $scenario', function (scenario, next) {
      const { testConfig, proxyConfig } = this.ctx

      this.ctx.replies = {}
      this.ctx.scenario = scenario
      this.ctx.bot = setupBot(testConfig)
      debug('set up new bot')

      each(testUsers, user => {
        this.ctx.replies[user.id] = []
      })

      this.ctx.proxy = setupProxy(proxyConfig, (req, res) => {
        const userId = req.body.recipient.id
        debug({ userId })

        debug(
          `user ${find(testUsers, {
            id: userId
          }).first_name} recieved message ${JSON.stringify(req.body.message)}`
        )

        this.ctx.replies[userId].push(req.body.message)
        res.status(200).end()
      })

      this.ctx.server = this.ctx.proxy.listen(this.ctx.port, next)
    })
    .given('the user $name has checked in at location $locationId', function (
      name,
      locationId,
      next
    ) {
      const userId = testUsers[name].id
      const update = { lastLocation: locationId }
      debug({ locationId, update })

      this.ctx.db.update('User', userId, update, next)
    })
    .given('the user $name is active', function (name, next) {
      const userId = testUsers[name].id
      const user = User(userId, name)

      this.ctx.db.saveUser(userId, user, next)
    })
    .given('the location $name has $num rats', function (name, num, next) {
      const location = find(locations, { id: name })
      location.rats = num

      this.ctx.db.update('Location', name, location, next)
    })
    .given('the location $name has $num $status traps', function (
      name,
      num,
      status,
      next
    ) {
      const location = find(locations, { id: name })
      const isBaited = status === 'baited' ? 1 : 0
      const updates = []

      for (let i = 0; i < num; i++) {
        updates.push(isBaited)
      }

      const setTraps = flow(
        filter(trap => trap !== isBaited), // remove existing
        concat(updates)
      )

      const traps = setTraps(location.traps)

      this.ctx.db.update('Location', name, { traps }, next)
    })
    .when('the user $name taps $title', function (name, title, next) {
      const user = testUsers[name]
      const userId = user.id
      const message = postback(userId, payloadMap[title])
      const body = { entry: [{ messaging: [message] }] }

      sendBotMessage(this.ctx.bot, body, err => {
        this.ctx.server.close()
        if (err) return next(err)
        next()
      })
    })
    .when('the user $name taps the quick reply $title', function (
      name,
      title,
      next
    ) {
      const user = testUsers[name]
      const userId = user.id
      const message = quickReply(userId, payloadMap[title], title)
      const body = { entry: [{ messaging: [message] }] }

      sendBotMessage(this.ctx.bot, body, err => {
        this.ctx.server.close()
        if (err) return next(err)
        next()
      })
    })
    .when('the user $name sends the bot a message', function (name, next) {
      const user = testUsers[name]
      const message = assign(messageWithText, { sender: user })
      const body = { entry: [{ messaging: [message] }] }
      debug({ body })

      sendBotMessage(this.ctx.bot, body, err => {
        this.ctx.server.close()
        if (err) return next(err)
        next()
      })
    })
    .when(
      'the user $name sends a recognisable photo of $photo to the bot',
      function (name, photo, next) {
        const user = testUsers[name]
        const image = testImages[photo]
        const message = assign(messageWithImage, { sender: user })
        message.message.attachments.push(image)

        const body = { entry: [{ messaging: [message] }] }
        debug({ body })

        sendBotMessage(this.ctx.bot, body, err => {
          this.ctx.server.close()
          if (err) return next(err)
          next()
        })
      }
    )
    .then('the bot messages $name with $message', function (name, message) {
      const { replies, scenario } = this.ctx
      const user = testUsers[name]
      const actual = replies[user.id][0]
      debug(JSON.stringify(replies))
      debug(actual)

      snapshot(`${scenario}-${name}-${message}`, actual)
    })
    .then('the bot sends message $num $message to $name', function (
      num,
      message,
      name
    ) {
      const { replies, scenario } = this.ctx
      const user = testUsers[name]
      const actual = replies[user.id][num - 1]
      debug({ replies })
      debug(actual)

      snapshot(`${scenario}-${name}-${message}-${num}`, actual)
    })
    .then('the bot subsequently messages $name with $message', function (
      name,
      message
    ) {
      const { replies, scenario } = this.ctx
      const user = testUsers[name]
      const actual = replies[user.id][1]
      debug(actual)

      snapshot(`${scenario}-${name}-subsequent-${message}`, actual)
    })
    .then('the bot has sent $name a total of $num messages', function (
      name,
      num
    ) {
      const { replies } = this.ctx
      const user = testUsers[name]
      const actual = replies[user.id].length
      debug(actual, num)

      assert(actual === num)
    })
    .then('the user $name is set to active', function (name, next) {
      const userId = testUsers[name].id

      this.ctx.db.get('User', userId, (err, user) => {
        if (err) return next(err)

        assert(name === user.name)
        next()
      })
    })
    .then('the user $name is set to inactive', function (name, next) {
      const userId = testUsers[name].id

      this.ctx.db.get('User', userId, (err, user) => {
        if (err) return next(err)

        assert(Boolean(user) === false)
        next()
      })
    })
    .then('$locationId will have $num $status traps', function (
      locationId,
      num,
      status,
      next
    ) {
      this.ctx.db.get('Location', locationId, (err, location) => {
        if (err) return next(err)
        const s = status === 'baited' ? 1 : 0
        debug({ location, s })
        const trapsOfStatus = filter(trap => trap === s)(location.traps)

        assert(trapsOfStatus.length === num)
        next()
      })
    })
    .then('the location $locationId will have $num traps', function (
      locationId,
      num,
      next
    ) {
      this.ctx.db.get('Location', locationId, (err, location) => {
        if (err) return next(err)
        assert(location.traps.length === num)
        next()
      })
    })
    .then('$name will have $num traps', function (name, num, next) {
      const userId = testUsers[name].id

      this.ctx.db.get('User', userId, (err, user) => {
        if (err) return next(err)

        assert(user.trapCount === num)
        next()
      })
    })
    .then('the game is reset and all locations have 0 rats', function (next) {
      const { scenario } = this.ctx

      this.ctx.db.getActive((err, users) => {
        if (err) return next(err)
        snapshot(`${scenario}-reset-users`, users)

        this.ctx.db.getAll('Location', (err, locations) => {
          if (err) return next(err)
          const ratCounts = map(({ rats }) => rats)(locations)

          snapshot(`${scenario}-reset-locations`, ratCounts)
          next()
        })
      })
    })
})()
