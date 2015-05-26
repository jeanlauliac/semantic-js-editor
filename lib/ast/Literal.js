import Immutable from 'immutable'
import Node from './Node'
import invariant from '../utils/invariant'

export default class Literal extends Node({
  value: null,
}) {
  constructor(value) {
    invariant(
      value === null ||
      value === undefined ||
      typeof value === 'string' ||
      typeof value === 'number',
      '`Literal.value` must be a valid simple value'
    )
    super({value})
  }
}
