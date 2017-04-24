const url = require('url')
const { assign } = Object

// TODO merge and overwrite from main config
module.exports = function (proxy) {
  const { messages, imageAnnotations, userProfile } = proxy.pathnames

  return {
    journeyKey: 'Central Park',

    projectId: 'journeybot-161320',
    ENV: 'test',
    verifyToken: 'test_bot',
    pageAccessToken: 'EAABhoP1ZACZCcBAN8vwQZAFZBC63B0hxQ9SPXVbEMKGJlzIGjb1hoi3Ixq3P97dVkcB8NZCkraP7zC2Hn8S5v2o9Y1BP0TjVc2CDWtZCJj4fIRfoiT463zRLMUZBPaCjcM9aV3SKnlST6hTnJZBOZBcOHAfX1XhP3M3N5REgtTHy7mwZDZD',
    fbMessages: url.format(
     assign({}, proxy, { pathname: messages })
    ),
    fbUserProfile: url.format(
      assign({}, proxy, { pathname: userProfile })
    ),
    apiKey: 'AIzaSyDmCp-GsFlk7AMh8C2bmbRsrftsXlbuH3g',
    visionAnnotateUrl: url.format(
      assign({}, proxy, { pathname: imageAnnotations })
    )
  }
}
