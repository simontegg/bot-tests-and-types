const debug = require('debug')('helpers:setup-proxy')
const express = require('express')
const bodyParser = require('body-parser')
const testUsers = require('../data/test-users')
const imagesGoogleApi = require('../data/images-goole-apis')
const { find } = require('lodash')

module.exports = function ({ pathnames }, handlePost) {
  const { userProfile, imageAnnotations, messages } = pathnames
  const proxy = express()

  proxy.use(bodyParser.json())

  proxy.get(`${userProfile}/:id`, function (req, res) {
    const { id } = req.params
    const user = find(testUsers, { id })
    debug({ id, user, testUsers })

    res.json(user)
  })

  proxy.post(imageAnnotations, function (req, res) {
    res.json(imagesGoogleApi('TOTA RA'))
  })

  proxy.post(messages, handlePost)

  return proxy
}
