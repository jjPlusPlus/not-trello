import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function MoveButton(props) {
  const { direction } = props;
  let icon;
  switch (direction) {
    case "left":
      icon = faChevronLeft;
      break;
    case "right":
      icon = faChevronRight;
      break;
    case "up":
      icon = faChevronUp;
      break;
    case "down":
      icon = faChevronDown;
      break;
    default:
      icon = faChevronRight;
  }
  return (
    <button className={"moveButton " + props.extraClasses} onClick={() => props.action()}>
      <FontAwesomeIcon icon={icon}/>
    </button>
  )
}

MoveButton.propTypes = {
  direction: PropTypes.string
}

export default MoveButton;
