const { reduce } = require('lodash')

module.exports = function getAttachments (attachments = []) {
  return reduce(
    attachments,
    (memo, attachment) => {
      console.log(memo)
      memo[attachment.type] = attachment
      return memo
    },
    {}
  )
}
