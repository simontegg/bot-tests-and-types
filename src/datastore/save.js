module.exports = function (datastore) {
  return function (kind, id, entity, callback) {
    const key = datastore.key({
      namespace: 'central-park',
      path: [kind, id]
    })

    datastore.save({ key, data: entity }, callback)
  }
}
