// const debug = require('debug')('images:index')

module.exports = function (config) {
  return {
    formatText: require('./format-text'),
    annotateRequest: require('./vision-images-annotate'),
    detectText: require('./detect-text')(config)
  }
}

