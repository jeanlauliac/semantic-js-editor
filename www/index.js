import BinaryOp from '../lib/ast/BinaryOp'
import BinaryOpType from '../lib/ast/BinaryOpType'
import Immutable from 'immutable'
import JSEditorContainer from './JSEditorContainer'
import JSEditorStore from './JSEditorStore'
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
  return new Unit(
    new Immutable.List([
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
  )
}

;(function main() {
  let root = document.getElementById('root')
  JSEditorStore.setUnit(exampleUnit())
  document.addEventListener('keydown', (event) => {
    if (event.defaultPrevented) {
      return
    }
    switch (event.keyIdentifier) {
      case 'Right':
        JSEditorStore.moveCaret(0, 1)
        break
      case 'Left':
        JSEditorStore.moveCaret(0, -1)
        break
      case 'Down':
        JSEditorStore.moveCaret(1, 0)
        break
      case 'Up':
        JSEditorStore.moveCaret(-1, 0)
        break
      case 'U+0008':
        JSEditorStore.delete()
        break
      default:
        return
    }
    event.preventDefault()
  }, false)
  document.addEventListener('keypress', (event) => {
    if (event.which) {
      var chr = String.fromCharCode(event.which)
      JSEditorStore.insert(chr)
    }
  }, false)
  React.render(<JSEditorContainer />, root)
})()
