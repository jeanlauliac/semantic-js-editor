import BinaryOpString from './BinaryOpString'
import SyntaxTree from '../ast/SyntaxTree'
import Token from '../Token'
import UnaryOpString from './UnaryOpString'
import createSyntaxTreeFromChar from '../createSyntaxTreeFromChar'

export default function tokenizeUnaryOp(tree, context, tokenize) {
  var precedence = UnaryOpPrecedence.get(tree.type)
  let hasParentheses = precedence < context.precedenceLevel
  let rightContext = context.set('precedenceLevel', precedence)
  let opString = UnaryOpString.fromOpType(tree.type)
  let isKeyword = opString[0] >= 'a' && opString[0] <= 'z'
  let opTokenType = isKeyword ? 'keyword' : 'operator'
  return [
    hasParentheses ? new Token('(', tree, 'operator') : undefined,
    new Token(opString, tree, opTokenType, insertCharAtOp, removeOperator),
    isKeyword && new Token(' ', tree, 'whiteSpace'),
    tokenize(tree.right, context),
    hasParentheses && new Token(')', tree, 'operator', insertCharAtEnd),
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

function insertCharAtOp(tree, character, index) {
  if (index > 0) {
    return tree
  }
  let unaryOpString = UnaryOpString.fromOpType(tree.type)
  let opType = BinaryOpString.toOpType(unaryOpString)
  if (opType != null) {
    let left = createSyntaxTreeFromChar(character)
    if (left != null) {
      return SyntaxTree.binaryOp(opType, left, tree.right)
    }
  }
  return tree
}

function removeOperator(tree, index) {
  if (index !== 0) {
    return tree
  }
  return tree.right
}
