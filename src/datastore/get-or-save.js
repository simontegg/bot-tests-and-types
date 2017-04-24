// const debug = require('debug')('get-or-save')

module.exports = function (datastore) {
  return function (userId, user, callback) {
    if (typeof userId !== 'string') userId = String(userId)
    const key = datastore.key({
      namespace: 'central-park',
      path: ['User', userId]
    })

    datastore.get(key, (err, entity) => {
      console.log('getOrSave', { entity: entity })
      if (err) return callback(err)
      if (!entity) {
        return datastore.save({ key, data: user }, err => {
          console.log('getOrSave saved', err, user)

          if (err) return callback(err)
          return callback(null, user) // calback original
        })
      }

      return callback(null, entity)
    })
  }
}
