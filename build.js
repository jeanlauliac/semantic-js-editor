import Emitter from './build/Emitter'
import StyleExtractor from './build/StyleExtractor'
import babelify from 'babelify'
import browserify from 'browserify'
import clc from 'cli-color'
import nopt from 'nopt'
import path from 'path'
import through from 'through2'
import watchify from 'watchify'

var Folders = {
  OUTPUT: 'output',
  SOURCE: 'source',
}

var BrowserifyOpts = {
  cache: {},
  debug: false,
  fullPaths: true,
  packageCache: {},
}

process.on('uncaughtException', (err) => {
  console.error(clc.red('build: *** Uncaught exception!'))
  console.error(err.stack)
  process.exit(1)
})

function browseristyle(filePath) {
  return new Emitter((inform) => {
    var styleExtractor = new StyleExtractor()
    var jsBundler = watchify(browserify(BrowserifyOpts)
      .transform(babelify)
      //.transform(styleExtractor.transform)
      .require(filePath, {entry: true}))
    var buildBundles = () => {
      var css = through()
      var js = jsBundler.bundle().on('end', () => {
        styleExtractor.toStream().pipe(css)
      })
      inform({js, css})
    }
    jsBundler.on('update', buildBundles)
    buildBundles()
    return () => {
      jsBundler.off('update', buildBundles)
    }
  })
}

(() => {
  var opts = nopt({once: Boolean})
  var sub = browseristyle('./' + path.join(Folders.SOURCE, 'index.js'))
    .subscribe(({js, css}) => {
      js.on('error', (error) => {
          console.error(clc.red('build: *** browserify failed'))
          console.error(error.stack)
        })
        .on('end', () => {console.error(clc.greenBright('built: bundle.js'))})
        .pipe(fs.createWriteStream(path.join(Folders.OUTPUT, 'bundle.js')))
      css.on('error', (error) => {
          console.error(clc.red('build: *** stylify failed'))
          console.error(error.stack)
        })
        .on('end', () => {console.error(clc.greenBright('built: bundle.css'))})
        .pipe(fs.createWriteStream(path.join(Folders.OUTPUT, 'bundle.css')))
      if (opts.once) {
        sub.remove()
      }
    })
})()
