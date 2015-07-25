import BinaryOpString from './BinaryOpString'
import Node from '../ast/Node'
import Token from '../Token'
import UnaryOpString from './UnaryOpString'
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
      return Node.binaryOp(opType, left, node.right)
    }
  }
  return node
}
