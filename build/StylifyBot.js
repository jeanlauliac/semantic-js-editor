import BrowserifyBot from './BrowserifyBot'
import {EventEmitter} from 'events'
import {PassThrough} from 'stream'
import StyleExtractor from './StyleExtractor'
import babelify from 'babelify'
import browserify from 'browserify'

var BrowserifyOpts = {
  cache: {},
  debug: false,
  fullPaths: true,
  packageCache: {},
}

export default class StylifyBot extends EventEmitter {

  constructor(entryPath, transforms) {
    super()
    this._styleExtractor = new StyleExtractor()
    var bundler = browserify(BrowserifyOpts)
    transforms.forEach(transform => bundler.transform(transform))
    bundler.transform(this._styleExtractor.getTransform())
    bundler.require(entryPath, {entry: true})
    this._bot = new BrowserifyBot(bundler)
      .on('change', paths => this.emit('change', paths))
      .on('update', this._update.bind(this))
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
