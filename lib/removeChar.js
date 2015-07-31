import Node from './ast/Node'
import TokenGroup from './TokenGroup'
import invariant from './utils/invariant'
import replaceNodeChild from './replaceNodeChild'

/**
 * Removes a single character at the specified position in the specified token
 * group. Returns the resulting new node, of `null` is the `Node` has been
 * totally removed.
 */
export default function removeChar(tokenGroup, index) {
  invariant(tokenGroup instanceof TokenGroup, '`tokenGroup` must be a `TokenGroup`')
  invariant(typeof index === 'number', '`index` must be a number')
  var node = removeFromNode(tokenGroup.node, tokenGroup.elements, index)
  invariant(node === null || Node.TYPE.validate(node) == null, 'char remover must return a `Node`')
  return node
}

function removeFromNode(node, elements, index) {
  let pair = elements.getPair(index)
  let subIndex = index - pair[0]
  if (pair[1] instanceof TokenGroup) {
    return removeFromTokenGroup(node, pair[1], subIndex)
  }
  if (pair[1].removeChar) {
    return pair[1].removeChar(node, subIndex)
  }
  return node
}

function removeFromTokenGroup(node, tokenGroup, index) {
  let oldChild = tokenGroup.node
  let newChild = removeChar(tokenGroup, index)
  return replaceNodeChild(node, oldChild, newChild)
}
