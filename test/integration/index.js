// main
// const debug = require('debug')('integration:index')
const test = require('ava')
const { find, filter, map, includes } = require('lodash/fp')
const Db = require('../../src/datastore')
const testLocations = require('../../src/data/locations')
const turnId = 'central-park-turn'

test.cb.beforeEach(t => {
  t.context.db = Db({})
  t.context.db.seedLocations(testLocations, err => {
    if (err) return t.end(err)
    t.context.db.update('Turn', turnId, { value: 0 }, t.end)
  })
})

test.cb('seed locations', t => {
  const testIds = map(({ id }) => id)(testLocations)

  t.context.db.getAll('Location', (err, locations) => {
    if (err) return t.end(err)

    const actualIds = map(({ id }) => id)(testLocations)
    t.deepEqual(actualIds, testIds)

    t.context.db.get('Turn', turnId, (err, turn) => {
      if (err) return t.end(err)

      t.is(turn, 0)
      t.end()
    })

    t.end(err)
  })
})

test.cb('set game', t => {
  const schema = {
    trapCount: 7,
    ratNestNot: ['totara', 'rata'],
    kakaNestNot: ['totara', 'rata'],
    trapsNot: ['gully', 'manuka', 'bridge'] // not used
  }

  t.context.db.setInitialState(schema, err => {
    if (err) t.end(err)

    t.context.db.getAll('Location', (err, locations) => {
      const hasTraps = filter(location => location.traps[0] === 0)(locations)
      const ratNest = find(location => location.ratNest)(locations)
      const kakaNest = find(location => location.kakaNest)(locations)

      t.is(hasTraps.length, schema.trapCount)
      t.false(includes(ratNest.id)(schema.ratNestNot))
      t.false(includes(kakaNest.id)(schema.kakaNestNot))
      t.deepEqual(ratNest.traps, [])
      t.deepEqual(kakaNest.traps, [])
      t.end(err)
    })
  })
})
