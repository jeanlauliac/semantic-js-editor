import BinaryOpType from './ast/BinaryOpType'
import Immutable from 'immutable'
import Line from './Line'
import Node from './ast/Node'
import TokenizerContext from './TokenizerContext'
import Token from './Token'
import TokenGroup from './TokenGroup'
import TokenType from './TokenType'
import invariant from './utils/invariant'
import tokenizeBinaryOp from './tokenizers/tokenizeBinaryOp'

var NodeBuilders = {
  BinaryOp: tokenizeBinaryOp,

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
    NodeBuilders[nodeName](node, context, tokenize)
      .filter(item => item != null)
  )
}
