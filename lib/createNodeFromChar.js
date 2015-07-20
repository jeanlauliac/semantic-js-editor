import Literal from './ast/Literal'
import invariant from './utils/invariant'

/**
 * Given an initial character, creates a node out of it.
 */
export default function createNodeFromChar(character) {
  invariant(typeof character === 'string' && character.length === 1, 'must be a character')
  if (character >= '0' && character <= '9') {
    return new Literal(parseFloat(character))
  }
  return null
}
