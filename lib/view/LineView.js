import React from 'react'
import Node from '../ast/Node'
import BinaryOp from '../ast/BinaryOp'
import BinaryOpType from '../ast/BinaryOpType'
import invariant from '../utils/invariant'

var LineView = React.createClass({
  propTypes: {
    line: React.PropTypes.object.isRequired,
  },

  render() {
    var parts = this.props.line.tokens.toSeq().butLast().map((token, i) => {
      return (
        <span key={i} className={token.className}>
          {token.content}
        </span>
      )
    }).toArray()
    return (
      <span>
        {parts}{'\n'}
      </span>
    )
  },

  shouldComponentUpdate(nextProps) {
    return nextProps.line !== this.props.line
  },
})

export default LineView
