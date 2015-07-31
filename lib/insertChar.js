import ImmutableIntervalMap from './utils/ImmutableIntervalMap'
import SyntaxTree from './ast/SyntaxTree'
import Type from './types/Type'
import replaceSyntaxTreeChild from './replaceSyntaxTreeChild'
import typedFunction from './types/typedFunction'

/**
 * Given the token intervals, returns a new syntax tree resulting from
 * inserting a single character at the specified position in the intervals.
 */
let insertChar = typedFunction([
  ['tokenIntervals', Type.instanceOf(ImmutableIntervalMap)],
  ['syntaxTree', SyntaxTree.TYPE],
  ['character', Type.STRING],
  ['index', Type.NUMBER],
], SyntaxTree.TYPE, _insertChar)

export default insertChar

function _insertChar(tokenIntervals, syntaxTree, character, index) {
  let pair = tokenIntervals.getPair(index)
  let subIndex = index - pair[0]
  if (pair[1].tag === 'group') {
    return insertInTokenGroup(pair[1], syntaxTree, character, subIndex)
  }
  if (index > 0) {
    let prevPair = tokenIntervals.getPair(index - 1)
    if (prevPair[1].tag === 'group') {
      return insertInTokenGroup(prevPair[1], syntaxTree, character, index - prevPair[0])
    }
  }
  if (pair[1].insertChar) {
    return pair[1].insertChar(syntaxTree, character, subIndex)
  }
  return syntaxTree
}

function insertInTokenGroup(tokenGroup, syntaxTree, character, index) {
  let oldChild = tokenGroup.syntaxTree
  let intervals = tokenGroup.intervals
  let newChild = insertChar(intervals, oldChild, character, index)
  return replaceSyntaxTreeChild(syntaxTree, oldChild, newChild)
}
