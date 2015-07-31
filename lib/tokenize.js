import Node from './ast/Node'
import TokenizerContext from './TokenizerContext'
import TokenGroup from './TokenGroup'
import Type from './types/Type'
import invariant from './utils/invariant'
import tokenizeBinaryOp from './tokenizers/tokenizeBinaryOp'
import tokenizeLiteral from './tokenizers/tokenizeLiteral'
import tokenizeUnaryOp from './tokenizers/tokenizeUnaryOp'
import tokenizeUnit from './tokenizers/tokenizeUnit'
import typedFunction from './types/typedFunction'

/**
 * Takes a node and convert it to a token group.
 */
let tokenize = typedFunction([
  ['node', Type.nullable(Node.TYPE)],
  ['context', Type.instanceOf(TokenizerContext)],
], Type.nullable(Type.instanceOf(TokenGroup)), _tokenize)

export default tokenize

function _tokenize(node, context) {
  if (node == null) {
    return null
  }
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
