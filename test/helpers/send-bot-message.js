const request = require('supertest')

module.exports = function (bot, body, callback) {
  request(bot)
    .post('/')
    .set('Accept', 'application/json')
    .send(body)
    .expect(200)
    .end(callback)
}
