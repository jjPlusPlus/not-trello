import React, { Component } from 'react';

import MoveButton from './buttons/MoveButton';

import { connect } from 'react-redux';
import { moveCardHorizontal, moveCardVertical, openCard } from '../actions';

class Card extends Component {

  render() {
    const { card } = this.props;
    return (
      <div className="my-2 bg-white rounded-sm shadow-md flex flex-row">
        <MoveButton direction="left" extraClasses="p-1 border-r border-gray-300 text-gray-500 hover:bg-teal-100" action={() => this.props.moveCardHorizontal(card, "left")}/>
        <div className="flex flex-col min-w-0 w-full">
          <MoveButton direction="up" extraClasses="p-0 border-b border-gray-300 text-gray-500 hover:bg-teal-100" action={() => this.props.moveCardVertical(card, "up")}/>
          <div className="p-1 hover:bg-teal-200" onClick={() => this.props.openCard(card, card.column)}>
            <h3 className="text-lg">{card.name}</h3>
            {/*<RemoveButton action={() => this.props.removeCard(card)}/>*/}
            <p className="text-base truncate">{card.description}</p>
          </div>
          <MoveButton direction="down" extraClasses="p-0 border-t border-gray-300 text-gray-500 hover:bg-teal-100" action={() => this.props.moveCardVertical(card, "down")}/>
        </div>
        <MoveButton direction="right" extraClasses="p-1 border-l border-gray-300 text-gray-500 hover:bg-teal-100" action={() => this.props.moveCardHorizontal(card, "right")}/>
      </div>
    )
  }
}

// passing the entire state
const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  moveCardHorizontal: (card, direction) => dispatch(moveCardHorizontal(card, direction)),
  moveCardVertical: (card, direction) => dispatch(moveCardVertical(card, direction)),
  openCard: (card, column) => dispatch(openCard(card, column))
})

export default connect(mapStateToProps, mapDispatchToProps)(Card);
