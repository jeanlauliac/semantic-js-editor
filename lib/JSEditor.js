import React from 'react'
import LineView from './view/LineView'
import PrintContext from './PrintContext'
import Unit from './ast/Unit'
import nodeToLines from './nodeToLines'

var Styles = stylify({
  '.root': {
    margin: '1rem auto',
    maxWidth: '32rem',
    fontSize: '1rem',
  },
  '.code': {
    marginLeft: '2rem',
  },
  '.gutter': {
    float: 'left',
    width: '2rem',
  }
})

var JSEditor = React.createClass({
  propTypes: {
    unit: React.PropTypes.instanceOf(Unit),
  },

  render() {
    let lines = nodeToLines(this.props.unit, new PrintContext())
    return (
      <div className={Styles.root}>
        {this._renderGutter(lines)}
        <pre>
          {this._renderLines(lines)}
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

  _renderLines(lines) {
    return lines.map((line, i) =>
      <LineView key={i} line={line} />
    )
  },
})

export default JSEditor
