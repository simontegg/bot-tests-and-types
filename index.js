// main
const Sender = require('http-sender')()

// modules
const api = require('./src/api')
const config = require('./config.js')
const fb = require('./src/facebook')(config)
const images = require('./src/images')(config)
const db = require('./src/datastore')(config)

const modules = { fb, images, db, config }

exports.api = function (req, res) {
  api(modules)(req, res, { data: {}, responses: [], actions: {}, notifications: [] }, Sender(req, res))
}
