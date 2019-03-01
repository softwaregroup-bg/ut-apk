import * as actionTypes from './actionTypes';
import * as apksListReducers from '../../helpers/reducers/ApksList';
import defaultState from './defaultState';


export function apksList(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.UPDATE_PAGINATION:
            return apksListReducers.updatePagination(state, action);
        case actionTypes.SET_PARENT_BUSINESS_UNIT:
            return apksListReducers.setParentBusinessUnit(state, action);
        case actionTypes.FETCH_APKS:
            return apksListReducers.fetchApks(state, action);
        case actionTypes.SELECT_APK:
            return apksListReducers.selectApk(state, action);
        case actionTypes.ACTIVATE_APK:
            return apksListReducers.activateApk(state, action);
        case actionTypes.LOCK_APK:
            return apksListReducers.lockApk(state, action);
        case actionTypes.DELETE_APK:
            return apksListReducers.deleteApk(state, action);
        case actionTypes.APPROVE_APK:
            return apksListReducers.approveApk(state, action);
        case actionTypes.SET_VISIBLE_COLUMNS:
            return apksListReducers.setVisibleColumns(state, action);
        case actionTypes.TOGGLE_COLUMN_VISIBILITY:
            return apksListReducers.toggleColumnVisibility(state, action);
        case actionTypes.TOOLBOX_TOGGLE:
            return apksListReducers.toolboxToggle(state, action);
        case actionTypes.TOOLBOX_SHOW_BUTTONS:
            return apksListReducers.toolboxShowButtons(state, action);
        case actionTypes.TOOLBOX_SHOW_FILTERS:
            return apksListReducers.toolboxShowFilters(state, action);
        case actionTypes.TOOLBOX_CUSTOM_SEARCH_SET_FIELD:
            return apksListReducers.toolboxCustomSearchSetField(state, action);
        case actionTypes.TOOLBOX_CUSTOM_SEARCH_SET_VALUE:
            return apksListReducers.toolboxCustomSearchSetValue(state, action);
        case actionTypes.RESET_FILTERS:
            let newState = apksListReducers.resetFilters(state, action);
            return newState
                .setIn(['toolbox', 'filters', 'opened'], false)
                .setIn(['toolbox', 'filters', 'customSearch', 'field'], 'identifier')
                .setIn(['toolbox', 'filters', 'customSearch', 'value'], undefined)
                .setIn(['filter', 'statusId'], null)
                .setIn(['filter', 'isSuspended'], null)
                .setIn(['filter', 'apkName'], null)
                .setIn(['filter', 'identifier'], null);
        case actionTypes.FETCH_APK_STATUSES:
            return apksListReducers.fetchApkStatuses(state, action);
        default:
            return state;
    }
}

export default { apksList };