module.exports = function (text) {
  return text
    .replace(
      /(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|"|'|<|,|\.|>|\?|\/|\\|\||-|_|\+|=)/g,
      ''
    )
    .replace(/\s/g, '')
    .toLowerCase()
}
