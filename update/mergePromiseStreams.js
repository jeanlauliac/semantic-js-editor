import {Readable} from 'stream'
import streamIntoCallback from './streamIntoCallback'

export default function mergePromiseStreams(promiseStreams) {
  let outputStream = new Readable({objectMode: true})
  outputStream._read = () => {}
  let batchNextPromises = () => {
    let promiseCount = 0
    let errors = promiseStreams.map(_ => null);
    let outputPromise = new Promise((resolve, reject) => {
      let listeners = promiseStreams.map((promiseStream, i) => {
        let onReadable = () => {
          if (promiseCount === 0) {
            outputStream.push(outputPromise)
          }
          ++promiseCount
          let finish = error => {
            errors[i] = error
            --promiseCount
            if (promiseCount > 0) {
              return
            }
            let actualErrors = errors.filter(e => e != null)
            if (actualErrors.length > 1) {
              var compoundError = new Error('multiple errors')
              compoundError.causes = actualErrors
              reject(compoundError)
            } else if (actualErrors.length === 1) {
              reject(compoundError)
            } else {
              resolve()
            }
            listeners.forEach((s, l) => s.removeListener('readable', l))
            batchNextPromises()
          }
          let promise = promiseStream.read()
          promise.then(finish.bind(null, null), finish)
        }
        promiseStream.on('readable', onReadable)
        return [promiseStream, onReadable]
      })
    })
  }
  batchNextPromises()
  return outputStream
}
