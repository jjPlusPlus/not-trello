import uuid from 'uuid';

export default function(state = { columns: [] }, action) {
  switch (action.type) {
    case "MOVE_CARD_HORIZONTAL": {
      const { card, direction } = action.payload;
      const columns = state.columns;

      let currentColumn = columns.filter((c) => c.id === card.column);

      if (!currentColumn[0]) {
        console.error("Move Card error: No column found");
        return { ...state }
      }

      let order = currentColumn[0].order;

      let isValid = direction === "left" && order > 1 || direction === "right" && order < columns.length;

      if (!isValid) {
        return { ...state };
      }

      let newColumn;

      switch (direction) {
        case "left":
          newColumn = columns.filter((c) => c.order === currentColumn[0].order - 1);
          break;
        case "right":
          newColumn = columns.filter((c) => c.order === currentColumn[0].order + 1);
          break;
      }

      return {
        ...state,
        columns: state.columns.map((column) => {
          // remove the card from the currentColumn
          if (column.id === currentColumn[0].id) {
            column.cards = column.cards.filter((c) => {
              return c.id === card.id ? false : true;
            })
          }

          // add the card to the new column
          if (column.id === newColumn[0].id) {
            // immutable?
            card.column = newColumn[0].id;
            column.cards = [
              ...column.cards,
              card
            ]
          }

          return column;
        })
      }
    }

    case "MOVE_CARD_VERTICAL": {
      const { card, direction } = action.payload;
      const columns = state.columns;

      let column = columns.filter((c) => c.id === card.column);

      if (!column[0]) {
        console.error("Move Card error: No column found");
        return { ...state }
      }

      column = column[0];

      let order = column.cards.findIndex((c) => {
        return c.id === card.id;
      });

      let isValid = order !== -1
                    && (
                        direction === "up" && order > 0
                        ||
                        direction === "down" && order < column.cards.length - 1
                    );

      if (!isValid) {
        console.log('not valid');
        return { ...state };
      }

      return {
        ...state,
        columns: state.columns.map((col) => {
          if (col.id === column.id) {
            if (direction === "up") {
              [col.cards[order - 1], col.cards[order]] = [col.cards[order], col.cards[order - 1]];
            } else if (direction === "down") {
              [col.cards[order + 1], col.cards[order]] = [col.cards[order], col.cards[order + 1]];
            }
          }

          return col;
        })
      }
    }
    case "ADD_COLUMN": {
      const columnName = action.payload;

      // new columns will always have an index that is current column length + 1
      return {
        ...state,
        columns: [
          ...state.columns,
          {
            id: uuid(),
            order: state.columns.length + 1,
            title: columnName
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
        columns: state.columns.filter(column => column.id !== id)
      };
    }
    default:
      return state;
  }
}
