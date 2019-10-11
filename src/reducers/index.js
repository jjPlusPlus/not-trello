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
      const { id, direction } = action.payload;
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

      return {
        ...state,
        columns: [
          ...state.columns,
          {
            id: uuid(),
            title: "newColumn",
            cards: []
          }
        ]
      };
    }
    case "MOVE_COLUMN": {
      const { id, direction } = action.payload;
      return {
        ...state,

      };
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
