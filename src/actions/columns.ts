import * as constants from "../constants";
import { Card, Column } from "../types";

export interface NewColumn {
  type: constants.NEW_COLUMN;
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
    id: string;
  };
}
export interface MoveColumn {
  type: constants.MOVE_COLUMN;
  payload: {
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

export const newColumn = () => ({
  type: "NEW_COLUMN",
});
export const addColumn = (name: string) => ({
  type: "ADD_COLUMN",
  payload: name,
});
export const removeColumn = (id: string) => ({
  type: "REMOVE_COLUMN",
  payload: id,
});
export const moveColumn = (column: Column, direction: string) => ({
  type: "MOVE_COLUMN",
  payload: { column, direction },
});
export const updateColumn = (id: string, column: string) => ({
  type: "UPDATE_COLUMN",
  payload: { id, column},
});
