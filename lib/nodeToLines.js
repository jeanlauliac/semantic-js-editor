import BinaryOpType from './ast/BinaryOpType'
import Fragment from './Fragment'
import Immutable from 'immutable'
import Line from './Line'
import Node from './ast/Node'
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
  BinaryOp: (node, context) => {
    let leftContext =
      context.set('precedenceLevel', BinaryOpPrecedence.get(node.type))
    let rightContext = leftContext
    let hasParentheses =
      BinaryOpPrecedence.get(node.type) < context.precedenceLevel
    return Line.flatten([
      hasParentheses ? contentToLines('(') : undefined,
      nodeToLines(node.left, leftContext),
      contentToLines(
        ' ' + BinaryOpStrings.get(node.type) + ' ',
        Styles.operator
      ),
      nodeToLines(node.right, rightContext),
      hasParentheses ? contentToLines(')') : undefined,
    ]);
  },

  Literal: (node) => contentToLines(node.value.toString(), Styles.literal),

  Unit: (node, context) =>
    Line.join(node.statements.toSeq().map((statement) =>
      nodeToLines(statement, context)).toArray()),
}

function contentToLines(content, className) {
  return [new Line(new Immutable.List([new Fragment(content, className)]))]
}

export default function nodeToLines(node, context) {
  invariant(Node.isNode(node), '`node` must be a Node')
  invariant(context instanceof PrintContext, '`context` must be a PrintContext')
  var nodeName = node.constructor.name
  invariant(NodeBuilders.hasOwnProperty(nodeName), 'unknown node type')
  return NodeBuilders[nodeName](node, context)
}
