import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function RemoveButton(props) {
  return <button className="px-2 text-red-500" onClick={() => props.action()}><FontAwesomeIcon icon={faTrash}/></button>
}

RemoveButton.propTypes = {

}

export default RemoveButton;
