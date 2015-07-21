import BinaryOp from '../ast/BinaryOp'
import BinaryOpString from './BinaryOpString'
import UnaryOp from '../ast/UnaryOp'
import UnaryOpString from './UnaryOpString'
import Token from '../Token'
import createNodeFromChar from '../createNodeFromChar'

export default function tokenizeUnaryOp(node, context, tokenize) {
  let opString = UnaryOpString.fromOpType(node.type)
  let isKeyword = opString[0] >= 'a' && opString[0] <= 'z'
  let opTokenType = isKeyword ? 'keyword' : 'operator'
  return [
    new Token(opString, node, opTokenType, insertCharAtOp),
    isKeyword && new Token(' ', node, 'whiteSpace'),
    tokenize(node.right, context),
  ]
}

function insertCharAtOp(node, character, index) {
  if (index > 0) {
    return node
  }
  let unaryOpString = UnaryOpString.fromOpType(node.type)
  let opType = BinaryOpString.toOpType(unaryOpString)
  if (opType != null) {
    let left = createNodeFromChar(character)
    if (left != null) {
      return new BinaryOp({
        left,
        right: node.right,
        type: opType,
      })
    }
  }
  return node
}
