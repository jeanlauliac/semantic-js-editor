export default function enumerate(prefix, spec) {
  var retval = {}
  var values = new Set()
  for (var name in spec) {
    retval[name] = prefix + '_' + name
    values.add(retval[name])
  }
  retval.isValid = (value) => values.has(value)
  return retval
}
