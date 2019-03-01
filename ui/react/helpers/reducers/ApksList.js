import { List, Map, fromJS } from 'immutable';
import { getLink } from 'ut-front/react/routerHelper';
import { getDefaultPagination } from 'ut-core/ui/react/helpers';
import { getStorageColumns, toggleColumnInStorage } from 'ut-front-react/components/SimpleGrid/helpers';
import { defaultFilterState } from '../../pages/ApkList/defaultState';

const REQUESTED = 'requested';
const FINISHED = 'finished';
const windowLocalStoragePropKeyColsVisible = 'apksGrid-columns-visible';
const windowLocalStoragePropKeyColsHidden = 'apksGrid-columns-hidden';

const parseApks = function(apks) {
    return apks.map((apk) => {
        return {
            ...apk,
            url: getLink('ut-apk:apkEdit', {id: apk.apkId})
        };
    });
};

export function updatePagination(state, action) {
    return state.set('pagination', action.pagination);
};

export function setParentBusinessUnit(state, action) {
    return state
        .setIn(['filter', 'businessUnitId'], action.businessUnitId)
        .setIn(['filter', 'breadcrumbs'], fromJS(action.breadcrumbs))
        .setIn(['pagination', 'pageNumber'], 1);
};

export function fetchApkStatuses(state, action) {
    if (action.methodRequestState === FINISHED && action.result) {
        return state.setIn(['items', 'apkStatus'], fromJS((action.result && action.result.apkStatus) || []));
    }
    return state;
}

export function fetchApks(state, action) {
    if (action.methodRequestState === REQUESTED) {
        return state
            .set('apks', new List())
            .set('filter', fromJS(action.params.filterBy))
            .set('order', fromJS(action.params.orderBy))
            .set('pagination', fromJS(action.params.paging))
            .set('selected', new Map())
            .setIn(['grid', 'checkedRows'], new List())
            .set('requiresFetch', false);
    }
    if (action.methodRequestState === FINISHED && action.result) {
        const apks = action.result.apk ? parseApks(action.result.apk) : [];
        const pagination = (action.result.pagination && action.result.pagination[0]) || getDefaultPagination(state.getIn(['pagination', 'pageSize']));
        return state
            .set('apks', fromJS(apks))
            .set('pagination', fromJS(pagination))
            .set('requiresFetch', false);
    }
    return state;
};

export function selectApk(state, action) {
    if (state.getIn(['selected', 'apkId']) === action.selectedApk.apkId &&
        state.getIn(['selected', 'apkUnapprovedId']) === action.selectedApk.apkUnapprovedId) {
        return state
            .set('selected', new Map())
            .setIn(['grid', 'checkedRows'], new List());
    } else {
        let checkedRows = new List([
            fromJS(action.selectedApk)
        ]);
        return state
            .set('selected', new Map(action.selectedApk))
            .setIn(['toolbox', 'buttons', 'opened'], true)
            .setIn(['toolbox', 'filters', 'opened'], false)
            .setIn(['grid', 'checkedRows'], checkedRows);
    }
}

export function activateApk(state, action) {
    if (action.methodRequestState === FINISHED && !action.error) {
        return state
            .set('selected', new Map())
            .set('requiresFetch', true);
    }
    return state;
};

export function lockApk(state, action) {
    if (action.methodRequestState === FINISHED && !action.error) {
        return state
            .set('selected', new Map())
            .set('requiresFetch', true);
    }
    return state;
};

export function deleteApk(state, action) {
    if (action.methodRequestState === FINISHED && !action.error) {
        return state
            .set('selected', new Map())
            .set('requiresFetch', true);
    }
    return state;
};

export function approveApk(state, action) {
    if (action.methodRequestState === FINISHED && !action.error) {
        return state
            .set('selected', new Map())
            .set('requiresFetch', true);
    }
    return state;
};

// Grid

export function setVisibleColumns(state, action) {
    const visibleColumns = getStorageColumns(windowLocalStoragePropKeyColsVisible);
    const hiddenColumns = getStorageColumns(windowLocalStoragePropKeyColsHidden);
    const fieldsWithVisibility = state.getIn(['grid', 'fields']).map((f) => {
        if (hiddenColumns.includes(f.get('name'))) {
            return f.set('visible', false);
        }
        if (visibleColumns.includes(f.get('name'))) {
            return f.set('visible', true);
        }
        return f;
    });
    return state.setIn(['grid', 'fields'], fieldsWithVisibility);
}

export function toggleColumnVisibility(state, action) {
    const visibleColumns = getStorageColumns(windowLocalStoragePropKeyColsVisible);
    const hiddenColumns = getStorageColumns(windowLocalStoragePropKeyColsHidden);
    return state.updateIn(['grid', 'fields'], (fields) => {
        return fields.map((f) => {
            if (action.field.name === f.get('name')) {
                if (!action.field.visible) { // visible -> this is the old value
                    if (hiddenColumns.includes(f.get('name'))) {
                        toggleColumnInStorage(windowLocalStoragePropKeyColsHidden, action.field.name);
                    }
                    toggleColumnInStorage(windowLocalStoragePropKeyColsVisible, action.field.name);
                } else {
                    if (visibleColumns.includes(f.get('name'))) {
                        toggleColumnInStorage(windowLocalStoragePropKeyColsVisible, action.field.name);
                    }
                    toggleColumnInStorage(windowLocalStoragePropKeyColsHidden, action.field.name);
                }
                return f.set('visible', !action.field.visible);
            }
            return f;
        });
    });
}

// Filters

export function toolboxToggle(state, action) {
    return state
        .updateIn(['toolbox', 'buttons', 'opened'], (v) => (!v))
        .updateIn(['toolbox', 'filters', 'opened'], (v) => (!v));
};

export function toolboxShowButtons(state, action) {
    return state
        .setIn(['toolbox', 'buttons', 'opened'], true)
        .setIn(['toolbox', 'filters', 'opened'], false);
};

export function toolboxShowFilters(state, action) {
    return state
        .setIn(['toolbox', 'buttons', 'opened'], false)
        .setIn(['toolbox', 'filters', 'opened'], true);
};

export function toolboxCustomSearchSetField(state, action) {
    const newSearchField = action.field;
    const currentSearchValue = state.getIn(['toolbox', 'filters', 'customSearch', 'value']);
    const requiresFetch = currentSearchValue !== '';

    return state
        .setIn(['filter', 'firstName'], null) // reset the filter params
        .setIn(['filter', 'lastName'], null) // reset the filter params
        .setIn(['filter', 'customerNumber'], null) // reset the filter params
        .setIn(['toolbox', 'filters', 'customSearch', 'field'], newSearchField) // update the custom search field
        .setIn(['filter', newSearchField], currentSearchValue) // set the proper filter param
        .set('requiresFetch', requiresFetch);
};

export function toolboxCustomSearchSetValue(state, action) {
    const value = action.value;
    const searchField = state.getIn(['toolbox', 'filters', 'customSearch', 'field']);

    return state
        .setIn(['toolbox', 'filters', 'customSearch', 'value'], value)
        .setIn(['filter', searchField], value)
        .set('requiresFetch', true);
};

export function resetFilters(state, action) {
    const pagination = {
        pageSize: state.getIn(['pagination', 'pageSize']),
        pageNumber: 1
    };
    // Preserve the selected Business Unit from the aside section.
    const newFilterState = {
        ...defaultFilterState,
        businessUnitId: state.getIn(['filter', 'businessUnitId']) || defaultFilterState.businessUnitId,
        breadcrumbs: state.getIn(['filter', 'breadcrumbs']) || defaultFilterState.breadcrumbs
    };
    return state
        .set('filter', new Map(newFilterState))
        .set('pagination', new Map(pagination))
        .set('selected', new Map())
        .setIn(['toolbox', 'filters', 'opened'], false)
        .setIn(['toolbox', 'filters', 'customSearch', 'field'], 'apkName')
        .setIn(['toolbox', 'filters', 'customSearch', 'value'], '')
        .set('requiresFetch', true);
};
