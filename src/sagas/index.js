import { put, takeLatest, all } from 'redux-saga/effects';
import uuid from 'uuid';

function* newColumnSaga() {
  const newColumnName = yield prompt("New column name:");
  yield put({ type: "ADD_COLUMN", payload: newColumnName });
}

function* newColumnWatcher() {
  yield takeLatest('NEW_COLUMN', newColumnSaga)
}

function* newCardSaga(action) {
  let newCardId = uuid();
  yield put({ type: "ADD_CARD", payload: {columnId: action.payload, cardId: newCardId } });

  yield put({ type: "OPEN_MODAL" })

  yield put({ type: "OPEN_CARD_DETAIL", payload: {column: action.payload, card: newCardId } });
}

function* newCardWatcher() {
  yield takeLatest('NEW_CARD', newCardSaga)
}

function* openCardSaga(action) {
  yield put({ type: "OPEN_MODAL" })
  yield put({type: "OPEN_CARD_DETAIL", payload: {card: action.payload.card.id, column: action.payload.column }})
  yield put({type: "LOG_CARD_ACTIVITY", payload: {card: action.payload.card, column: action.payload.column }})
}

function* openCardWatcher() {
  yield takeLatest('OPEN_CARD', openCardSaga)
}

function* deleteCardSaga(id) {
  yield put({ type:"REMOVE_CARD", payload: id })
}

function* deleteCardWatcher() {
  yield takeLatest('DELETE_CARD', deleteCardSaga)
}

export default function* rootSaga() {
  yield all([
    newColumnWatcher(),
    newCardWatcher(),
    deleteCardWatcher(),
    openCardWatcher()
  ]);
}
