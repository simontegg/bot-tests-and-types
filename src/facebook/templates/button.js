module.exports = function (title, payload) {
  return { type: 'postback', title, payload }
}
