import BinaryOpType from './BinaryOpType'
import Immutable from 'immutable'
import Node from './Node'
import invariant from '../utils/invariant'

export default class BinaryOp extends Node({
  left: null,
  right: null,
  type: null,
}) {
  constructor(obj) {
    invariant(obj.left == null || Node.isNode(obj.left), '`BinaryOp.left` must be a `Node`')
    invariant(obj.right == null || Node.isNode(obj.right), '`BinaryOp.right` must be a `Node`')
    invariant(BinaryOpType.has(obj.type), '`BinaryOp.type` must be a `BinaryOpType`')
    super(obj)
  }
}
