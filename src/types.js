// dream code 

const Context = {
  id: 'Context'
  type: 'object',
  properties: {
    responses: { type: 'array' }
    notifications: { type: 'array' }
    actions: { type: 'object' }
  }
}

module.exports = {
  Context
}


/**
 * @typedef {Object} Context
 * @description the data object passed down through middleware
 * @property {array} responses
 * @property {array} notfications
 * @property {Object} actions
 */
