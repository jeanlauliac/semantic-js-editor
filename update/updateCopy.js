import {EventEmitter} from 'events'
import {Readable} from 'stream'
import streamIntoCallback from './streamIntoCallback'
import streamFromFile from './streamFromFile'
import streamIntoFile from './streamIntoFile'
import fs from 'fs'

/**
 * Copy a file, and copy it again anytime it changes. Returns a stream of
 * promises, provided everytime a new update is done. The promise is rejected
 * if the update didn't happen correctly.
 */
export default function updateCopy(sourcePath, destPath, watchFile) {

  let stream = new Readable({objectMode: true})
  stream._read = () => {}
  let sourceStream = streamFromFile(sourcePath, watchFile)

  sourceStream.pipe(streamIntoFile(destPath)).pipe(
    streamIntoCallback(fsStream => {
      stream.push(new Promise((resolve, reject) => {
        fsStream.on('error', error => {
          reject(error)
        })
        fsStream.on('finish', resolve)
      }))
    })
  )

  stream.close = () => {
    sourceStream.close()
  }

  return stream

}

function errorFrom(error, origin) {
  let outerError = new Error(error.message)
  outerError.inner = error
  outerError.origin = origin
  return outerError
}
