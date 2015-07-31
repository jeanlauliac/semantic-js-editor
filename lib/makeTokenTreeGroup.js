import ImmutableIntervalMap from './utils/ImmutableIntervalMap'
import SyntaxTree from './ast/SyntaxTree'
import TokenTree from './TokenTree'
import Type from './types/Type'
import typedFunction from './types/typedFunction'

let makeTokenTreeGroup = typedFunction([
  ['syntaxTree', SyntaxTree.TYPE],
  ['elementArray', Type.arrayOf(TokenTree.TYPE)],
], TokenTree.typeOf('group'), _makeTokenTreeGroup)

function _makeTokenTreeGroup(syntaxTree, elementArray) {
  let length = 0
  let elementPairs = elementArray.map(element => {
    var pair = [length, element]
    length += element.tag === 'group' ? element.length : element.content.length
    return pair
  })
  let intervals = new ImmutableIntervalMap(elementPairs, sortNumber)
  return TokenTree.group(syntaxTree, intervals, length)
}

function sortNumber(a, b) {
  return a - b
}

export default makeTokenTreeGroup
