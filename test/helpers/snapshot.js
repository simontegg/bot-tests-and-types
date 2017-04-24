const snapShot = require('snap-shot-core')
const opts = {
  show: Boolean(process.env.SHOW),
  dryRun: Boolean(process.env.DRY),
  update: Boolean(process.env.UPDATE)
}

module.exports = function (specName, what) {
  const file = 'steps.js'
  return snapShot({
    what,
    file,
    specName,
    compare: compare,
    ext: '.snapshot',
    opts
  })
}

function compare ({ expected, value }) {
  const e = JSON.stringify(expected)
  const v = JSON.stringify(value)
  if (e === v) {
    return {
      valid: true
    }
  }
  return {
    valid: false,
    message: `expected : ${e} 
    
    actual: ${v}`
  }
}
