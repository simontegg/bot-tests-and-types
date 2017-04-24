const { assign } = require('lodash')

module.exports = reset

function reset (location) {
  return assign({}, location, {
    traps: [],
    rats: 0,
    ratNest: false,
    kakaNest: false
  })
}
