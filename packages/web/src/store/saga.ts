/**
 *
 * Ledger Web App Source Code.
 *
 * @license MIT
 * @copyright Toan Nguyen <nta.toan@gmail.com>
 *
 */

import { all, select, call, put, take, fork } from 'redux-saga/effects';
import { errorDisplay, loadingDisplay, messageClear, successDisplay } from '../actions/system';
import {
    transactionList,
    transactionRequest,
    yearList,
    transactionCreatingRequest,
    transactionDeletingRequest,
    transactionUpdatingRequest,
    GET_TRANSACTION,
    RECORD_TRANSACTION,
    UPDATE_TRANSACTION,
    DELETE_TRANSACTION,
    GET_LIST_YEAR,
} from '../actions/trans';
import { HTTPResult, Action, Transaction, APIError, RemoteRepository } from '../types';

import { clearToken, setToken } from '../utils/token';
import { CLOSE_SIGNIN, requireSignin, SIGNIN, SIGNOUT } from '../actions/auth';

type YieldReturn<T> = T extends Promise<infer U> ? U : T;

/**
 * Check if server return 401:
 *  - show login dialog
 *  - save current action to allow resuming after login
 */
export function* check401(response: HTTPResult<APIError>, currentAction: Action) {
    if (response.status === 401) {
        yield put(requireSignin(currentAction));
    } else {
        yield put(errorDisplay(response.data.message || 'Unknown error'));
    }
}

/**
 * Fetch a list of transaction records by year
 */
export function* fetchTransactionRequest(repo: RemoteRepository, year: number) {
    yield fork(fetchYearListRequest, repo);

    try {
        yield put(loadingDisplay('Loading transactions'));
        const response: YieldReturn<ReturnType<typeof repo.getTransactions>> = yield call(
            repo.getTransactions,
            {
                year,
            }
        );

        if (response.ok) {
            yield put(transactionList(response.data as Transaction[]));
            yield put(messageClear());
        } else {
            yield check401(response as HTTPResult<APIError>, transactionRequest(year));
        }
    } catch (e) {
        yield put(errorDisplay('Network error'));
    }
}

/**
 * Fetch a list of years
 */
export function* fetchYearListRequest(repo: RemoteRepository) {
    const refetch = yield select((state) => state.transaction.refetchListYears);

    if (refetch) {
        try {
            const response: YieldReturn<ReturnType<typeof repo.getYears>> = yield call(
                repo.getYears
            );
            if (response.ok) {
                yield put(yearList(response.data as number[]));
            }
        } catch (e) {
            console.error(e);
        }
    }
}

/**
 * Create a transactions
 */
export function* createTransactionRequest(repo: RemoteRepository, data: Omit<Transaction, 'id'>) {
    yield put(loadingDisplay('Saving transaction'));
    const response: YieldReturn<ReturnType<typeof repo.createTransaction>> = yield call(
        repo.createTransaction,
        data
    );
    yield put(messageClear());

    if (response.ok) {
        const year = yield select((state) => state.transaction.year);
        yield put(transactionRequest(year));
    } else {
        yield check401(response as HTTPResult<APIError>, transactionCreatingRequest(data));
    }
}

/**
 * Update a transaction
 */
export function* updateTransactionRequest(repo: RemoteRepository, data: Transaction) {
    yield put(loadingDisplay('Saving transaction'));
    const response: YieldReturn<ReturnType<typeof repo.updateTransaction>> = yield call(
        repo.updateTransaction,
        data
    );
    yield put(messageClear());

    if (response.ok) {
        const year = yield select((state) => state.transaction.year);
        yield put(transactionRequest(year));
    } else {
        yield check401(response as HTTPResult<APIError>, transactionUpdatingRequest(data));
    }
}

/**
 * Delete a transaction
 */
export function* deleteTransactionRequest(repo: RemoteRepository, data: number) {
    yield put(loadingDisplay('Saving transaction'));
    const response: YieldReturn<ReturnType<typeof repo.deleteTransaction>> = yield call(
        repo.deleteTransaction,
        data
    );
    yield put(messageClear());

    if (response.ok) {
        const year = yield select((state) => state.transaction.year);
        yield put(transactionRequest(year));
    } else {
        yield check401(response as HTTPResult<APIError>, transactionDeletingRequest(data));
    }
}

/**
 *
 * Signin request.
 *  - success: save token to localstorage and return true
 *  - fail   : show error flash message and return false
 *
 * @param {*} data
 * {
 *      email: string,
 *      password: string,
 *      remember: boolean
 * }
 */
export function* signinRequest(repo: RemoteRepository, data: { email: string; password: string }) {
    try {
        yield put(loadingDisplay('Sign in'));
        const response: YieldReturn<ReturnType<typeof repo.signin>> = yield call(repo.signin, data);
        yield put(messageClear());

        if (response.ok) {
            const result = yield call(setToken, (response.data as { token: string }).token);
            if (result) {
                const resumingAction = yield select((state) => state.common.retainedAction);
                if (resumingAction) {
                    yield put({ ...resumingAction });
                }
                yield put({ type: CLOSE_SIGNIN });
                return true;
            } else {
                yield put(errorDisplay("Couldn't store token to local storage"));
                return false;
            }
        } else {
            yield put(errorDisplay((response.data as APIError).message || 'Unknown error'));
            return false;
        }
    } catch (e) {
        yield put(errorDisplay('Network error'));
    }
}

/**
 * Sign out request
 */
export function* signoutRequest(repo: RemoteRepository) {
    try {
        const response: YieldReturn<ReturnType<typeof repo.signout>> = yield call(repo.signout);

        if (response.ok) {
            yield put(successDisplay('You have beend signed out'));
            yield call(() => {
                clearToken();
                return Promise.resolve(true);
            });
        } else {
            yield put(errorDisplay((response as HTTPResult<APIError>).data.message));
        }
    } catch (e) {
        yield put(errorDisplay('Network error'));
    }
}

/**
 * Watch for transaction fetching request.
 */
export function watchFetchRequest(repository: RemoteRepository) {
    return function* () {
        while (true) {
            const { payload }: Action<string, number> = yield take(GET_TRANSACTION);
            yield fetchTransactionRequest(repository, payload);
        }
    };
}

/**
 * Watch for transaction creating request.
 */
export function watchCreatingRequest(repository: RemoteRepository) {
    return function* () {
        while (true) {
            const { payload } = yield take(RECORD_TRANSACTION);
            yield createTransactionRequest(repository, payload);
        }
    };
}

/**
 * Watch for transaction updating request.
 */
export function watchUpdatingRequest(repository: RemoteRepository) {
    return function* () {
        while (true) {
            const { payload } = yield take(UPDATE_TRANSACTION);
            yield updateTransactionRequest(repository, payload);
        }
    };
}

/**
 * Watch for transaction deleting request.
 */
export function watchDeletingRequest(repository: RemoteRepository) {
    return function* () {
        while (true) {
            const { payload } = yield take(DELETE_TRANSACTION);
            yield deleteTransactionRequest(repository, payload);
        }
    };
}

/**
 * Watch for sign in request.
 */
function watchSigninRequest(repository: RemoteRepository) {
    return function* () {
        while (true) {
            const { payload }: Action<string, { email: string; password: string }> = yield take(
                SIGNIN
            );
            yield signinRequest(repository, payload);
        }
    };
}

/**
 * Watch for sign out request.
 */
export function watchSignoutRequest(repository: RemoteRepository) {
    return function* () {
        while (true) {
            yield take(SIGNOUT);
            yield signoutRequest(repository);
        }
    };
}

/**
 * Watch for years list request.
 */
export function watchYearRequest(repository: RemoteRepository) {
    return function* () {
        while (true) {
            yield take(GET_LIST_YEAR);
            yield fetchYearListRequest(repository);
        }
    };
}

export default function rootSaga(repository: RemoteRepository) {
    return function* () {
        yield all(
            [
                watchFetchRequest(repository),
                watchCreatingRequest(repository),
                watchUpdatingRequest(repository),
                watchDeletingRequest(repository),
                watchSigninRequest(repository),
                watchSignoutRequest(repository),
                watchYearRequest(repository),
            ].map(fork)
        );
    };
}
