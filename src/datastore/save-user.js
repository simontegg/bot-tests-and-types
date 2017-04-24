module.exports = function (datastore) {
  return function (userId, user, callback) {
    const key = datastore.key({
      namespace: 'central-park',
      path: ['User', userId]
    })

    datastore.save({ key, data: user }, callback)
  }
}
