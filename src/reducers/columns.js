import uuid from 'uuid';

export default function(state = { columns: [] }, action) {
  switch (action.type) {
    case "ADD_CARD": {
      const { column, cardID } = action.payload;

      const newCard = {
        id: cardID,
        column: column,
        name: "New Task",
        description: "A new task about doing something",
        content: "Markdown content goes here",
        activity: [
          {
            label: "Card created: ",
            timestamp: Date.now()
          }
        ]
      };

      return {
        ...state,
        columns: state.columns.map((c) => {
          if (c.id === column) {
            c.cards = [
              ...c.cards,
              newCard
            ]
          }
          return c;
        })
      };
    }

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

    case "DRAG_DROP_CARD": {
      const { cardId, source, destination } = action.payload;
      const columns = state.columns;
      let sourceColumn = columns.filter((c) => c.id === source.droppableId);

      if (!sourceColumn[0]) {
        console.error("Drop Card error: No source column found");
        return { ...state }
      }

      sourceColumn = sourceColumn[0];

      let card = sourceColumn.cards.filter((c) => {
        return c.id === cardId;
      })

      card = card[0];
      return {
        ...state,
        columns: columns.map((column) => {
          // filter out the card from the source column
          if (column.id === source.droppableId) {
            column.cards = column.cards.filter((c) => {
              return c.id !== cardId;
            })
          }
          // add the card to the dest. column at the desired index
          if (column.id === destination.droppableId) {
            let destinationCopy = column.cards.slice();
            destinationCopy.splice(destination.index, 0, card);
            column.cards = destinationCopy.map((c) => {
              if (c.id === cardId) {
                c['column'] = destination.droppableId;
              }
              return c;
            })
          }
          return column;
        })
      }
    }
    case "OPEN_CARD_DETAIL": {
      return {
        ...state,
        detail: {
          card: action.payload.card,
          column: action.payload.column
        },
        modal: true
      }
    }
    case "LOG_CARD_ACTIVITY": {
      const { card } = action.payload;
      return {
        ...state,
        columns: state.columns.map((col) => {
          if (col.id === card.column) {
            col.cards.map((c) => {
              if (c.id === card.id) {
                c.activity = [
                  ...c.activity,
                  {
                    label: "Card viewed: ",
                    timestamp: Date.now()
                  }
                ]
              }
              return c;
            })
          }
          return col;
        })
      }
    }
    case "UPDATE_CARD": {
      const { detail, field, value } = action.payload;
      return {
        ...state,
        columns: state.columns.map((column) => {
          if (column.id === detail.column) {
            column.cards.map((card) => {
              if (card.id === detail.card) {
                card[field] = value;
                return card;
              }
            })
          }
          return column;
        })
      };
    }
    case "REMOVE_CARD": {
      const card = action.payload;
      return {
        ...state,
        columns: state.columns.map(column => {
          if (column.id === card.column) {
            column.cards = column.cards.filter((c) => {
              return c.id !== card.id;
            })
          }
          return column;
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
            title: columnName,
            cards: []
          }
        ]
      };
    }
    case "MOVE_COLUMN": {
      const { column, direction } = action.payload;

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
      const { column, id } = action.payload;
      return {
        ...state,
        columns: state.columns.map(c => {

          if (c.id === column) {
            if (!c.cards) {
              c.cards = [];
            }

            c.cards.push({
              id: id,
              order: c.cards.length + 1
            });
          }
          return c;
        })

      };
    }
    case "REMOVE_COLUMN": {
      const { id } = action.payload;
      return {
        ...state,
        columns: state.columns.filter(column => column.id !== id)
      };
    }
    case "OPEN_MODAL": {
      return {
        ...state,
        modal: true
      }
    }
    case "CLOSE_MODAL": {
      return {
        ...state,
        modal: false
      }
    }
    default:
      return state;
  }
}
