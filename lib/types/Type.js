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

  Type.FUNCTION = Type(
    'function',
    value => typeof value === 'function' ? undefined : 'must be a function'
  )

  Type.NUMBER = Type(
    'number',
    value => typeof value === 'number' ? undefined : 'must be a number'
  )

  Type.STRING = Type(
    'string',
    value => typeof value === 'string' ? undefined : 'must be a string'
  )

  Type.arrayOf = type => Type(
    `Array<${type.name}>`,
    value => {
      if (!Array.isArray(value)) {
        return 'must be an array'
      }
      for (var i = 0; i < value.length; ++i) {
        let reason = type.validate(value[i])
        if (reason != null) {
          return `is an array, each element of which ${reason}`
        }
      }
    }
  )

  Type.intersection = (...types) => Type(
    types.map(type => type.displayName).join(' & '),
    value => {
      for (var i = 0; i < types.length; ++i) {
        let reason = types[i].validate(value)
        if (reason != null) {
          return reason
        }
      }
    }
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
      ? undefined
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
            return `has a field \`${key}\`, that ${reason}`
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

  Type.instanceOf = (classCtor) => Type(
    classCtor.name,
    value => value instanceof classCtor
      ? undefined : `must be an instance of \`${classCtor.name}\``
  )

  return Type

})()
