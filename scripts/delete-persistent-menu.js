const request = require('superagent')
const config = require('../config')

const menu = {
  fields: [ 'persistent_menu' ]
}

request.delete(config.fbProfile)
  .send(menu)
  .query({ access_token: config.access_token })
  .end((err, res) => {
    console.log(err, res.body, res.text)
  })

