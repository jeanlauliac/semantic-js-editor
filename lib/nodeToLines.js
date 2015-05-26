import BinaryOpType from './ast/BinaryOpType'
import Fragment from './Fragment'
import Immutable from 'immutable'
import Line from './Line'
import NodePath from './NodePath'
import PrintContext from './PrintContext'
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
    return Line.flatten([
      hasParentheses ? contentToLines('(', path) : undefined,
      nodeToLines(path.to(path.node.left), leftContext),
      contentToLines(
        ' ' + BinaryOpStrings.get(path.node.type) + ' ',
        path,
        Styles.operator
      ),
      nodeToLines(path.to(path.node.right), rightContext),
      hasParentheses ? contentToLines(')', path) : undefined,
    ]);
  },

  Literal: (path) =>
    contentToLines(path.node.value.toString(), path, Styles.literal),

  Unit: (path, context) =>
    Line.join(path.node.statements.toSeq().map((statement) =>
      nodeToLines(path.to(statement), context)).toArray()),
}

function contentToLines(content, path, className) {
  return [new Line(new Immutable.List([
    new Fragment(content, path, className)
  ]))]
}

export default function nodeToLines(path, context) {
  invariant(path instanceof NodePath, '`path` must be a `NodePath`')
  invariant(context instanceof PrintContext, '`context` must be a `PrintContext`')
  var nodeName = path.node.constructor.name
  invariant(NodeBuilders.hasOwnProperty(nodeName), 'unknown node type')
  return NodeBuilders[nodeName](path, context)
}
