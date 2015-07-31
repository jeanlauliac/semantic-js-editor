import SyntaxTree from './ast/SyntaxTree'
import TokenGroup from './TokenGroup'
import invariant from './utils/invariant'
import replaceSyntaxTreeChild from './replaceSyntaxTreeChild'

/**
 * Removes a single character at the specified position in the specified token
 * group. Returns the resulting new tree, of `null` is the `SyntaxTree` has been
 * totally removed.
 */
export default function removeChar(tokenGroup, index) {
  invariant(tokenGroup instanceof TokenGroup, '`tokenGroup` must be a `TokenGroup`')
  invariant(typeof index === 'number', '`index` must be a number')
  var tree = removeFromSyntaxTree(tokenGroup.tree, tokenGroup.elements, index)
  invariant(tree === null || SyntaxTree.TYPE.validate(tree) == null, 'char remover must return a `SyntaxTree`')
  return tree
}

function removeFromSyntaxTree(tree, elements, index) {
  let pair = elements.getPair(index)
  let subIndex = index - pair[0]
  if (pair[1] instanceof TokenGroup) {
    return removeFromTokenGroup(tree, pair[1], subIndex)
  }
  if (pair[1].removeChar) {
    return pair[1].removeChar(tree, subIndex)
  }
  return tree
}

function removeFromTokenGroup(tree, tokenGroup, index) {
  let oldChild = tokenGroup.tree
  let newChild = removeChar(tokenGroup, index)
  return replaceSyntaxTreeChild(tree, oldChild, newChild)
}
