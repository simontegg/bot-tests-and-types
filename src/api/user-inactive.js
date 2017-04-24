const debug = require('debug')('api:user-inactive')
const { getSenderId } = require('../getters')

module.exports = function ({ getUserProfile }) {
  return function (req, res, context, next) {
    if (!context.profile) {
      const userId = getSenderId(context)

      return getUserProfile(userId, (err, profile) => {
        if (err) return next(err)
        context.profile = profile
        debug({ context })

        next()
      })
    }

    return next()
  }
}
