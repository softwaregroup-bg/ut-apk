import { fromJS } from 'immutable';
import * as actionTypes from './actionTypes';

export function fetchApkStatuses() {
    return {
        type: actionTypes.FETCH_APK_STATUSES,
        method: 'apk.status.list',
        params: {}
    };
}

export function updatePagination(pagination) {
    return {
        type: actionTypes.UPDATE_PAGINATION,
        pagination
    };
}

export function setParentBusinessUnit(businessUnit, breadcrumbs) {
    let businessUnitId = businessUnit ? businessUnit.id : null;
    return {
        type: actionTypes.SET_PARENT_BUSINESS_UNIT,
        businessUnitId: businessUnitId,
        breadcrumbs: breadcrumbs
    };
};

export function fetchApks(filterBy = {}, paging = {}, orderBy = {}) {
    if (filterBy.get('identifier') === '') {
        filterBy = filterBy.remove('identifier');
    }
    return {
        type: actionTypes.FETCH_APKS,
        method: 'apk.apk.fetch',
        params: {
            filterBy,
            orderBy,
            paging: fromJS({
                pageSize: paging.get('pageSize'),
                pageNumber: paging.get('pageNumber')
            })
        }
    };
};

export function selectApk(apk, selectedGridIndex) {
    return {
        type: actionTypes.SELECT_APK,
        selectedApk: apk,
        selectedGridIndex
    };
};

export function activateApk(apk) {
    return {
        type: actionTypes.ACTIVATE_APK,
        method: 'apk.apk.lock',
        params: {
            apkId: apk.get('apkId'),
            isEnabled: !apk.get('isEnabled')
        }
    };
}

export function lockApk(apkId, status) {
    return {
        type: actionTypes.LOCK_APK,
        method: 'apk.suspendStatus.edit',
        params: {
            apkId,
            status
        }
    };
}

export function deleteApk(apkId) {
    return {
        type: actionTypes.DELETE_APK,
        method: 'apk.apk.delete',
        params: {
            apkId
        }
    };
}

export function approveApk(apkId) {
    return {
        type: actionTypes.APPROVE_APK,
        method: 'apk.apk.approve',
        params: {
            apkId
        }
    };
}

// Grid
export function setVisibleColumns() {
    return { type: actionTypes.SET_VISIBLE_COLUMNS };
}

export function toggleColumnVisibility(field) {
    return {
        type: actionTypes.TOGGLE_COLUMN_VISIBILITY,
        field
    };
};

// Filters
export function toolboxToggle() {
    return { type: actionTypes.TOOLBOX_TOGGLE };
};

export function toolboxShowButtons() {
    return { type: actionTypes.TOOLBOX_SHOW_BUTTONS };
};

export function toolboxShowFilters() {
    return { type: actionTypes.TOOLBOX_SHOW_FILTERS };
};

export function toolboxCustomSearchSetField(field) {
    return {
        type: actionTypes.TOOLBOX_CUSTOM_SEARCH_SET_FIELD,
        field
    };
};

export function toolboxCustomSearchSetValue(value) {
    return {
        type: actionTypes.TOOLBOX_CUSTOM_SEARCH_SET_VALUE,
        value
    };
};

export function resetFilters() {
    return {
        type: actionTypes.RESET_FILTERS
    };
};
