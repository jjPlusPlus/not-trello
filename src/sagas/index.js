import { put, takeLatest, select, all } from 'redux-saga/effects';
import firebase from "firebase/app";
import "firebase/database";

/* NEW COLUMN*/

function* newColumnSaga(board) {
  const newColumnName = yield prompt("New column name:");
  const boardId = board.payload.replace("/board/", "")

  let columns = yield select((state) => {
    return state.firebase.data.boards[boardId].columns;
  });

  columns = Object.keys(columns) || [];
  let columnLength = columns.length + 1;

  try {
    yield firebase.ref(`/boards/${boardId}/columns`).push({
      cards: [],
      order: columnLength,
      title: newColumnName,
    });
  } catch (err) {
    console.log('Error creating the column in a saga!:', err)
  }
}

function* newColumnWatcher() {
  yield takeLatest('NEW_COLUMN', newColumnSaga)
}

/* DELETE A COLUMN */

function* deleteColumnSaga(action) {
  const { boardId, columnId, name } = action.payload;

  // first, make the user verify the deletion
  const verification = window.confirm(`This will permanently delete the column "${name}"`);
  if (!verification) { return; }

  // build the url
  const url = `boards/${boardId}/columns/${columnId}`;
  try {
    yield firebase.ref(url).remove();
  } catch (err) {
    console.log('Error removing a column in a saga!:', err)
  }
}

function* deleteColumnWatcher() {
  yield takeLatest('REMOVE_COLUMN', deleteColumnSaga);
}

/* NEW CARD */

function* newCardSaga(action) {
  let card;
  let columnId = action.payload.columnId;
  const boardId = action.payload.boardId.replace("/board/", "")
  const url = `boards/${boardId}/columns/${columnId}/cards`;

  // get the column to which this card will be added 
  const columnState = yield select((state) => {
    return state.firebase.data.boards[boardId].columns;
  });

  const cards = columnState[columnId].cards || {}; // null-safe the cards in case there are none yet

  // The "order" of the new card is the # existing cards + 1
  const order = Object.keys(cards).length + 1;

  try {
    card = yield firebase.ref(url).push({
      name: "New Card",
      description: "A new task about doing something",
      content: "Markdown content goes here",
      column: columnId,
      order: order,
      activity: [
        {
          label: "Card created: ",
          timestamp: Date.now(),
        },
      ],
    });
  } catch (err) {
    console.log('Error creating the column in a saga!:', err)
  }

  yield put({ type: "OPEN_CARD_DETAIL", payload: { column: action.payload.columnId, card: card.key } });

  yield put({ type: "OPEN_MODAL" })
}

function* newCardWatcher() {
  yield takeLatest('NEW_CARD', newCardSaga)
}

/* OPEN THE CARD DETAIL MODAL */ 

function* openCardSaga(action) {
  yield put({type: "OPEN_MODAL" })
  yield put({type: "OPEN_CARD_DETAIL", payload: {card: action.payload.card.id, column: action.payload.column }})
  yield put({type: "LOG_CARD_ACTIVITY", payload: {board: action.payload.board, card: action.payload.card, column: action.payload.column }})
}

function* openCardWatcher() {
  yield takeLatest('OPEN_CARD', openCardSaga)
}

function* cardActivitySaga(action) {
  const { board, column, card } = action.payload;
  // need to get the board from the url again
  const url = `boards/${board}/columns/${column}/cards/${card.id}/activity`;
  try {
    yield firebase.ref(url).push({
      label: "Card viewed: ",
      timestamp: Date.now(),
    });
  } catch (err) {
    console.log('Error updating the card in a saga!:', err)
  }
  return;
}

function* cardActivityWatcher() {
  yield takeLatest("LOG_CARD_ACTIVITY", cardActivitySaga);
}


/* UPDATE A CARD */

function* updateCardSaga(action) {
  const { board, column, card, field, value } = action.payload;
  const url = `boards/${board}/columns/${column}/cards/${card}`;
  try {
    yield firebase.ref(url).update({
      [field]: value
    });
  } catch (err) {
    console.log('Error updating the card in a saga!:', err)
  }
}

function* updateCardWatcher() {
  yield takeLatest('UPDATE_CARD', updateCardSaga);
}

/* MOVE A COLUMN LEFT OR RIGHT */

function* moveColumnSaga(action) {
  const { board, column, direction } = action.payload;
  const columnState = yield select((state) => {
    return state.firebase.data.boards[board].columns;
  });

  const columnKeys = Object.keys(columnState);
  const columns = columnKeys.map((col, index) => {
    const entry = columnState[col];
    entry.id = col;
    return entry;
  });

  // may need to convert the column state first to an array with id keys
  const isValid =
    direction === "left" && column.order > 1
    || direction === "right" && column.order < columns.length;

  if (!isValid) {
    console.log('wasnt valid');
    return;
  } else {

    // going through all of the columns
    // either fbase update the columns one-by-one
    // or update them all together and set the board in one big request?
    // hmmm...
    for (var i = 0; i < columns.length; i++) {
      switch (direction) {
        case "right":
          if (columns[i].id === column.id) {
            columns[i].order += 1;
          } else if (columns[i].order === column.order) {
            columns[i].order -= 1;
          }
          break;
        case "left":
          if (columns[i].id === column.id) {
            columns[i].order -= 1;
          }
          if (columns[i].order === column.order - 1) {
            columns[i].order += 1;
          }
          break;
        default:
          console.error("direction must be left or right");
      }

      const url = `boards/${board}/columns/${columns[i].id}`;

      try {
        yield firebase.ref(url).update({
          order: columns[i].order
        });
      } catch (err) {
        console.log('Error updating the card in a saga!:', err)
      }
    }
  }
}

function* moveColumnWatcher() {
  yield takeLatest('MOVE_COLUMN', moveColumnSaga);
}

/* MOVE A CARD VERTICALLY INSIDE OF A COLUMN */

function* moveCardVerticalSaga(action) {
  const { board, card, direction } = action.payload;

  // get the current column
  const columnState = yield select((state) => {
    return state.firebase.data.boards[board].columns;
  });

  const columnKeys = Object.keys(columnState);
  const columns = columnKeys.map((col, index) => {
    const entry = columnState[col];
    entry.id = col;
    return entry;
  });

  const column = columns.filter((c) => c.id === card.column);

  if (!column[0]) {
    console.error("Move Card error: No column found");
    return;
  }

  const order = card.order;
  const numCards = Object.keys(column[0].cards).length;
  const isValid = order !== -1
    && (
      direction === "up" && order > 1
      ||
      direction === "down" && order < numCards
    );

  if (!isValid) {
    console.log("Move Card Vertical error: Invalid move");
    return;
  }

  const arrangedCards = {};

  /* note: down equals increase, up equals decrease, because cards are sorted top to bottom.
   * 1 A               A
   * 2 B               C > used to be order = 3, now it's order = 2
   * 3 C  Move C "up"  B > used to be order = 2, now it's order = 3
   * 4 D               D
   * 5 E               E
   * So in effect, if the moving card is going up, decrease it's order by 1.
   *
  */
  Object.keys(column[0].cards).forEach((key) => {
    const c = column[0].cards[key];

    if (direction === "up") {
      if (c.order === card.order) { c.order -= 1 }
      if (c.order === card.order - 1) { c.order += 1 }
    } else if (direction === "down") {
      if (c.order === card.order) { c.order += 1 }
      if (c.order === card.order + 1) { c.order -= 1 }
    }
    arrangedCards[key] = c;
  });

  const updateURL = `boards/${board}/columns/${card.column}/`;
  try {
    yield firebase.ref(updateURL).update({
      cards: arrangedCards
    });
  } catch (err) {
    console.log('Error adding the card to the new column:', err)
  }

  return;
}

function* moveCardVerticalWatcher() {
  yield takeLatest('MOVE_CARD_VERTICAL', moveCardVerticalSaga);
}

/* MOVE A CARD LEFT OR RIGHT FROM ONE COLUMN TO ANOTHER */ 

function* moveCardHorizontalSaga(action) {
  const { board, card, direction } = action.payload;

  const columnState = yield select((state) => {
    return state.firebase.data.boards[board].columns;
  });

  const columnKeys = Object.keys(columnState);
  const columns = columnKeys.map((col, index) => {
    const entry = columnState[col];
    entry.id = col;
    return entry;
  });

  const previousColumn = columns.filter((c) => c.id === card.column);

  if (!previousColumn[0]) {
    console.error("Move Card error: No column found");
    return;
  }

  const order = previousColumn[0].order;

  const isValid = direction === "left" && order > 1 || direction === "right" && order < columns.length;

  if (!isValid) {
    console.error("Move Card error: Invalid move");
    return;
  }

  let nextColumn;

  switch (direction) {
    case "left":
      nextColumn = columns.filter((c) => c.order === previousColumn[0].order - 1);
      break;
    case "right":
      nextColumn = columns.filter((c) => c.order === previousColumn[0].order + 1);
      break;
    default:
      console.log("Move Card (Horizontal) error: direction must be \"left\" or \"right\"");
      return;
  }

  const previousColumnURL = `boards/${board}/columns/${previousColumn[0].id}`;
  const nextColumnURL = `boards/${board}/columns/${nextColumn[0].id}/`;

  const previousColumnCards = previousColumn[0].cards;

  // splice  the card from the previousColumn
  delete previousColumnCards[card.id];

  // recalculate the cards in the previous column
  // if I move card in the 2nd position out, than every card higher needs to re-shuffle down (-1)
  Object.keys(previousColumnCards).forEach((key) => {
    const c = previousColumnCards[key];
    if (c.order > card.order) {
      c.order -= 1;
    }
  });

  try {
    yield firebase.ref(previousColumnURL).update({
      cards: previousColumnCards // strip out the current card from this column... maybe even just delete the card since we have a ref here
    });
  } catch (err) {
    console.log('Error removing the card from the current column:', err)
  }

  // add card to the nextColumn, updating it's 'column' attribute
  try {
    // first, set the card's 'column' attribute
    card.column = nextColumn[0].id;
    nextColumn[0].cards = nextColumn[0].cards || {}; // null-safe against empty columns
    card.order = Object.keys(nextColumn[0].cards).length + 1 || 1;
    const nextColumnNewCards = nextColumn[0].cards;
    nextColumnNewCards[card.id] = card;
    yield firebase.ref(nextColumnURL).update({
      cards: nextColumnNewCards
    });
  } catch (err) {
    console.log('Error adding the card to the new column:', err)
  }
}

function* moveCardHorizontalWatcher() {
  yield takeLatest('MOVE_CARD_HORIZONTAL', moveCardHorizontalSaga);
}

/* DELETE A CARD */

function* deleteCardSaga(action) {
  const { boardId, columnId, cardId, name } = action.payload;

  // first, make the user verify the deletion
  const verification = window.confirm(`This will permanently delete the card "${name}"`);
  if (!verification) { return; }

  // build the url
  const url = `boards/${boardId}/columns/${columnId}/cards/${cardId}`;

  yield firebase.ref(url).remove();
  yield put({ type: "CLOSE_MODAL" });
}

function* deleteCardWatcher() {
  yield takeLatest('REMOVE_CARD', deleteCardSaga);
}

function* dragDropCardSaga(action) {
  const { cardId, source, destination, board } = action.payload;
  const columns = yield select((state) => {
    return state.firebase.data.boards[board].columns;
  });

  // get the source/destination column objects
  const sourceColumn = columns[source.droppableId];
  const destinationColumn = columns[destination.droppableId];
  
  if (!sourceColumn || !destinationColumn) { return console.log("Card drop error: Missing source or destination column"); }
  
  // get the dropped card object from the source column
  const droppedCard = sourceColumn.cards[cardId]; 
  if (!droppedCard) { return console.log("Card drop error: Missing dropped card object"); }

  const sourceURL = `boards/${board}/columns/${source.droppableId}/cards/${cardId}`;
  const destinationURL = `boards/${board}/columns/${destination.droppableId}`;

  // remove the card from the source column
  yield firebase.ref(sourceURL).remove();

  // rewrite the cards of the destination column with the new card inserted at the droppableIndex
  // first, set the card's 'column' attribute
  droppedCard.column = destination.droppableId;
  destinationColumn.cards = destinationColumn.cards || {}; // null-safe against empty cards

  // add the card at the dropIndex
  droppedCard.order = destination.index + 1;
 
  // update the other existing cards "order"
  // ... if the card's order is > the destination index, increase it's order by 1
  /* i  o
   * 0  1
   * 1  2
   * 2  3
  */
  Object.keys(destinationColumn.cards).forEach(key => {
    const c = destinationColumn.cards[key];
    if (c.order > destination.index) {
      destinationColumn.cards[key].order += 1;
    } 
  });

  // now add the card to the list
  destinationColumn.cards[cardId] = droppedCard;

  yield firebase.ref(destinationURL).update({
    cards: destinationColumn.cards
  });

  return;
}

function* dragDropCardWatcher() {
  yield takeLatest('DRAG_DROP_CARD', dragDropCardSaga);
}

export default function* rootSaga() {
  yield all([
    newColumnWatcher(),
    moveColumnWatcher(),
    deleteColumnWatcher(),
    newCardWatcher(),
    deleteCardWatcher(),
    openCardWatcher(),
    updateCardWatcher(),
    moveCardVerticalWatcher(),
    moveCardHorizontalWatcher(),
    cardActivityWatcher(),
    dragDropCardWatcher(),
  ]);
}
