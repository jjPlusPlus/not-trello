import React from 'react';
import PropTypes from 'prop-types';

function MoveButton(props) {
  const { direction } = props;
  return <button className="moveButton" onClick={() => props.action()}>Move {direction}</button>
}

MoveButton.propTypes = {
  direction: PropTypes.string
}

export default MoveButton;
