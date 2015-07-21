import BinaryOp from '../ast/BinaryOp'
import BinaryOpType from '../ast/BinaryOpType'
import React from 'react'
import Node from '../ast/Node'
import invariant from '../utils/invariant'

var Styles = stylify({
  '.literal': {
    color: '#aa2211',
  },
  '.operator': {
    color: 'black',
  },
})

var TokenTypeClasses = new Map([
  ['number', Styles.literal],
  ['operator', Styles.operator],
])

var LineView = React.createClass({
  propTypes: {
    line: React.PropTypes.object.isRequired,
  },

  render() {
    var parts = this.props.line.tokens.toSeq().butLast().map((token, i) => {
      let className = TokenTypeClasses.get(token.type)
      return (
        <span key={i} className={className}>
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
