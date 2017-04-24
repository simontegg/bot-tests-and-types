const { map } = require('lodash/fp')
const { assign, concat, reduce, shuffle, zipObject } = require('lodash')

module.exports = function (locations, opts) {
  const options = opts || { restless: false }

  const addSubtractMap = zipObject(
    map(location => location.id)(locations),
    map(location => 0)(locations)
  )

  for (let i = 0; i < locations.length; i++) {
    let location = locations[i]

    if (location.rats > 0) {
      for (let j = 0; j < location.rats; j++) {
        let moveTos = options.restless
          ? location.nearby
          : concat(location.nearby, location.id)

        let moveTo = shuffle(moveTos)[0]

        addSubtractMap[moveTo] += 1
        addSubtractMap[location.id] -= 1
      }
    }
  }

  console.log({addSubtractMap})

  return reduce(locations, (memo, location) => {
    const change = addSubtractMap[location.id]

    if (change !== 0) {
      let rats = location.rats
      rats = (rats + change)
      memo.push(assign({}, location, { rats }))
    }

    return memo
  }, [])
}
