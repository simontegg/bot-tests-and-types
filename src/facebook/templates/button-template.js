const debug = require('debug')('facebook:templates:button')

module.exports = function (recipientId, text, buttons) {
  debug({ recipientId, text, buttons })
  return {
    recipient: { id: recipientId },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text,
          buttons
        }
      }
    }
  }
}
