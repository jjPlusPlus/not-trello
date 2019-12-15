import React, { Component } from "react";

import Column from "./Column";

import { firebaseConnect } from "react-redux-firebase";

import { useLocation } from "react-router-dom";

import { compose } from "recompose";

import { connect } from "react-redux";

import { AnyAction, Dispatch } from "redux";

import { AppState } from "../types";

import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";

import { dropCard, IDragDrop } from "../actions";

import _ from "lodash";

import { pathToRegexp } from "path-to-regexp";

interface IDragResult {
  source: object;
  destination: object;
  draggableId: string;
}

interface IDropCard {
  draggableId: string;
  source: object;
  destination: object;
}

interface IStateProps {
  columns: any;
  boards: any;
  match: any;
  dropCard(id: string, source: object, destination: object, board: string): void;
}
interface IDispatchProps {
  onSomeEvent: () => void;
}

export interface IOwnProps {
  propFromParent: number;
}

type Props = IStateProps & IDispatchProps & IOwnProps;

const Board = (props: IStateProps) => {

  // const boardId = props.match.params.id;
  let boardId = "";
  const location = useLocation().pathname;
  const keys: any = [];
  const regex = pathToRegexp("/board/:id", keys);
  const result = regex.exec(location) || [];
  boardId = result[1];

  if (!boardId) { return ( <div>Board Error: Could not parse Board ID from the Route. </div> ); }

  const boards = props.boards;
  const board = boards[boardId];
  board.columns = board.columns || {}; // null-safe the columns in case there are none

  const onDragEnd = (dragResult: DropResult) => {
    if (!dragResult.destination) {
      return;
    }
    props.dropCard(dragResult.draggableId, dragResult.source, dragResult.destination, boardId);
  };

  const columnKeys = Object.keys(board.columns);
  const convertedColumns = columnKeys.map((col: any, index) => {
    const entry: any = board.columns[col];
    entry.id = col;
    return entry;
  });
  const sortedColumns = _.sortBy(convertedColumns, "order");

  return (
    <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
      <div className="board flex flex-row flex-shrink-0 overflow-x-scroll overflow-y-visible flex-no-wrap">
        { sortedColumns
          ? sortedColumns.map((column: any, index: number) => {
              return (
                <Droppable key={index} droppableId={column.id}>
                  {(provided) => (
                    <div className="column-wrapper w-1/4 mx-2 mt-1 flex-shrink-0 flex-grow-0 overflow-y-scroll pb-10 pt-4" ref={provided.innerRef} {...provided.droppableProps}>
                      <Column key={index} column={column}>
                        <div>
                          {provided.placeholder}
                        </div>
                      </Column>
                    </div>
                  )}
                </Droppable>
              );
            })
          : <div className="w-full h-full flex items-center justify-center">
              <div className="bg-white w-1/3 rounded p-8">
                <h3 className="text-4xl">Welcome to your new Board!</h3>
                <br/>
                <p>
                  You can get started by adding some columns.
                </p>
              </div>
            </div>
        }
      </div>
    </DragDropContext>
  );
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  dropCard: (cardId: string, source: IDragDrop, destination: IDragDrop, board: string) =>
              dispatch(dropCard(cardId, source, destination, board)),
});

const enhance = compose<IStateProps, {}>(
  firebaseConnect(() => [
    "boards",
  ]),
  connect(
    (state: AppState) => ({
      boards: state.firebase.data.boards,
    }),
    mapDispatchToProps,
  ),
);

export default enhance(Board);
