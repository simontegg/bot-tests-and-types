const debug = require('debug')('test:unit:facebook:message')
const test = require('ava')
const makeMessage = require('../../../src/facebook/make-message')
const { messageWithTextAndButton } = require('../../data/facebook-webhook')

test.skip('make message makes a facebook messenger message', t => {
  const recipientId = messageWithTextAndButton.recipient.id
  const expected = messageWithTextAndButton
  const actual = makeMessage({
    recipientId,
    text: 'Your journey begins at Central Park. Hit Start when you arrive to begin your journey',
    buttons: [
      {
        type: 'postback',
        title: 'Start',
        payload: 'START_JOURNEY'
      }
    ]
  })

  debug(actual)

  t.deepEqual(actual.message, expected.message)
  t.end()
})
