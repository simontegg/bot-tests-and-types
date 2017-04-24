// @flow
const request = require('superagent')

// : (Object) : Function
module.exports = function ({ visionAnnotateUrl, apiKey }) {

  /**
   * POST an image text detection request 
   * to the google vision annotate image API
   */
  // : (Object, Function) : void
  return function detectText (body, callback) {
    request
      .post(visionAnnotateUrl)
      .send(body)
      .query({ key: apiKey })
      .end(callback)
  }
}
