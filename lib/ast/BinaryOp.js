import BinaryOpType from './BinaryOpType'
import Immutable from 'immutable'
import Node from './Node'
import invariant from '../utils/invariant'

export default class BinaryOp extends Node({
  type: null,
  left: null,
  right: null,
}) {
  constructor(obj) {
    invariant(BinaryOpType.isValid(obj.type), '`BinaryOp.type` must be a `BinaryOpType`')
    invariant(Node.isNode(obj.left), '`BinaryOp.left` must be a `Node`')
    invariant(Node.isNode(obj.right), '`BinaryOp.right` must be a `Node`')
    super(obj)
  }
}
