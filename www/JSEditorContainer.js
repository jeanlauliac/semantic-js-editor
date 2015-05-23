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
        lines: JSEditorStore.getLines(),
      }
    },
  },

  render() {
    return (
      <JSEditor
        caretState={this.state.caretState}
        lines={this.state.lines}
      />
    );
  },
})

export default JSEditorContainer
