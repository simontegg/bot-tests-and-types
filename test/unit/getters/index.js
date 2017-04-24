const test = require('ava')
const { getPayload } = require('../../../src/getters')
const quickReply = require('../../data/quick-reply')
const { messageWithTextAndButton } = require('../../data/facebook-webhook')

test.cb('get payload gets from standard button message', t => {
  const expected = 'START_JOURNEY'
  const context = { message: messageWithTextAndButton }
  console.log(context)

  const actual = getPayload(context)

  t.is(expected, actual)
  t.end()
})

test.cb('get payload gets from a quick reply', t => {
  const payload = 'MY_PAYLOAD'
  const context = { message: quickReply(123, payload, 'Press me') }

  console.log(context)
  const actual = getPayload(context)

  t.is(payload, actual)
  t.end()
})
