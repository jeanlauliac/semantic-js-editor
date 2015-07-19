import BinaryOp from './ast/BinaryOp'
import Node from './ast/Node'
import invariant from './utils/invariant'
import Unit from './ast/Unit'

export default function replaceNodeChild(node, oldChild, newChild) {
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
