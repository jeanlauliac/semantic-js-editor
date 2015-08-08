import {EventEmitter} from 'events'
import streamIntoCallback from './streamIntoCallback'
import streamFromFile from './streamFromFile'
import streamIntoFile from './streamIntoFile'
import fs from 'fs'

/**
 * Copy a file, and copy it again anytime it changes.
 */
export default function updateCopy(sourcePath, destPath) {

  let events = new EventEmitter()
  let sourceStream = streamFromFile(sourcePath)

  sourceStream.pipe(streamIntoCallback(sourceStream => {
    events.emit('change', sourcePath)
    sourceStream.on('error', error => {
      events.emit('error', errorFrom(error, 'source'))
    })
  }))

  sourceStream.pipe(streamIntoFile(destPath)).pipe(
    streamIntoCallback(fsStream => {
      events.emit('start')
      fsStream.on('error', error => {
        events.emit('error', errorFrom(error, 'destination'))
      })
      fsStream.on('finish', () => events.emit('finish'))
    })
  )

  events.close = () => {
    sourceStream.close()
  }

  return events

}

function errorFrom(error, origin) {
  let outerError = new Error(error.message)
  outerError.inner = error
  outerError.origin = origin
  return outerError
}
