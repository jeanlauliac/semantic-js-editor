export default {

  NUMBER: Object.freeze({validate: value => typeof value === 'number'}),
  STRING: Object.freeze({validate: value => typeof value === 'string'}),

  nullable(type) {
    return this.where(value => value == null || type.validate(value))
  },

  object(spec) {
    var keys = Object.keys(spec)
    return this.where(value =>
      keys.every(key => spec[key].validate(value[key]))
    )
  },

  oneOf(set) {
    return this.where(value => set.has(value))
  },

  union(...types) {
    return this.where(value => types.some(type => type.validate(value)))
  },

  taggedUnion(spec) {
    return this.where(value => {
      if (!(
        value != null &&
        typeof value === 'object' &&
        value.tag != null &&
        typeof value.tag === 'string'
      )) {
        return false
      }
      let {tag, ...rest} = value
      return spec[tag].validate(rest)
    })
  },

  where(validate) {
    return Object.freeze({validate})
  },

}
