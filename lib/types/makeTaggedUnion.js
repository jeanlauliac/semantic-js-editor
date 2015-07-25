import Types from '../types/Types'
import invariant from '../utils/invariant'

/**
 * Given a function `makeSpec(type: object): object` where `type` is the
 * recursive type of the tagged union, and returns a specification; returns a
 * new function that can build a tagged union object corresponding to the spec.
 */
export default function makeTaggedUnion(makeSpec) {

  const SECRET = Object.freeze({})
  const SIMPLE_TYPE = Types.object({__secret: Types.literal(SECRET)})
  const SPEC = makeSpec(SIMPLE_TYPE)
  const FULL_TYPE = Types.taggedUnion(buildType(SPEC))

  var TaggedUnion = function(fields) {
    invariant(FULL_TYPE.validate(fields), 'invalid fields for tagged union')
    var object = {...fields}
    Object.defineProperty(object, '__secret', {value: SECRET})
    return Object.freeze(object)
  }

  TaggedUnion.isValid = function(value) {
    return SIMPLE_TYPE.validate(value)
  }

  forEachField(SPEC, (fieldSpec, tag) => {
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

function buildType(spec) {
  var typeFields = {}
  forEachField(spec, (tagSpec, tag) => {
    let tagTypeSpec = {}
    tagSpec.forEach(([fieldName, fieldType]) =>
      tagTypeSpec[fieldName] = fieldType
    )
    typeFields[tag] = Types.object(tagTypeSpec)
  })
  return typeFields
}

function forEachField(obj, callback) {
  for (name in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, name)) {
      if (callback(obj[name], name) === false) {
        return
      }
    }
  }
}
