// const debug = require('debug')('datastore:get-active')
const { map } = require('lodash/fp')

module.exports = getActive

function getActive (datastore) {
  return function (callback) {
    const query = datastore.createQuery('central-park', 'User')

    datastore.runQuery(query, (err, users) => {
      if (err) return callback(err)
      callback(null, map(user => user.id)(users))
    })
  }
}
