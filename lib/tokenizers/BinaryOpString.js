import BinaryOpType from '../ast/BinaryOpType'

var BinaryOpStringSpecs = [
  [BinaryOpType.ADD, '+'],
  [BinaryOpType.SUBTRACT, '-'],
  [BinaryOpType.MULTIPLY, '*'],
  [BinaryOpType.DIVIDE, '/'],
  [BinaryOpType.MODULO, '%'],
]

var BinaryOpStrings = new Map(BinaryOpStringSpecs)
var StringToBinaryOps =
  new Map(BinaryOpStringSpecs.map(([k, v]) => [v, k]))

var BinaryOpString = {
  fromOpType: (opType) => BinaryOpStrings.get(opType),
  toOpType: (string) => StringToBinaryOps.get(string),
}

export default BinaryOpString
