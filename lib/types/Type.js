/**
 * A type is an object containing a `displayName` for display in errors for
 * instance, and a `validate` function that takes a value and returns a string
 * indicating a typing error, as an qualifier; or `undefined` if there's no
 * issue.
 */
export default (() => {

  function Type(displayName, validate) {
    return Object.freeze({displayName, validate})
  }

  Type.NUMBER = Type(
    'number',
    value => typeof value === 'number' ? undefined : 'must be a number'
  )

  Type.STRING = Type(
    'string',
    value => typeof value === 'string' ? undefined : 'must be a string'
  )

  Type.literal = literal => Type(
    JSON.stringify(literal),
    value => value === literal
      ? undefined
      : `must equal ${JSON.stringify(literal)}`
  )

  Type.nullable = type => Type(
    '?' + type.displayName,
    value => value == null
      ? null
      : type.validate(value)
  )

  Type.object = spec => {
    var keys = Object.keys(spec)
    return Type(
      '{' + keys.map(
        name => `${name}: ${spec[name].displayName}`
      ).join(', ') + '}',
      value => {
        if (!(
          typeof value === 'object' &&
          value != null
        )) {
          return 'must be a non-empty object'
        }
        for (var i = 0; i < keys.length; ++i) {
          let key = keys[i]
          let reason = spec[key].validate(value[key])
          if (reason != null) {
            return `have a field \`${key}\`, that ${reason}`
          }
        }
      }
    )
  }

  Type.oneOf = set => {
    let names = set.toArray().map(value => JSON.stringify(value))
    return Type(
      names.join(' | '),
      value => set.has(value)
        ? undefined
        : 'must be one of the values: ' + names.join(', ')
    )
  }

  Type.union = (...types) => Type(
    types.map(type => type.displayName).join(' | '),
    value => {
      var reasons = types.map(type => type.validate(value))
      if (!reasons.some(reason => reason == null)) {
        return (
          'can be one of the following: ' +
          reasons.map(reason => 'it ' + reason).join('; or ')
        )
      }
    }
  )

  return Type

})()
