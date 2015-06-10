import BinaryOpType from './ast/BinaryOpType'
import Immutable from 'immutable'
import Line from './Line'
import NodePath from './NodePath'
import TokenizerContext from './TokenizerContext'
import Token from './Token'
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
  BinaryOp: (path, context) => {
    let leftContext =
      context.set('precedenceLevel', BinaryOpPrecedence.get(path.node.type))
    let rightContext = leftContext
    let hasParentheses =
      BinaryOpPrecedence.get(path.node.type) < context.precedenceLevel
    return [
      hasParentheses ? new Token('(', path, Styles.operator) : undefined,
      // TODO: instead of calling the function, return placeholders (ex.
      // just like React Components). This will enable doing efficient
      // memoization of the lines.
      tokenize(path.to(path.node.left), leftContext),
      new Token(
        ' ' + BinaryOpStrings.get(path.node.type) + ' ',
        path,
        Styles.operator
      ),
      tokenize(path.to(path.node.right), rightContext),
      hasParentheses ? new Token(')', path, Styles.operator) : undefined,
    ];
  },

  Literal: (path) =>
    [new Token(path.node.value.toString(), path, Styles.literal)],

  Unit: (path, context) =>
    path.node.statements.toSeq().map(statement =>
      tokenize(path.to(statement), context).concat([new Token('\n', path)])
    ).toArray(),
}

/**
 * Takes a node path and convert it to a list of tokens.
 */
function tokenize(path, context) {
  invariant(path instanceof NodePath, '`path` must be a `NodePath`')
  invariant(context instanceof TokenizerContext, '`context` must be a `PrintContext`')
  var nodeName = path.node.constructor.name
  invariant(NodeBuilders.hasOwnProperty(nodeName), 'unknown node type')
  return new Immutable.List(flatten(
    NodeBuilders[nodeName](path, context).filter(item => item != null)
  ))
}

function flatten(array) {
  var result = []
  array.forEach(item => {
    if (Immutable.List.isList(item)) {
      result = result.concat(item.toArray());
    } else {
      result.push(item)
    }
  })
  return new Immutable.List(result)
}

/**
 * Takes a list of `fragments` and bucket them into separate lines (a list of
 * list of fragments).
 */
function lineifyTokens(tokens) {
  invariant(Immutable.List.isList(tokens), '`tokens` must be an `Immutable.List`')
  invariant(tokens.every(token => token instanceof Token), '`tokens` must contain Token instances')
  var lines = []
  var currentLine = []
  tokens.forEach(token => {
    currentLine.push(token)
    if (token.content === '\n') {
      lines.push(new Line(new Immutable.List(currentLine)))
      currentLine = []
    }
  });
  lines.push(new Line(new Immutable.List(currentLine)))
  return new Immutable.List(lines);
}

/**
 * Takes a node path and expand it into a list of lines.
 */
export default function lineifyNode(path, context) {
  return lineifyTokens(tokenize(path, context))
}
