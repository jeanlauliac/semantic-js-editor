import BinaryOpString from './tokenizers/BinaryOpString'
import Immutable from 'immutable'
import Node from './ast/Node'
import UnaryOpString from './tokenizers/UnaryOpString'
import invariant from './utils/invariant'

export default function replaceNodeChild(node, oldChild, newChild) {
  invariant(ChildrenReplacers.hasOwnProperty(node.tag), 'unknown node tag')
  let newNode = ChildrenReplacers[node.tag](node, oldChild, newChild)
  invariant(Node.TYPE.validate(newNode) == null, 'children replacer must return a `Node`')
  return newNode
}

var ChildrenReplacers = {

  binaryOp: (node, oldChild, newChild) => {
    if (node.left === oldChild && newChild == null) {
      let binaryOpString = BinaryOpString.fromOpType(node.type)
      let opType = UnaryOpString.toOpType(binaryOpString)
      if (opType != null) {
        return Node.unaryOp(opType, node.right)
      }
    }
    return Node.binaryOp(
      node.type,
      node.left === oldChild ? newChild : node.left,
      node.right === oldChild ? newChild : node.right
    )
  },

  unaryOp: (node, oldChild, newChild) => {
    return Node.unaryOp(
      node.type,
      node.right === oldChild ? newChild : node.right
    )
  },

  unit: (node, oldChild, newChild) => {
    return Node.unit(Immutable.List(node.statements.toSeq().map(child =>
      child === oldChild ? newChild : child
    ).filter(child => !!child)))
  },

}
