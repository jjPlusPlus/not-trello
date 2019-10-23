import React, { Component } from 'react';

import Column from './Column';

import { connect } from 'react-redux';
import { newColumn, dropCard } from '../actions';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

function onDragEnd() {

}

class Board extends Component {
  /*
    {
      draggableId,
      type
      reason,
      source: { droppableId, index }
      destination: { droppableId, index }
    }
  */
  onDragEnd = result => {
    this.props.dropCard(result.draggableId, result.source, result.destination);
  }

  render() {
    const sortedColumns = this.props.columns ? this.props.columns.sort((a, b) => a.order > b.order ? 1 : -1) : [];
    return <DragDropContext onDragEnd={this.onDragEnd}>
      <div className="task-board flex flex-row">
        { this.props.columns && this.props.columns.length
          ? sortedColumns.map((column, index) => {
              return (
                <Droppable key={index} droppableId={column.id}>
                  {provided => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Column key={index} column={column}>
                        {provided.placeholder}
                      </Column>
                    </div>
                  )}
                </Droppable>
              )
            })
          : <div>
              <h3>AINT NO COLUMNS YET THO</h3>
            </div>
        }
        <button onClick={this.props.newColumn}>ADD COLUMN</button>
      </div>
    </DragDropContext>
  }
}

// passing the entire state
const mapStateToProps = state => ({
  columns: state.columns.columns
})

const mapDispatchToProps = dispatch => ({
  newColumn: () => dispatch(newColumn()),
  dropCard: (cardId, source, destination) => dispatch(dropCard(cardId, source, destination))
})

export default connect(mapStateToProps, mapDispatchToProps)(Board);
