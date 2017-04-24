module.exports = function (type, content) {
  return {
    requests: [
      {
        image: {
          content: content
        },
        features: [
          {
            type: type,
            maxResults: 10
          }
        ]
      }
    ]
  }
}
