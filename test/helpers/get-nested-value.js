const traverse = require('traverse')

module.exports = function (obj, key) {
  return traverse(obj).reduce(function (acc, x) {
    if (this.key === key) acc = x
    return acc
  }, null)
}
