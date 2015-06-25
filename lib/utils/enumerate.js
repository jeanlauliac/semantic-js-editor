import invariant from './invariant'

/**
 * Creates an object containing the same keys as the `spec` object, whose
 * values are sensibly built using the `prefix` and the keys.
 *
 * The returned object also exposes a function `isValid` that can be used
 * to verify that a string is one of the values.
 */
export default function enumerate(prefix, spec) {
  invariant(typeof prefix === 'string', '`prefix` must be a string')
  invariant(typeof spec === 'object', '`spec` must be an object')
  var retval = {}
  var values = new Set()
  for (var name in spec) {
    retval[name] = prefix + '_' + name
    values.add(retval[name])
  }
  retval.isValid = (value) => values.has(value)
  return retval
}
