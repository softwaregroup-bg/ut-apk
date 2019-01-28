import * as actionTypes from './actionTypes';

export function fetch(tag, method, query, options) {
    return {
        ...options,
        type: actionTypes.FETCH,
        method: method,
        tag: tag,
        params: query
    };
}

export function clear(tag) {
    return {
        type: actionTypes.CLEAR,
        tag: tag
    };
}
