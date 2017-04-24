const pull = require('pull-stream')
const makeKey = require('./make-location-key')
const yaml = require('yaml-js')
const { assign } = require('lodash')
const path = require('path')
const fs = require('fs')

module.exports = function (datastore) {
  return function (locations, callback) {
    // TODO: make async
    const responses = yaml.load(
      fs.readFileSync(path.join(__dirname, 'responses.yaml'))
    )

    console.log('locations', locations)
    console.log('responses', responses)

    return pull(
      pull.values(locations),
      pull.asyncMap((location, cb) => {
        const withContent = assign(location, {
          description: responses.locations[location.id],
          info: responses.locationInfo[location.id]
        })
        const key = makeKey(datastore, location.id)
        console.log(withContent)

        datastore.save({ key, data: withContent }, cb)
      }),
      pull.onEnd(callback)
    )
  }
}
