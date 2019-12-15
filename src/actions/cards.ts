import * as constants from "../constants";
import { Card, Column } from "../types";

export interface NewCard {
  type: constants.NEW_CARD;
  payload: {
    boardId: string;
    columnId: string;
  };
}
export interface AddCard {
  type: constants.ADD_CARD;
  payload: {
    columnId: string,
    cardId: string,
  };
}
export interface RemoveCard {
  type: constants.REMOVE_CARD;
  payload: {
    boardId: string;
    columnId: string;
    cardId: string;
    name: string;
  };
}
export interface MoveCardHorizontal {
  type: constants.MOVE_CARD_HORIZONTAL;
  payload: {
    board: any;
    card: Card;
    direction: string;
  };
}
export interface MoveCardVertical {
  type: constants.MOVE_CARD_VERTICAL;
  payload: {
    board: any;
    card: Card;
    direction: string;
  };
}
export interface IDragDrop {
  draggableId: string;
  droppableId: string;
  source: Column;
  destination: Column;
  index: number;
}
export interface DragDropCard {
  type: constants.DRAG_DROP_CARD;
  payload: {
    cardId: string;
    source: IDragDrop;
    destination: IDragDrop;
    board: string;
  };
}
export interface UpdateCard {
  type: constants.UPDATE_CARD;
  payload: {
    board: any;
    column: any;
    card: Card;
    field: string;
    value: any;
  };
}
export interface OpenCardDetail {
  type: constants.OPEN_CARD_DETAIL;
  payload: {
    card: string;
    column: string;
  };
}
export interface OpenCard {
  type: constants.OPEN_CARD;
  payload: {
    board: string;
    card: string;
    column: string;
  };
}
export interface LogCardActivity {
  type: constants.LOG_CARD_ACTIVITY;
  payload: {
    card: Card;
  };
}

export type CardAction =
  | LogCardActivity
  | OpenCard
  | OpenCardDetail
  | UpdateCard
  | DragDropCard
  | MoveCardVertical
  | MoveCardHorizontal
  | RemoveCard
  | AddCard
  | NewCard;

export default "tslint lol";

export const newCard = (columnId: string, boardId: string): NewCard  => ({
  payload: { columnId, boardId },
  type: "NEW_CARD",
});

export const addCard = (payload: { columnId: string, cardId: string}): AddCard => {
  return {
    payload: { columnId: payload.columnId, cardId: payload.cardId },
    type: "ADD_CARD",
  };
};

// double check: is card an id or Card object?
export const removeCard = (boardId: string, columnId: string, cardId: string, name: string): RemoveCard => ({
  payload: { boardId, columnId, cardId, name },
  type: "REMOVE_CARD",
});
export const moveCardHorizontal = (board: any, card: Card, direction: string): MoveCardHorizontal => ({
  payload: { board, card, direction },
  type: "MOVE_CARD_HORIZONTAL",
});
export const moveCardVertical = (board: any, card: Card, direction: string): MoveCardVertical => ({
  payload: { board, card, direction },
  type: "MOVE_CARD_VERTICAL",
});
export const dropCard = (cardId: string, source: IDragDrop, destination: IDragDrop, board: string): DragDropCard => ({
  payload: { cardId, source, destination, board },
  type: "DRAG_DROP_CARD",
});
export const updateCard = (board: any, column: any, card: Card, field: string, value: any): UpdateCard => {
  return {
    payload: { board, column, card, field, value },
    type: "UPDATE_CARD",
  };
};

export const openCardDetail = (card: string, column: string): OpenCardDetail => ({
  payload: { card, column },
  type: "OPEN_CARD_DETAIL",
});
export const openCard = (board: string, column: string, card: string): OpenCard => ({
  payload: { board, column, card },
  type: "OPEN_CARD",
});
