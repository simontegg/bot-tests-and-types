const request = require('superagent')
const config = require('../config')

const greeting = {
  greeting: [
    { locale: 'default', text: 'Send us a message to get started' }
  ]
}

request.post(config.fbProfile)
  .send(greeting)
  .query({ access_token: config.access_token })
  .end((err, res) => {
    console.log(err, res)
  })

