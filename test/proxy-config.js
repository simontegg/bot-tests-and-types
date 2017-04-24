// constants
const messages = '/messages'
const imageAnnotations = '/images'
const userProfile = '/user-profile'

module.exports = {
  protocol: 'http',
  hostname: 'localhost',
  port: 3001,
  pathnames: {
    messages,
    imageAnnotations,
    userProfile
  }
}
