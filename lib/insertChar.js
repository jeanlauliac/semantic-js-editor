import SyntaxTree from './ast/SyntaxTree'
import TokenGroup from './TokenGroup'
import invariant from './utils/invariant'
import replaceSyntaxTreeChild from './replaceSyntaxTreeChild'

/**
 * Inserts a single character at the specified position in the specified token
 * group. Returns the resulting new tree.
 */
export default function insertChar(tokenGroup, character, index) {
  invariant(tokenGroup instanceof TokenGroup, '`tokenGroup` must be a `TokenGroup`')
  invariant(typeof index === 'number', '`index` must be a number')
  invariant(typeof character === 'string', '`character` must be a string')
  var tree = insertInSyntaxTree(tokenGroup.tree, tokenGroup.elements, character, index)
  invariant(SyntaxTree.TYPE.validate(tree) == null, 'char inserter must return a `SyntaxTree`')
  return tree
}

function insertInSyntaxTree(tree, elements, character, index) {
  let pair = elements.getPair(index)
  let subIndex = index - pair[0]
  if (pair[1] instanceof TokenGroup) {
    return insertInTokenGroup(tree, pair[1], character, subIndex)
  }
  if (index > 0) {
    let prevPair = elements.getPair(index - 1)
    if (prevPair[1] instanceof TokenGroup) {
      return insertInTokenGroup(tree, prevPair[1], character, index - prevPair[0])
    }
  }
  if (pair[1].insertChar) {
    return pair[1].insertChar(tree, character, subIndex)
  }
  return tree
}

function insertInTokenGroup(tree, tokenGroup, character, index) {
  let oldChild = tokenGroup.tree
  let newChild = insertChar(tokenGroup, character, index)
  return replaceSyntaxTreeChild(tree, oldChild, newChild)
}
