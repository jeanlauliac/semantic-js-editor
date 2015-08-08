import {Readable} from 'stream'
import chokidar from 'chokidar'

/**
 * Returns a readable stream of stream objects. A new stream is pushed every
 * time the file changes.
 */
export default function streamFromFile(filePath) {

  let stream = new Readable({objectMode: true})
  stream._read = () => {}

  let watcher = chokidar.watch(filePath, {persistent: true})
  watcher.on('change', () => {
    pushStream()
  })
  process.nextTick(pushStream)

  function pushStream() {
    let fileStream = fs.createReadStream(filePath)
    stream.push(fileStream)
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
