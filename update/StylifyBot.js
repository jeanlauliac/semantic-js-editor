import {EventEmitter} from 'events'
import {PassThrough} from 'stream'
import StyleExtractor from './StyleExtractor'
import babelify from 'babelify'
import browserify from 'browserify'
import streamBrowserify from './streamBrowserify'

var BrowserifyOpts = {
  debug: false,
  fullPaths: true,
}

export default class StylifyBot extends EventEmitter {

  constructor(entryPath, transforms) {
    super()
    this._styleExtractor = new StyleExtractor()
    this._bot = streamBrowserify(BrowserifyOpts, (bundler) => {
      transforms.forEach(transform => bundler.transform(transform))
      bundler.transform(this._styleExtractor.getTransform())
      bundler.require(entryPath, {entry: true})
    })
      .on('change', paths => this.emit('change', paths))
      .on('readable', () => {
        this._update(this._bot.read())
        this._bot.read(0)
      })
  }

  _update(output) {
    var cssOutput = new PassThrough()
    output.on('end', () => {
      this._styleExtractor.toStream().pipe(cssOutput)
    })
    this.emit('update', output, cssOutput)
  }

  close() {
    this._bot.close()
  }

}
