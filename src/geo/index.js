const geolib = require('geolib')

/**
 * @typedef {Coordinate[]} Coordinates
 * @description an array of length 2
 * @property {number} 0 - latitude
 * @property {number} 1 - longitude
 */

/**
 * @typedef {number} Coordinate
 * @description
 */

module.exports = {
  getGeo,
  getNavigation,
  toGeoLib
}

function getGeo (coordinates) {
  return {
    coordinates: [coordinates.lat, coordinates.long]
  }
}

/**
 * @param {Coordinates} origin
 * @param {Coordinates} destination
 * @returns {Object}
 */
function getNavigation (origin, destination) {
  const orig = toGeoLib(origin)
  const dest = toGeoLib(destination)

  return {
    distance: geolib.getDistance(orig, dest, 10),
    compassDirection: geolib.getCompassDirection(orig, dest)
  }
}

function toGeoLib (coords) {
  return {
    latitude: coords[0],
    longitude: coords[1]
  }
}
