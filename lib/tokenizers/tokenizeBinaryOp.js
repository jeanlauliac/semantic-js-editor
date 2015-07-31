import BinaryOpString from './BinaryOpString'
import SyntaxTree from '../ast/SyntaxTree'
import Token from '../Token'
import createSyntaxTreeFromChar from '../createSyntaxTreeFromChar'

export default function tokenizeBinaryOp(tree, context, tokenize) {
  var precedence = BinaryOpPrecedence.get(tree.type)
  let hasParentheses = precedence < context.precedenceLevel
  let leftContext = context.set('precedenceLevel', precedence)
  let rightContext = context.set('precedenceLevel', precedence + 1)
  let opString = BinaryOpString.fromOpType(tree.type)
  return [
    hasParentheses ? new Token('(', tree, 'operator') : undefined,
    tokenize(tree.left, leftContext),
    tree.left != null && new Token(' ', tree, 'whiteSpace'),
    new Token(opString, tree, 'operator', insertCharAtOperator, removeOperator),
    tree.right != null && new Token(' ', tree, 'whiteSpace'),
    tokenize(tree.right, rightContext),
    hasParentheses && new Token(')', tree, 'operator', insertCharAtEnd),
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

function insertCharAtOperator(tree, character, index) {
  if (index === 0) {
    let op = BinaryOpString.toOpType(character)
    if (op != null) {
      return SyntaxTree({...tree, type: op})
    }
  }
  if (index === 0 && tree.left == null) {
    return SyntaxTree({...tree, left: createSyntaxTreeFromChar(character)})
  }
  if (index === 1) {
    return insertCharAtEnd(tree, character, 0)
  }
  return tree
}

function removeOperator(tree, index) {
  if (index !== 0) {
    return tree
  }
  if (tree.right == null) {
    return tree.left
  }
  if (tree.left == null) {
    return tree.right
  }
  return tree
}

function insertCharAtEnd(tree, character, index) {
  if (tree.right == null) {
    return SyntaxTree({...tree, right: createSyntaxTreeFromChar(character)})
  }
  return tree
}
