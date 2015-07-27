import Node from './ast/Node'
import TokenizerContext from './TokenizerContext'
import Token from './Token'
import TokenGroup from './TokenGroup'
import invariant from './utils/invariant'
import tokenizeBinaryOp from './tokenizers/tokenizeBinaryOp'
import tokenizeLiteral from './tokenizers/tokenizeLiteral'
import tokenizeUnaryOp from './tokenizers/tokenizeUnaryOp'
import tokenizeUnit from './tokenizers/tokenizeUnit'

/**
 * Takes a node and convert it to a token group.
 */
export default function tokenize(node, context) {
  if (node == null) {
    return null
  }
  invariant(Node.isValid(node), '`node` must be a `Node`')
  invariant(context instanceof TokenizerContext, '`context` must be a `TokenizerContext`')
  invariant(NodeBuilders.hasOwnProperty(node.tag), 'unknown node tag')
  return new TokenGroup(
    node,
    NodeBuilders[node.tag](node, context, tokenize)
      .filter(item => !!item)
  )
}

var NodeBuilders = {
  binaryOp: tokenizeBinaryOp,
  literal: tokenizeLiteral,
  unaryOp: tokenizeUnaryOp,
  unit: tokenizeUnit,
}
