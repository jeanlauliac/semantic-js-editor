import BinaryOpType from './ast/BinaryOpType'
import Immutable from 'immutable'
import Line from './Line'
import Node from './ast/Node'
import TokenizerContext from './TokenizerContext'
import Token from './Token'
import TokenGroup from './TokenGroup'
import invariant from './utils/invariant'

var Styles = stylify({
  '.literal': {
    color: '#aa2211',
  },
  '.operator': {
    color: 'black',
  }
})

var BinaryOpStrings = new Map([
  [BinaryOpType.ADD, '+'],
  [BinaryOpType.SUBTRACT, '-'],
  [BinaryOpType.MULTIPLY, '*'],
  [BinaryOpType.DIVIDE, '/'],
  [BinaryOpType.MODULO, '%'],
])

var BinaryOpPrecedence = new Map([
  [BinaryOpType.ADD, 1],
  [BinaryOpType.SUBTRACT, 1],
  [BinaryOpType.MULTIPLY, 2],
  [BinaryOpType.DIVIDE, 2],
  [BinaryOpType.MODULO, 2],
])

var NodeBuilders = {
  BinaryOp: (node, context) => {
    let leftContext =
      context.set('precedenceLevel', BinaryOpPrecedence.get(node.type))
    let rightContext = leftContext
    let hasParentheses =
      BinaryOpPrecedence.get(node.type) < context.precedenceLevel
    return [
      hasParentheses ? new Token('(', node, Styles.operator) : undefined,
      // TODO: instead of calling the function, return placeholders (ex.
      // just like React Components). This will enable doing efficient
      // memoization of the lines.
      tokenize(node.left, leftContext),
      new Token(
        ' ' + BinaryOpStrings.get(node.type) + ' ',
        node,
        Styles.operator
      ),
      tokenize(node.right, rightContext),
      hasParentheses ? new Token(')', node, Styles.operator) : undefined,
    ];
  },

  Literal: (node) =>
    [new Token(node.value.toString(), node, Styles.literal)],

  Unit: (node, context) => {
    let elements = []
    node.statements.forEach(statement => {
      elements.push(tokenize(statement, context))
      elements.push(new Token('\n', node))
    })
    return elements
  },
}

/**
 * Takes a node and convert it to a token group.
 */
function tokenize(node, context) {
  invariant(Node.isNode(node), '`node` must be a `Node`')
  invariant(context instanceof TokenizerContext, '`context` must be a `TokenizerContext`')
  var nodeName = node.constructor.name
  invariant(NodeBuilders.hasOwnProperty(nodeName), 'unknown node type')
  return new TokenGroup(
    node,
    NodeBuilders[nodeName](node, context).filter(item => item != null)
  )
}

function flattenTokenGroup(tokenGroup) {
  invariant(tokenGroup instanceof TokenGroup, '`tokenGroup` must be a `TokenGroup`')
  var result = []
  tokenGroup.elements.forEach(pair => {
    if (pair[1] instanceof TokenGroup) {
      result = result.concat(flattenTokenGroup(pair[1]));
    } else {
      invariant(pair[1] instanceof Token, '`tokenGroup` contains invalid element')
      result.push(pair[1])
    }
  })
  return result
}

/**
 * Takes a token group and bucket the tokenss them into separate lines (a list
 * of list of tokens).
 */
function lineifyTokenGroup(tokenGroup) {
  invariant(tokenGroup instanceof TokenGroup, '`tokenGroup` must be a `TokenGroup`')
  var tokens = flattenTokenGroup(tokenGroup)
  var lines = []
  var currentLine = []
  var index = 0
  tokens.forEach(token => {
    currentLine.push(token)
    if (token.content === '\n') {
      let newLine = new Line(new Immutable.List(currentLine), index)
      lines.push(newLine)
      index += newLine.length
      currentLine = []
    }
  });
  invariant(currentLine.length === 0, 'missing newline at the end of tokens')
  return new Immutable.List(lines);
}

/**
 * Takes a node and expand it into a list of lines.
 */
export default function lineifyNode(node, context) {
  return lineifyTokenGroup(tokenize(node, context))
}
