const debug = require('debug')('datastore:get-other-active')
const { filter, flow, map } = require('lodash/fp')

module.exports = getOtherActive

// : (Object) : Function
function getOtherActive (datastore) {
  return function (excludeId, callback) {
    const query = datastore.createQuery('central-park', 'User')
    const otherActive = flow(
      map(user => user.id),
      filter(userId => userId !== excludeId)
    )

    datastore.runQuery(query, (err, users) => {
      debug({ users })
      if (err) return callback(err)
      callback(null, otherActive(users))
    })
  }
}
