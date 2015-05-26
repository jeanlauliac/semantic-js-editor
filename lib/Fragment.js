import Immutable from 'immutable'
import NodePath from './NodePath'
import invariant from './utils/invariant'

/**
 * A fragment is a small string resulting from the expansion of some node.
 */
export default class Fragment extends Immutable.Record({
  /**
   * The content as a string.
   */
  content: null,
  /**
   * The class to be applied on the fragment.
   */
  className: null,
  /**
   * `NodePath` instance that allows us to find the `Node` that generated this
   * fragment in the first place.
   */
  path: null,
}) {
  constructor(content, path, className) {
    invariant(typeof content === 'string', '`Fragment.content` must be a string')
    invariant(content.length > 0, '`Fragment.content` cannot be empty')
    invariant(path instanceof NodePath, '`Fragment.path` must be a `NodePath`')
    invariant(!className || typeof className === 'string', '`Fragment.className` must be a string')
    super({content, className, path})
  }
}
