import React, { Component } from "react";

import MoveButton from "./buttons/MoveButton";

import { connect } from "react-redux";
import { compose } from "recompose";
import { AnyAction, Dispatch } from "redux";

import { moveCardHorizontal, moveCardVertical, openCard } from "../actions";

import { AppState } from "../types";

import { withRouter } from "react-router-dom";

// interface CardProps {
//   card;
//   // moveCardHorizontal: (card: object, direction: string) => void;
//   // moveCardVertical: (card: object, direction: string) => void;
//   // openCard: (card: object, column: string) => void;
//   moveCardHorizontal;
//   moveCardVertical;
//   openCard;
//   location;
// }

class Card extends Component {

  render() {
    const { card } = this.props;
    const board = this.props.location.pathname.replace("/board/", "");

    return (
      <div className="my-2 bg-white rounded-sm shadow-md flex flex-row">
        <MoveButton
          direction="left"
          extraClasses="p-1 border-r border-gray-300 text-gray-500 hover:bg-teal-100"
          action={() => this.props.moveCardHorizontal(board, card, "left")}
        />
        <div className="flex flex-col min-w-0 w-full">
          <MoveButton
            direction="up"
            extraClasses="p-0 border-b border-gray-300 text-gray-500 hover:bg-teal-100"
            action={() => this.props.moveCardVertical(board, card, "up")}
          />
          <div className="p-1 hover:bg-teal-200" onClick={() => this.props.openCard(board, card.column, card)}>
            <h3 className="text-lg">{card.name}</h3>
            <p className="text-base truncate">{card.description}</p>
          </div>
          <MoveButton
            direction="down"
            extraClasses="p-0 border-t border-gray-300 text-gray-500 hover:bg-teal-100"
            action={() => this.props.moveCardVertical(board, card, "down")}
          />
        </div>
        <MoveButton
          direction="right"
          extraClasses="p-1 border-l border-gray-300 text-gray-500 hover:bg-teal-100"
          action={() => this.props.moveCardHorizontal(board, card, "right")}
        />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  moveCardHorizontal: (board, card, direction) => dispatch(moveCardHorizontal(board, card, direction)),
  moveCardVertical: (board, card, direction) => dispatch(moveCardVertical(board, card, direction)),
  openCard: (board, column, card) => dispatch(openCard(board, column, card)),
});

const enhance = compose(
  connect(null, mapDispatchToProps),
  withRouter,
);

export default enhance(Card);
