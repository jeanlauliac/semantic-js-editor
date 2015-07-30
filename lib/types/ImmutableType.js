import Immutable from 'immutable'
import Type from './Type'

export default {

  listOf(type) {
    return Type(
      `Immutable.List<${type}>`,
      value => {
        if (!Immutable.List.isList(value)) {
          return 'must be a immutable list'
        }
        let reason = value.toSeq().map(e => type.validate(e))
          .filter(e => !!e).first()
        if (reason != null) {
          return 'is a list, each element of which ${reason}'
        }
      }
    )
  },

}
