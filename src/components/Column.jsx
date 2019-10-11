import React from 'react';

import Card from './Card';
import MoveButton from './buttons/MoveButton';
import AddButton from './buttons/AddButton';
import RemoveButton from './buttons/RemoveButton';

import { connect } from 'react-redux';
import { addCard, removeColumn } from '../actions';

function Column(props) {
  const { columns, column, cards } = props;

  // Only cards where the columnID is this column
  // ... Not sure if this is the correct Redux paradigm
  const columnCards = cards.filter((c) => c.column === columns[column].id);

  return <div className="column">
    <header className="column-header">
      <h2 className="column-header--title">{columns[column].title}</h2>
      <MoveButton direction="left" />
      <MoveButton direction="right" />
      <RemoveButton action={() => props.removeColumn(columns[column])}/>
    </header>
    <div className="column-body">
      { cards
        ? columnCards.map((card, index) => {
            return (
              <Card key={index} card={card}/>
            )
          })
        : <div>
            <h3>No cards yet</h3>
          </div>
      }
      <AddButton action={() => props.addCard(columns[column].id)}/>
    </div>
  </div>;
}

// passing the entire state
const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  addCard: (column) => dispatch(addCard(column)),
  removeColumn: (column) => dispatch(removeColumn(column))
})

export default connect(mapStateToProps, mapDispatchToProps)(Column);
