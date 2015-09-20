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
export default function updateCopy(
  sourcePath,
  destPath,
  watchFile,
  createWriteStream,
  once
) {

  let stream = new Readable({objectMode: true})
  stream._read = () => {}
  let sourceStream = streamFromFile(sourcePath, watchFile, once)

  sourceStream.pipe(streamIntoFile(destPath, createWriteStream)).pipe(
    streamIntoCallback(result => {
      stream.push(result)
    })
  )

  stream.close = () => {
    sourceStream.close()
  }

  return stream

}
