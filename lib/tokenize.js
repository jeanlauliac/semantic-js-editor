import Immutable from 'immutable'
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
  ['prevTokenTree', Type.nullable(TokenTree.TYPE)],
], Type.nullable(TokenTree.typeOf('group')), _tokenize)

export default tokenize

function _tokenize(syntaxTree, context, prevTokenTree) {
  if (syntaxTree == null) {
    return null
  }
  if (
    prevTokenTree != null &&
    prevTokenTree.tag === 'group' &&
    prevTokenTree.syntaxTree === syntaxTree &&
    TokenizerContext.areSimilar(prevTokenTree.context, context)
  ) {
    return prevTokenTree
  }
  invariant(
    SyntaxTreeBuilders.hasOwnProperty(syntaxTree.tag),
    'don\'t know how to tokenize this syntax tree'
  )
  let tokenizer = SyntaxTreeBuilders[syntaxTree.tag]
  let namedChildren = Immutable.Map()
  let elements = compactArray(
    tokenizer(syntaxTree, context, (syntaxTree, context, name) => {
      let namedTokenTree
      if (
        name != null &&
        prevTokenTree != null &&
        prevTokenTree.tag === 'group'
      ) {
        namedTokenTree = prevTokenTree.namedChildren.get(name)
      }
      let newNamedTokenTree = tokenize(syntaxTree, context, namedTokenTree)
      if (name != null) {
        namedChildren = namedChildren.set(name, newNamedTokenTree)
      }
      return newNamedTokenTree
    })
  )
  return makeTokenTreeGroup(syntaxTree, context, elements, namedChildren)
}

var SyntaxTreeBuilders = {
  binaryOp: tokenizeBinaryOp,
  literal: tokenizeLiteral,
  unaryOp: tokenizeUnaryOp,
  unit: tokenizeUnit,
}
