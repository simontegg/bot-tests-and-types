// const debug = require('debug')('datastore:wrap')

module.exports = function (datastore) {
  return {
    deleteAllUsers: require('./delete-all-users')(datastore),
    deleteUser: require('./delete-user')(datastore),
    get: require('./get')(datastore),
    getActive: require('./get-active')(datastore),
    getAll: require('./get-all')(datastore),
    getOrSave: require('./get-or-save')(datastore),
    getOtherActive: require('./get-other-active')(datastore),
    moveRats: require('./move-rats')(datastore),
    incrementTurn: require('./incerement-turn')(datastore),
    saveUser: require('./save-user')(datastore),
    save: require('./save')(datastore),
    seedLocations: require('./seed-locations')(datastore),
    setInitialState: require('./set-initial-state')(datastore),
    trapAction: require('./trap-action')(datastore),
    update: require('./update')(datastore)
  }
}
