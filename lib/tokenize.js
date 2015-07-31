import SyntaxTree from './ast/SyntaxTree'
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
 * Takes a tree and convert it to a token group.
 */
let tokenize = typedFunction([
  ['tree', Type.nullable(SyntaxTree.TYPE)],
  ['context', Type.instanceOf(TokenizerContext)],
], Type.nullable(Type.instanceOf(TokenGroup)), _tokenize)

export default tokenize

function _tokenize(tree, context) {
  if (tree == null) {
    return null
  }
  invariant(SyntaxTreeBuilders.hasOwnProperty(tree.tag), 'unknown tree tag')
  return new TokenGroup(
    tree,
    SyntaxTreeBuilders[tree.tag](tree, context, tokenize)
      .filter(item => !!item)
  )
}

var SyntaxTreeBuilders = {
  binaryOp: tokenizeBinaryOp,
  literal: tokenizeLiteral,
  unaryOp: tokenizeUnaryOp,
  unit: tokenizeUnit,
}
