import BinaryOpString from './BinaryOpString'
import Node from '../ast/Node'
import Token from '../Token'
import UnaryOpString from './UnaryOpString'
import createNodeFromChar from '../createNodeFromChar'

export default function tokenizeUnaryOp(node, context, tokenize) {
  var precedence = UnaryOpPrecedence.get(node.type)
  let hasParentheses = precedence < context.precedenceLevel
  let rightContext = context.set('precedenceLevel', precedence)
  let opString = UnaryOpString.fromOpType(node.type)
  let isKeyword = opString[0] >= 'a' && opString[0] <= 'z'
  let opTokenType = isKeyword ? 'keyword' : 'operator'
  return [
    hasParentheses ? new Token('(', node, 'operator') : undefined,
    new Token(opString, node, opTokenType, insertCharAtOp, removeOperator),
    isKeyword && new Token(' ', node, 'whiteSpace'),
    tokenize(node.right, context),
    hasParentheses && new Token(')', node, 'operator', insertCharAtEnd),
  ]
}

// Matches https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
var UnaryOpPrecedence = new Map([
  ['delete', 15],
  ['negate', 15],
  ['plus', 15],
  ['typeof', 15],
  ['void', 15],
])

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

function removeOperator(node, index) {
  if (index !== 0) {
    return node
  }
  return node.right
}
