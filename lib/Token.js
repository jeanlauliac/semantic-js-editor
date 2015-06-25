import Immutable from 'immutable'
import Node from './ast/Node'
import TokenType from './TokenType'
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
   * `NodePath` instance that allows us to find the `Node` that generated this
   * token in the first place.
   */
  path: null,
  /**
   * `TokenType`, that can be used for example to control the behavior of
   * character insertion.
   */
  type: null,
}) {
  constructor(content, node, type) {
    invariant(typeof content === 'string', '`content` must be a string')
    invariant(content.length > 0, '`content` cannot be empty')
    invariant(Node.isNode(node), '`node` must be a `Node`')
    invariant(TokenType.isValid(type), '`type` must be a `TokenType`')
    super({content, node, type})
    Object.defineProperty(this, 'length', {get: () => this.content.length})
  }
}
