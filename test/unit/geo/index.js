const test = require('ava')
const { getGeo, getNavigation } = require('../../../src/geo')

test.cb('converts messenger location into simplified  geojson geometry', t => {
  const locationAttachment = {
    type: 'location',
    payload: {
      coordinates: { lat: -41.293794, long: 174.761266 }
    }
  }

  const geometry = {
    coordinates: [-41.293794, 174.761266]
  }

  const actual = getGeo(locationAttachment)

  t.deepEqual(actual, geometry)
  t.end()
})

test.cb('return disance and bearing from one location to another', t => {
  const origin = [-41.296946, 174.773947] // enspiral dev academy
  const destination = [-41.293794, 174.761266] // polehill reserve
  const expectedNavigation = {
    distance: 1120,
    compassDirection: {
      bearing: 288.3059352524323,
      rough: 'W',
      exact: 'WNW'
    }
  }

  const navigation = getNavigation(origin, destination)
  t.deepEqual(navigation, expectedNavigation)
  t.end()
})
