import uuid from 'uuid';

export default function(state = { cards: [], columns: [] }, action) {
  switch (action.type) {
    /* Cards */
    case "ADD_CARD": {
      const { column } = action.payload;
      const newCard = {
        id: uuid(),
        name: "New Task",
        shortdescription: "A new task about doing something",
        content: "Markdown content goes here",
        column: column
      };
      return {
        ...state,
        cards: [
          ...state.cards,
          newCard
        ]
      };
    }
    case "MOVE_CARD": {
      const { card, direction } = action.payload;

      let currentColumn = state.columns.filter((c) => c.id === card.column);
      let order = currentColumn[0].order;

      let isValid = direction === "left" && order > 1 || direction === "right" && order < state.columns.length;
      if (!isValid) {
        return { ...state };
      }

      let newColumn;

      switch (direction) {
        case "left":
          newColumn = state.columns.filter((c) => c.order === currentColumn[0].order - 1);
          break;
        case "right":
          newColumn = state.columns.filter((c) => c.order === currentColumn[0].order + 1);
          break;
      }

      return {
        ...state,
        cards: state.cards.map((c) => {
          if (c.id === card.id) {
            c.column = newColumn[0].id;
            return c;
          } else {
            return c;
          }
        })
      }



      // if the move is left, get the previous column's ID and set the card's column property to that

      // if the move is right, get the next column's ID and set the card's column property to that
      return {
        ...state,

      };
    }
    case "UPDATE_CARD": {
      const { id, card } = action.payload;
      return {
        ...state,

      };
    }
    case "REMOVE_CARD": {
      const { id } = action.payload;
      return {
        ...state,
        cards: state.cards.filter(card => card.id !== id)
      };
    }

    /* Columns */
    case "ADD_COLUMN": {
      const { card, column } = action.payload;

      // new columns will always have an index that is current column length + 1
      return {
        ...state,
        columns: [
          ...state.columns,
          {
            id: uuid(),
            order: state.columns.length + 1,
            title: "newColumn"
          }
        ]
      };
    }
    case "MOVE_COLUMN": {
      const { column, direction } = action.payload;
      /*  invalid if this is the first column and a user wants to move it left
          or this is the last column and a user wants to move it right
      */
      const isValid = direction === "left" && column.order > 1 || direction === "right" && column.order < state.columns.length;

      if (!isValid) {
        return { ...state };
      } else {
        let newColumns = state.columns.map(c => {
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
          columns: newColumns
        }
      }
    }
    case "UPDATE_COLUMN": {
      const { id, card } = action.payload;
      return {
        ...state,

      };
    }
    case "REMOVE_COLUMN": {
      const { id } = action.payload;
      return {
        ...state,
        cards: state.cards.filter(card => card.column !== id),
        columns: state.columns.filter(column => column.id !== id)
      };
    }
    default:
      return state;
  }
}
