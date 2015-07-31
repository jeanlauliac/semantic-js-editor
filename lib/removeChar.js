import ImmutableIntervalMap from './utils/ImmutableIntervalMap'
import SyntaxTree from './ast/SyntaxTree'
import invariant from './utils/invariant'
import replaceSyntaxTreeChild from './replaceSyntaxTreeChild'

/**
 * Given the token intervals, returns a new syntax tree resulting from removing
 * a single character at the specified position. It may return `null` when the
 * removal causes the syntax tree to be void.
 */
export default function removeChar(tokenIntervals, syntaxTree, index) {
  invariant(tokenIntervals instanceof ImmutableIntervalMap, '`intervals` must be a `ImmutableIntervalMap`')
  invariant(typeof index === 'number', '`index` must be a number')
  syntaxTree = removeFromSyntaxTree(tokenIntervals, syntaxTree, index)
  invariant(syntaxTree === null || SyntaxTree.TYPE.validate(syntaxTree) == null, 'char remover must return a `SyntaxTree`')
  return syntaxTree
}

function removeFromSyntaxTree(tokenIntervals, syntaxTree, index) {
  let pair = tokenIntervals.getPair(index)
  let subIndex = index - pair[0]
  if (pair[1].tag === 'group') {
    return removeFromTokenGroup(pair[1], syntaxTree, subIndex)
  }
  if (pair[1].removeChar) {
    return pair[1].removeChar(syntaxTree, subIndex)
  }
  return syntaxTree
}

function removeFromTokenGroup(tokenGroup, syntaxTree, index) {
  let oldChild = tokenGroup.syntaxTree
  let newChild = removeChar(tokenGroup.intervals, oldChild, index)
  return replaceSyntaxTreeChild(syntaxTree, oldChild, newChild)
}
