import UnaryOpType from './UnaryOpType'
import Immutable from 'immutable'
import Node from './Node'
import invariant from '../utils/invariant'

export default class UnaryOp extends Node({
  right: null,
  type: null,
}) {
  constructor(obj) {
    invariant(obj.right == null || Node.isNode(obj.right), '`UnaryOp.right` must be a `Node`')
    invariant(UnaryOpType.has(obj.type), '`UnaryOp.type` must be a `UnaryOpType`')
    super(obj)
  }
}
