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
  }
})

var JSEditor = React.createClass({
  propTypes: {
    lines: React.PropTypes.array.isRequired,
    caretState: React.PropTypes.object.isRequired,
  },

  render() {
    return (
      <div
        className={Styles.root}>
        {this._renderGutter(this.props.lines)}
        <pre className={Styles.code}>
          {this._renderCaret()}
          {this._renderLines(this.props.lines)}
        </pre>
      </div>
    );
  },

  _renderGutter(lines) {
    var numbers = []
    for(let i = 0; i < lines.length; ++i) {
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

  _renderLines(lines) {
    return lines.map((line, i) => {
      return <LineView key={i + 1} line={line} />
    })
  },
})

export default JSEditor
