import Immutable from 'immutable'
import Node from './Node'

export default class Literal extends Node({
  value: null,
}) {
  constructor(value) {
    super({value})
  }
}
