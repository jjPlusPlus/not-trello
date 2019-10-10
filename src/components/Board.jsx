import React from 'react';

import Column from './Column';
import AddButton from './buttons/AddButton';

import { connect } from 'react-redux';
import { addColumn } from '../actions';

function Board(props) {
  return <div className="task-board flex flex-row">
    { props.columns
      ? Object.keys(props.columns).map((column, index) => {
          return (
            <Column key={index} column={column}/>
          )
        })
      : <div>
          <h3>AINT NO COLUMNS YET THO</h3>
        </div>
    }
    <button onClick={props.addColumn}>ADD COLUMN</button>
  </div>
}

// passing the entire state
const mapStateToProps = state => ({
  ...state
})


const mapDispatchToProps = dispatch => ({
  addColumn: () => dispatch(addColumn())
})

export default connect(mapStateToProps, mapDispatchToProps)(Board);
