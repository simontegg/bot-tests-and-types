const debug = require('debug')('facebook:templates:list')

module.exports = function (recipientId, elements) {
  debug({ recipientId, elements })
  return {
    recipient: { id: recipientId },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'list',
          elements
        }
      }
    }
  }
}
