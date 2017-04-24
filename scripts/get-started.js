const request = require('superagent')
const { fbThreadSettings, access_token } = require('../config')
const { GET_STARTED } = require('../src/data/payloads')

const getStarted = {
  setting_type: 'call_to_actions',
  thread_state: 'new_thread',
  call_to_actions: [{
    payload: GET_STARTED
  }]
}

console.log(getStarted)

request.post(fbThreadSettings)
  .send(getStarted)
  .query({ access_token })
  .end((err, res) => {
    console.log(err, res.body, res.text)
  })

