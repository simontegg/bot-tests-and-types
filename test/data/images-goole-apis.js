module.exports = function (description) {
  return {
    responses: [
      {
        textAnnotations: [
          {
            locale: 'en',
            description,
            boundingPoly: {
              vertices: [
                {
                  x: 88,
                  y: 249
                },
                {
                  x: 807,
                  y: 249
                },
                {
                  x: 807,
                  y: 671
                },
                {
                  x: 88,
                  y: 671
                }
              ]
            }
          },
          {
            description: 'CATS',
            boundingPoly: {
              vertices: [
                {
                  x: 88,
                  y: 250
                },
                {
                  x: 807,
                  y: 250
                },
                {
                  x: 807,
                  y: 672
                },
                {
                  x: 88,
                  y: 672
                }
              ]
            }
          }
        ],
        fullTextAnnotation: {
          pages: [
            {
              property: {
                detectedLanguages: [
                  {
                    languageCode: 'en'
                  }
                ]
              },
              width: 900,
              height: 900,
              blocks: [
                {
                  property: {
                    detectedLanguages: [
                      {
                        languageCode: 'en'
                      }
                    ]
                  },
                  boundingBox: {
                    vertices: [
                      {
                        x: 88,
                        y: 249
                      },
                      {
                        x: 807,
                        y: 249
                      },
                      {
                        x: 807,
                        y: 671
                      },
                      {
                        x: 88,
                        y: 671
                      }
                    ]
                  },
                  paragraphs: [
                    {
                      property: {
                        detectedLanguages: [
                          {
                            languageCode: 'en'
                          }
                        ]
                      },
                      boundingBox: {
                        vertices: [
                          {
                            x: 88,
                            y: 249
                          },
                          {
                            x: 807,
                            y: 249
                          },
                          {
                            x: 807,
                            y: 671
                          },
                          {
                            x: 88,
                            y: 671
                          }
                        ]
                      },
                      words: [
                        {
                          property: {
                            detectedLanguages: [
                              {
                                languageCode: 'en'
                              }
                            ]
                          },
                          boundingBox: {
                            vertices: [
                              {
                                x: 88,
                                y: 250
                              },
                              {
                                x: 807,
                                y: 250
                              },
                              {
                                x: 807,
                                y: 672
                              },
                              {
                                x: 88,
                                y: 672
                              }
                            ]
                          },
                          symbols: [
                            {
                              property: {
                                detectedLanguages: [
                                  {
                                    languageCode: 'en'
                                  }
                                ]
                              },
                              boundingBox: {
                                vertices: [
                                  {
                                    x: 88,
                                    y: 303
                                  },
                                  {
                                    x: 256,
                                    y: 303
                                  },
                                  {
                                    x: 256,
                                    y: 672
                                  },
                                  {
                                    x: 88,
                                    y: 672
                                  }
                                ]
                              },
                              text: 'C'
                            },
                            {
                              property: {
                                detectedLanguages: [
                                  {
                                    languageCode: 'en'
                                  }
                                ]
                              },
                              boundingBox: {
                                vertices: [
                                  {
                                    x: 278,
                                    y: 282
                                  },
                                  {
                                    x: 447,
                                    y: 282
                                  },
                                  {
                                    x: 447,
                                    y: 608
                                  },
                                  {
                                    x: 278,
                                    y: 608
                                  }
                                ]
                              },
                              text: 'A'
                            },
                            {
                              property: {
                                detectedLanguages: [
                                  {
                                    languageCode: 'en'
                                  }
                                ]
                              },
                              boundingBox: {
                                vertices: [
                                  {
                                    x: 448,
                                    y: 282
                                  },
                                  {
                                    x: 627,
                                    y: 282
                                  },
                                  {
                                    x: 627,
                                    y: 608
                                  },
                                  {
                                    x: 448,
                                    y: 608
                                  }
                                ]
                              },
                              text: 'T'
                            },
                            {
                              property: {
                                detectedLanguages: [
                                  {
                                    languageCode: 'en'
                                  }
                                ],
                                detectedBreak: {
                                  type: 'EOL_SURE_SPACE'
                                }
                              },
                              boundingBox: {
                                vertices: [
                                  {
                                    x: 617,
                                    y: 250
                                  },
                                  {
                                    x: 807,
                                    y: 250
                                  },
                                  {
                                    x: 807,
                                    y: 524
                                  },
                                  {
                                    x: 617,
                                    y: 524
                                  }
                                ]
                              },
                              text: 'S'
                            }
                          ]
                        }
                      ]
                    }
                  ],
                  blockType: 'TEXT'
                }
              ]
            }
          ],
          text: 'CATS\n'
        }
      }
    ]
  }
}
