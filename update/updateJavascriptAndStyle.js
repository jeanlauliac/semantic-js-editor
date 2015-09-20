import {EventEmitter} from 'events'
import {PassThrough} from 'stream'
import {Readable} from 'stream'
import babelify from 'babelify'
import browserify from 'browserify'
import streamStylify from './streamStylify'

var BrowserifyOpts = {
  debug: false,
  fullPaths: true,
}

export default function updateJavascriptAndStyle(
  entryPath,
  jsDestPath,
  cssDestPath,
  watchFile,
  transforms
) {

  let stream = new Readable({objectMode: true})
  stream._read = () => {}

  let bot = streamStylify(BrowserifyOpts, watchFile, bundler => {
    transforms.forEach(transform => bundler.transform(transform))
    bundler.require(entryPath, {entry: true})
  }).on('readable', () => {
    update(bot.read())
    bot.read(0)
  })

  function update([jsOutput, cssOutput]) {
    stream.push(new Promise((resolve, reject) => {
      jsOutput.on('error', error => reject(error))
      cssOutput.on('error', error => reject(error))
      waitStreams([
        jsOutput.pipe(fs.createWriteStream(jsDestPath)),
        cssOutput.pipe(fs.createWriteStream(cssDestPath)),
      ]).then(() => resolve())
    }))
  }

  stream.close = bot.close.bind(bot)

  return stream

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
