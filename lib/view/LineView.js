import React from 'react'
import Node from '../ast/Node'
import BinaryOp from '../ast/BinaryOp'
import BinaryOpType from '../ast/BinaryOpType'
import invariant from '../utils/invariant'

var LineView = React.createClass({
  propTypes: {
    line: React.PropTypes.object.isRequired,
    index: React.PropTypes.number.isRequired,
  },

  render() {
    var parts = this.props.line.fragments.map((fragment, i) => {
      return (
        <span key={i} className={fragment.className}>
          {fragment.content}
        </span>
      )
    })
    return (
      <span>
        <span>{this.props.index}</span>
        {parts}{'\n'}
      </span>
    )
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.line !== this.props.line
  },
})

export default LineView
