// main
const debug = require('debug')('facebook:notify')
const pull = require('pull-stream')
const request = require('superagent')

// modules
const Text = require('../facebook/templates/text')

module.exports = function notify ({ access_token, fbMessages }) {
  return function (notifications, callback) {
    debug({notifications})

    pull(
      pull.values(notifications),
      pull.map(({ id, notification }) => Text(id, notification)),
      pull.asyncMap((body, cb) => {
        request
          .post(fbMessages)
          .set('Accept', 'application/json')
          .send(body)
          .query({ access_token })
          .end(err => {
            debug({ err })
            if (err) return cb(err)
            cb(null)
          })
      }),
      pull.onEnd(callback)
    )
  }
}
