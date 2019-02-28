import * as actionTypes from './actionTypes';
import immutable from 'immutable';

const defaultUserState = {
    host: '127.0.0.1',
    port: 8004,
    apkUri: '/rpc/apk/upload'
};

const defaultStateImmutable = immutable.fromJS(defaultUserState);

export function serverConfig(state = defaultStateImmutable, action) {
    switch (action.type) {
        case actionTypes.SET_SERVER_CONFIG:
            if (action.config) {
                let passedConfigAsImmutable = immutable.fromJS(action.config);
                let newConfigState = state.mergeDeep(passedConfigAsImmutable);
                return newConfigState;
            }
    }

    return state;
}

export default { serverConfig };
