import BinaryOp from './ast/BinaryOp'
import BinaryOpType from './ast/BinaryOpType'
import Immutable from 'immutable'
import Literal from './ast/Literal'
import Node from './ast/Node'
import Token from './Token'
import TokenGroup from './TokenGroup'
import TokenType from './TokenType'
import Unit from './ast/Unit'
import invariant from './utils/invariant'
import replaceNodeChild from './replaceNodeChild'

/**
 * Removes a single character at the specified position in the specified token
 * group. Returns the resulting new node.
 */
export default function removeChar(tokenGroup, index) {
  invariant(tokenGroup instanceof TokenGroup, '`tokenGroup` must be a `TokenGroup`')
  invariant(typeof index === 'number', '`index` must be a number')
  var node = removeFromNode(tokenGroup.node, tokenGroup.elements, index)
  invariant(Node.isNode(node), 'char remover must return a `Node`')
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
