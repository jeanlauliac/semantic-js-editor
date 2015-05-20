import React from 'react'
import LineView from './view/LineView'
import Unit from './ast/Unit'
import nodeToLines from './nodeToLines'

var Styles = stylify({
  '.root': {
    margin: '0 auto',
    maxWidth: '32rem',
  },
})

var JSEditor = React.createClass({
  propTypes: {
    unit: React.PropTypes.instanceOf(Unit),
  },

  render() {
    return (
      <pre className={Styles.root}>
        {this._renderLines()}
      </pre>
    );
  },

  _renderLines() {
    return nodeToLines(this.props.unit).map((line, i) =>
      <LineView key={i} line={line} />
    )
  },
})

export default JSEditor
