const test = require('ava')
const moveRats = require('../../../src/game/move-rats')
const locations = require('../../../src/data/locations')
const { map } = require('lodash/fp').convert({ cap: false })
const { assign } = require('lodash')

test.cb.only('move rats shifts rats', t => {
  const testLocations = map((location, i) => {
    if (i < 1) return assign({}, location, { rats: 1 })
    return location
  })(locations)
  console.log('testLocations', testLocations)

  const actual = moveRats(testLocations, { restless: true })

  console.log('actual', actual)

  t.not(testLocations[0].rats, actual[0].rats)

  t.end()
})
