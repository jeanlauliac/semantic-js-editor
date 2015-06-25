import BinaryOp from './ast/BinaryOp'
import Immutable from 'immutable'
import Literal from './ast/Literal'
import Node from './ast/Node'
import Token from './Token'
import TokenGroup from './TokenGroup'
import TokenType from './TokenType'
import Unit from './ast/Unit'
import invariant from './utils/invariant'

var CharInserters = {
  BinaryOp: (node, elements, index, character) => {
    let pair = elements.getPair(index)
    if (pair[1] instanceof TokenGroup) {
      var oldNode = pair[1].node
      var newNode = insertChar(pair[1], index - pair[0], character)
      return new BinaryOp({
        left: node.left === oldNode ? newNode : node.left,
        right: node.right === oldNode ? newNode : node.right,
        type: node.type,
      })
    }
    return node
  },

  Literal: (node, elements, index, character) => {
    let token = elements.get(index)
    invariant(token instanceof Token, 'literal should be a token')
    if (
      typeof node.value === 'number' &&
      character >= '0' &&
      character <= '9'
    ) {
      let mult = Math.pow(10, token.length - index)
      let left = Math.floor(node.value / mult) * mult * 10
      let right = node.value % mult
      return new Literal(
        left + mult * (+character) + right
      )
    }
    return node
  },

  Unit: (node, elements, index, character) => {
    let pair = elements.getPair(index)
    if (pair[1] instanceof TokenGroup) {
      var oldNode = pair[1].node
      var newNode = insertChar(pair[1], index - pair[0], character)
      return new Unit(node.statements.map(subNode =>
        subNode === oldNode ? newNode : subNode
      ))
    }
    return node
  },
}

/**
 * Inserts a single character at the specified position in the specified token
 * group. Returns the resulting new node.
 */
export default function insertChar(tokenGroup, index, character) {
  invariant(tokenGroup instanceof TokenGroup, '`tokenGroup` must be a `TokenGroup`')
  invariant(typeof index === 'number', '`index` must be a number')
  invariant(typeof character === 'string', '`character` must be a string')
  var nodeName = tokenGroup.node.constructor.name
  invariant(CharInserters.hasOwnProperty(nodeName), 'unknown node type')
  var node = CharInserters[nodeName]
    (tokenGroup.node, tokenGroup.elements, index, character)
  invariant(Node.isNode(node), 'char inserter must return a `Node`')
  return node
}
