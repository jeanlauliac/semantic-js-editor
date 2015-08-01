import Immutable from 'immutable'
import Type from './Type'

export default {

  listOf(type) {
    return Type(
      `Immutable.List<${type}>`,
      value => {
        if (!Immutable.List.isList(value)) {
          return 'must be an immutable list'
        }
        let reason = value.toSeq().map(e => type.validate(e))
          .filter(e => !!e).first()
        if (reason != null) {
          return 'is a list, each element of which ${reason}'
        }
      }
    )
  },

  mapOf(keyType, valueType) {
    return Type(
      `Immutable.Map<${keyType}, ${valueType}>`,
      value => {
        if (!Immutable.Map.isMap(value)) {
          return 'must be an immutable map'
        }
        let reason = value.entrySeq().map(([k, v]) =>
          [keyType.validate(k), valueType.validate(v)])
          .filter(e => e.k || e.v).first()
        if (reason != null) {
          if (reason[0]) {
            return 'is a map, each key of which ${reason}'
          }
          if (reason[1]) {
            return 'is a map, each value of which ${reason}'
          }
        }
      }
    )
  }

}
