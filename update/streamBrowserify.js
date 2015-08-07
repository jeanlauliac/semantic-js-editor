import {EventEmitter} from 'events'
import {Readable} from 'stream'
import browserify from 'browserify'
import watchify from 'watchify'

let WATCHIFY_OPTS = {
  cache: {},
  packageCache: {},
}

/**
 * Returns a stream of browserify stream objects. A new stream is pushed when
 * any of the source files of the browserify instance change.
 *
 *   - `opts` is a list of options to pass to browserify.
 *   - `setupFn(bundler)` is a function that must setup the browserify instance.
 */
export default function streamBrowserify(opts, setupFn) {

  let stream = new Readable({objectMode: true})
  stream._read = () => {}

  let fullOpts = {}
  Object.keys(opts).forEach(key => fullOpts[key] = opts[key])
  Object.keys(WATCHIFY_OPTS).forEach(key => fullOpts[key] = WATCHIFY_OPTS[key])
  let bundler = browserify(fullOpts)
  setupFn(bundler)

  let watcher = watchify(bundler)
  watcher.on('update', paths => {
    stream.emit('change', paths)
    bundle()
  })
  process.nextTick(bundle)

  /**
   * Starts the browserify process. Emits `update(stream)` where `stream` is the
   * new browserify output.
   */
  function bundle() {
    stream.push(watcher.bundle())
  }

  /**
   * Stops the bot to allow the process to exit.
   */
  stream.close = () => {
    setTimeout(() => {
      // Need to do that async.
      // See https://github.com/substack/watchify/issues/22#issuecomment-67673776
      watcher.close()
      stream.push(null)
    }, 500)
  }

  return stream

}
