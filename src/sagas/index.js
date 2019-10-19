// saga effects are cool https://redux-saga.js.org/docs/api/
import { put, takeLatest, all } from 'redux-saga/effects';

function* newColumnSaga() {
  // do something async that LOOKS sync. This could be an API call. In this case, we're asking for a name.
  const newColumnName = yield prompt("New column name:");
  yield put({ type: "ADD_COLUMN", payload: newColumnName });
}

function* newColumnWatcher() {
  yield takeLatest('NEW_COLUMN', newColumnSaga)
}

function* newCardSaga() {

}

function* newCardWatcher() {
  yield takeLatest('NEW_CARD', newCardSaga)
}

export default function* rootSaga() {
  yield all([
    newColumnWatcher(),
    newCardWatcher()
  ]);
}
