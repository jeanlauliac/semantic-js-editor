import BinaryOpTypes from '../ast/BinaryOpTypes'
import invariant from '../utils/invariant'

var BinaryOpStringSpecs = [
  ['add', '+'],
  ['divide', '/'],
  ['modulo', '%'],
  ['multiply', '*'],
  ['subtract', '-'],
]

var BinaryOpStrings = new Map(BinaryOpStringSpecs)
var StringToBinaryOps =
  new Map(BinaryOpStringSpecs.map(([k, v]) => [v, k]))

export default {
  fromOpType: opType => {
    invariant(BinaryOpTypes.has(opType), 'invalid op. type')
    return BinaryOpStrings.get(opType)
  },
  toOpType: string => StringToBinaryOps.get(string),
}
