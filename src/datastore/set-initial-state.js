// main
const { includes, reduce } = require('lodash/fp')
const { shuffle } = require('lodash')
const pull = require('pull-stream')

// modules
const makeKey = require('./make-location-key')

// TODO: consolidate with seed-locations ?
module.exports = function (datastore) {
  return function ({ ratNestNot, kakaNestNot, trapCount }, callback) {
    const query = datastore.createQuery('central-park', 'Location')

    datastore.runQuery(query, (err, locations) => {
      if (err) return callback(err)
      let traps = 0
      let setRatNest = false
      let setKakaNest = false

      const updates = reduce((memo, location) => {
        const { id } = location

        if (!setRatNest && !includes(id)(ratNestNot)) {
          location.ratNest = true
          location.rats = 1 // rat nest starts with 1
          setRatNest = true
        }

        if (!location.ratNest && !setKakaNest && !includes(id)(kakaNestNot)) {
          location.kakaNest = true
          setKakaNest = true
        }

        if (!location.ratNest && !location.kakaNest && traps < trapCount) {
          location.traps = [0] // 0 == trap present but not baited
        }

        memo.push(location)
        return memo
      }, [])(shuffle(locations))

      return pull(
        pull.values(updates),
        pull.asyncMap((location, cb) => {
          const key = makeKey(datastore, location.id)
          datastore.save({ key, data: location }, cb)
        }),
        pull.onEnd(callback)
      )
    })
  }
}
