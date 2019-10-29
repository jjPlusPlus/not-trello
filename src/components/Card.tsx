import React, { Component } from "react";

import MoveButton from "./buttons/MoveButton";

import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";

import { moveCardHorizontal, moveCardVertical, openCard } from "../actions";

import { AppState } from "../types";

interface CardProps {
  card: any;
  // moveCardHorizontal: (card: object, direction: string) => void;
  // moveCardVertical: (card: object, direction: string) => void;
  // openCard: (card: object, column: string) => void;
  moveCardHorizontal: any;
  moveCardVertical: any;
  openCard: any;
}

class Card extends Component<CardProps> {

  public render() {
    const { card } = this.props;
    return (
      <div className="my-2 bg-white rounded-sm shadow-md flex flex-row">
        <MoveButton
          direction="left"
          extraClasses="p-1 border-r border-gray-300 text-gray-500 hover:bg-teal-100"
          action={() => this.props.moveCardHorizontal(card, "left")}
        />
        <div className="flex flex-col min-w-0 w-full">
          <MoveButton
            direction="up"
            extraClasses="p-0 border-b border-gray-300 text-gray-500 hover:bg-teal-100"
          />
          <div className="p-1 hover:bg-teal-200" onClick={() => this.props.openCard(card, card.column)}>
            <h3 className="text-lg">{card.name}</h3>
            <p className="text-base truncate">{card.description}</p>
          </div>
          <MoveButton
            direction="down"
            extraClasses="p-0 border-t border-gray-300 text-gray-500 hover:bg-teal-100"
          />
        </div>
        <MoveButton
          direction="right"
          extraClasses="p-1 border-l border-gray-300 text-gray-500 hover:bg-teal-100"
        />
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  ...state,
});

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  moveCardHorizontal: (card: any, direction: string) => dispatch(moveCardHorizontal(card, direction)),
  moveCardVertical: (card: any, direction: string) => dispatch(moveCardVertical(card, direction)),
  openCard: (card: string, column: string) => dispatch(openCard(card, column)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Card);
