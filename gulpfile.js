// main
const exec = require('child_process').exec
const net = require('net')

// gulp
const babel = require('gulp-babel')
const changed = require('gulp-changed')
const docs = require('gulp-documentation')
const flow = require('gulp-flowtype')
const gulp = require('gulp')
const gutil = require('gulp-util')
const standard = require('gulp-standard')
const watch = require('gulp-watch')
const PluginError = gutil.PluginError

// module
const through = require('through2')
const flowJsDoc = require('flow-jsdoc')

// constants
const FLOW_DEST = 'flow/'
const FLOW_GLOB = 'flow/**/*.js'
const TCOMB = 'tcomb-test/'
const DOCS = 'docs'
const PORT = 4001
const sources = [
  'src/test-flow.js',
  'data/*.js', 
  'src/**/*.js'
]

// tasks
gulp.task('default', ['annotate', 'copy', 'flow'])

gulp.task('watch', (cb) => {
  gulp.watch(sources, ['annotate'])
  gulp.watch(FLOW_GLOB, ['flow'])
  gulp.watch(sources, ({ type, path }) => {
    if (type === 'added' || type === 'changed') lint(path)
  })

  isPortTaken(PORT, (err, taken) => {
    if (err) return cb(err)
    if (!taken) {
      exec(`./node_modules/documentation/bin/documentation.js serve -w ${FLOW_GLOB}`, err => {
        if (err) return cb(err)
        console.log(`serving docs on port ${PORT}`)
      })
    }
  })
})

gulp.task('annotate', () => {
  return gulp.src(sources, { base: './' })
    .pipe(changed(FLOW_DEST))
    .pipe(docToFlow())
    .pipe(gulp.dest(FLOW_DEST))
})


gulp.task('copy', () => {
  return gulp.src('.flowconfig')
    .pipe(gulp.dest(FLOW_DEST))
})

gulp.task('flow', () => {
  return gulp.src(FLOW_GLOB)
    .pipe(flow({ declarations: './flow-typed' }))
})

function lint (file) {
  gulp.src(file) 
    .pipe(standard())
    .pipe(standard.reporter('default'))
}

//gulp.task('tcomb', (cb) => {
//  gulp.src(FLOW_GLOB)
//    .pipe(babel({
//      presets: ['flow-tcomb']
//    }))
//    .pipe(gulp.dest(TCOMB))
//})

// JSDOC TO FLOW 
// TODO: extract to own module
const NAME = 'gulp-flow-js-doc'

function docToFlow () {
  function transform (file, enc, callback) {
    if (file.isNull() || file.isDirectory()) return callback(null, file)

    const str = file.contents.toString('utf8')
    const data = flowJsDoc(str).toString()

    if (file.isBuffer()) file.contents = new Buffer(data)

    if (file.isStream()) {    
      const streamer = docToFlowStream()
      streamer.on('error', this.emit.bind(this, 'error'))
      file.contents = file.contents.pipe(write(data))
    }

    return callback(null, file)
  }

  return through.obj(transform)
}

function write (str) {
  const stream = through()
  stream.write(str)
  return stream
}

function isPortTaken (port, callback) {
  const tester = net.createServer()
    .once('error', function (err) {
      if (err.code != 'EADDRINUSE') return callback(err)
      callback(null, true)
    })
    .once('listening', function() {
      tester
        .once('close', () => callback(null, false))
        .close()
    })
    .listen(port)
}
