import JSEditor from '../lib/JSEditor'
import JSEditorStore from './JSEditorStore'
import React from 'react'

var JSEditorContainer = React.createClass({
  getInitialState() {
    return JSEditorContainer.calculateState()
  },

  componentDidMount() {
    JSEditorStore.on('change', this._onChange)
  },

  _onChange() {
    this.setState(JSEditorContainer.calculateState())
  },

  componentWillUnmount() {
    JSEditorStore.removeListener('change', this._onChange)
  },

  statics: {
    calculateState() {
      return {
        caretState: JSEditorStore.getCaretState(),
        path: JSEditorStore.getPath(),
        lines: JSEditorStore.getLines(),
      }
    },
  },

  render() {
    return (
      <JSEditor
        caretState={this.state.caretState}
        path={this.state.path}
        lines={this.state.lines}
      />
    )
  },
})

export default JSEditorContainer
