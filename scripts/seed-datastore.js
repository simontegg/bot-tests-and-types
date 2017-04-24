const makeTestConfig = require('../test.config')
const Datastore = require('../src/datastore')
const { assign } = Object

// constants
const journey = require('../src/datastore/journey')
const proxyConfig = {
  protocol: 'http',
  hostname: 'localhost',
  port: 3001,
  pathnames: {
    messages: '/messages',
    imageAnnotations: '/images'
  }
}

const port = 3001
const testConfig = makeTestConfig(assign({}, proxyConfig, { port }))

const datastore = Datastore(testConfig)
console.log(datastore)

const key = datastore.key('Journey', 'Central Park')

datastore.save({ key, data: journey }, (err) => {
  console.log(err)
})

