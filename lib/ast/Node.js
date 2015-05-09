import Immutable from 'immutable'
import extend from 'extend'

export default function Node(fields) {
  return new Immutable.Record(extend(
    {},
    fields
  ));
}
