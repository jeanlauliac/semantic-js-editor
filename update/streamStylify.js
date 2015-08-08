import {PassThrough} from 'stream'
import {Readable} from 'stream'
import StyleExtractor from './StyleExtractor'
import babelify from 'babelify'
import browserify from 'browserify'
import streamBrowserify from './streamBrowserify'

/**
 * Returns a stream of pairs `[jsStream, cssStream]`, where `jsStream` is the
 * result of browserify and `cssStream` is the result of the stylify extractor.
 */
export default function streamStylify(opts, setupFn) {

  let stream = new Readable({objectMode: true})
  stream._read = () => {}

  let styleExtractor = new StyleExtractor()
  let browserifyStream = streamBrowserify(opts, bundler => {
    setupFn(bundler)
    bundler.transform(styleExtractor.getTransform())
  })
  browserifyStream
    .on('change', paths => stream.emit('change', paths))
    .on('readable', () => {
      process(browserifyStream.read())
      browserifyStream.read(0)
    })
    .on('error', error => {
      stream.emit('error', error)
      stream.close()
    })
    .on('end', () => stream.push(null))

  /**
   * Processes a stream resulting from a browserification, by emitting the
   * corresponding style sheets and pushing the result to the output stream.
   */
  function process(jsStream) {
    var cssStream = new PassThrough()
    jsStream.on('end', () => {
      styleExtractor.toStream().pipe(cssStream)
    }).on('error', () => cssStream.end())
    stream.push([jsStream, cssStream])
  }

  stream.close = () => {
    browserifyStream.close()
  }

  return stream

}
