import Immutable from 'immutable'
import extend from 'extend'

var SECRET = Math.floor(Math.random() * 10000)

export default function Node(fields) {
  return new Immutable.Record(extend(
    {__secret: SECRET},
    fields
  ));
}

Node.isNode = function(node) {
  return node && node.__secret === SECRET
}
