import Immutable from 'immutable'
import ImmutableIntervalMap from './utils/ImmutableIntervalMap'
import SyntaxTree from './ast/SyntaxTree'
import Token from './Token'
import invariant from './utils/invariant'

export default class TokenGroup extends Immutable.Record({
  /**
   * The tree that generated this group.
   */
  tree: null,
  /**
   * An interval map associating a local position range to the corresponding
   * token or token group that fits in that position.
   */
  elements: null,
  /**
   * The total length of this group.
   */
  length: null,
}) {
  /**
   * Given a tree and a list of elements (tokens or sub-groups), builds the
   * corresponding token group.
   */
  constructor(tree, elementArray) {
    invariant(SyntaxTree.TYPE.validate(tree) == null, '`tree` must be a SyntaxTree')
    invariant(Array.isArray(elementArray), '`elementArray` must be an array')
    let length = 0
    let elementsSpec = elementArray.map(element => {
      invariant(
        element instanceof Token || element instanceof TokenGroup,
        '`tokenGroup` contains invalid element'
      )
      var pair = [length, element]
      length += element.length
      return pair
    })
    super({
      tree,
      elements: new ImmutableIntervalMap(elementsSpec, (a, b) => a - b),
      length,
    })
  }
}
