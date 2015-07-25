import Node from './ast/Node'
import invariant from './utils/invariant'

/**
 * Given an initial character, creates a node out of it.
 */
export default function createNodeFromChar(character) {
  invariant(typeof character === 'string' && character.length === 1, 'must be a character')
  if (character >= '0' && character <= '9') {
    return Node.literal(parseFloat(character))
  }
  return null
}
