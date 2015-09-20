import {Writable} from 'stream'

/**
 * Returns a writable stream of stream objects. When a stream is pushed,
 * `callback(stream)` is called.
 */
export default function streamIntoCallback(callback) {
  let stream = new Writable({objectMode: true})
  stream._write = (inboundStream, _, writeCallback) => {
    callback(inboundStream)
    writeCallback()
  }
  return stream
}
