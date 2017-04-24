// const debug = require('debug')('datastore:get-all')

module.exports = function (datastore) {
  return function (kind, callback) {
    const query = datastore.createQuery('central-park', kind)

    datastore.runQuery(query, callback)
  }
}
