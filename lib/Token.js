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
   * Function that, given a character and position, will return a new node
   * resulting of the insertion of the character into the original one. The
   * original node is the one that generated this token.
   */
  insertChar: null,
  /**
   * `TokenType`, that can be used for example to control the behavior of
   * character insertion.
   */
  type: null,
}) {
  constructor(content, node, type, insertChar) {
    invariant(typeof content === 'string', '`content` must be a string')
    invariant(content.length > 0, '`content` cannot be empty')
    invariant(Node.isNode(node), '`node` must be a `Node`')
    invariant(TokenType.isValid(type), '`type` must be a `TokenType`')
    invariant(!insertChar || typeof insertChar === 'function', '`onInsertChar` must be a function')
    super({content, node, type, insertChar})
    Object.defineProperty(this, 'length', {get: () => this.content.length})
  }
}
