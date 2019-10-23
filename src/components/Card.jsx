import React from 'react';

import RemoveButton from './buttons/RemoveButton';
import MoveButton from './buttons/MoveButton';

import { connect } from 'react-redux';
import { removeCard, moveCardHorizontal, moveCardVertical } from '../actions';

function Card(props) {
  const { card } = props;
  return <div className="card">
    <h3 className="card--title">{card.name}</h3>
    <RemoveButton action={() => props.removeCard(card)}/>
    <p className="card-shortdescription">{card.description}</p>
    <MoveButton direction="left" action={() => props.moveCardHorizontal(card, "left")}/>
    <MoveButton direction="right" action={() => props.moveCardHorizontal(card, "right")}/>
    <MoveButton direction="up" action={() => props.moveCardVertical(card, "up")}/>
    <MoveButton direction="down" action={() => props.moveCardVertical(card, "down")}/>
  </div>
}

// passing the entire state
const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  removeCard: (card) => dispatch(removeCard(card)),
  moveCardHorizontal: (card, direction) => dispatch(moveCardHorizontal(card, direction)),
  moveCardVertical: (card, direction) => dispatch(moveCardVertical(card, direction))
})

export default connect(mapStateToProps, mapDispatchToProps)(Card);
