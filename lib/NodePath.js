import Immutable from 'immutable'
import Node from './ast/Node'
import invariant from './utils/invariant'

/**
 * Expresses the path leading from the AST root up to an arbritrary node. This
 * is done by chaining a node to the path of its own parent.
 */
export default class NodePath extends Immutable.Record({
  /**
   * `NodePath` instance that leads to the parent of the `node`. May be `null`,
   * in which case the `node` is the root of the AST.
   */
  parent: null,
  /**
   * The `Node` instance this path leads to.
   */
  node: null,
}) {
  constructor(parent, node) {
    invariant(parent == null || parent instanceof NodePath, '`NodePath.parent` must be a NodePath')
    invariant(Node.isNode(node), '`NodePath.node` must be a Node')
    super({parent, node})
  }

  to(node) {
    return new NodePath(this, node)
  }
}
