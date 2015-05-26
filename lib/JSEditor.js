import React from 'react'
import LineView from './view/LineView'
import Line from './Line'

var Styles = stylify({
  '.root': {
    margin: '2rem auto',
    maxWidth: '32rem',
    fontSize: '1rem',
  },
  '.code': {
    position: 'relative',
    marginLeft: '2rem',
  },
  '.caret': {
    position: 'absolute',
    width: 0,
    height: '1.4rem',
    borderLeft: '1px solid #111',
  },
  '.gutter': {
    float: 'left',
    width: '2rem',
  },
  '.path': {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    'li': {
      display: 'inline-block',
      margin: '0 .8rem 0 0',
      '&::before': {
        content: '"> "',
      },
    },
  },
})

function flattenPath(path) {
  if (path == null) {
    return []
  }
  return flattenPath(path.parent).concat(path.node)
}

var JSEditor = React.createClass({
  propTypes: {
    caretState: React.PropTypes.object.isRequired,
    lines: React.PropTypes.array.isRequired,
    path: React.PropTypes.object,
  },

  render() {
    return (
      <div
        className={Styles.root}>
        {this._renderPath()}
        <div>
          {this._renderGutter()}
          <pre className={Styles.code}>
            {this._renderCaret()}
            {this._renderLines()}
          </pre>
        </div>
      </div>
    );
  },

  _renderPath() {
    return (
      <ul className={Styles.path}>
        {
          [
            <li key='root'>*</li>
          ].concat(flattenPath(this.props.path).map((node, i) => {
            return <li key={i}>{node.constructor.name}</li>
          }))
        }
      </ul>
    )
  },

  _renderGutter() {
    var numbers = []
    for(let i = 0; i < this.props.lines.length; ++i) {
      numbers.push(<div key={i + 1}>{(i + 1).toString()}</div>)
    }
    return (
      <div className={Styles.gutter}>
        {numbers}
      </div>
    );
  },

  _renderCaret() {
    var state = this.props.caretState
    return (
      <div
        className={Styles.caret}
        style={{
          top: (state.position.line - 1) * 1.6 + 'rem',
          left: (state.position.column - 1) + 'ch',
          visibility: state.visible ? 'visible' : 'hidden',
        }}
      />
    )
  },

  _renderLines() {
    return this.props.lines.map((line, i) => {
      return <LineView key={i + 1} line={line} />
    })
  },
})

export default JSEditor
