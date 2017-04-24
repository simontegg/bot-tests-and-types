const debug = require('debug')('datastore:update')
const { assign } = require('lodash')

module.exports = function (datastore) {
  return function (kind, id, props, callback) {
    const key = datastore.key({
      namespace: 'central-park',
      path: [kind, id]
    })

    datastore.get(key, (err, entity) => {
      debug('update', { entity: entity })
      if (err) return callback(err)
      if (!entity) return callback(null, null)

      const updated = assign(entity, props)
      datastore.save({ key, data: updated }, err => {
        // .save(callback) has 1 param
        if (err) return callback(err)
        callback(null, updated)
      })
    })
  }
}
