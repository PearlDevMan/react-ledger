import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';

import * as reasonSagas from './Reason/saga';
import * as transactionSagas from './Transaction/saga';
import { reasonReducer } from './Reason';
import { transactionReducer } from './Transaction';
import { paneReducer } from './Pane';
import { sharedReducer } from './Shared';

const reducers = combineReducers({
  reason: reasonReducer,
  transaction: transactionReducer,
  pane: paneReducer,
  shared: sharedReducer,
});
const sagaMiddleWare = createSagaMiddleware();

function* rootSaga() {
  yield all([...Object.values(reasonSagas), ...Object.values(transactionSagas)].map(fork));
}

const typedWindow = typeof window !== 'undefined' && (window as any);
function createStoreInstance() {
  const composeEnhancers =
    (process.env.NODE_ENV === 'development' && typedWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
  const storeInstance = createStore(reducers, composeEnhancers(applyMiddleware(sagaMiddleWare)));

  sagaMiddleWare.run(rootSaga);
  return storeInstance;
}
export type AppState = ReturnType<typeof reducers>;
export const store = createStoreInstance();
