import uuid from "uuid";
import { AppState } from "../types";

import * as constants from "../constants";

import { CardAction } from "../actions/cards";
import { ColumnAction } from "../actions/columns";
import { ModalAction } from "../actions/modal";

import { Reducer } from "redux";

// import firebase from "firebase/app";
// import "firebase/database";

const initialState = {
  columns: [],
  detail: null,
  modal: false,
};

const appReducer: Reducer = (state = initialState, action: CardAction | ColumnAction | ModalAction) => {

  switch (action.type) {
    case constants.OPEN_CARD_DETAIL: {
      return {
        ...state,
        detail: {
          card: action.payload.card,
          column: action.payload.column,
        },
        modal: true,
      };
    }
    case constants.OPEN_MODAL: {
      return {
        ...state,
        modal: true,
      };
    }
    case constants.CLOSE_MODAL: {
      return {
        ...state,
        modal: false,
      };
    }
    default:
      return state;
  }
};

export default appReducer;
