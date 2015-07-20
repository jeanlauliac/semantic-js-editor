import UnaryOpType from '../ast/UnaryOpType'
import invariant from '../utils/invariant'

var UnaryOpStringSpecs = [
  ['bitwiseNot', '~'],
  ['decrement', '--'],
  ['delete', 'delete'],
  ['increment', '++'],
  ['logicalNot', '!'],
  ['negation', '-'],
  ['plus', '+'],
  ['typeof', 'typeof'],
  ['void', 'void'],
]

var UnaryOpStrings = new Map(UnaryOpStringSpecs)
var StringToUnaryOps =
  new Map(UnaryOpStringSpecs.map(([k, v]) => [v, k]))

export default {
  fromOpType: opType => {
    invariant(UnaryOpType.has(opType), 'invalid unary op. type')
    return UnaryOpStrings.get(opType)
  },
  toOpType: string => StringToUnaryOps.get(string),
}
