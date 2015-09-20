import {Transform} from 'stream'

/**
 * Returns a duplex stream. Every time a buffer/string stream is pushed through
 * the outer stream, it is piped to an actual file which path is specified with
 * `filePath`. Promises can then read from the stream signaling the result of
 * the write for each file.
 */
export default function streamIntoFile(filePath, createWriteStream) {

  let stream = new Transform({objectMode: true})
  let prev
  stream._transform = (inboundStream, _, callback) => {
    if (prev != null) {
      prev.inbound.unpipe(prev.file)
      prev.file.end()
    }
    let fileStream = createWriteStream(filePath)
    inboundStream.on('error', error => {
      let outError = new Error(`Failed to update ${filePath}`)
      outError.cause = error
      fileStream.emit('error', outError)
      fileStream.end()
      prev = undefined
    }).on('end', () => {
      prev = undefined
    })
    inboundStream.pipe(fileStream)
    stream.push(new Promise((resolve, reject) => {
      fileStream.on('error', error => {
        reject(error)
      })
      fileStream.on('finish', resolve)
    }))
    prev = {inbound: inboundStream, file: fileStream}
    callback()
  }

  return stream

}
