import React from 'react';

import Card from './Card';
import MoveButton from './buttons/MoveButton';
import AddButton from './buttons/AddButton';
import RemoveButton from './buttons/RemoveButton';

import { connect } from 'react-redux';
import { newCard, removeColumn, moveColumn } from '../actions';

function Column(props) {
  const { column } = props;

  return <div className="column">
    <header className="column-header">
      <h2 className="column-header--title">{column.title}</h2>
      <MoveButton direction="left" action={() => props.moveColumn(column, "left")}/>
      <MoveButton direction="right" action={() => props.moveColumn(column, "right")}/>
      <RemoveButton action={() => props.removeColumn(column)}/>
    </header>
    <div className="column-body">
      { column.cards
        ? column.cards.map((card, index) => {
            return (
              <Card key={index} card={card}/>
            )
          })
        : <div>
            <h3>No cards yet</h3>
          </div>
      }
      <AddButton action={() => props.newCard(column.id)}/>
    </div>
  </div>;
}

const mapDispatchToProps = dispatch => ({
  newCard: (column) => dispatch(newCard(column)),
  removeColumn: (column) => dispatch(removeColumn(column)),
  moveColumn: (column, direction) => dispatch(moveColumn(column, direction))
})

export default connect(null, mapDispatchToProps)(Column);
