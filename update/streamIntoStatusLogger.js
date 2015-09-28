import {Writable} from 'stream'
import clc from 'cli-color'
import moment from 'moment'
import progressString from './progressString'

/**
 * Returns a writable stream of promises. When a promise is pushed,
 * the console status shows an infinite progress bar until the promise resolves.
 * A new inbound promise replaces the current one.
 */
export default function streamIntoStatusLogger(statusLogger, log) {

  const stream = new Writable({objectMode: true})
  let startTime = 0
  let progressBarPhase = 0
  let lastPromise = null
  let interval = null

  let state = null

  stream._write = (inboundPromise, _, writeCallback) => {
    if (state == null) {
      state = {
        interval: setInterval(updateBar, 100),
        lastPromise: null,
        progressBarPhase: 0,
        startTime: moment(),
      }
      updateBar()
    }
    state.lastPromise = inboundPromise
    state.lastPromise.then(
      () => processPromiseSettled(inboundPromise),
      error => processPromiseSettled(inboundPromise, error)
    ).catch(error => {
      setTimeout(() => {throw error}, 0)
    })
    writeCallback()
  }

  function processPromiseSettled(promise, error) {
    if (state == null || promise !== state.lastPromise) {
      return
    }
    let duration = moment().diff(state.startTime, 'seconds', true)
    clearInterval(state.interval)
    state = null
    statusLogger.status()
    if (error != null) {
      log(`Project is NOT up-to-date, error(s) happened ${
        clc.blackBright(`(after ${duration}s)`)
      }`)
    } else {
      log(`Project is up-to-date ${
        clc.blackBright(`(after ${duration}s)`)
      }`)
    }
  }

  function updateBar() {
    if (state == null) {
      return
    }
    const progress = progressString(20, state.progressBarPhase)
    statusLogger.status(`Updating  ${progress}`)
    ++state.progressBarPhase
  }

  return stream
}
