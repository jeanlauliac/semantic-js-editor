import StylifyBot from './StylifyBot'
import {EventEmitter} from 'events'
import {PassThrough} from 'stream'
import babelify from 'babelify'
import browserify from 'browserify'

export default class JavascriptBot extends EventEmitter {

  constructor(entryPath, jsDestPath, cssDestPath, transforms) {
    super()
    this._jsDestPath = jsDestPath
    this._cssDestPath = cssDestPath
    this._bot = new StylifyBot(entryPath, transforms)
      .on('change', paths => this.emit('change', paths))
      .on('update', this._update.bind(this))
  }

  _update(jsOutput, cssOutput) {
    this.emit('start')
    jsOutput.on('error', error => this.emit('error', error, 'js'))
    cssOutput.on('error', error => this.emit('error', error, 'css'))
    waitStreams([
      jsOutput.pipe(fs.createWriteStream(this._jsDestPath)).on('error',
        error => this.emit('error', error, 'jsFile')),
      cssOutput.pipe(fs.createWriteStream(this._cssDestPath)).on('error',
        error => this.emit('error', error, 'cssFile')),
    ]).then(() => this.emit('finish'))
  }

  close() {
    this._bot.close()
  }

}

function waitStreams(streams) {
  return Promise.all(streams.map(stream => {
    return new Promise((resolve, reject) => {
      stream
        .on('finish', () => resolve())
        .on('error', error => reject(error))
    })
  }))
}
