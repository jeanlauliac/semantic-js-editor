import Immutable from 'immutable'

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
    super({content, className});
  }
}
