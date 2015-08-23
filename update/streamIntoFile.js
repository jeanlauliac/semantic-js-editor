import {Transform} from 'stream'

/**
 * Returns a duplex stream of stream objects. Every time a buffer/string
 * stream is pushed through the outer stream, it is piped to an actual file
 * which path is specified with `filePath`. The file stream itself can be
 * then read from the stream (and listen to for errors, for instance).
 */
export default function streamIntoFile(filePath) {

  let stream = new Transform({objectMode: true})
  let prev
  stream._transform = (inboundStream, _, callback) => {
    if (prev != null) {
      prev.inbound.unpipe(prev.file)
      prev.file.end()
    }
    let fileStream = fs.createWriteStream(filePath)
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
    stream.push(fileStream)
    prev = {inbound: inboundStream, file: fileStream}
    callback()
  }

  return stream

}
