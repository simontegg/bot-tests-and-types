const request = require('superagent')
const config = require('../config')
const { GET_STARTED, STOP } = require('../src/data/payloads')

const menu = {
  'persistent_menu': [
    {
      'locale': 'default',
      'composer_input_disabled': false,
      'call_to_actions': [
        {
          'title': 'Start',
          'type': 'postback',
          'payload': GET_STARTED
        },
        {
          'title': 'Stop',
          'type': 'postback',
          'payload': STOP
        }
      ]
    }
  ]
}

request.post(config.fbProfile)
  .send(menu)
  .query({ access_token: config.access_token })
  .end((err, res) => {
    console.log(err, res.body, res.text)
  })

