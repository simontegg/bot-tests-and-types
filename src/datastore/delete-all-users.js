const debug = require('debug')('datastore:delete-all-users')
const { flow, map } = require('lodash/fp')
const GetActive = require('./get-active')

module.exports = function (datastore) {
  const getActive = GetActive(datastore)

  return function (callback) {
    getActive((err, userIds) => {
      debug({ userIds })
      if (err) callback(err)

      const keys = flow(
        map(id => ({ namespace: 'central-park', path: ['User', id] })),
        map(datastore.key)
      )(userIds)

      datastore.delete(keys, callback)
    })
  }
}
