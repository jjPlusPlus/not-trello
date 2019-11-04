import React from "react";

interface AddButtonProps {
  action: any;
  extraClasses: string;
}

function AddButton(props: AddButtonProps) {
  return <button className={"add-button " + props.extraClasses} onClick={() => props.action()}>Add +</button>;
}

export default AddButton;
