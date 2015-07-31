import Type from '../types/Type'
import invariant from '../utils/invariant'

/**
 * Given a function `makeSpec(type: object): object` where `type` is the
 * recursive type of the tagged union, and returns a specification; returns a
 * new function that can build a tagged union object corresponding to the spec.
 */
export default function makeTaggedUnion(name, makeSpec) {

  const SECRET = Object.freeze({})
  const SIMPLE_TYPE = Type(
    name,
    value =>
      value != null && value.__secret === SECRET
        ? undefined : `must be a non-empty instance of \`${name}\``
  )
  const SPEC = makeSpec(SIMPLE_TYPE)
  const TYPES = buildTypes(SPEC)

  var TaggedUnion = function(fields) {
    invariant(typeof fields.tag === 'string', 'invalid tag')
    let reason = TYPES[fields.tag].validate(fields)
    invariant(
      reason == null,
      `invalid object for tag \`${fields.tag}\`, it ${reason}`
    )
    var object = {...fields}
    Object.defineProperty(object, '__secret', {value: SECRET})
    return Object.freeze(object)
  }

  TaggedUnion.TYPE = SIMPLE_TYPE

  Object.keys(SPEC).forEach(tag => {
    let fieldSpec = SPEC[tag]
    TaggedUnion[tag] = (...values) => {
      var fields = {}
      values.forEach((value, i) => {
        fields[fieldSpec[i][0]] = value
      })
      return TaggedUnion({
        ...fields,
        tag,
      })
    }
  })

  return TaggedUnion

}

function buildTypes(spec) {
  var typeFields = {}
  Object.keys(spec).forEach(tag => {
    let tagSpec = spec[tag]
    let tagTypeSpec = {}
    tagSpec.forEach(([fieldName, fieldType]) =>
      tagTypeSpec[fieldName] = fieldType
    )
    typeFields[tag] = Type.object(tagTypeSpec)
  })
  return typeFields
}
