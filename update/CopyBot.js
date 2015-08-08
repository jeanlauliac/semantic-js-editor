import {EventEmitter} from 'events'
import streamIntoCallback from './streamIntoCallback'
import streamFromFile from './streamFromFile'
import streamIntoFile from './streamIntoFile'
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
    this._from = streamFromFile(sourcePath)
    this._from.pipe(streamIntoCallback(sourceStream => {
      this.emit('change', sourcePath)
      sourceStream.on('error', error => this.emit('error', error, 'source'))
    }))
    this._from.pipe(streamIntoFile(destPath)).pipe(
      streamIntoCallback(fsStream => {
        this.emit('start')
        fsStream.on('error', error => this.emit('error', error, 'dest'))
        fsStream.on('finish', () => this.emit('finish'))
      })
    )
  }

  close() {
    this._from.close()
  }

}
