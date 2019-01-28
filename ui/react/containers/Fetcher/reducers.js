import { List, fromJS, Set } from 'immutable';
import * as actionTypes from './actionTypes';
import omitby from 'lodash.omitby';

const FINISHED = 'finished';
const FETCH_PROTOTYPE = fromJS({
    query: {},
    isLoading: false,
    selection: [],
    result: undefined,
    method: undefined
});
const DEFAULT_STATE = fromJS({
    data: {
        // tag : FETCH_PROTOTYPE
    }
});

// See https://github.com/facebook/immutable-js/wiki/Predicates
function keyIn(/* ...keys */) {
    const keySet = new Set(arguments);
    return function(v, k) {
        return keySet.has(k);
    };
}
const OPTIONS_PICKER = keyIn('type', 'methodRequestState', 'result', 'error', 'params', 'tag', 'method');

function utFetcher(state = DEFAULT_STATE, action) {
    const { params, tag, method } = action;
    switch (action.type) {
        case actionTypes.FETCH:
            const options = omitby(action, OPTIONS_PICKER);
            if (action.methodRequestState === FINISHED) {
                if (state.getIn(['data', tag], FETCH_PROTOTYPE).get('reqId') !== action.reqId) {
                    return state;
                }
                if (action.result) {
                    return state.updateIn(['data', tag], FETCH_PROTOTYPE, (oldValue) => {
                        return oldValue
                            .set('query', fromJS(params))
                            .set('method', method)
                            .set('options', options)
                            .set('selection', new List())
                            .set('error', undefined)
                            .set('result', fromJS(action.result))
                            .set('isLoading', false);
                    });
                } else { // Error
                    return state.updateIn(['data', tag], FETCH_PROTOTYPE, (oldValue) => {
                        return oldValue
                            .set('query', fromJS(params))
                            .set('method', method)
                            .set('options', options)
                            .set('selection', new List())
                            .set('error', fromJS(action.error))
                            .set('result', undefined)
                            .set('isLoading', false);
                    });
                }
            } else { // Requesting
                action.reqId = state.getIn(['data', tag, 'reqId'], 0) + 1;
                return state.updateIn(['data', tag], FETCH_PROTOTYPE, (oldValue) => {
                    return oldValue
                        .set('reqId', action.reqId)
                        .set('query', fromJS(params))
                        .set('method', method)
                        .set('options', options)
                        .set('error', undefined)
                        .set('isLoading', true);
                });
            }
        case actionTypes.CLEAR:
            return state.deleteIn(['data', tag]);
    }
    return state;
}

export const fetcherSelector = (state, tag) => state.utFetcher.getIn(['data', tag], FETCH_PROTOTYPE);

export default { utFetcher };
