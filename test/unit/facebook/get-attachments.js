const test = require('ava')
const { messageWithLocation } = require('../../data/facebook-webhook')
const getAttachments = require('../../../src/facebook/get-attachments')

test.cb('attaches types to message', t => {
  const attachments = messageWithLocation.message.attachments
  const expectedAttachments = {
    location: messageWithLocation.message.attachments[0]
  }

  const attachmentsMap = getAttachments(attachments)

  t.deepEqual(attachmentsMap, expectedAttachments)
  t.end()
})
