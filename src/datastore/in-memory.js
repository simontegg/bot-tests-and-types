// const debug = require('debug')('datastore:in-memory')
const Levelup = require('levelup')
const Sublevel = require('level-sublevel')
const isArray = require('is-array')
const { map } = require('lodash/fp')

// in-memory test datastore
module.exports = function () {
  const db = Sublevel(
    Levelup('./test-db', {
      db: require('memdown'),
      valueEncoding: 'json'
    })
  )
  const users = db.sublevel('users')
  const locations = db.sublevel('locations')
  const turn = db.sublevel('turn')
  const dbs = { User: users, Location: locations, Turn: turn }

  return {
    createQuery: (namespace, kind) => ({ namespace, kind }),

    runQuery: function (query, callback) {
      // hardcoded to assume get all query
      const entities = []
      const { kind } = query

      dbs[kind]
        .createValueStream()
        .on('data', value => entities.push(value))
        .on('error', callback)
        .on('end', () => callback(null, entities))
    },

    key: key => key,

    save: function ({ key, data }, callback) {
      const kind = key.kind || key.path[0]
      const k = key.path[1]

      return dbs[kind].put(k, data, err => {
        if (err) return callback(err)
        callback(null, data)
      })
    },

    get: function (key, callback) {
      console.log('key', key)
      const kind = key.kind || key.path[0]
      const k = key.path[1]

      return dbs[kind].get(k, (err, entity) => {
        if (err && err.notFound) return callback(null, null)
        if (err) return callback(err)

        return callback(null, entity)
      }) // synchronous
    },

    delete: function (key, callback) {
      if (isArray(key)) return this.deleteBatch(key, callback)
      const kind = key.kind || key.path[0]
      const k = key.path[1]

      dbs[kind].del(k, callback)
    },

    deleteBatch: function (keys, callback) {
      if (keys.length > 0) {
        const kind = keys[0].kind || keys[0].path[0]

        return dbs[kind].batch(
          map(key => ({ type: 'del', key: key.path[1] }))(keys),
          callback
        )
      }

      return callback(null)
    }
  }
}
