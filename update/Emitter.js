import invariant from '../lib/utils/invariant'

export default class Emitter {
  constructor(setup) {
    this._subs = {}
    this._nextKey = 1
    this._subCount = 0
    this._setup = setup
  }

  subscribe(callback) {
    invariant(typeof callback === 'function', 'callback is not a function')
    var key = 'subscriber_' + this._nextKey++
    this._subs[key] = callback
    if (++this._subCount === 1) {
      this._teardown = this._setup(this._inform.bind(this))
      invariant(
        this._teardown,
        'Emitter initializer must return a teardown funtion'
      )
    }
    return {remove: () => {
      invariant(this._subs.hasOwnProperty(key), 'subscription already removed')
      delete this._subs[key]
      if (--this._subCount === 0 && this._teardown) {
        this._teardown()
      }
    }}
  }

  _inform(...payload) {
    // We get an inform before the _setup function even returned, in which case
    // we make it async. Indeed, the subscribers might want to teardown directly
    // after the very first event.
    if (!this._teardown) {
      process.nextTick(() => this._inform(...payload))
      return
    }
    for (var key in this._subs) {
      this._subs[key](...payload)
    }
  }
}
