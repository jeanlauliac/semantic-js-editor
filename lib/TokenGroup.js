import Immutable from 'immutable'
import ImmutableIntervalMap from './utils/ImmutableIntervalMap'
import Node from './ast/Node'
import Token from './Token'
import invariant from './utils/invariant'

export default class TokenGroup extends Immutable.Record({
  /**
   * The node that generated this group.
   */
  node: null,
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
   * Given a node and a list of elements (tokens or sub-groups), builds the
   * corresponding token group.
   */
  constructor(node, elementArray) {
    invariant(Node.isNode(node), '`node` must be a Node')
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
    });
    super({
      node,
      elements: new ImmutableIntervalMap(elementsSpec, (a, b) => a - b),
      length
    })
  }
}
