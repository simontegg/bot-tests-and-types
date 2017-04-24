// TODO send geolocation attachment
// http://stackoverflow.com/questions/38017382/how-to-send-location-from-facebook-messenger-platform
module.exports = function ({
  recipientId,
  text,
  // coords,
  // imageUrl,
  buttons
}) {
  return {
    recipient: { id: recipientId },
    message: {
      text,
      buttons
    }
  }
}
