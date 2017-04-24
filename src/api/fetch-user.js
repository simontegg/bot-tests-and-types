// const { getSenderId, getActiveUsers } = require('../getters')
// const request = require('superagent')

module.exports = function ({ getUserProfile }) {
  return function (req, res, context, next) {
    //    const senderId = getSenderId(context)

    if (context.sender) {
    }

    next()
  }
}
