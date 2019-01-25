import { fromJS, Map, List } from 'immutable';
import DEFAULT_STATE, { DEFAULT_APK_CREATE, DEFAULT_APK_EDIT } from './defaultState';

import * as actionTypes from './actionTypes';
import { keyIn } from '../../helpers/util';

const FINISHED = 'finished';
const REQUESTED = 'requested';

const APK_FILTER = keyIn('apkId', 'apkName');

const editPropertyMapping = {
    'create': 'data',
    'edit': 'edited'
};

const parseApkData = apkGetResult => {
    const apkId = apkGetResult.getIn(['apk', 0, 'apkId']);
    const apkName = apkGetResult.getIn(['apk', 0, 'apkName']);
    const devices = apkGetResult.get('apk', 0, 'devices');
    const imeis = apkGetResult.get('apk', 0, 'imeis');
    const androidVersions = apkGetResult.get('androidVersion', 0, 'androidVersions');
    const apkFileName = apkGetResult.getIn(['apk', 0, 'apkFileName']);
    const apkSize = apkGetResult.getIn(['apk', 0, 'apkSize']);

    const organizationId = apkGetResult.getIn(['apk', 0, 'organizationId']);
    const organizationName = apkGetResult.getIn(['apk', 0, 'organizationName']);

    const mappingBranchId = apkGetResult.getIn(['apk', 0, 'mappingBranchId'], organizationId);
    const mappingBranchName = apkGetResult.getIn(['apk', 0, 'mappingBranchName'], organizationName);
    const visibleFor = [];
    if (mappingBranchId) {
        visibleFor.push({
            actorId: mappingBranchId,
            organizationName: mappingBranchName
        });
    }

    return fromJS({
        apkId,
        apkName,
        devices,
        imeis,
        androidVersions,
        mappingBranchId,
        apkFileName,
        apkSize
    });
};

function apkInfo(state = DEFAULT_STATE, action) {
    const activeTabMode = state.getIn(['activeTabData', 'mode']);
    const activeTabId = state.getIn(['activeTabData', 'id']);

    switch (action.type) {
        case actionTypes.SET_ACTIVE_TAB:
            return state.set('activeTabData', fromJS({
                mode: action.params.mode,
                id: action.params.id
            }));
        case actionTypes.GET_APK:
            if (action.methodRequestState === FINISHED && !action.error) {
                const apkData = fromJS(action.result);
                return state
                    .updateIn(
                        [activeTabMode, activeTabId, 'data', 'apkInfo'],
                        new Map(),
                        data => parseApkData(apkData)
                    )
                    .deleteIn([activeTabMode, activeTabId, 'errors', 'apkName']);
            }
            break;
        case actionTypes.EDIT_APK_FIELD:
            const { key, value, tab, errorMessage } = action.params;
            state = state.setIn([activeTabMode, activeTabId, editPropertyMapping[activeTabMode], tab, key], value);
            if (errorMessage) {
                state = state.setIn([activeTabMode, activeTabId, 'errors', key], errorMessage);
            } else {
                state = state.deleteIn([activeTabMode, activeTabId, 'errors', key]);
            }
            return state;
        case actionTypes.UPDATE_ERRORS:
            const errors = state.getIn([activeTabMode, activeTabId, 'errors']) || new Map();
            const newErrors = errors.merge(fromJS(action.params.errors));
            return state.setIn([activeTabMode, activeTabId, 'errors'], newErrors);
        case actionTypes.FETCH_AVAILABLE_BUSINESS_UNITS:
            if (action.methodRequestState === FINISHED && !action.error) {
                const organization = action.result.organization ? parseAgentTypes(action.result.organization) : [];
                return state.setIn(['common', 'dropdownData', 'organization'], fromJS(organization).map(o => new Map({actorId: o.get('id')})));
            }
            return state;
        case actionTypes.CREATE_APK:
            if (action.methodRequestState === REQUESTED) {
                const statusObj = { status: 'pending', message: 'Adding apk.' };
                return state.setIn([activeTabMode, activeTabId, 'status'], fromJS(statusObj));
            }
            if (action.methodRequestState === FINISHED) {
                if (action.error) {
                    let errorObj = { status: 'failed', message: action.error && action.error.message };
                    return state.setIn([activeTabMode, activeTabId, 'status'], fromJS(errorObj));
                } else {
                    let statusObj = { status: 'success', message: 'Apk successfully added.' };

                    let cacheId = state.getIn([activeTabMode, activeTabId, 'cacheId']) || 0;
                    return state
                        .setIn([activeTabMode, activeTabId, 'cacheId'], cacheId + 1)
                        .setIn([activeTabMode, activeTabId, 'status'], fromJS(statusObj));
                }
            }
            break;
        case actionTypes.EDIT_APK:
            if (action.methodRequestState === REQUESTED) {
                let statusObj = {status: 'pending', message: 'Saving apk changes.'};
                return state.setIn([activeTabMode, activeTabId, 'status'], fromJS(statusObj));
            }
            if (action.methodRequestState === FINISHED) {
                if (action.error) {
                    let errorObj = { status: 'failed', message: action.error.message };
                    return state.setIn([activeTabMode, activeTabId, 'status'], fromJS(errorObj));
                } else {
                    let statusObj = { status: 'success', message: 'Apk successfully edited.' };
                    let cacheId = state.getIn([activeTabMode, activeTabId, 'cacheId']) || 0;
                    return state
                        .setIn([activeTabMode, activeTabId, 'cacheId'], cacheId + 1)
                        .setIn([activeTabMode, activeTabId, 'status'], fromJS(statusObj));
                }
            }
            break;
        case actionTypes.RESET_APK_STATE:
            let newState = state.setIn([activeTabMode, activeTabId, 'status'], new Map());
            if (action.params.clearData === true) {
                if (activeTabMode === 'create') {
                    return newState.setIn([activeTabMode, activeTabId], DEFAULT_APK_CREATE);
                } else {
                    return newState.setIn([activeTabMode, activeTabId], DEFAULT_APK_EDIT);
                }
            } else {
                return newState;
            }
        case actionTypes.FETCH_ITEMS:
            if (action.methodRequestState === FINISHED && action.result) {
                if (Array.isArray(action.result.items) && action.result.items.length > 0) {
                    const mappedItems = action.result.items.reduce((accum, next) => {
                        const typeArray = accum[next.type] || [];
                        typeArray.push({
                            key: next.value,
                            name: next.display
                        });
                        accum[next.type] = typeArray;
                        return accum;
                    }, {});
                    return state.mergeIn(['common', 'dropdownData'], fromJS(mappedItems));
                }
            }
            break;
        case actionTypes.SET_FIELD: {
            const { path } = action.params;

            if (Array.isArray(path)) {
                return state.setIn(path, action.params.value);
            }

            break;
        }
        case actionTypes.SAVE_APK_FILE:
            if (action.methodRequestState === REQUESTED) {
                const statusObj = { status: 'pending', message: 'Saving apk file' };
                return state.setIn([activeTabMode, activeTabId, 'status'], fromJS(statusObj));
            }
            if (action.methodRequestState === FINISHED) {
                if (action.error) {
                    let errorObj = { status: 'failed', message: action.error && action.error.message };
                    return state.setIn([activeTabMode, activeTabId, 'status'], fromJS(errorObj));
                } else {
                    let statusObj = { status: 'success', message: 'Apk file successfully saved.' };

                    let cacheId = state.getIn([activeTabMode, activeTabId, 'cacheId']) || 0;
                    return state
                        .setIn([activeTabMode, activeTabId, 'cacheId'], cacheId + 1)
                        .setIn([activeTabMode, activeTabId, 'status'], fromJS(statusObj));
                }
            }
            break;
    }
    return state;
}

export default { apkInfo };