import invariant from './invariant'

/**
 * Maps adjacent and non-overlapping left half-closed intervals to arbitrary
 * values.
 */
export default class ImmutableIntervalMap {
  /**
   * Create an interval map based on an array of pairs `[startIndex, value]`,
   * where `startIndex` is the beginning of the interval, included. For example:
   *
   *   new ImmutableIntervalMap([[0, 'foo'], [4, 'bar']], compareNumber)
   *
   * That creates a map of two intervals [0, 4[ and [4, +Infinity[. Values can
   * be defined `undefined`, creating gaps. Indices don't have to be numbers.
   */
  constructor(pairs, compareFunction) {
    invariant(Array.isArray(pairs), '`pairs` must be an array')
    invariant(pairs.every(pair => Array.isArray(pair)), '`pairs` must be an array of pairs')
    invariant(typeof compareFunction === 'function', '`compareFunction` must be a function')
    this._compareFunction = compareFunction
    this._pairs = pairs.slice().sort((a, b) => compareFunction(a[0], b[0]))
  }

  forEach(callback) {
    return this._pairs.forEach(callback)
  }

  /**
   * Find the interval that contains the specified index and returns the
   * corresponding pair. If the interval is unknown, return `undefined`.
   */
  getPair(index) {
    var range = [0, this._pairs.length - 1]
    var idx = 0
    while (true) {
      var mid = Math.floor((range[1] + range[0]) / 2)
      if (this._compareFunction(index, this._pairs[mid][0]) < 0) {
        range[1] = mid - 1
        if (range[1] < 0) {
          return
        }
      } else if (
        mid < this._pairs.length - 1 &&
        this._compareFunction(index, this._pairs[mid + 1][0]) >= 0
      ) {
        range[0] = mid + 1
      } else {
        return this._pairs[mid]
      }
      ++idx
      invariant(idx <= Math.ceil(this._pairs.length / 2), 'get() algorithm is broken')
    }
  }

  get(index) {
    let pair = this.getPair(index)
    if (pair) {
      return pair[1]
    }
  }
}
