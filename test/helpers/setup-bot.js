// main
const express = require('express')
const bodyParser = require('body-parser')
const Sender = require('http-sender')()

// modules
const Fb = require('../../src/facebook')
const Images = require('../../src/images')
const Db = require('../../src/datastore')

// api
const api = require('../../src/api')

module.exports = function (config) {
  const bot = express()
  const fb = Fb(config)
  const images = Images(config)
  const db = Db(config)
  const modules = { fb, images, db, config }

  bot.use(bodyParser.json())
  bot.use(function (req, res) {
    api(
      modules
    )(req, res, { data: {}, responses: [], actions: {}, notifications: [] }, Sender(req, res))
  })

  return bot
}
