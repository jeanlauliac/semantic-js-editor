import Immutable from 'immutable'
import Node from './Node'

/**
 * A fragment is a piece of code that hasn't been parsed yet.
 */
export default class Fragment extends Node({
  content: null,
}) {}
