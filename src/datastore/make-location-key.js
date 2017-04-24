module.exports = function makeKey (datastore, id) {
  return datastore.key({ namespace: 'central-park', path: ['Location', id] })
}
