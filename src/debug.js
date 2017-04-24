if (typeof process !== 'undefined') {
  module.exports = require('debug')
} else {
  module.exports = function (string) {
    console.log('debug set', string)
    return function () {
      console.log('string', string, arguments)
      console.log(`${string}: `, arguments)
    }
  }
}
