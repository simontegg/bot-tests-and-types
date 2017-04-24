const Datastore = require('@google-cloud/datastore')
const Wrap = require('./wrap')

module.exports = function (config) {
  // production datastore
  if (config.ENV === 'production') {
    return Wrap(Datastore())
  }

  // emulated datastore
  if (process.env.DATASTORE_EMULATOR_HOST) {
    return Wrap(
      Datastore({
        projectId: config.projectId,
        apiEndPoint: process.env.DATASTORE_EMULATOR_HOST
      })
    )
  }

  // fast in memeory test datastore
  return Wrap(require('./in-memory')())
}
