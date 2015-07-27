import Examples from './Examples'
import JSEditor from '../lib/JSEditor'
import JSEditorStore from './JSEditorStore'
import React from 'react'

var Styles = stylify({
  '.header': {
    background: '#eee',
    listStyle: 'none',
    margin: 0,
    padding: '0.5rem',
    li: {
      display: 'inline-block',
      margin: '0 0.8rem',
    },
  },
})

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
      <div>
        <ul className={Styles.header}>
          <li>JS Ed</li>
          {Object.keys(Examples).map(name => {
            return (
              <li key={name}>
                <a href='#' onClick={this._loadExample.bind(this, name)}>
                  {name}
                </a>
              </li>
            )
          })}
        </ul>
        <JSEditor
          caretState={this.state.caretState}
          path={this.state.path}
          lines={this.state.lines}
        />
      </div>
    )
  },

  _loadExample(name) {
    if (Examples[name] != null) {
      JSEditorStore.setUnit(Examples[name])
    }
  },
})

export default JSEditorContainer
