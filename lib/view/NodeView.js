import React from 'react'
import Node from '../ast/Node'
import BinaryOp from '../ast/BinaryOp'
import BinaryOpType from '../ast/BinaryOpType'
import invariant from '../utils/invariant'

var Styles = stylify({
  '.literal': {
    color: 'red',
  },
})

var BinaryOpStrings = new Map([
  [BinaryOpType.ADD, '+'],
  [BinaryOpType.SUBTRACT, '-'],
  [BinaryOpType.MULTIPLY, '*'],
  [BinaryOpType.DIVIDE, '/'],
  [BinaryOpType.MODULO, '%'],
])

var NodeRenderers = {
  BinaryOp: (node) =>
    <span>
      <NodeView node={node.left} />
      {' ' + BinaryOpStrings.get(node.type) + ' '}
      <NodeView node={node.right} />
    </span>,
  Literal: (node) =>
    <span className={Styles.literal}>{node.value}</span>,
}

var NodeView = React.createClass({
  propTypes: {
    node: React.PropTypes.object.isRequired,
  },

  render() {
    var nodeName = this.props.node.constructor.name
    invariant(NodeRenderers.hasOwnProperty(nodeName), 'unknown node type')
    return NodeRenderers[nodeName](this.props.node)
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.node !== this.props.node
  },
})

export default NodeView
