import {EventEmitter} from 'events'
import {PassThrough} from 'stream'
import {Readable} from 'stream'
import babelify from 'babelify'
import browserify from 'browserify'
import streamIntoFile from './streamIntoFile'
import streamStylify from './streamStylify'
import unzipStream from './unzipStream'

var BrowserifyOpts = {
  debug: false,
  fullPaths: true,
}

export default function updateJavascriptAndStyle(
  update,
  entryPath,
  jsDestPath,
  cssDestPath,
  transforms,
) {

  let stream = new Readable({objectMode: true})
  stream._read = () => {}

  let mixedStream = streamStylify(update.fs, BrowserifyOpts, bundler => {
    transforms.forEach(transform => bundler.transform(transform))
    bundler.require(entryPath, {entry: true})
  })

  let [jsStream, cssStream] = unzipStream(2, mixedStream)

  return [
    jsStream.pipe(update.intoFile(jsDestPath)),
    cssStream.pipe(update.intoFile(cssDestPath)),
  ]

}
