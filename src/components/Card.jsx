import React from 'react';

import RemoveButton from './buttons/RemoveButton';
import MoveButton from './buttons/MoveButton';

import { connect } from 'react-redux';
import { removeCard } from '../actions';

function Card(props) {
  const { card } = props;
  return <div className="card">
    <h3 className="card--title">{card.name}</h3>
    <RemoveButton />
    <p className="card-shortdescription">{card.shortdescription}</p>
    <MoveButton direction="left" />
    <MoveButton direction="right" />
  </div>
}

// passing the entire state
const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  removeCard: (card) => dispatch(removeCard(card))
})

export default connect(mapStateToProps, mapDispatchToProps)(Card);
