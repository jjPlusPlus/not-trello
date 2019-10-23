import React, { Component } from 'react';

import Card from './Card';
import MoveButton from './buttons/MoveButton';
import AddButton from './buttons/AddButton';
import RemoveButton from './buttons/RemoveButton';

import { connect } from 'react-redux';
import { newCard, removeColumn, moveColumn } from '../actions';

import { Draggable } from 'react-beautiful-dnd';

class Column extends Component {
  render() {
    const { column } = this.props;
    return (
      <div className="column">
        <header className="column-header">
          <h2 className="column-header--title">{column.title}</h2>
          <MoveButton direction="left" action={() => this.props.moveColumn(column, "left")}/>
          <MoveButton direction="right" action={() => this.props.moveColumn(column, "right")}/>
          <RemoveButton action={() => this.props.removeColumn(column)}/>
        </header>

        <div className="column-body">
          { column.cards
            ? column.cards.map((card, index) => {
                return (
                  <Draggable key={index} index={index} draggableId={card.id}>
                    {provided => (
                      <div ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card key={index} card={card} />
                      </div>
                    )}
                  </Draggable>
                )
              })
            : <div>
                <h3>No cards yet</h3>
              </div>
          }
          <AddButton action={() => this.props.newCard(column.id)}/>
        </div>

      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  newCard: (column) => dispatch(newCard(column)),
  removeColumn: (column) => dispatch(removeColumn(column)),
  moveColumn: (column, direction) => dispatch(moveColumn(column, direction))
})

export default connect(null, mapDispatchToProps)(Column);
