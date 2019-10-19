import { createStore, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';

import rootReducer from './reducers';
import rootSaga from './sagas';

import createSagaMiddleware from 'redux-saga';
const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer);

export default function configureStore() {

  const store = createStore(
    rootReducer,
    applyMiddleware(logger, sagaMiddleware)
  );

  sagaMiddleware.run(rootSaga)

  return store;
}
