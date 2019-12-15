import React, { Component } from "react";

import MoveButton from "./buttons/MoveButton";

import { connect } from "react-redux";
import { compose } from "recompose";
import { AnyAction, Dispatch } from "redux";

import { moveCardHorizontal, moveCardVertical, openCard } from "../actions";

import { AppState } from "../types";

import { withRouter, useLocation } from "react-router-dom";

import { pathToRegexp } from "path-to-regexp";

interface CardProps {
  card: any;
  location?: any;
  moveCardHorizontal?: (board: string, card: object, direction: string) => void;
  moveCardVertical?: (board: string, card: object, direction: string) => void;
  openCard?: (board: string, column: string, card: any) => void;
}

const Card = (props: CardProps) => {

  const { card } = props;
  let board = "";
  const location = useLocation().pathname;
  const keys: any = [];
  const regex = pathToRegexp("/board/:id", keys);
  const result = regex.exec(location) || [];
  board = result[1];

  if (!board) { return (<div>Board Error: Could not parse Board ID from the Route. </div>); }

  return (
    <div className="my-2 bg-white rounded-sm shadow-md flex flex-row">
      <MoveButton
        direction="left"
        extraClasses="p-1 border-r border-gray-300 text-gray-500 hover:bg-teal-100"
        action={() => props.moveCardHorizontal ? props.moveCardHorizontal(board, card, "left") : () => { return; } }
      />
      <div className="flex flex-col min-w-0 w-full">
        <MoveButton
          direction="up"
          extraClasses="p-0 border-b border-gray-300 text-gray-500 hover:bg-teal-100"
          action={() => props.moveCardVertical ? props.moveCardVertical(board, card, "up") : () => { return; } }
        />
        <div className="p-1 hover:bg-teal-200" onClick={() => props.openCard ? props.openCard(board, card.column, card) : () => { return; } }>
          <h3 className="text-lg">{card.name}</h3>
          <p className="text-base truncate">{card.description}</p>
        </div>
        <MoveButton
          direction="down"
          extraClasses="p-0 border-t border-gray-300 text-gray-500 hover:bg-teal-100"
          action={() => props.moveCardVertical ? props.moveCardVertical(board, card, "down") : () => { return; } }
        />
      </div>
      <MoveButton
        direction="right"
        extraClasses="p-1 border-l border-gray-300 text-gray-500 hover:bg-teal-100"
        action={() => props.moveCardHorizontal ? props.moveCardHorizontal(board, card, "right") : () => { return; } }
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  moveCardHorizontal: (board: string, card: any, direction: string) => dispatch(moveCardHorizontal(board, card, direction)),
  moveCardVertical: (board: string, card: any, direction: string) => dispatch(moveCardVertical(board, card, direction)),
  openCard: (board: string, column: string, card: string) => dispatch(openCard(board, column, card)),
});

const enhance = compose<CardProps, CardProps>(
  connect(null, mapDispatchToProps),
  withRouter,
);

export default enhance(Card);
