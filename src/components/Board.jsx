import React from 'react';

import Column from './Column';
import AddButton from './buttons/AddButton';

import { connect } from 'react-redux';
import { newColumn } from '../actions';

function Board(props) {
  const sortedColumns = props.columns.sort((a, b) => a.order > b.order ? 1 : -1);
  return <div className="task-board flex flex-row">
    { props.columns.length
      ? sortedColumns.map((column, index) => {
          return (
            <Column key={index} column={column}/>
          )
        })
      : <div>
          <h3>AINT NO COLUMNS YET THO</h3>
        </div>
    }
    <button onClick={props.newColumn}>ADD COLUMN</button>
  </div>
}

// passing the entire state
const mapStateToProps = state => ({
  columns: state.columns.columns
})

const mapDispatchToProps = dispatch => ({
  newColumn: () => dispatch(newColumn())
})

export default connect(mapStateToProps, mapDispatchToProps)(Board);
