import Emitter from './build/Emitter'
import StyleExtractor from './build/StyleExtractor'
import babelify from 'babelify'
import browserify from 'browserify'
import clc from 'cli-color'
import moment from 'moment'
import nopt from 'nopt'
import path from 'path'
import through from 'through2'
import watchify from 'watchify'

var Folders = {
  OUTPUT: 'output',
  WWW: 'www',
}

var BrowserifyOpts = {
  cache: {},
  debug: false,
  fullPaths: true,
  packageCache: {},
}

var log = (() => {
  return (message) => {
    let date = clc.blackBright(moment().format('HH:mm:ss'))
    console.error(`[${date}] ${message}`)
  }
})()

process.on('uncaughtException', (err) => {
  log(clc.red('*** Uncaught exception!'))
  console.error(err.stack)
  process.exit(1)
})

function browseristyle(filePath) {
  return new Emitter((inform) => {
    var styleExtractor = new StyleExtractor()
    var jsBundler = watchify(
      browserify(BrowserifyOpts)
        .transform(babelify)
        //.transform(styleExtractor.transform)
        .require(filePath, {entry: true})
      )
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
      jsBundler.removeListener('update', buildBundles)
      setTimeout(() => {
        // Need to do that async.
        // See https://github.com/substack/watchify/issues/22#issuecomment-67673776
        jsBundler.close()
      }, 1000)
    }
  })
}

function streamToFile(stream, filePath) {
  return stream.on('error', (error) => {
    log(clc.red(`*** Failed to generate ${filePath}`))
    console.error(error.stack)
  }).pipe(fs.createWriteStream(filePath))
    .on('error', (error) => {
      log(clc.red(`*** Failed to write file ${filePath}`))
      console.error(error.stack)
    })
    .on('finish', () => {
      log(`Wrote ${clc.blue(filePath)}`)
    })
}

function copying(sourcePath, destPath) {
  return new Emitter((inform) => {
    var copy = () => {
      return streamToFile(fs.createReadStream(sourcePath), destPath)
    }
    var watcher = fs.watch(sourcePath, () => {
      inform(copy())
    })
    inform(copy())
    return () => {
      watcher.close()
    }
  })
}

(() => {
  let opts = nopt({once: Boolean})
  let jsEntryPath = './' + path.join(Folders.WWW, 'index.js')
  let jsBundlePath = path.join(Folders.OUTPUT, 'bundle.js');
  let cssBundlePath = path.join(Folders.OUTPUT, 'bundle.css');
  let sub = browseristyle(jsEntryPath).subscribe(({js, css}) => {
    streamToFile(js, jsBundlePath)
    streamToFile(css, cssBundlePath)
    if (opts.once) {
      sub.remove()
    }
  })
  let sub2 = copying(
    path.join(Folders.WWW, 'index.html'),
    path.join(Folders.OUTPUT, 'index.html')
  ).subscribe(() => {
    if (opts.once) {
      sub2.remove()
    }
  })
})()
