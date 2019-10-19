import uuid from 'uuid';
const initialState = null;
export default function(state = { columns: [] }, action) {
  switch (action.type) {
    /* Columns */
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
        cards: state.cards.filter(card => card.column !== id),
        columns: state.columns.filter(column => column.id !== id)
      };
    }
    default:
      return state;
  }
}
