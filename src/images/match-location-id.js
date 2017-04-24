const { find } = require('lodash/fp')

module.exports = function (text, locations) {
  return find(({ id }) => id.includes(text))(locations)
}
