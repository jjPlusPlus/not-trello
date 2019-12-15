import * as constants from "../constants";
import { Card, Column } from "../types";

export interface NewColumn {
  type: constants.NEW_COLUMN;
  payload: {
    board: string;
  };
}
export interface AddColumn {
  type: constants.ADD_COLUMN;
  payload: {
    name: string;
  };
}
export interface RemoveColumn {
  type: constants.REMOVE_COLUMN;
  payload: {
    boardId: string;
    columnId: string;
    name: string;
  };
}
export interface MoveColumn {
  type: constants.MOVE_COLUMN;
  payload: {
    board: any;
    column: Column;
    direction: string;
  };
}
export interface UpdateColumn {
  type: constants.UPDATE_COLUMN;
  payload: {
    id: string;
    column: string;
  };
}
export type ColumnAction =
  | NewColumn
  | AddColumn
  | RemoveColumn
  | MoveColumn
  | UpdateColumn;

export const newColumn = (board: string) => ({
  type: "NEW_COLUMN",
  payload: board,
});
export const addColumn = (name: string) => ({
  type: "ADD_COLUMN",
  payload: name,
});
export const removeColumn = (boardId: string, columnId: string, name: string) => ({
  type: "REMOVE_COLUMN",
  payload: { boardId, columnId, name },
});
export const moveColumn = (board: any, column: Column, direction: string) => ({
  type: "MOVE_COLUMN",
  payload: { board, column, direction },
});
export const updateColumn = (id: string, column: string) => ({
  type: "UPDATE_COLUMN",
  payload: { id, column},
});
