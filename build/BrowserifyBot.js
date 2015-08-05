import {EventEmitter} from 'events'
import watchify from 'watchify'

/**
 * Browserifies a set of files, then keep updating on changes.
 */
export default class BrowserifyBot extends EventEmitter {

  /**
   * Sets up the bundler, that is, the result of calling `browserify()` and
   * setting up some options on it, like the entry point.
   */
  constructor(bundler) {
    super()
    this._watcher = watchify(bundler)
    this._watcher.on('update', paths => {
      this.emit('change', paths)
      this._bundle()
    })
    process.nextTick(this._bundle.bind(this))
  }

  /**
   * Starts the browserify process. Emits `update(stream)` where `stream` is the
   * new browserify output.
   */
  _bundle() {
    this.emit('update', this._watcher.bundle())
  }

  /**
   * Stops the bot to allow the process to exit.
   */
  close() {
    setTimeout(() => {
      // Need to do that async.
      // See https://github.com/substack/watchify/issues/22#issuecomment-67673776
      this._watcher.close()
    }, 500)
  }

}
