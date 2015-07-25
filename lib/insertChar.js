import Node from './ast/Node'
import TokenGroup from './TokenGroup'
import invariant from './utils/invariant'
import replaceNodeChild from './replaceNodeChild'

/**
 * Inserts a single character at the specified position in the specified token
 * group. Returns the resulting new node.
 */
export default function insertChar(tokenGroup, character, index) {
  invariant(tokenGroup instanceof TokenGroup, '`tokenGroup` must be a `TokenGroup`')
  invariant(typeof index === 'number', '`index` must be a number')
  invariant(typeof character === 'string', '`character` must be a string')
  var node = insertInNode(tokenGroup.node, tokenGroup.elements, character, index)
  invariant(Node.isValid(node), 'char inserter must return a `Node`')
  return node
}

function insertInNode(node, elements, character, index) {
  let pair = elements.getPair(index)
  let subIndex = index - pair[0]
  if (pair[1] instanceof TokenGroup) {
    return insertInTokenGroup(node, pair[1], character, subIndex)
  }
  if (index > 0) {
    let prevPair = elements.getPair(index - 1)
    if (prevPair[1] instanceof TokenGroup) {
      return insertInTokenGroup(node, prevPair[1], character, index - prevPair[0])
    }
  }
  if (pair[1].insertChar) {
    return pair[1].insertChar(node, character, subIndex)
  }
  return node
}

function insertInTokenGroup(node, tokenGroup, character, index) {
  let oldChild = tokenGroup.node
  let newChild = insertChar(tokenGroup, character, index)
  return replaceNodeChild(node, oldChild, newChild)
}
