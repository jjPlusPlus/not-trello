import React, { Component } from 'react';

import Card from './Card';
import MoveButton from './buttons/MoveButton';
import AddButton from './buttons/AddButton';
import RemoveButton from './buttons/RemoveButton';

import { connect } from 'react-redux';
import { addCard } from '../actions';

class Column extends Component {
  render() {
    const { columns, column, cards } = this.props;

    return (
      <div className="column">
        <header className="column-header">
          <h2 className="column-header--title">{columns[column].title}</h2>
          <MoveButton direction="left" />
          <MoveButton direction="right" />
          <RemoveButton />
        </header>
        <div className="column-body">
          { columns[column].cards
            ? columns[column].cards.map((card, index) => {
                console.log('huhh???');
                return (
                  <Card key={index} card={card}/>
                )
              })
            : <div>
                <h3>AINT NO CARDS YET THO</h3>
              </div>
          }
          <button onClick={() => this.props.addCard(column)}>ADD CARD</button>
        </div>
      </div>
    )
  }
}

// passing the entire state
const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  addCard: (column) => dispatch(addCard(column))
})

export default connect(mapStateToProps, mapDispatchToProps)(Column);
