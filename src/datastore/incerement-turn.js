const { turnId } = require('../data/payloads')

module.exports = function (datastore) {
  const key = datastore.key({
    namespace: 'central-park',
    path: ['Turn', turnId]
  })

  return function (callback) {
    datastore.get(key, (err, turn) => {
      console.log('Increment', err, turn)
      if (err) return callback(err)
      turn.value += 1
      console.log('Increment', err, turn)

      datastore.save({ key, data: turn }, err => {
        if (err) return callback(err)
        return callback(null, turn.value)
      })
    })
  }
}
