const request = require('superagent')
const { fbThreadSettings, access_token } = require('../config')

const deleteStarted = {
  setting_type: 'call_to_actions',
  thread_state: 'new_thread'
}

console.log(deleteStarted)

request.del(fbThreadSettings)
  .send(deleteStarted)
  .query({ access_token })
  .end((err, res) => {
    console.log(err, res.body, res.text)
  })

