export default function(state = {}, action) {
  switch (action.type) {
    /* Cards */
    case "ADD_CARD": {
      const { column } = action.payload;
      const newID = Date.now();
      const newCard = {
        id: newID,
        name: "New Task",
        shortdescription: "A new task about doing something",
        content: "Markdown content goes here",
        column: column
      };
      return {
        ...state,
        cards: {
          ...state.cards,
          [newID]: {
            id: newID,
            name: "New Task",
            column: column
          }
        },
        columns: {
          ...state.columns,
          [column]: {
            title: state.columns[column].title,
            cards: [
              ...state.columns[column].cards,
              newCard
            ]
          }
        }
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

      };
    }

    /* Columns */
    case "ADD_COLUMN": {
      console.log('add column');
      const { card, column } = action.payload;
      const newID = Date.now(); // sort-of unique, can be fooled

      return {
        ...state,
        columns: {
          ...state.columns,
          [newID]: {
            title: "newColumn",
            cards: []
          }
        }
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

      };
    }
    default:
      return state;
  }
}
