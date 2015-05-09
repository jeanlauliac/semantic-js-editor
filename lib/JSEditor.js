import React from 'react'
import StatementView from './view/NodeView'
import Unit from './ast/Unit'

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
        {this._renderStatements()}
      </pre>
    );
  },

  _renderStatements() {
    return this.props.unit.statements.toSeq().map((statement, i) =>
      <StatementView key={i} node={statement} />
    ).toArray()
  },
})

export default JSEditor
