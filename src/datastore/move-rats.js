// @flow

// const debug = require('debug')('datastore:move-rats')
const move = require('../game/move-rats')
const pull = require('pull-stream')

module.exports = moveRats

//: (Object) : Function
function moveRats (datastore) {
  return function (callback) {
    const kind = 'Location'
    const query = datastore.createQuery('central-park', kind)
    console.log({query})

    return pull(
      pull.once(query),
      pull.asyncMap((query, cb) => {
        datastore.runQuery(query, (err, locations) => { // superstition
          if (err) return cb(err)
          cb(null, locations)
        })
      }),
      pull.map(move),
      pull.map(t => {
        console.log({t})
        return t
      }),
      pull.flatten(),
      pull.asyncMap((location, cb) => {
        const key = datastore.key({
          namespace: 'central-park',
          path: [kind, location.id]
        })

        datastore.save({ key, data: location }, cb)
      }),
      pull.onEnd(callback)
    )
  }
}
