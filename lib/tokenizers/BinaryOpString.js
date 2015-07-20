import BinaryOpType from '../ast/BinaryOpType'
import invariant from '../utils/invariant'

var BinaryOpStringSpecs = [
  ['add', '+'],
  ['subtract', '-'],
  ['multiply', '*'],
  ['divide', '/'],
  ['modulo', '%'],
]

var BinaryOpStrings = new Map(BinaryOpStringSpecs)
var StringToBinaryOps =
  new Map(BinaryOpStringSpecs.map(([k, v]) => [v, k]))

var BinaryOpString = {
  fromOpType: (opType) => {
    invariant(BinaryOpType.has(opType), 'invalid op. type')
    return BinaryOpStrings.get(opType)
  },
  toOpType: (string) => StringToBinaryOps.get(string),
}

export default BinaryOpString
