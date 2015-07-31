import Immutable from 'immutable'
import SyntaxTree from './ast/SyntaxTree'
import TokenType from './TokenType'
import invariant from './utils/invariant'

/**
 * A token is a small string resulting from the expansion of some tree.
 */
export default class Token extends Immutable.Record({
  /**
   * The content as a string.
   */
  content: null,
  /**
   * Function that, given a character and position, will return a new tree
   * resulting of the insertion of the character into the original one. The
   * original tree is the one that generated this token.
   */
  insertChar: null,
  /**
   * `SyntaxTree` that generated this token in the first place.
   */
  tree: null,
  /**
   * Function that, given a position, will return a new tree resulting of the
   * removal of the character at this position from the original one.
   */
  removeChar: null,
  /**
   * `TokenType`, that can be used for example to control the behavior of
   * character insertion.
   */
  type: null,
}) {
  constructor(content, tree, type, insertChar, removeChar) {
    invariant(typeof content === 'string', '`content` must be a string')
    invariant(content.length > 0, '`content` cannot be empty')
    invariant(SyntaxTree.TYPE.validate(tree) == null, '`tree` must be a `SyntaxTree`')
    invariant(TokenType.has(type), '`type` must be a `TokenType`')
    invariant(!insertChar || typeof insertChar === 'function', '`insertChar` must be a function')
    invariant(!removeChar || typeof removeChar === 'function', '`removeChar` must be a function')
    super({content, tree, type, insertChar, removeChar})
    Object.defineProperty(this, 'length', {get: () => this.content.length})
  }
}
