import React, { Component } from 'react';

import PropTypes from 'prop-types';

// accepts a field name?
// either renders a text or a
class EditableField extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false
    }
  }

  inputChange = (event) => {
    return this.props.updateInput(event.target.value);
  }

  render() {
    const TagType = `${this.props.element}`;
    const InputType = `${this.props.inputType}`;
    return (
      <div>
        { !this.state.editing ? (
          <TagType onClick={() => this.setState({editing: !this.state.editing})}>
            {this.props.field}
          </TagType>
        ) : (
          <div>
            <InputType value={this.props.field} onChange={(e) => this.inputChange(e)}/>
            <button onClick={() => this.setState({editing: !this.state.editing})}>
              Done Editing
            </button>
          </div>
        )}
      </div>

    )
  }

}

EditableField.propTypes = {
  element: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired
}

export default EditableField;
