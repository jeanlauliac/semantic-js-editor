import BinaryOp from '../ast/BinaryOp'
import BinaryOpString from './BinaryOpString'
import BinaryOpType from '../ast/BinaryOpType'
import Token from '../Token'
import TokenType from '../TokenType'
import createNodeFromChar from '../createNodeFromChar'

export default function tokenizeBinaryOp(node, context, tokenize) {
  let leftContext =
    context.set('precedenceLevel', BinaryOpPrecedence.get(node.type))
  let rightContext = leftContext
  let hasParentheses =
    BinaryOpPrecedence.get(node.type) < context.precedenceLevel
  let opString = BinaryOpString.fromOpType(node.type)
  return [
    hasParentheses ? new Token('(', node, TokenType.OPERATOR) : undefined,
    tokenize(node.left, leftContext),
    node.left != null && new Token(' ', node, TokenType.WHITE_SPACE),
    new Token(opString, node, TokenType.OPERATOR, insertCharAtOperator),
    node.right != null && new Token(' ', node, TokenType.WHITE_SPACE),
    tokenize(node.right, rightContext),
    hasParentheses && new Token(')', node, TokenType.OPERATOR, insertCharAtEnd),
  ];
}

var BinaryOpPrecedence = new Map([
  [BinaryOpType.ADD, 1],
  [BinaryOpType.SUBTRACT, 1],
  [BinaryOpType.MULTIPLY, 2],
  [BinaryOpType.DIVIDE, 2],
  [BinaryOpType.MODULO, 2],
])

function insertCharAtOperator(node, character, index) {
  if (index === 0) {
    let op = BinaryOpString.toOpType(character)
    if (op != null) {
      return node.set('type', op)
    }
  }
  if (index === 0 && node.left == null) {
    return node.set('left', createNodeFromChar(character));
  }
  if (index === 1) {
    return insertCharAtEnd(node, character, 0);
  }
  return node
}

function insertCharAtEnd(node, character, index) {
  if (node.right == null) {
    return node.set('right', createNodeFromChar(character));
  }
  return node
}
