import ImmutableIntervalMap from './utils/ImmutableIntervalMap'
import ImmutableType from './types/ImmutableType'
import SyntaxTree from './ast/SyntaxTree'
import TokenTree from './TokenTree'
import TokenizerContext from './TokenizerContext'
import Type from './types/Type'
import typedFunction from './types/typedFunction'

let makeTokenTreeGroup = typedFunction([
  ['syntaxTree', SyntaxTree.TYPE],
  ['context', Type.instanceOf(TokenizerContext)],
  ['elementArray', Type.arrayOf(TokenTree.TYPE)],
  ['namedChildren', ImmutableType.mapOf(Type.STRING, TokenTree.TYPE)],
], TokenTree.typeOf('group'), _makeTokenTreeGroup)

function _makeTokenTreeGroup(syntaxTree, context, elementArray, namedChildren) {
  let length = 0
  let elementPairs = elementArray.map(element => {
    var pair = [length, element]
    length += element.tag === 'group' ? element.length : element.content.length
    return pair
  })
  let intervals = new ImmutableIntervalMap(elementPairs, sortNumber)
  return TokenTree.group(syntaxTree, context, intervals, length, namedChildren)
}

function sortNumber(a, b) {
  return a - b
}

export default makeTokenTreeGroup
