import React from 'react';
import { fromJS,Map } from 'immutable';
import { textValidations, validationTypes } from 'ut-front-react/validator/constants';

export const config = {
    apkInfo: {
        title: 'APK Info',
        inputs: [
            { key: 'system', type: 'dropdown', label: 'System', readonly: false, required: true, data: fromJS([{key:'agency',name:'Agency Banking',placeholder:'Agency Banking'}, {key:'dfa',name:'DFA',placeholder:'DFA'}]) },
            { key: 'apkName', type: 'text', label: 'APK Name', readonly: false },
            { key: 'devices', type: 'text', label: 'Devices', readonly: false },
            { key: 'imeis', type: 'text', label: 'IMEIs', readonly: false },
            { key: 'androidVersions', type: 'text', label: 'Supported Android Versions', readonly: false }
        ]
    }
};

const inputValidators = {
    'default': [],
    'apkName': [
        {
            type: textValidations.isRequired,
            errorMessage: 'APK Name is required'
        }
    ]
};

export const getInputValidators = (inputKey) => {
    return inputValidators[inputKey] || inputValidators.default;
};

const getPageStartIndex = (pagination) => {
    if (Map.isMap(pagination)) {
        return (pagination.get('pageNumber', 1) - 1) * pagination.get('pageSize', 0);
    } else {
        return 0;
    }
};

export const apkSearchColumns = {
    index: {
        label: 'Index',
        width: 48,
        disableSort: true,
        // eslint-disable-next-line react/prop-types
        cellRenderer: ({columnData, rowIndex}) => <span>{1 + getPageStartIndex(columnData && columnData.pagination) + rowIndex}</span>
    },
    apkName: {
        label: 'APK Name',
        width: 144,
        flexGrow: 1
    }
};

export const getTabValidations = () => {
    return [
        {
            key: ['apkInfo', 'apkName'],
            type: validationTypes.text,
            rules: inputValidators['apkName']
        }
    ];
};
