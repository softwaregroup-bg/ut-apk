import { fromJS } from 'immutable';
import confirmDialogDefaultState from 'ut-front-react/components/ConfirmDialog/defaultState';

export const DEFAULT_APK_CREATE = fromJS({
    data: {
        apkInfo: {}
    },
    errors: {}
});

export const DEFAULT_APK_EDIT = fromJS({
    data: {
        apkInfo: {}
    },
    edited: {
        apkInfo: {}
    },
    errors: {}
});

const defaultState = {
    create: {
        create: DEFAULT_APK_CREATE
    },
    edit: {
        // id : { ... }
        // Map with id keys and the same structure as 'create' property except of
        // edited property which is replication of data property with edited values of the fields
    },
    validate: {
    },
    remote: {},
    localData: {},
    cached: {
    },
    activeTabData: {
        mode: '',
        id: ''
    },
    common: {
        dropdownData: {},
        confirmDialog: confirmDialogDefaultState
    },
     // Related to BusinessUnitSelection
    units: [],
    unitsTree: [],
    unitsTreeChildrenAndParents: {},
    rootId: null
};

export default fromJS(defaultState);
