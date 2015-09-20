import {Readable} from 'stream'

/**
 * Given a stream of tuple objects (arrays of a given size), returns a tuple
 * of streams containing values of each original tuple.
 */
export default function unzipStream(tupleSize, tupleStream) {
  let streams = new Array(tupleSize);
  for (let i = 0; i < tupleSize; ++i) {
    streams[i] = new Readable({objectMode: true})
    streams[i]._read = () => {}
  }
  tupleStream.on('readable', () => {
    let tuple = tupleStream.read()
    for (let i = 0; i < tupleSize; ++i) {
      streams[i].push(tuple[i])
    }
    tupleStream.read(0)
  }).on('end', () => {
    for (let i = 0; i < tupleSize; ++i) {
      streams[i].push(null)
    }
  })
  return streams
}
