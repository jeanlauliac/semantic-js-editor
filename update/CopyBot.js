import {EventEmitter} from 'events'
import chokidar from 'chokidar'
import fs from 'fs'

/**
 * Copy a file, and copy it again anytime it changes.
 */
export default class CopyBot extends EventEmitter {

  /**
   * Sets up the source and destination file paths. Supports any path
   * supported by the Node `fs` module. Emits the event `change()` when a source
   * file change triggers a new copy.
   *
   * The first copy starts asynchronously to give the opportunity to listen to
   * events.
   */
  constructor(sourcePath, destPath) {
    super()
    Object.defineProperty(this, 'sourcePath', {value: sourcePath})
    Object.defineProperty(this, 'destPath', {value: destPath})
    this._watcher = chokidar.watch(sourcePath, {persistent: true})
    this._watcher.on('change', () => {
      this.emit('change', sourcePath)
      this._copy()
    })
    process.nextTick(this._copy.bind(this))
  }

  /**
   * Triggers a new copy, and emit some events along the way to signal the
   * progression:
   *
   *   - `start()`: began the copy;
   *   - `sourceError(error)`: something wrong with the source file;
   *   - `destError(error)`: something wrong with the destination file;
   *   - `finish()`: finished the copy.
   *
   * If an error happens, `finish` is not triggered for this cycle. Future
   * changes continue to trigger a copy even if an error happened.
   */
  _copy() {
    if (this._stream != null) {
      this._stream.close()
    } else {
      this.emit('start')
    }
    let sourceStream = fs.createReadStream(this.sourcePath)
    sourceStream.on('error', error => {
      this.emit('error', error, 'source')
      this._stream = undefined
    })
    let stream = sourceStream.pipe(fs.createWriteStream(this.destPath))
      .on('error', error => {
        this.emit('error', error, 'dest')
        this._stream = undefined
      })
    this._stream = stream
    stream.on('finish', () => {
      if (this._stream === stream) {
        this.emit('finish')
        this._stream = undefined
      }
    })
  }

  /**
   * Stop watching. Emits an event `close()`.
   */
  close() {
    setTimeout(() => {
      this._watcher.close()
      this.emit('close')
    }, 500)
  }

}
