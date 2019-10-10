import { createStore, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';
import rootReducer from './reducers';

const store = createStore(rootReducer)

export default function configureStore() {

  const store = createStore(
    rootReducer,
    applyMiddleware(logger)
  );

  return store;
}
