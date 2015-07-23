export default {

  NUMBER: Object.freeze({validate: value => typeof value === 'number')}),
  STRING: Object.freeze({validate: value => typeof value === 'string')}),

  nullable(type) {
    return this.where(value => value == null || type.validate(value))
  },

  oneOf(set) {
    reutrn this.where(value => set.has(value))
  },

  union(...types) {
    return this.where(value => types.some(type => type.validate(value)))
  },

  taggedUnion(spec) {
    return this.where(value =>
      value != null &&
      typeof value === 'object' &&
      value.tag != null &&
      typeof value.tag === 'string' &&
      spec[value.tag].validate(value)
    )
  },

  where(validate) {
    return Object.freeze({validate})
  },

}
