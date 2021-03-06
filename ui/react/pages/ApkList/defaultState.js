import immutable from 'immutable';

export const defaultFilterState = {
    statusId: null,
    apkName: null,
    breadcrumbs: immutable.List([]),
    isEnabled: null
};

export const defaultOrderState = {
    column: null,
    direction: null
};

export const defaultPaginationState = {
    pageSize: 25,
    pageNumber: 1
};

export const lockStatuses = [
    {name: 'Locked', key: 1},
    {name: 'Unlocked', key: 0}
];

export const defaultState = {
    apks: [],
    filter: defaultFilterState,
    items: { lockStatuses },
    toolbox: {
        buttons: { opened: true },
        filters: {
            opened: false,
            customSearch: {
                field: 'identifier',
                value: ''
            }
        }
    },
    grid: {
        fields: [
            {title: 'Apk Name', name: 'apkName'},
            {title: 'Uploadod On', name: 'createdOn'},
            {title:'Updated On', name:'updatedOn'},
            {title: 'Status', name: 'statusId'},
            //{title: 'Branch', name: 'mappingBranchName'},
            {title: 'Supported Devices', name: 'devices'},
            {title: 'Supported Android Versions', name: 'androidVersions'},
            {title: 'Link', name: 'link'}
        ],
        checkedRows: []
    },
    selected: {},
    pagination: defaultPaginationState,
    order: defaultOrderState,
    requiresFetch: false
};

export default immutable.fromJS(defaultState);
