import BinaryOp from '../ast/BinaryOp'
import BinaryOpString from './BinaryOpString'
import BinaryOpType from '../ast/BinaryOpType'
import Token from '../Token'
import TokenType from '../TokenType'

var BinaryOpPrecedence = new Map([
  [BinaryOpType.ADD, 1],
  [BinaryOpType.SUBTRACT, 1],
  [BinaryOpType.MULTIPLY, 2],
  [BinaryOpType.DIVIDE, 2],
  [BinaryOpType.MODULO, 2],
])

export default function tokenizeBinaryOp(node, context, tokenize) {
  let leftContext =
    context.set('precedenceLevel', BinaryOpPrecedence.get(node.type))
  let rightContext = leftContext
  let hasParentheses =
    BinaryOpPrecedence.get(node.type) < context.precedenceLevel
  let opString = BinaryOpString.fromOpType(node.type)
  return [
    hasParentheses ? new Token('(', node, TokenType.OPERATOR) : undefined,
    // TODO: instead of calling the function, return placeholders (ex.
    // just like React Components). This will enable doing efficient
    // memoization of the lines.
    tokenize(node.left, leftContext),
    new Token(' ', node, TokenType.WHITE_SPACE),
    new Token(opString, node, TokenType.OPERATOR, replaceOperator),
    new Token(' ', node, TokenType.WHITE_SPACE),
    tokenize(node.right, rightContext),
    hasParentheses ? new Token(')', node, TokenType.OPERATOR) : undefined,
  ];
}

function replaceOperator(node, character, index) {
  let op = BinaryOpString.toOpType(character)
  if (op != null) {
    return node.set('type', op)
  }
  return node
}
