import React from 'react';
import PropTypes from 'prop-types';

function RemoveButton(props) {
  return <button className="remove-button" onClick={() => props.action()}>Remove</button>
}

RemoveButton.propTypes = {

}

export default RemoveButton;
