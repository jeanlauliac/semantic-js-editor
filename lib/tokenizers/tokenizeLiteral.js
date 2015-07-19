import BinaryOp from '../ast/BinaryOp'
import BinaryOpString from './BinaryOpString'
import Literal from '../ast/Literal'
import Token from '../Token'
import TokenType from '../TokenType'
import invariant from '../utils/invariant'

export default function tokenizeLiteral(node, context, tokenize) {
  if (typeof node.value === 'number') {
    return [
      new Token(node.value.toString(), node, TokenType.NUMBER, insertChar, removeChar)
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
    return new Literal(
      parseFloat(left + character + right)
    )
  }
  let opType = BinaryOpString.toOpType(character)
  if (
    opType != null &&
    left.length > 0 &&
    right.length > 0
  ) {
    return new BinaryOp({
      left: new Literal(parseFloat(left)),
      right: new Literal(parseFloat(right)),
      type: opType,
    })
  }
  return node
}

function removeChar(node, index) {
  let left = this.content.substr(0, index)
  let right = this.content.substr(index + 1)
  if (left === '' && right === '') {
    return null
  }
  return new Literal(parseFloat(left + right))
}
