import Token from './Token'
import Immutable from 'immutable'
import invariant from './utils/invariant'

/**
 * A line is a single line of code that could have been generated from
 * several nodes, or only be part of a single node expansion.
 */
export default class Line extends Immutable.Record({
  /**
   * The position of the first token of the line in the whole unit (ie. file).
   */
  index: null,
  /**
   * `Immutable.List<Token>`. Each part of the line.
   */
  tokens: null,
  /**
   * The length of the line, in characters. That includes the termination
   * newline.
   */
  length: null,
}) {
  constructor(tokens, index) {
    invariant(tokens instanceof Immutable.List, 'not an Immutable.List')
    invariant(tokens.every(token => token instanceof Token), 'not a list of Token')
    invariant(typeof index === 'number', '`index` must be a number')
    super({index, tokens, length: tokens.reduce((length, token) =>
      length + token.content.length
    , 0)})
  }
}
