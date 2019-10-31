import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface RemoveButtonProps {
  action: any;
}

const RemoveButton: React.SFC<RemoveButtonProps> = (props) => {
  return (
    <button className="px-2 text-red-500" onClick={() => props.action()}>
      <FontAwesomeIcon icon={faTrash}/>
    </button>
  );
}

export default RemoveButton;
