import React from "react";

import Card from "./Card";

import { AnyAction, Dispatch } from "redux";

import { AppState } from "../types";

import AddButton from "./buttons/AddButton";
import MoveButton from "./buttons/MoveButton";
import RemoveButton from "./buttons/RemoveButton";

import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
import { compose } from "recompose";

import { moveColumn, newCard, removeColumn } from "../actions";

import { Draggable } from "react-beautiful-dnd";

import { withRouter } from "react-router-dom";

import _ from 'lodash';

// interface ColumnProps {
//   column: any;
//   key: any;
//   moveColumn: any;
//   removeColumn: any;
//   newCard: any;
//   children: any;
//   cards: any;
// }

const Column = (props) => {

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
        <MoveButton direction="left" extraClasses="p-2" action={() => props.moveColumn(boardId, column, "left")}/>
        <h2 className="flex-1 p-2 text-lg">{column.title}</h2>
        <RemoveButton action={() => props.removeColumn(boardId, column.id, column.title)}/>
        <MoveButton direction="right" extraClasses="p-2" action={() => props.moveColumn(boardId, column, "right")}/>
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
              )
            })
          : <div>
              <h3>No cards yet</h3>
            </div>
        }
        <AddButton extraClasses="w-full" action={() => props.newCard(column.id, props.location.pathname)}/>
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  moveColumn: (board, column, direction) => dispatch(moveColumn(board, column, direction)),
  newCard: (columnId, boardId) => dispatch(newCard(columnId, boardId)),
  removeColumn: (board, column, name) => dispatch(removeColumn(board, column, name)),
});

const enhance = compose(
  firebaseConnect(() => [
    "cards",
  ]),
  connect(
    (state) => ({
      cards: state.firebase.data.cards,
    }),
    mapDispatchToProps,
  ),
  withRouter
);

export default enhance(Column);
