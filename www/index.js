import BinaryOp from '../lib/ast/BinaryOp'
import BinaryOpType from '../lib/ast/BinaryOpType'
import Immutable from 'immutable'
import JSEditor from '../lib/JSEditor'
import Literal from '../lib/ast/Literal'
import Unit from '../lib/ast/Unit'
import React from 'react'

stylify({
  'body': {
    fontFamily: "monospace",
    fontSize: '100%',
    lineHeight: '1.6',
    margin: 0,
    padding: 0,
  },
  'pre': {
    lineHeight: '1.6',
  },
  'h1, h2, h3, h4, h5, h6': {
    fontWeight: 'normal',
  },
})

function exampleUnit() {
  return new Unit({
    statements: new Immutable.List([
      new BinaryOp({
        left: new Literal(42),
        right: new BinaryOp({
          left: new Literal(10),
          right: new Literal(32),
          type: BinaryOpType.ADD,
        }),
        type: BinaryOpType.MULTIPLY,
      }),
      new BinaryOp({
        left: new Literal(100),
        right: new Literal(81),
        type: BinaryOpType.SUBTRACT,
      })
    ])
  })
}

;(function main() {
  var root = document.getElementById('root')
  var unit = exampleUnit()
  React.render(<JSEditor unit={unit} />, root)
})()
