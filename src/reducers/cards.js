import uuid from 'uuid';
const initialState = [];
export default function(state = { cards: [] }, action) {
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
      const { card, columns, direction } = action.payload;
      debugger;
      let currentColumn = columns.columns.filter((c) => c.id === card.column);
      let order = currentColumn[0].order;

      let isValid = direction === "left" && order > 1 || direction === "right" && order < columns.columns.length;
      if (!isValid) {
        return { ...state };
      }

      let newColumn;

      switch (direction) {
        case "left":
          newColumn = columns.columns.filter((c) => c.order === currentColumn[0].order - 1);
          break;
        case "right":
          newColumn = columns.columns.filter((c) => c.order === currentColumn[0].order + 1);
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
    default:
      return state;
  }
}