import Immutable from 'immutable'
import Types from './Types'

export default {

  listOf(type) {
    return Types.where(value => (
      Immutable.List.isList(value) &&
      value.every(element => type.validate(element))
    ))
  },

}
