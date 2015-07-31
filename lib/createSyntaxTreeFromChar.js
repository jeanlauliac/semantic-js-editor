import SyntaxTree from './ast/SyntaxTree'
import invariant from './utils/invariant'

/**
 * Given an initial character, creates a tree out of it.
 */
export default function createSyntaxTreeFromChar(character) {
  invariant(typeof character === 'string' && character.length === 1, 'must be a character')
  if (character >= '0' && character <= '9') {
    return SyntaxTree.literal(parseFloat(character))
  }
  return null
}
