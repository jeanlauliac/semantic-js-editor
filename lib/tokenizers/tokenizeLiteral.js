import BinaryOpString from './BinaryOpString'
import Node from '../ast/Node'
import Token from '../Token'
import invariant from '../utils/invariant'

export default function tokenizeLiteral(node, context, tokenize) {
  if (typeof node.value === 'number') {
    return [
      new Token(node.value.toString(), node, 'number', insertChar, removeChar),
    ]
  }
  invariant(false, 'unsupported literal')
}

function insertChar(node, character, index) {
  let left = this.content.substr(0, index)
  let right = this.content.substr(index)
  if (
    typeof node.value === 'number' &&
    character >= '0' &&
    character <= '9'
  ) {
    return Node.literal(
      parseFloat(left + character + right)
    )
  }
  let opType = BinaryOpString.toOpType(character)
  if (opType != null) {
    return Node.binaryOp(
      opType,
      left.length === 0 ? null : Node.literal(parseFloat(left)),
      right.length === 0 ? null : Node.literal(parseFloat(right))
    )
  }
  return node
}

function removeChar(node, index) {
  let left = this.content.substr(0, index)
  let right = this.content.substr(index + 1)
  if (left === '' && right === '') {
    return null
  }
  return Node.literal(parseFloat(left + right))
}
