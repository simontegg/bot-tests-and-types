module.exports = function (recipientId, text) {
  return {
    recipient: { id: recipientId },
    message: { text }
  }
}
