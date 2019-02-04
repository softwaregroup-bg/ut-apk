import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';

import Input from 'ut-front-react/components/Input';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

import LocalTitledContentBox from '../../../../components/TitledContentBox';
import DropdownRenderer from '../../../../components/SelectPopup/DropdownRenderer';

import ApkSearch from './ApkSearch';
import styles from './style.css';
import { config, getInputValidators } from './config.js';
import { getApk, editApkField, saveAPKFile } from '../../actions';
import Text from 'ut-front-react/components/Text';

class ApkInfo extends Component {
    constructor(props, context) {
        super(props, context);
        this.tab = 'apkInfo';
        this.permissions = {
            edit: context.checkPermission('apk.apk.edit'),
            add: context.checkPermission('apk.apk.add')
        };
        this.state = {
            isDialogOpen: false,
            apk: undefined
        };
        // Bind the actions
        this.onInputChange = this.onInputChange.bind(this);
        this.onDropdownChange = this.onDropdownChange.bind(this);
        this.handleDialogOpen = (e) => {
            this.setState({ isDialogOpen: true });
        };
        this.handleDialogCancel = (e) => {
            this.setState({ isDialogOpen: false, apk: undefined });
        };
        this.handleDialogOk = (e) => {
            const apkId = this.state.apk && this.state.apk.get('apkId');
            this.setState({ isDialogOpen: false, apk: undefined });

            if (apkId) {
                const { editApkField } = this.props;
                editApkField({ key: 'apkId', value: apkId, tab: this.tab });
                // this.props.getApk(apkId);
            }
        };
        this.handleApkSelect = (value, index) => {
            this.setState({ apk: value });
        };
        this.onDrop = this.onDrop.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const apkId = this.getValue('apkId', this.props);
        const newApkId = this.getValue('apkId', nextProps);
        if (apkId !== newApkId && newApkId) {
            this.props.getApk(newApkId);
        }
    }

    getInputsReadonlyStatus() {
        let { mode, id } = this.props;
        let fieldsAreReadonly = true;
        if (mode === 'edit' && id) {
            // const loggedUserId = this.props.login.result['identity.check']['apkId'];
            // const updatedBy = this.props.defaultData.get('updatedBy');

            // let productStatus = this.props.defaultData.get('statusId');
            // let allowedToEditStatuses = ['approved', 'rejected'];
            // fieldsAreReadonly = (loggedUserId !== updatedBy) ? !this.permissions.edit ||
            //     (allowedToEditStatuses.indexOf(productStatus) < 0 && this.permissions.edit) : false;
        } else {
            fieldsAreReadonly = !this.permissions.add;
        }
        return fieldsAreReadonly;
    }

    getValue(key, props) {
        const { editedData, defaultData } = props;
        return editedData.has(key) ? editedData.get(key) : defaultData.get(key);
    }

    onDropdownChange({ key, value, initValue }) {
        const { editApkField } = this.props;
        editApkField({ key: key, value: value, tab: this.tab });
    }

    onInputChange({ key, value, initValue, error, errorMessage }) {
        const { editApkField } = this.props;
        editApkField({
            key: key,
            value,
            tab: this.tab,
            errorMessage: error ? errorMessage : ''
        });
    }

    getDropdownData(key) {
        const { dropdownData } = this.props;
        return dropdownData.has(key) && dropdownData.get(key).toJS();
    }

    onDrop(acceptedFiles,rejectedFiles){
        //Get the file name, size and content and create the file in the root folder
        const { editApkField, saveAPKFile } = this.props;
        acceptedFiles.forEach((apkFile,index) => {
            if(index === 0){
                let value = {
                    name : apkFile.name,
                    path: apkFile.path,
                    size: apkFile.size
                }
                editApkField({ key: 'apkFile', value: value, tab: this.tab });
                //Save the apk
                const reader = new FileReader();
                reader.onload = () => {
                    const fileAsBinaryString = reader.result;
                    // do whatever you want with the file content
                    saveAPKFile(fileAsBinaryString);
                };
                reader.onabort = () => console.log('file reading was aborted');
                reader.onerror = () => console.log('file reading has failed');

                reader.readAsBinaryString(apkFile);
            }
        });
    }

    // Render
    renderInputs(inputs) {
        const { defaultData, editedData } = this.props;
        const inputsReadOnlyStatus = false; // this.getInputsReadonlyStatus();
        return inputs.map((input, index) => {
            let inputKey = Array.isArray(input.key) ? input.key : [input.key];
            const value = editedData.hasIn(inputKey) ? editedData.getIn(inputKey) : defaultData.getIn(inputKey);
            const readonly = input.hasOwnProperty('readonly') ? input.readonly : inputsReadOnlyStatus;
            switch (input.type) {
                case 'text':
                    return this.renderTextInput(index, input, value, readonly);
                case 'dropdown':
                    return this.renderDropDown(index, input, value, readonly);
                case 'dropdownMultiSelect':
                    return this.renderDropDownMultiSelect(index, input, value, readonly);
                case 'datePicker':
                    return this.renderDatePicker(index, input, value, readonly);
                default:
                    break;
            }
        });
    }

    renderTextInput(index, input, value, readonly) {
        const { defaultData, editedData, errors } = this.props;
        return (
            <div key={index} className={classnames(styles.inputWrapper, styles.borderBottom)}>
                <Input
                  key={input.key}
                  keyProp={input.key}
                  errorMessage={errors.get(input.key)}
                  isValid={!errors.get(input.key)}
                  type={input.type}
                  label={input.label}
                  value={value}
                  placeholder={input.placeholder}
                  validators={getInputValidators(input.key)}
                  isEdited={editedData.get(input.key) !== undefined && editedData.get(input.key) !== defaultData.get(input.key)}
                  onChange={this.onInputChange}
                  readonly={readonly}
                />
            </div>
        );
    }

    renderDropDown(index, input, value, readonly) {
        const { editedData, defaultData, errors, mode } = this.props;
        const dropDownData = input.data || this.getDropdownData(input.dataPath) || [];
        const star = input.required ? ' *' : '';
        return (
            <div key={index} className={classnames(styles.inputWrapper, styles.borderBottom)}>
              <Dropdown
                key={input.key}
                data={dropDownData}
                keyProp={input.key}
                errorMessage={errors.get(input.key)}
                defaultSelected={value || input.placeholder}
                label={input.label + star}
                type={input.type}
                isValid={!errors.get(input.key)}
                isEdited={editedData.get(input.key) !== undefined && editedData.get(input.key) !== defaultData.get(input.key)}
                onSelect={this.onDropdownChange}
                disabled={readonly}
              />
              {input.info && <div className={styles.infoText}>{input.info}</div>}
            </div>
        );
    }

    render() {
        const { defaultData, editedData } = this.props;
        const apkName = (editedData.has('apkName') ? editedData.get('apkName') : defaultData.get('apkName')) || 'Select';
        const readonly = this.getInputsReadonlyStatus();

        const actions = [
            <FlatButton label='Cancel' onTouchTap={this.handleDialogCancel} />,
            <FlatButton label='Ok' primary onTouchTap={this.handleDialogOk} />
        ];
        return (
            <div className={styles.container}>
                <div className={styles.contentBoxWrapper}>
                    <LocalTitledContentBox
                      title='Apk Info' >
                        {this.renderInputs(config['apkInfo'].inputs)}
                        {/* this.getValue('account', this.props).map(account => <div>{account.get('accountNumber') + ' -- ' + account.get('currencyName')}</div>) */}
                        {this.permissions.add && 
                        <LocalTitledContentBox
                        title='Drop files here, or click to select files' >
                        <Dropzone 
                            onDrop={this.onDrop}
                            accept=".apk"
                            >
                            {({getRootProps, getInputProps, isDragActive}) => {
                            return (
                                <div
                                {...getRootProps()}
                                >
                                <Text>Drop files here, or click to select files</Text>
                                <input {...getInputProps()} />
                                </div>
                            )
                            }}
                        </Dropzone>
                        </LocalTitledContentBox>
                        }
                    </LocalTitledContentBox>

                    {/* Apk Search Dialog */}
                    <Dialog
                      title='Select Apk'
                      modal
                      open={this.state.isDialogOpen}
                      actions={actions}
                      contentStyle={{ width: '80%', maxWidth: '80%' }}
                      onRequestClose={this.handleDialogCancel} >
                        {this.state.isDialogOpen && <ApkSearch onSelect={this.handleApkSelect} />}
                    </Dialog>
                </div>
            </div>
        );
    }
}

ApkInfo.contextTypes = {
    checkPermission: PropTypes.func
};

ApkInfo.propTypes = {
    // from store
    dropdownData: PropTypes.instanceOf(Map),
    defaultData: PropTypes.instanceOf(Map),
    editedData: PropTypes.instanceOf(Map),
    errors: PropTypes.object,
    // from parent
    mode: PropTypes.string,
    id: PropTypes.string,
    // Actions
    getApk: PropTypes.func.isRequired,
    editApkField: PropTypes.func.isRequired
};

export default connect(
    (state, props) => {
        const { apkInfo } = state;
        const { mode, id } = props;
        return {
            dropdownData: apkInfo.getIn(['common', 'dropdownData']) || new Map(),
            defaultData: apkInfo.getIn([mode, id, 'data', 'apkInfo']) || new Map(),
            editedData: apkInfo.getIn([mode, id, 'edited', 'apkInfo']) || new Map(),
            errors: apkInfo.getIn([mode, id, 'errors']) || new Map()
        };
    }, {
        getApk,
        editApkField,
        saveAPKFile
    }
)(ApkInfo);
