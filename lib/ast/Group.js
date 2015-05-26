import Immutable from 'immutable'
import Node from './Node'
import invariant from '../utils/invariant'

/**
 * A loose group of nodes, that is syntactically invalid JS but should be
 * interpreted as a specific `Node` as soon as possible.
 */
export default class Group extends Node({
  children: null,
}) {
  constructor(children) {
    invariant(
      children instanceof Immutable.List &&
      children.all(child => Node.isNode(child)),
      '`Group.children` must be an `Immutable.List` of `Node`'
    )
    super({children})
  }
}
