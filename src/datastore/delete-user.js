// const debug = require('debug')('datastore:delete-user')

module.exports = deleteUser

// : (Object) : Function
function deleteUser (datastore) {
  return function (userId, callback) {
    console.log('deleting', { userId })
    const key = datastore.key({
      namespace: 'central-park',
      path: ['User', userId]
    })

    datastore.delete(key, err => {
      console.log('deleted', userId)
      if (err) return callback(err) // delete paranoia
      callback(null)
    })
  }
}
