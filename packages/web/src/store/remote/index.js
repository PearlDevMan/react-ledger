/**
 *
 * Ledger Web App Source Code.
 *
 * @license MIT
 * @copyright Toan Nguyen <nta.toan@gmail.com>
 *
 */

import axios from 'axios/lib/axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import attachBearer from './attachBearer';
import toCamelCase from './toCamelCase';
import toSnackCase from './toSnackCase';

/**
 * Axios uses xhr adapter by default. In order to leverage service worker for caching, fetch adapter is used instead
 */
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    mode: 'cors',
    cache: 'no-store',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
    adapter: fetchAdapter,
    settle: (resolve, _, response) => {
        resolve(response);
    },
});

axiosInstance.interceptors.request.use(attachBearer);
axiosInstance.interceptors.request.use(toSnackCase);
axiosInstance.interceptors.response.use(toCamelCase);

export default axiosInstance;

export function ping() {
    return axiosInstance.get('/ping');
}

export function fetchTransactions(year) {
    return axiosInstance.get('/transactions?wb=cache_first', {
        params: { year },
    });
}

export function syncTransactions(data) {
    return axiosInstance.post('/transactions', data);
}

export function deleteTransactions(data) {
    return axiosInstance.delete(`/transactions/${data}`);
}

export function signin(data) {
    return axiosInstance.post('/signin', data);
}

export function signout() {
    return axiosInstance.put('/signout');
}

export function getYears() {
    return axiosInstance.get('/transactions/years?wb=cache_first');
}