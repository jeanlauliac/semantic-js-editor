import Immutable from 'immutable'
import extend from 'extend'

var SECRET = {}

export default function Node(fields) {
  return new Immutable.Record(extend(
    {__secret: SECRET},
    fields
  ));
}

Node.isNode = function(node) {
  return node && node.__secret === SECRET
}
