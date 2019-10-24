import React, { Component } from 'react';

import Column from './Column';

import { connect } from 'react-redux';
import { dropCard } from '../actions';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

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
      <div className="board flex flex-row flex-shrink-0 overflow-x-scroll overflow-y-visible flex-no-wrap">
        { this.props.columns && this.props.columns.length
          ? sortedColumns.map((column, index) => {
              return (
                <Droppable key={index} droppableId={column.id}>
                  {provided => (
                    <div className="column-wrapper w-1/4 mx-2 mt-1 flex-shrink-0 flex-grow-0 overflow-y-scroll pb-10 pt-4" ref={provided.innerRef} {...provided.droppableProps}>
                      <Column key={index} column={column}>
                        {provided.placeholder}
                      </Column>
                    </div>
                  )}
                </Droppable>
              )
            })
          : <div className="w-full h-full flex items-center justify-center">
              <div className="bg-white w-1/3 rounded p-8">
                <h3 className="text-4xl">Welcome to Not Trello</h3>
                <p>
                  This is a side project I built inspired by a rapid-dev test I took.
                  There are so many "Todo App" starters out there, I decided to take one
                  a step further and see if I could put my own spin on it.
                </p>
                <br />
                <p>
                  You can get started by adding some columns. You can also view the project on &nbsp;
                  <a className="text-purple-600" href="https://www.github.com/jjplusplus/not-trello" target="_blank"><FontAwesomeIcon icon={faGithub}/> Github</a>.
                </p>
              </div>
            </div>
        }
      </div>
    </DragDropContext>
  }
}

// passing the entire state
const mapStateToProps = state => ({
  columns: state.columns.columns
})

const mapDispatchToProps = dispatch => ({
  dropCard: (cardId, source, destination) => dispatch(dropCard(cardId, source, destination))
})

export default connect(mapStateToProps, mapDispatchToProps)(Board);
