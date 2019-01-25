import * as actionTypes from './actionTypes';

// Tab control
export const setActiveTab = ({ mode, id }) => ({
    type: actionTypes.SET_ACTIVE_TAB,
    params: { mode, id }
});

export const updateErrors = ({ errors }) => ({
    type: actionTypes.UPDATE_ERRORS,
    params: {
        errors
    }
});

export const editApkField = ({ key, value, tab, errorMessage }) => ({
    type: actionTypes.EDIT_APK_FIELD,
    params: { key, value, tab, errorMessage }
});

export const saveAPKFile = ({content, tab, errorMessage}) => ({
    type: actionTypes.SAVE_APK_FILE,
    method: 'apk.apk.saveFile',
    params: { content, tab, errorMessage }
});

export const resetApkState = (clearData) => ({
    type: actionTypes.RESET_APK_STATE,
    params: { clearData }
});

export const getApk = (apkId) => ({
    type: actionTypes.GET_APK,
    method: 'apk.apk.get',
    params: { apkId }
});

export const createApk = (params) => ({
    type: actionTypes.CREATE_APK,
    method: 'apk.apk.add',
    suppressPreloadWindow: true,
    suppressErrorWindow: true,
    params: params
});

export const editApk = (params) => {
    if (params.getIn(['apk', 'threshold'], '') === '') {
        params = params.setIn(['apk', 'threshold'], null);
    }
    return {
        type: actionTypes.EDIT_APK,
        method: 'apk.apk.edit',
        suppressPreloadWindow: true,
        suppressErrorWindow: true,
        params: params
    };
};

export const fetchItems = (params) => ({
    type: actionTypes.FETCH_ITEMS,
    method: 'apk.item.fetch',
    params: params
});

export function fetchAvailableBusinessUnits() {
    return {
        type: actionTypes.FETCH_AVAILABLE_BUSINESS_UNITS,
        method: 'customer.organization.graphFetch',
        params: {
            level: 0
        }
    };
}

export const setField = (params) => {
    return {
        type: actionTypes.SET_FIELD,
        params
    };
};
