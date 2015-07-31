import SyntaxTree from './ast/SyntaxTree'
import TokenizerContext from './TokenizerContext'
import TokenTree from './TokenTree'
import Type from './types/Type'
import compactArray from './utils/compactArray'
import invariant from './utils/invariant'
import makeTokenTreeGroup from './makeTokenTreeGroup'
import tokenizeBinaryOp from './tokenizers/tokenizeBinaryOp'
import tokenizeLiteral from './tokenizers/tokenizeLiteral'
import tokenizeUnaryOp from './tokenizers/tokenizeUnaryOp'
import tokenizeUnit from './tokenizers/tokenizeUnit'
import typedFunction from './types/typedFunction'

/**
 * Takes a syntax tree and builds a token tree out of it. A token tree is useful
 * to display the tree in a sensible way to humans. Each group of the token tree
 * matches a sub syntax tree. The leaves of the token tree are tokens, that can
 * be displayed.
 */
let tokenize = typedFunction([
  ['syntaxTree', Type.nullable(SyntaxTree.TYPE)],
  ['context', Type.instanceOf(TokenizerContext)],
], Type.nullable(TokenTree.typeOf('group')), _tokenize)

export default tokenize

function _tokenize(syntaxTree, context) {
  if (syntaxTree == null) {
    return null
  }
  invariant(
    SyntaxTreeBuilders.hasOwnProperty(syntaxTree.tag),
    'don\'t know how to tokenize this syntax tree'
  )
  let tokenizer = SyntaxTreeBuilders[syntaxTree.tag]
  let elements = compactArray(tokenizer(syntaxTree, context, tokenize))
  return makeTokenTreeGroup(syntaxTree, elements)
}

var SyntaxTreeBuilders = {
  binaryOp: tokenizeBinaryOp,
  literal: tokenizeLiteral,
  unaryOp: tokenizeUnaryOp,
  unit: tokenizeUnit,
}
