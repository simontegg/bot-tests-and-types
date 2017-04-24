const test = require('ava')
const { navigationResponse } = require('../../../src/data/responses')
const { destination } = require('../../../data')

test.cb('returns a human readable navigation instruction', t => {
  const navigation = {
    distance: 1120,
    compassDirection: {
      bearing: 288.3059352524323,
      rough: 'W',
      exact: 'WNW'
    }
  }

  const expectedResponse = 'You are 1.1km west of Polehill reserve'

  const actual = navigationResponse(
    navigation.distance,
    navigation.compassDirection.rough,
    destination.properties.name
  )

  t.is(actual, expectedResponse, expectedResponse)
  t.end()
})
