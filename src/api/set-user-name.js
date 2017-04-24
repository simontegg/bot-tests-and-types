const { getSenderId, getUserName, setActiveUser } = require('../getters')

module.exports = function ({ getUserProfile }) {
  return function (req, res, context, next) {
    const senderId = getSenderId(context)
    const username = getUserName(context, senderId)

    if (!username) {
      return getUserProfile(senderId, (err, profile) => {
        if (err) return next(err)
        const { first_name } = profile

        setActiveUser(context, senderId, first_name)
        next()
      })
    }
    
    next()
  }
}
