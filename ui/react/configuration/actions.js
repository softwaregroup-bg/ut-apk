import * as actionTypes from './actionTypes';

export function setConfig(config) {
    return {
        type: actionTypes.SET_USER_CONFIG,
        config: config
    };
}
