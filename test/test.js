/* global before, after, featureFile, scenarios, steps */
// main
// const debug = require('debug')('test:test')
const { assign } = require('lodash')
const Yadda = require('yadda')
const Emulator = require('google-datastore-emulator')
const npmRun = require('npm-run')
const pull = require('pull-stream')

// modules
const Db = require('../src/datastore')
const makeTestConfig = require('../test.config')

// data
const reset = require('../src/data/reset-location')
const locations = require('../src/data/locations')
const { turnId } = require('../src/data/payloads')

// setup
const proxyConfig = require('./proxy-config')
const port = 3001
const testConfig = makeTestConfig(assign({}, proxyConfig, { port }))
const context = {
  replies: [],
  port,
  testConfig,
  proxyConfig,
  proxy: null,
  bot: null
}

let emulator

before(function () {
  return startEmulator(this)
    .then(() => {
      context.db = Db(testConfig)
    })
    .then(done => {
      context.db.seedLocations(locations, done)
    })
    .catch(err => {
      console.log(err)
    })
})

after(() => {
  return process.env.EMULATE ? emulator.stop() : Promise.resolve()
})

Yadda.plugins.mocha.StepLevelPlugin.init()
new Yadda.FeatureFileSearch('./test/features').each(function (file) {
  featureFile(file, function (feature) {
    const library = require('./steps/steps.js')
    const yadda = Yadda.createInstance(library, { ctx: context })

    scenarios(feature.scenarios, scenario => {
      before(function (done) {
        return pull(
          pull.once(1),
          pull.asyncMap((_, cb) => context.db.deleteAllUsers(cb)),
          pull.asyncMap((_, cb) => context.db.getAll('Location', cb)),
          pull.flatten(),
          pull.asyncMap((location, cb) => {
            context.db.update('Location', location.id, reset(location), cb)
          }),
          pull.asyncMap((_, cb) => {
            context.db.save('Turn', turnId, { value: 0 }, cb)
          }),
          pull.onEnd(done)
        )
      })

      steps(scenario.steps, (step, done) => {
        yadda.run(step, done)
      })
    })
  })
})

function startEmulator (self) {
  if (process.env.EMULATE) {
    self.timeout(15000)
    emulator = new Emulator()

    return emulator.start().then(() => {
      console.log('emulator started')
      return new Promise((resolve, reject) => {
        npmRun('gcloud beta emulators datastore env-init', (err, stdout) => {
          if (err) return reject(err)
          else return resolve(stdout)
        })
      })
    })
  }

  // use fake datastore for test speed
  return Promise.resolve()
}
