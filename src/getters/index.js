// @flow

/**
 * @typedef {Object} Context
 * @description the data object passed down through middleware
 * @property {array} responses
 * @property {array} notfications
 * @property {Object} actions
 */

const debug = require('debug')('getters:index')
const { get } = require('object-path')
const { assign } = require('lodash')
const { map } = require('lodash/fp')


module.exports = {
  getActions,
  getTextFromAnnotation,
  getMessage,
  getSenderId,
  getUserName,
  getPayload,
  setUsername
}
/**
 * accesses and transforms the actions map into array of action strings
 */
// : (Context) : string[]
function getActions (context) {
  return map(action => action)(context.actions)
}


// : (Context, string) : Object
function setUsername (context, username) {
  return assign(context, { username })
}

// : (Object) : string
function getUserName (context) {
  return get(context, 'username')
}

// : (Object) : string
function getSenderId (context) {
  return get(context, 'message.sender.id')
}

/**
 * extracts the payload from the message attached to the context
 */
// : (Context) : string
function getPayload (context) {
  return (
    payloadStart(context) ||
    payloadButton(context) ||
    payloadQuickReply(context)
  )
}

// : (Object) : string
function payloadStart (context) {
  return get(context, 'message.postback.payload')
}

// : (Object) : string
function payloadButton (context) {
  return get(context, 'message.message.buttons.0.payload')
}

// : (Object) : string
function payloadQuickReply (context) {
  return get(context, 'message.message.quick_reply.payload')
}

// : (Object) : Object
function getMessage (req) {
  return get(req, 'body.entry.0.messaging.0')
}

// : (Object) : string
function getTextFromAnnotation (res) {
  debug(res.body.responses[0].textAnnotations[0])
  const text = get(res, 'body.responses.0.textAnnotations.0.description')

  return typeof text === 'string' ? text.trim() : text
}
