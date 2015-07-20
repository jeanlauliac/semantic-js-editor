import BinaryOp from './ast/BinaryOp'
import BinaryOpString from './tokenizers/BinaryOpString'
import Node from './ast/Node'
import UnaryOp from './ast/UnaryOp'
import UnaryOpString from './tokenizers/UnaryOpString'
import Unit from './ast/Unit'
import invariant from './utils/invariant'

export default function replaceNodeChild(node, oldChild, newChild) {
  var nodeName = node.constructor.name
  invariant(ChildrenReplacers.hasOwnProperty(nodeName), 'unknown node type')
  let newNode = ChildrenReplacers[nodeName](node, oldChild, newChild)
  invariant(Node.isNode(newNode), 'children replacer must return a `Node`')
  return newNode
}

var ChildrenReplacers = {
  BinaryOp: (node, oldChild, newChild) => {
    if (node.left === oldChild && newChild == null) {
      let binaryOpString = BinaryOpString.fromOpType(node.type)
      let opType = UnaryOpString.toOpType(binaryOpString)
      if (opType != null) {
        return new UnaryOp({
          right: node.right,
          type: opType,
        })
      }
    }
    return new BinaryOp({
      left: node.left === oldChild ? newChild : node.left,
      right: node.right === oldChild ? newChild : node.right,
      type: node.type,
    })
  },
  UnaryOp: (node, oldChild, newChild) => {
    return new UnaryOp({
      right: node.right === oldChild ? newChild : node.right,
      type: node.type,
    })
  },
  Unit: (node, oldChild, newChild) => {
    return new Unit(node.statements.map(child =>
      child === oldChild ? newChild : child
    ))
  },
}
