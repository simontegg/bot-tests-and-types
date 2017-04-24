const { GET_STARTED, BEGIN_JOURNEY, STOP } = require('./payloads')
const {
  startMessage,
  beginJourney,
  endJourney,
  instructions
} = require('./responses')
const { Text, Image } = require('../facebook/templates')

module.exports = {
  [GET_STARTED]: getStarted,
  [BEGIN_JOURNEY]: begin,
  [STOP]: stop
}

function getStarted (recipientId) {
  return [
    {
      recipient: { id: recipientId },
      message: {
        text: startMessage,
        quick_replies: [
          {
            content_type: 'text',
            title: 'Begin Journey',
            payload: BEGIN_JOURNEY
          }
        ]
      }
    }
  ]
}

function begin (recipientId) {
  return [
    Text(recipientId, beginJourney),
    Text(recipientId, instructions),
    Image(recipientId, 'http://i.imgur.com/9EhNxbZ.jpg')
  ]
}

function stop (recipientId) {
  return [Text(recipientId, endJourney)]
}
