import React from "react";

import Card from "./Card";

import { AnyAction, Dispatch } from "redux";

import { AppState, Column } from "../types";

import AddButton from "./buttons/AddButton";
import MoveButton from "./buttons/MoveButton";
import RemoveButton from "./buttons/RemoveButton";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { compose } from "recompose";

import { moveColumn, newCard, removeColumn } from "../actions";

import { Draggable } from "react-beautiful-dnd";

import { withRouter } from "react-router-dom";

import _ from "lodash";

interface IStateProps {
  column: any;
  key: any;
  children: any;
  cards?: any;
  location?: any;
}
interface IDispatchProps {
  moveColumn?: (board: string, column: string, direction: string) => void | null;
  newCard?: (column: string, board: string) => void | null;
  removeColumn?: (board: string, column: string, title: string) => void | null;
}
type Props = IStateProps & IDispatchProps;

const Column = (props: Props) => {

  const { column } = props;
  const cards = column.cards || {};
  const boardId = props.location.pathname.replace("/board/", "");

  const cardKeys = Object.keys(cards);
  const convertedCards = cardKeys.map((c, index) => {
    const entry = cards[c];
    entry.id = c;
    return entry;
  });

  const sortedCards = _.sortBy(convertedCards, "order");

  return (
    <div className="bg-gray-400">
      <header className="flex flex-row items-center text-white bg-black">
        <MoveButton
          direction="left"
          extraClasses="p-2"
          action={() => props.moveColumn ? props.moveColumn(boardId, column, "left") : () => {return; } }
        />
        <h2 className="flex-1 p-2 text-lg">{column.title}</h2>
        <RemoveButton action={() => props.removeColumn ? props.removeColumn(boardId, column.id, column.title) : () => { return; } }/>
        <MoveButton direction="right" extraClasses="p-2" action={() => props.moveColumn ? props.moveColumn(boardId, column, "right") : () => { return; } }/>
      </header>

      <div className="p-2">
        { column.cards
          ? sortedCards.map((card, index) => {
              return (
                <Draggable key={index} index={index} draggableId={card.id}>
                  {(provided) => (
                    <div ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card key={index} card={card} />
                    </div>
                  )}
                </Draggable>
              );
            })
          : <div>
              <h3>No cards yet</h3>
            </div>
        }
        <AddButton extraClasses="w-full" action={() => props.newCard ? props.newCard(column.id, props.location.pathname) : () => { return; }}/>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  moveColumn: (board: string, column: Column, direction: string) => dispatch(moveColumn(board, column, direction)),
  newCard: (columnId: string, boardId: string) => dispatch(newCard(columnId, boardId)),
  removeColumn: (board: string, column: string, name: string) => dispatch(removeColumn(board, column, name)),
});

const enhance = compose<Props, Props>(
  firebaseConnect(() => [
    "cards",
  ]),
  connect(
    (state: AppState) => ({
      cards: state.firebase.data.cards,
    }),
    mapDispatchToProps,
  ),
  withRouter,
);

export default enhance(Column);