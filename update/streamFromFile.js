import {Readable} from 'stream'

/**
 * Returns a readable stream of stream objects. A new stream is pushed every
 * time the file changes.
 */
export default function streamFromFile(watchFile, once, filePath) {

  let stream = new Readable({objectMode: true})
  stream._read = () => {}

  if (!once) {
    let watcher = watchFile(filePath, {persistent: true})
    watcher.on('change', () => {
      pushStream()
    })
  }
  process.nextTick(pushStream)

  function pushStream() {
    let fileStream = fs.createReadStream(filePath)
    stream.push(fileStream)
    if (once) {
      stream.push(null)
    }
  }

  stream.close = () => {
    if (watcher == null) {
      return
    }
    setTimeout(() => {
      watcher.close()
      watcher = null
      stream.push(null)
    }, 500)
  }

  return stream

}
