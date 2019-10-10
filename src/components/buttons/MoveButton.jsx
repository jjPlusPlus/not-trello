import React, { Component } from 'react';
import PropTypes from 'prop-types';

class MoveButton extends Component {
  render() {
    const {direction} = this.props;
    return (
      <button className="moveButton">Move {direction}</button>
    )
  }
}

MoveButton.propTypes = {
  direction: PropTypes.string
}

export default MoveButton;
