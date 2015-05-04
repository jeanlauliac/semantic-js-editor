'use strict'

function invariant(expr, message) {
  if (expr) {
    return
  }
  if (message) {
    throw new Error('Invariant failed: ' + message)
  }
  throw new Error('Invariant failed')
}

module.exports = invariant
