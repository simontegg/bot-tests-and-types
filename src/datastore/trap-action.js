const debug = require('debug')('datastore:trap-action')
const { assign } = require('lodash')
const { concat, indexOf } = require('lodash/fp')
const map = require('lodash/fp/map').convert({ cap: false })
const filter = require('lodash/fp/filter').convert({ cap: false })
const { BAIT, PICKUP, DROP, CATCH } = require('../data/payloads')

module.exports = function (datastore) {
  return function (locationId, action, callback) {
    const key = datastore.key({
      namespace: 'central-park',
      path: ['Location', locationId]
    })

    debug({ key })

    datastore.get(key, (err, location) => {
      if (err) return callback(err)
      if (!location) return callback(null, null)

      debug('traps prior', location)
      const traps = act(location.traps, action)
      const ratNest = action === DROP ? false : location.ratNest
      const toUpdate = assign(location, { traps, ratNest })
      console.log('trapAction', { traps, toUpdate, key })

      datastore.save({ key, data: toUpdate }, err => {
        debug('saved')
        if (err) return callback(err)
        callback(null, toUpdate) // callback with updated location
      })
    })
  }
}

function act (traps, action) {
  if (action === BAIT) {
    const index = indexOf(0)(traps)
    const bait = map((trap, i) => {
      if (i === index) return 1
      return trap
    })

    return bait(traps)
  }

  if (action === PICKUP) {
    const index = indexOf(0)(traps) > -1
      ? indexOf(0)(traps) // pick up unbaited if available
      : indexOf(1)(traps)

    const pickup = filter((trap, i) => i !== index)
    return pickup(traps)
  }

  if (action === DROP) {
    return concat([1])(traps)
  }

  if (action === CATCH) {
    const index = indexOf(1)(traps) > -1
    const drop = map((trap, i) => {
      if (i !== index) return 0
      return trap
    })
    return drop(traps)
  }
}
