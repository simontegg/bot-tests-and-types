module.exports = function (recipientId, imageUrl) {
  return {
    recipient: { id: recipientId },
    message: {
      attachment: {
        type: 'image',
        payload: {
          url: imageUrl
        }
      }
    }
  }
}
