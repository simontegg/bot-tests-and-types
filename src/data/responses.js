const { format } = require('d3-format')

const { BAIT, DROP, PICKUP } = require('../data/payloads')

const formatKm = metres => `${format('.1f')(metres / 1000)}km`
const formatMetres = metres => `${metres} metres`
const compassDirection = {
  N: 'north',
  E: 'east',
  S: 'south',
  W: 'west'
}

const buttonTitles = {
  [BAIT]: 'Bait',
  [DROP]: 'Drop',
  [PICKUP]: 'Pick up'
}

// NOTE: duplicates response.yaml
const startMessage = `When you arrive at the park entranceway tap "Begin Journey" to begin the game`
const beginJourney = `
Welcome young Rat Trapper!
Unfortunately the park is infested with rats!
And a kākā has made a nest somewhere in the park
Your mission is to find and bait the traps before the rats find the kākā nest.`
const endJourney = `You have ended the journey.`
const notRecognized = `I could not recognise this place. Please take another photo`
const instructions = `
When you find a sign use Messenger to take a picture of it \n
and send it to me \n
And I'll give you more options`

module.exports = {
  startMessage,
  beginJourney,
  endJourney,
  notRecognized,
  instructions,
  baited,
  buttonTitles,
  trapsHere,
  dropped,
  found,
  hasFound,
  begun,
  pickedUp,
  stopped,
  navigationResponse,
  youSentMe
}

function pickedUp (description, trapCount) {
  const traps = trapCount === 1 ? 'trap' : 'traps'
  return `You have picked up a trap from ${description} and now have ${trapCount} ${traps}`
}

function dropped (description, trapCount) {
  const traps = trapCount === 1 ? 'trap' : 'traps'
  return `You have set a trap at ${description} and have ${trapCount} ${traps} left`
}

function baited (description) {
  return `The trap at ${description} is now ready to catch a rat`
}

function youSentMe (text) {
  return `You sent a picture of ${text}. But I don't know any places in the park that match this`
}

function trapsHere (count) {
  const message = count === 1
    ? 'There is 1 trap here'
    : `There are ${count} traps here.`
  return message
}

function begun (name) {
  return `${name} has joined you in trapping rats`
}

function found (description) {
  return `you have found ${description}`
}

function hasFound (name, description) {
  return `${name} has found ${description}`
}

function stopped (name) {
  return `${name} has ended the game`
}

// : (number, string, string) : string
function navigationResponse (distance, direction, destination) {
  const formatter = distance < 950 ? formatMetres : formatKm
  return `You are ${formatter(distance)} ${compassDirection[direction]} of ${destination}`
}

// function baitMsg (bool) {
//  return bool ? 'Bait a trap?' : ''
// }
// function pickupMsg (bool) {
//  return bool ? 'Pickup a trap?' : ''
// }
// function dropMsg (bool) {
//  return bool ? 'Drop and bait your trap?' : ''
// }
//
// TODO: an async reponse function that loads yaml?
// function getResponse (path, callback) {
//   fs.readFile(path.join(__dirname, 'responses.yaml'), 'utf8', (err, data) => {
//     if (err) return callback(err)
//     callback(null, get(yaml.load(data), path))
//   })
// }
