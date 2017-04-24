const testyMctestface = require('./test-user')
const journeyBot = require('./journeybot-page')
// const imageWithTextUrl = 'http://i1.kym-cdn.com/photos/images/facebook/000/147/500/1310497610002.jpg'

const { GET_STARTED } = require('../../src/data/payloads')

exports.messageWithText = {
  sender: testyMctestface,
  recipient: journeyBot,
  timestamp: 1458692752478,
  message: {
    mid: 'mid.1458696618141:b4ef9d19ec21086067',
    text: 'Hi, from testy'
  }
}

exports.centralPark = [-41.298306, 174.76849]

exports.messageWithTextAndButton = {
  sender: journeyBot,
  recipient: testyMctestface,
  timestamp: 1458692752478,
  message: {
    text: 'Your journey begins at Central Park. Hit Start when you arrive to begin your journey',
    buttons: [
      {
        type: 'postback',
        title: 'Start',
        payload: 'START_JOURNEY'
      }
    ]
  }
}

exports.messageWithImage = {
  sender: testyMctestface,
  recipient: journeyBot,
  timestamp: 1458692752478,
  message: {
    mid: 'mid.1458696618141:b4ef9d19ec21086067',
    attachments: []
  }
}

exports.messageWithLocation = {
  sender: testyMctestface,
  recipient: journeyBot,
  timestamp: 1458692752478,
  message: {
    mid: 'mid.1458696618141:b4ef9d19ec21086067',
    attachments: [
      {
        type: 'location',
        payload: {
          coordinates: { lat: -41.296946, long: 174.773947 }
        }
      }
    ]
  }
}

exports.postbackStart = {
  sender: testyMctestface,
  recipient: {
    id: journeyBot
  },
  timestamp: 1458692752478,
  postback: {
    payload: GET_STARTED
  }
}
