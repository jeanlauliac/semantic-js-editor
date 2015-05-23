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
        caret: JSEditorStore.getCaret(),
        lines: JSEditorStore.getLines(),
      }
    },
  },

  render() {
    return (
      <JSEditor
        caret={this.state.caret}
        lines={this.state.lines}
      />
    );
  },
})

export default JSEditorContainer
