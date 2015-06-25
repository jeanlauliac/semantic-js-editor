import Immutable from 'immutable'
import Node from './ast/Node'
import invariant from './utils/invariant'

/**
 * A token is a small string resulting from the expansion of some node.
 */
export default class Token extends Immutable.Record({
  /**
   * The content as a string.
   */
  content: null,
  /**
   * The class to be applied to the token.
   */
  className: null,
  /**
   * `NodePath` instance that allows us to find the `Node` that generated this
   * token in the first place.
   */
  path: null,
}) {
  constructor(content, node, className) {
    invariant(typeof content === 'string', '`content` must be a string')
    invariant(content.length > 0, '`content` cannot be empty')
    invariant(Node.isNode(node), '`node` must be a `Node`')
    invariant(!className || typeof className === 'string', '`className` must be a string')
    super({content, className, node})
    Object.defineProperty(this, 'length', {get: () => this.content.length})
  }
}
