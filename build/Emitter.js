import invariant from '../source/utils/invariant'

export default class Emitter {
  constructor(setup, teardown) {
    this._subs = {}
    this._nextKey = 1
    this._subCount = 0
    this._setup = setup
  }

  subscribe(callback) {
    var key = 'subscriber_' + this._nextKey++
    this._subs[key] = callback;
    if (++this._subCount === 1) {
      this._teardown = this._setup(this._inform.bind(this))
    }
    return {remove: () => {
      invariant(this._subs.hasOwnProperty(key), 'subscription already removed')
      delete this._subs[key]
      if (--this._subCount === 0 && this._teardown) {
        this._teardown();
      }
    }}
  }

  _inform(...payload) {
    for (var key in this._subs) {
      this._subs[key](...payload);
    }
  }
}
