import { applyMiddleware, createStore  } from "redux";
import { logger } from "redux-logger";

import { AppState } from "./types";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

import createSagaMiddleware from "redux-saga";
const sagaMiddleware = createSagaMiddleware();

export default function configureStore() {
  const persistedState = localStorage.getItem("reduxState")
                         ? JSON.parse(localStorage.getItem("reduxState") || "{}")
                         : {columns: [], detail: null, modal: false};

  const store = createStore<AppState, any, any, any>(
    rootReducer,
    persistedState,
    applyMiddleware(logger, sagaMiddleware),
  );

  store.subscribe(() => {
    localStorage.setItem("reduxState", JSON.stringify(store.getState()));
  });

  sagaMiddleware.run(rootSaga);

  return store;
}
