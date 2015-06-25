import BinaryOpType from './ast/BinaryOpType'
import Immutable from 'immutable'
import Line from './Line'
import Node from './ast/Node'
import TokenizerContext from './TokenizerContext'
import Token from './Token'
import TokenGroup from './TokenGroup'
import TokenType from './TokenType'
import invariant from './utils/invariant'

var BinaryOpStrings = new Map([
  [BinaryOpType.ADD, '+'],
  [BinaryOpType.SUBTRACT, '-'],
  [BinaryOpType.MULTIPLY, '*'],
  [BinaryOpType.DIVIDE, '/'],
  [BinaryOpType.MODULO, '%'],
])

var BinaryOpPrecedence = new Map([
  [BinaryOpType.ADD, 1],
  [BinaryOpType.SUBTRACT, 1],
  [BinaryOpType.MULTIPLY, 2],
  [BinaryOpType.DIVIDE, 2],
  [BinaryOpType.MODULO, 2],
])

var NodeBuilders = {
  BinaryOp: (node, context) => {
    let leftContext =
      context.set('precedenceLevel', BinaryOpPrecedence.get(node.type))
    let rightContext = leftContext
    let hasParentheses =
      BinaryOpPrecedence.get(node.type) < context.precedenceLevel
    return [
      hasParentheses ? new Token('(', node, TokenType.OPERATOR) : undefined,
      // TODO: instead of calling the function, return placeholders (ex.
      // just like React Components). This will enable doing efficient
      // memoization of the lines.
      tokenize(node.left, leftContext),
      new Token(' ', node, TokenType.WHITE_SPACE),
      new Token(BinaryOpStrings.get(node.type), node, TokenType.OPERATOR),
      new Token(' ', node, TokenType.WHITE_SPACE),
      tokenize(node.right, rightContext),
      hasParentheses ? new Token(')', node, TokenType.OPERATOR) : undefined,
    ];
  },

  Literal: (node) => {
    if (typeof node.value === 'number') {
      return [new Token(node.value.toString(), node, TokenType.NUMBER)]
    }
    invariant(false, 'unsupported literal')
  },

  Unit: (node, context) => {
    let elements = []
    node.statements.forEach(statement => {
      elements.push(tokenize(statement, context))
      elements.push(new Token('\n', node, TokenType.WHITE_SPACE))
    })
    return elements
  },
}

/**
 * Takes a node and convert it to a token group.
 */
export default function tokenize(node, context) {
  invariant(Node.isNode(node), '`node` must be a `Node`')
  invariant(context instanceof TokenizerContext, '`context` must be a `TokenizerContext`')
  var nodeName = node.constructor.name
  invariant(NodeBuilders.hasOwnProperty(nodeName), 'unknown node type')
  return new TokenGroup(
    node,
    NodeBuilders[nodeName](node, context).filter(item => item != null)
  )
}
