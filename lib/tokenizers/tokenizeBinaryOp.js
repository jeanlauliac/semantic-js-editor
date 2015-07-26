import BinaryOpString from './BinaryOpString'
import Node from '../ast/Node'
import Token from '../Token'
import createNodeFromChar from '../createNodeFromChar'

export default function tokenizeBinaryOp(node, context, tokenize) {
  var precedence = BinaryOpPrecedence.get(node.type)
  let hasParentheses = precedence < context.precedenceLevel
  let leftContext = context.set('precedenceLevel', precedence)
  let rightContext = context.set('precedenceLevel', precedence + 1)
  let opString = BinaryOpString.fromOpType(node.type)
  return [
    hasParentheses ? new Token('(', node, 'operator') : undefined,
    tokenize(node.left, leftContext),
    node.left != null && new Token(' ', node, 'whiteSpace'),
    new Token(opString, node, 'operator', insertCharAtOperator, removeOperator),
    node.right != null && new Token(' ', node, 'whiteSpace'),
    tokenize(node.right, rightContext),
    hasParentheses && new Token(')', node, 'operator', insertCharAtEnd),
  ]
}

// Matches https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence
var BinaryOpPrecedence = new Map([
  ['add', 13],
  ['divide', 14],
  ['modulo', 14],
  ['multiply', 14],
  ['subtract', 13],
])

function insertCharAtOperator(node, character, index) {
  if (index === 0) {
    let op = BinaryOpString.toOpType(character)
    if (op != null) {
      return Node({...node, type: op})
    }
  }
  if (index === 0 && node.left == null) {
    return Node({...node, left: createNodeFromChar(character)})
  }
  if (index === 1) {
    return insertCharAtEnd(node, character, 0)
  }
  return node
}

function removeOperator(node, index) {
  if (index !== 0) {
    return node
  }
  if (node.right == null) {
    return node.left
  }
  if (node.left == null) {
    return node.right
  }
  return node
}

function insertCharAtEnd(node, character, index) {
  if (node.right == null) {
    return Node({...node, right: createNodeFromChar(character)})
  }
  return node
}
