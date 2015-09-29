import StatusLogger from './StatusLogger'
import chokidar from 'chokidar'
import clc from 'cli-color'
import http from 'http'
import mergePromiseStreams from './mergePromiseStreams'
import moment from 'moment'
import nodeStatic from 'node-static'
import nopt from 'nopt'
import path from 'path'
import streamFromFile from './streamFromFile'
import streamIntoFile from './streamIntoFile'
import streamIntoStatusLogger from './streamIntoStatusLogger'

export default function startCLI(optsDef, createUpdateStream) {
  const fullOptsDef = {...optsDef, once: Boolean}
  const {...opts, once} = nopt(fullOptsDef)
  const statusLogger = new StatusLogger(process.stderr)
  const log = message => {
    let date = clc.blackBright(moment().format('HH:mm:ss'))
    statusLogger.log(`${date}  ${message}`)
  }
  const update = makeUpdater(statusLogger, log, once)
  const stream = createUpdateStream(update, opts)
  stream.pipe(streamIntoStatusLogger(statusLogger, log))
}

function makeUpdater(statusLogger, log, once) {
  const fs = {
    createWriteStream: createWriteStream.bind(null, log),
    watchFile: watchFile.bind(null, log),
    once,
  }
  return {
    statusLogger,
    log,
    fs,
    serveFiles: once ? () => {} : serveFiles.bind(null, log),
    intoFile: streamIntoFile.bind(null, fs.createWriteStream),
    fromFile: streamFromFile.bind(null, fs.watchFile, once),
    all: mergePromiseStreams,
  }
}

function serveFiles(log, rootPath, port) {
  let server = new nodeStatic.Server(rootPath)
  http.createServer((request, response) => {
    request.on('end', () => {
      server.serve(request, response)
    }).resume()
  }).listen(port).on('listening', () => {
    log(`Listening on port ${clc.magenta(port)}`)
  })
}

function watchFile(log, filePath, opts) {
  let fileWatcher = chokidar.watch(filePath, opts)
  let localPath = path.relative('.', filePath)
  fileWatcher.on('change', () => {
    log('Changed: ' + clc.green(localPath))
  })
  return fileWatcher;
}

function createWriteStream(log, filePath) {
  let stream = fs.createWriteStream(filePath)
  stream.on('finish', () => {
    log(`Wrote ${clc.blue(filePath)}`)
  })
  return stream
}
