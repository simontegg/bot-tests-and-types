module.exports = function (senderId, payload) {
  return {
    sender: { id: senderId },
    recipient: { id: 123 },
    timestamp: 1,
    postback: {
      payload
    }
  }
}
