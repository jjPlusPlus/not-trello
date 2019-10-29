import uuid from "uuid";
import { AppState } from "../types";

import * as constants from "../constants";

import { CardAction } from "../actions/cards";
import { ColumnAction } from "../actions/columns";
import { ModalAction } from "../actions/modal";

import { Reducer } from "redux";

// TODO: replace this with a union of all defined actions
// import { AnyAction } from "redux";

const initialState = {
  columns: [],
  detail: null,
  modal: false,
};

// export default function(state: AppState, action: CardAction | ColumnAction | ModalAction) {
const columns: Reducer = (state = initialState, action: CardAction | ColumnAction | ModalAction) => {

  switch (action.type) {
    case constants.ADD_CARD: {
      const { column, cardID } = action.payload;

      const newCard = {
        column,
        content: "Markdown content goes here",
        description: "A new task about doing something",
        id: cardID,
        name: "New Task",
        activity: [
          {
            label: "Card created: ",
            timestamp: Date.now(),
          },
        ],
      };

      return {
        ...state,
        columns: state.columns.map((c: any) => {
          if (c.id === column) {
            c.cards = [
              ...c.cards,
              newCard,
            ];
          }
          return c;
        }),
      };
    }

    case constants.MOVE_CARD_HORIZONTAL: {
      const { card, direction } = action.payload;
      const columns = state.columns;

      const currentColumn = columns.filter((c: any) => c.id === card.column);

      if (!currentColumn[0]) {
        console.error("Move Card error: No column found");
        return { ...state };
      }

      const order = currentColumn[0].order;

      const isValid = direction === "left" && order > 1 || direction === "right" && order < columns.length;

      if (!isValid) {
        return { ...state };
      }

      let newColumn: any;

      switch (direction) {
        case "left":
          newColumn = columns.filter((c: any) => c.order === currentColumn[0].order - 1);
          break;
        case "right":
          newColumn = columns.filter((c: any) => c.order === currentColumn[0].order + 1);
          break;
      }

      return {
        ...state,
        columns: state.columns.map((column: any) => {
          // remove the card from the currentColumn
          if (column.id === currentColumn[0].id) {
            column.cards = column.cards.filter((c: any) => {
              return c.id === card.id ? false : true;
            });
          }

          // add the card to the new column
          if (column.id === newColumn[0].id) {
            // immutable?
            card.column = newColumn[0].id;
            column.cards = [
              ...column.cards,
              card,
            ];
          }

          return column;
        }),
      };
    }

    case constants.MOVE_CARD_VERTICAL: {
      const { card, direction } = action.payload;
      const columns = state.columns;

      const column = columns.filter((c: any) => c.id === card.column);

      if (!column[0]) {
        console.error("Move Card error: No column found");
        return { ...state };
      }

      const order = column[0].cards.findIndex((c: any) => {
        return c.id === card.id;
      });

      const isValid = order !== -1
                    && (
                        direction === "up" && order > 0
                        ||
                        direction === "down" && order < column[0].cards.length - 1
                    );

      if (!isValid) {
        console.log("not valid");
        return { ...state };
      }

      return {
        ...state,
        columns: state.columns.map((col: any) => {
          if (col.id === column[0].id) {
            if (direction === "up") {
              [col.cards[order - 1], col.cards[order]] = [col.cards[order], col.cards[order - 1]];
            } else if (direction === "down") {
              [col.cards[order + 1], col.cards[order]] = [col.cards[order], col.cards[order + 1]];
            }
          }

          return col;
        }),
      };
    }

    case constants.DRAG_DROP_CARD: {
      const { cardId, source, destination } = action.payload;
      const columns = state.columns;
      const sourceColumn = columns.filter((c: any) => c.id === source.droppableId);

      if (!sourceColumn[0]) {
        console.error("Drop Card error: No source column found");
        return { ...state };
      }

      const card = sourceColumn[0].cards.filter((c: any) => {
        return c.id === cardId;
      });

      return {
        ...state,
        columns: columns.map((column: any) => {
          // filter out the card from the source column
          if (column.id === source.droppableId) {
            column.cards = column.cards.filter((c: any) => {
              return c.id !== cardId;
            });
          }
          // add the card to the dest. column at the desired index
          if (column.id === destination.droppableId) {
            const destinationCopy = column.cards.slice();
            destinationCopy.splice(destination.index, 0, card[0]);
            column.cards = destinationCopy.map((c: any) => {
              if (c.id === cardId) {
                c.column = destination.droppableId;
              }
              return c;
            });
          }
          return column;
        }),
      };
    }
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
    case "LOG_CARD_ACTIVITY": {
      const { card } = action.payload;
      return {
        ...state,
        columns: state.columns.map((col: any) => {
          if (col.id === card.column) {
            col.cards.map((c: any) => {
              if (c.id === card.id) {
                c.activity = [
                  ...c.activity,
                  {
                    label: "Card viewed: ",
                    timestamp: Date.now(),
                  },
                ];
              }
              return c;
            });
          }
          return col;
        }),
      };
    }
    case constants.UPDATE_CARD: {
      const { card, field, value } = action.payload;
      return {
        ...state,
        columns: state.columns.map((column: any) => {
          if (column.id === card.column) {
            column.cards.map((c: any) => {
              if (c.id === card.id) {
                for (let key of Object.keys(c)) {
                  if ( key === field) {
                    key = value;
                  }
                }
                // c[field] = value;
                return c;
              }
            });
          }
          return column;
        }),
      };
    }
    case constants.REMOVE_CARD: {
      const { card } = action.payload;
      return {
        ...state,
        columns: state.columns.map((column: any) => {
          if (column.id === card.column) {
            column.cards = column.cards.filter((c: any) => {
              return c.id !== card.id;
            });
          }
          return column;
        }),
      };
    }
    case constants.ADD_COLUMN: {
      const { name } = action.payload;

      // new columns will always have an index that is current column length + 1
      return {
        ...state,
        columns: [
          ...state.columns,
          {
            id: uuid(),
            order: state.columns.length + 1,
            title: name,
            cards: [],
          },
        ],
      };
    }
    case constants.MOVE_COLUMN: {
      const { column, direction } = action.payload;

      const isValid =
               direction === "left" && column.order > 1
            || direction === "right" && column.order < state.columns.length;

      if (!isValid) {
        return { ...state };
      } else {
        const newColumns = state.columns.map((c: any) => {
          switch (direction) {
            case "right":
              if (c.id === column.id) {
                c.order += 1;
              } else if (c.order === column.order) {
                c.order -= 1;
              }
              break;
            case "left":
              if (c.id === column.id) {
                c.order -= 1;
              }
              if (c.order === column.order - 1) {
                c.order += 1;
              }
              break;
            default:
              console.error("direction must be 'left' or 'right'");
          }
          return c;
        });

        return {
          ...state,
          columns: newColumns,
        };
      }
    }
    case constants.UPDATE_COLUMN: {
      const { column, id } = action.payload;
      return {
        ...state,
        columns: state.columns.map((c: any) => {

          if (c.id === column) {
            if (!c.cards) {
              c.cards = [];
            }

            // c.cards.push({
              // id,
              // order: c.cards.length + 1
            // });
          }
          return c;
        }),

      };
    }
    case constants.REMOVE_COLUMN: {
      const { id } = action.payload;
      return {
        ...state,
        columns: state.columns.filter((column: any) => column.id !== id),
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

export default columns;
