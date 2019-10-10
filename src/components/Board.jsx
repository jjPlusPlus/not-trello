import React, { Component } from 'react';

import Column from './Column';
import AddButton from './buttons/AddButton';

import { connect } from 'react-redux';
import { addColumn } from '../actions';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    return (
      <div className="task-board flex flex-row">
        { this.props.columns
          ? Object.keys(this.props.columns).map((column, index) => {
              return (
                <Column key={index} column={column}/>
              )
            })
          : <div>
              <h3>AINT NO COLUMNS YET THO</h3>
            </div>
        }
        <button onClick={this.props.addColumn}>ADD COLUMN</button>
      </div>
    )
  }
}

// passing the entire state
const mapStateToProps = state => ({
  ...state
})


const mapDispatchToProps = dispatch => ({
  addColumn: () => dispatch(addColumn())
})

export default connect(mapStateToProps, mapDispatchToProps)(Board);
