import * as constants from "../constants";
import { Card, Column } from "../types";

export interface NewCard {
  type: constants.NEW_CARD;
  payload: string;
}
export interface AddCard {
  type: constants.ADD_CARD;
  payload: {
    column: string,
    cardID: string,
  };
}
export interface RemoveCard {
  type: constants.REMOVE_CARD;
  payload: {
    card: Card;
  };
}
export interface MoveCardHorizontal {
  type: constants.MOVE_CARD_HORIZONTAL;
  payload: {
    card: Card;
    direction: string;
  };
}
export interface MoveCardVertical {
  type: constants.MOVE_CARD_VERTICAL;
  payload: {
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
  };
}
export interface UpdateCard {
  type: constants.UPDATE_CARD;
  payload: {
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

export default "poop";

// double check: is column an id or Column object?
export const newCard = (column: string): NewCard  => ({
  payload: column,
  type: "NEW_CARD",
});
export const addCard = (payload: { column: string, cardID: string}): AddCard => {
  return {
    payload: { column: payload.column, cardID: payload.cardID },
    type: "ADD_CARD",
  };
};
// double check: is card an id or Card object?
export const removeCard = (card: Card): RemoveCard => ({
  payload: { card },
  type: "REMOVE_CARD",
});
export const moveCardHorizontal = (card: Card, direction: string): MoveCardHorizontal => ({
  payload: { card, direction },
  type: "MOVE_CARD_HORIZONTAL",
});
export const moveCardVertical = (card: Card, direction: string): MoveCardVertical => ({
  payload: { card, direction },
  type: "MOVE_CARD_VERTICAL",
});
export const dropCard = (cardId: string, source: IDragDrop, destination: IDragDrop): DragDropCard => ({
  payload: { cardId, source, destination },
  type: "DRAG_DROP_CARD",
});
export const updateCard = (card: Card, field: string, value: any): UpdateCard => ({
  payload: { card, field, value },
  type: "UPDATE_CARD",
});
export const openCardDetail = (card: string, column: string): OpenCardDetail => ({
  payload: { card, column },
  type: "OPEN_CARD_DETAIL",
});
export const openCard = (card: string, column: string): OpenCard => ({
  payload: { card, column },
  type: "OPEN_CARD",
});
