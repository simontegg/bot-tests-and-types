module.exports = function (senderId, payload, text) {
  return {
    sender: { id: senderId },
    timestamp: 123,
    message: {
      quick_reply: { payload },
      mid: 'astring',
      seq: 123,
      text
    }
  }
}
