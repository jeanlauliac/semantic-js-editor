export default function enumerate(prefix, spec) {
  var retval = {}
  for (var name in spec) {
    retval[name] = prefix + '_' + name
  }
  return retval
}
