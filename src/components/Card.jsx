import React from 'react';

import RemoveButton from './buttons/RemoveButton';
import MoveButton from './buttons/MoveButton';

import { connect } from 'react-redux';
import { removeCard, moveCard } from '../actions';

function Card(props) {
  const { card } = props;
  return <div className="card">
    <h3 className="card--title">{card.name}</h3>
    <RemoveButton action={() => props.removeCard(card)}/>
    <p className="card-shortdescription">{card.shortdescription}</p>
    <MoveButton direction="left" action={() => props.moveCard(card, props.columns, "left")}/>
    <MoveButton direction="right" action={() => props.moveCard(card, props.columns, "right")}/>
  </div>
}

// passing the entire state
const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  removeCard: (card) => dispatch(removeCard(card)),
  moveCard: (card, columns, direction) => dispatch(moveCard(card, columns, direction))
})

export default connect(mapStateToProps, mapDispatchToProps)(Card);
