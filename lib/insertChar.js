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

/**
 * Inserts a single character at the specified position in the specified token
 * group. Returns the resulting new node.
 */
export default function insertChar(tokenGroup, character, index) {
  invariant(tokenGroup instanceof TokenGroup, '`tokenGroup` must be a `TokenGroup`')
  invariant(typeof index === 'number', '`index` must be a number')
  invariant(typeof character === 'string', '`character` must be a string')
  var node = insertInNode(tokenGroup.node, tokenGroup.elements, character, index)
  invariant(Node.isNode(node), 'char inserter must return a `Node`')
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
  var nodeName = node.constructor.name
  invariant(ChildrenReplacers.hasOwnProperty(nodeName), 'unknown node type')
  let newNode = ChildrenReplacers[nodeName](node, oldChild, newChild)
  invariant(Node.isNode(newNode), 'children replacer must return a `Node`')
  return newNode
}

var ChildrenReplacers = {
  BinaryOp: (node, oldChild, newChild) => {
    return new BinaryOp({
      left: node.left === oldChild ? newChild : node.left,
      right: node.right === oldChild ? newChild : node.right,
      type: node.type,
    })
  },

  Literal: node => node,

  Unit: (node, oldChild, newChild) => {
    return new Unit(node.statements.map(child =>
      child === oldChild ? newChild : child
    ))
  },
}
