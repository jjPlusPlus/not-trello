import { createStore, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';

import rootReducer from './reducers';
import rootSaga from './sagas';

import createSagaMiddleware from 'redux-saga';
const sagaMiddleware = createSagaMiddleware();

export default function configureStore() {
  const persistedState = localStorage.getItem('reduxState')
                         ? JSON.parse(localStorage.getItem('reduxState'))
                         : {};

  const store = createStore(
    rootReducer,
    persistedState,
    applyMiddleware(logger, sagaMiddleware)
  );

  store.subscribe(()=>{
    localStorage.setItem('reduxState', JSON.stringify(store.getState()))
  })

  sagaMiddleware.run(rootSaga)

  return store;
}
