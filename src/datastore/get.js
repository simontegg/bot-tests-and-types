const debug = require('debug')('datastore:get')

module.exports = function (datastore) {
  return function (kind, id, callback) {
    debug({ kind, id })
    const key = datastore.key({
      namespace: 'central-park',
      path: [kind, id]
    })

    datastore.get(key, callback)
  }
}
