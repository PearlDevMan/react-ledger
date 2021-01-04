import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { connectRouter, routerMiddleware } from 'connected-react-router';

import { createBrowserHistory } from 'history';

import {
    watchFetchMoreExpensesRequest,
    watchFetchExpenseCategories,
    watchExpensesFilteringRequest,
    watchSaveExpensesRequest,
    watchExpenseTranctionDeletion,
} from './routes/Expenses/saga';
import {
    watchFetchMoreIncomesRequest,
    watchFetchIncomeCategories,
    watchIncomesFilteringRequest,
    watchSaveIncomesRequest,
    watchIncomeTranctionDeletion,
} from './routes/Incomes/saga';
import { watchLoginVerify, watchMeLogin, watchMeForceRelogin, watchSignup } from './routes/User/saga';
import { expensesStatisticsRequest, dashboardStatisticsRequest } from './routes/Dashboard/saga';

import app from './App/reducer';
import me from './routes/User/reducer';
import statisticsReducer from './routes/Dashboard/reducer';
import { inTransaction, listOfInCates, listOfIns } from './routes/Incomes/reducer';
import { exTransaction, listOfExCates, listOfExs } from './routes/Expenses/reducer';

const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware({
    onError: (e) => {
        console.error(e);
    },
});
const typedWindow = typeof window !== 'undefined' && window;
const composeEnhancers =
    (process.env.NODE_ENV === 'development' &&
        typeof typedWindow !== 'undefined' &&
        typedWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
        typedWindow.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            trace: true,
            traceLimit: 25,
        })) ||
    compose;

const store = createStore(
    combineReducers({
        me,
        app,
        router: connectRouter(history),
        statistics: statisticsReducer,
        exs: listOfExs,
        exTrans: exTransaction,
        exCates: listOfExCates,
        ins: listOfIns,
        inTrans: inTransaction,
        inCates: listOfInCates,
    }),
    composeEnhancers(applyMiddleware(sagaMiddleware, routerMiddleware(history)))
);

const saga = function* rootSaga() {
    yield all(
        [
            expensesStatisticsRequest,
            dashboardStatisticsRequest,

            watchLoginVerify,
            watchMeLogin,
            watchSignup,
            watchMeForceRelogin,
            watchFetchMoreExpensesRequest,
            watchFetchExpenseCategories,
            watchExpensesFilteringRequest,
            watchSaveExpensesRequest,
            watchExpenseTranctionDeletion,
            watchFetchMoreIncomesRequest,
            watchFetchIncomeCategories,
            watchIncomesFilteringRequest,
            watchSaveIncomesRequest,
            watchIncomeTranctionDeletion,
        ].map(fork)
    );
};
sagaMiddleware.run(saga);

export { history };
export default store;