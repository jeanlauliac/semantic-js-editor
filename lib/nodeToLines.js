import BinaryOpType from './ast/BinaryOpType'
import Fragment from './Fragment'
import Immutable from 'immutable'
import Line from './Line'

import invariant from './utils/invariant'

var Styles = stylify({
  '.literal': {
    color: '#aa2211',
  },
  '.operator': {
    color: 'black',
  }
})

var LINE_BREAK = new Line(new Immutable.List([
  new Fragment(''),
  new Fragment(''),
]))

var BinaryOpStrings = new Map([
  [BinaryOpType.ADD, '+'],
  [BinaryOpType.SUBTRACT, '-'],
  [BinaryOpType.MULTIPLY, '*'],
  [BinaryOpType.DIVIDE, '/'],
  [BinaryOpType.MODULO, '%'],
])

var NodeBuilders = {
  BinaryOp: (node) =>
    Line.flatten([
      nodeToLines(node.left),
      contentToLines(
        ' ' + BinaryOpStrings.get(node.type) + ' ',
        Styles.operator
      ),
      nodeToLines(node.right),
    ]),
  Literal: (node) => contentToLines(node.value.toString(), Styles.literal),
  Unit: (node) =>
    Line.flatten(node.statements.toSeq().map((statement) =>
      nodeToLines(statement).concat(LINE_BREAK)).toArray()),
}

function contentToLines(content, className) {
  return [new Line(new Immutable.List([new Fragment(content, className)]))]
}

export default function nodeToLines(node) {
  var nodeName = node.constructor.name
  invariant(NodeBuilders.hasOwnProperty(nodeName), 'unknown node type')
  return NodeBuilders[nodeName](node)
}
