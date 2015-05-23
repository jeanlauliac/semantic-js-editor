import React from 'react'
import extend from 'extend'

var Caret = React.createClass({
  propTypes: {
    className: React.PropTypes.string.isRequired,
    style: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {visible: true}
  },

  componentDidMount() {
    this._interval = setInterval(() =>
      this.setState({visible: !this.state.visible})
    , 700)
  },

  componentWillUnmount() {
    clearInterval(this._interval)
  },

  render() {
    return (
      <div
        className={this.props.className}
        style={extend(
          this.props.style,
          {visibility: this.state.visible ? 'visible' : 'hidden'}
        )}
      />
    );
  },
})

export default Caret
