module.exports = function () {
  return {
    locations: {
      totara: {
        nearby: ['rata'],
        traps: [],
        rats: 0,
        ratNest: null,
        kakaNest: null
      },
      rata: { nearby: ['totara'], traps: [] },
      'big tree': {
        nearby: ['rata', 'karaka', 'cabbage tree', 'punga'],
        traps: []
      },
      karaka: { nearby: ['big tree', 'manuka', 'cabbage tree'], traps: [] },
      'cabbage tree': {
        nearby: ['big tree', 'manuka', 'cabbage tree'],
        traps: []
      },
      manuka: { nearby: ['karaka', 'fern'], traps: [] },
      punga: { nearby: ['big tree', 'bridge'], traps: [] },
      bridge: { nearby: ['gully', 'punga'], traps: [] },
      gully: { nearby: ['bridge'], traps: [] }
    },
    rats: [],
    ratNest: null,
    kakaNest: null
  }
}
