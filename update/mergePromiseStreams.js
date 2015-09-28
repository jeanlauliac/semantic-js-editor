import {Readable} from 'stream'
import streamIntoCallback from './streamIntoCallback'

const EMPTY_STATE = {
  pendingCount: 0,
  errored: false,
  outputControls: null
};

export default function mergePromiseStreams(promiseStreams) {

  const outputStream = new Readable({objectMode: true})
  outputStream._read = () => {}

  let inputPromises = promiseStreams.map(_ => null);
  let state = {...EMPTY_STATE};

  promiseStreams.forEach((promiseStream, index) => {
    promiseStream.on('readable', () => {
      const inputPromise = promiseStream.read()
      if (inputPromise != null) {
        processPromise(index, inputPromise)
        promiseStream.read(0)
      }
    })
  })

  function processPromise(index, inputPromise) {
    if (state.pendingCount === 0) {
      const outputPromise = new Promise((fulfill, reject) => {
        state.outputControls = {fulfill, reject}
      })
      outputStream.push(outputPromise)
    }
    if (!inputPromises[index]) {
      ++state.pendingCount
    }
    inputPromises[index] = inputPromise
    inputPromise.then(
      () => processPromiseSettled(index, null),
      error => processPromiseSettled(index, error)
    ).catch(error => {
      setTimeout(() => {throw error;}, 0)
    })
  }

  function processPromiseSettled(index, error) {
    --state.pendingCount
    inputPromises[index] = null
    state.errored = state.errored || (error != null)
    if (state.pendingCount > 0) {
      return;
    }
    const prevState = state
    state = {...EMPTY_STATE}
    if (!prevState.errored) {
      prevState.outputControls.fulfill()
      return
    }
    const reason = new Error('at least one source promise was rejected')
    prevState.outputControls.reject(reason)
  }

  return outputStream
}
