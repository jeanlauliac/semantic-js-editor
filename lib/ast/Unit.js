import Immutable from 'immutable'
import Node from './Node'

export default class Unit extends Node({
  statements: new Immutable.List(),
}) {
  constructor(statements) {
    super({statements})
  }
}
