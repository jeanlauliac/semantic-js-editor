import Examples from './Examples'
import JSEditorContainer from './JSEditorContainer'
import JSEditorStore from './JSEditorStore'
import React from 'react'

stylify({
  'body': {
    fontFamily: 'monospace',
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

;(function main() {
  let root = document.getElementById('root')
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
  JSEditorStore.setUnit(Examples.empty)
  React.render(<JSEditorContainer />, root)
})()
