import BinaryOpString from './tokenizers/BinaryOpString'
import Immutable from 'immutable'
import SyntaxTree from './ast/SyntaxTree'
import UnaryOpString from './tokenizers/UnaryOpString'
import invariant from './utils/invariant'

export default function replaceSyntaxTreeChild(tree, oldChild, newChild) {
  invariant(ChildrenReplacers.hasOwnProperty(tree.tag), 'unknown tree tag')
  let newSyntaxTree = ChildrenReplacers[tree.tag](tree, oldChild, newChild)
  invariant(SyntaxTree.TYPE.validate(newSyntaxTree) == null, 'children replacer must return a `SyntaxTree`')
  return newSyntaxTree
}

var ChildrenReplacers = {

  binaryOp: (tree, oldChild, newChild) => {
    if (tree.left === oldChild && newChild == null) {
      let binaryOpString = BinaryOpString.fromOpType(tree.type)
      let opType = UnaryOpString.toOpType(binaryOpString)
      if (opType != null) {
        return SyntaxTree.unaryOp(opType, tree.right)
      }
    }
    return SyntaxTree.binaryOp(
      tree.type,
      tree.left === oldChild ? newChild : tree.left,
      tree.right === oldChild ? newChild : tree.right
    )
  },

  unaryOp: (tree, oldChild, newChild) => {
    return SyntaxTree.unaryOp(
      tree.type,
      tree.right === oldChild ? newChild : tree.right
    )
  },

  unit: (tree, oldChild, newChild) => {
    return SyntaxTree.unit(Immutable.List(tree.statements.toSeq().map(child =>
      child === oldChild ? newChild : child
    ).filter(child => !!child)))
  },

}
