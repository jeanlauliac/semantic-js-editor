function transformify(stName, fns) {
  var transforms = {}
  for (var name in fns) {
    transforms[name] = ((fn) => function (...args) {
      var st = {}
      st[stName] = fn(this.state[stName], ...args)
      this.setState(st)
    })(fns[name])
  }
  return transforms
}

module.exports = transformify
