import BinaryOpString from './BinaryOpString'
import Node from '../ast/Node'
import Token from '../Token'
import createNodeFromChar from '../createNodeFromChar'

export default function tokenizeBinaryOp(node, context, tokenize) {
  let leftContext =
    context.set('precedenceLevel', BinaryOpPrecedence.get(node.type))
  let rightContext = leftContext
  let hasParentheses =
    BinaryOpPrecedence.get(node.type) < context.precedenceLevel
  let opString = BinaryOpString.fromOpType(node.type)
  return [
    hasParentheses ? new Token('(', node, 'operator') : undefined,
    tokenize(node.left, leftContext),
    node.left != null && new Token(' ', node, 'whiteSpace'),
    new Token(opString, node, 'operator', insertCharAtOperator),
    node.right != null && new Token(' ', node, 'whiteSpace'),
    tokenize(node.right, rightContext),
    hasParentheses && new Token(')', node, 'operator', insertCharAtEnd),
  ]
}

var BinaryOpPrecedence = new Map([
  ['add', 1],
  ['subtract', 1],
  ['multiply', 2],
  ['divide', 2],
  ['modulo', 2],
])

function insertCharAtOperator(node, character, index) {
  if (index === 0) {
    let op = BinaryOpString.toOpType(character)
    if (op != null) {
      return node.set('type', op)
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

function insertCharAtEnd(node, character, index) {
  if (node.right == null) {
    return Node({...node, right: createNodeFromChar(character)})
  }
  return node
}
