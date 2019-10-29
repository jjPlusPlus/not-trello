import React, { Component } from "react";

interface EditableFieldProps {
  updateInput: any;
  element: any;
  inputType: any;
  extraClasses: any;
  extraInputClasses: any;
  field: any;
}
interface EditableFieldState {
  editing: boolean;
}

class EditableField extends Component<EditableFieldProps, EditableFieldState> {

  constructor(props: any) {
    super(props);
    this.state = {
      editing: false,
    };
  }

  public inputChange = (event: any) => {
    return this.props.updateInput(event.target.value);
  }

  public render() {
    const TagType = `${this.props.element}`;
    const InputType = `${this.props.inputType}`;
    return (
      <div>
        { !this.state.editing ? (
          <h3 className={this.props.extraClasses} onClick={() => this.setState({editing: !this.state.editing})}>
            {this.props.field}
          </h3>
        ) : (
          <div>
            <input
              className={this.props.extraInputClasses}
              value={this.props.field}
              onChange={(e: any) => this.inputChange(e)}
            />
            <button
              className="rounded-sm bg-teal-500 px-4 py-2 border-teal-100 text-white hover:bg-teal-800"
              onClick={() => this.setState({editing: !this.state.editing})}
            >
              Done Editing
            </button>
          </div>
        )}
      </div>
    );
  }

}

export default EditableField;
