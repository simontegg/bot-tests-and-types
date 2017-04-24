// @flow
// main
const debug = require('debug')('facebook:index')
const request = require('superagent')
const pull = require('pull-stream')
const delay = require('pull-delay')

// modules
const getAttachments = require('./get-attachments')
const buttonTemplate = require('./templates/button')
const notify = require('./notify')

// : (Object) : Object
module.exports = function (config) {
  const { verifyToken } = config

  return {
    buttonTemplate,
    getProfile: getProfile(config),
    getAttachments,
    notify: notify(config),
    sendResponse: sendResponse(config),
    verifyToken
  }
}

function getProfile ({ fbUserProfile, access_token }) {
  return function (userId, callback) {
    debug({ userId })
    request(`${fbUserProfile}/${userId}`)
      .query({ access_token, fields: 'first_name' }) // Hard coded first-name field
      .end((err, res) => {
        console.log('getProfile', err, Object.keys(res))
        if (err) return callback(err)

        callback(null, res.body)
      })
  }
}

function sendResponse ({ access_token, fbMessages }) {
  return function (responses, callback) {
    console.log('sendResponse', responses.length)
    return pull(
      pull.values(responses),
      delay(500),
      pull.asyncMap((response, cb) => {
        console.log({ response })

        request
          .post(fbMessages)
          .set('Accept', 'application/json')
          .send(response)
          .query({ access_token })
          .end((err, res) => {
            console.log({ err }, res.body)
            if (err) return cb(err)
            cb(null)
          })
      }),
      pull.onEnd(callback)
    )
  }
}
