import Immutable from 'immutable'
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
}) {
  constructor(content, className) {
    invariant(typeof content === 'string', '`Fragment.content` must be a string');
    invariant(!className || typeof className === 'string', '`Fragment.className` must be a string');
    super({content, className});
  }
}
