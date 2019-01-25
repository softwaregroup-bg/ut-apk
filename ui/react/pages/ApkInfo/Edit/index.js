import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, List } from 'immutable';

import { removeTab, updateTabTitle } from 'ut-front-react/containers/TabMenu/actions';
import { AddTab } from 'ut-front-react/containers/TabMenu';
import TabContainer from 'ut-front-react/containers/TabContainer';
import StatusDialog from 'ut-front-react/components/StatusDialog';
import Container from 'ut-front-react/components/PageLayout/Container';
import Content from 'ut-front-react/components/PageLayout/Content';
import { getLink } from 'ut-front/react/routerHelper';

import { getTabValidations as getApkInfoTabValidations } from '../tabs/ApkInfo/validations';

import ApkInfo from '../tabs/ApkInfo';

import { prepareApkToAdd } from '../helpers';
import {
    getApk,
    setActiveTab,
    resetApkState,
    updateErrors,
    editApk,
    fetchAvailableBusinessUnits
} from '../actions.js';

const baseTabTitle = 'Edit Apk ';

const getPath = (id) => getLink('ut-apk:apkEdit', {id: id});

class ApkEdit extends Component {
    constructor(props, context) {
        super(props, context);
        this.permissions = {
            edit: context.checkPermission('apk.apk.edit')
        };
        // Bind the actions
        this.renderTabContainer = this.renderTabContainer.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.updateErrors = this.updateErrors.bind(this);
    }

    componentWillMount() {
        const { setActiveTab, getApk, fetchAvailableBusinessUnits, params: { id } } = this.props;
        setActiveTab({
            mode: 'edit',
            id: id
        });
        fetchAvailableBusinessUnits();
        getApk(id);
    }

    getValue(key, props) {
        const { allData } = props;
        const editedData = allData.get('edited', new Map());
        const defaultData = allData.get('data', new Map());
        const keyArr = Array.isArray(key) ? key : [key];
        return editedData.hasIn(keyArr) ? editedData.getIn(keyArr) : defaultData.getIn(keyArr);
    }

    componentWillReceiveProps(nextProps) {
        const nextId = this.getValue(['apkInfo', 'apkId'], nextProps);
        const currentId = this.getValue(['apkInfo', 'apkId'], this.props);
        if (nextId !== currentId) {
            const pathname = getPath(nextId);
            const identifier = this.getValue(['apkInfo', 'apkFileName'], nextProps);
            this.props.updateTabTitle(pathname, baseTabTitle + identifier);
        }
    }

    handleDialogClose() {
        const { resetApkState } = this.props;
        resetApkState(false);
        if (this.closeHandler) {
            this.closeHandler();
        }
    }

    updateErrors(errors) {
        this.props.updateErrors({
            errors
        });
    }

    renderTabContainer() {
        const { allData, errors, params: { id }, editApk } = this.props;
        const tabs = [
            {
                title: 'Apk Info',
                component: <ApkInfo mode='edit' id={id} />,
                validations: getApkInfoTabValidations(errors, allData)
            }
        ];
        const save = () => {
            const { allData } = this.props;
            const mdata = allData.mergeDeepIn(['data'], allData.get('edited'));
            return editApk(prepareApkToAdd(mdata));
        };
        const close = () => {
            this.props.removeTab(this.props.activeTab.pathname);
        };
        const saveAndClose = () => {
            return save().then((response) => {
                if (!response.error) {
                    this.closeHandler = close;
                }
                return Promise.resolve();
            });
        };
        let actionButtons = [
            { text: 'Close', onClick: close }
        ];

        if (this.permissions.edit) {
            actionButtons = [
                { text: 'Save and Close', performFullValidation: true, onClick: saveAndClose, styleType: 'primaryLight' },
                { text: 'Save', performFullValidation: true, onClick: save },
                { text: 'Close', onClick: close }
            ];
        }

        return (
            <TabContainer
              sourceMap={this.mergedData}
              headerTitle={baseTabTitle}
              headerBreadcrumbsRemoveSlashes={2}
              actionButtons={actionButtons}
              tabs={tabs}
              errors={errors}
              onErrors={this.updateErrors} />
        );
    }

    get mergedData() {
        const { allData } = this.props;
        return allData.get('data', new Map()).mergeDeep(allData.get('edited'));
    }

    render() {
        const { status, params: { id } } = this.props;
        return (
            <div>
                <AddTab pathname={getPath(id)} title={baseTabTitle + this.mergedData.get('identifier', '')} />
                <StatusDialog status={status} onClose={this.handleDialogClose} />
                <Container>
                    <Content style={{ position: 'relative' }}>
                        {this.renderTabContainer()}
                    </Content>
                </Container>
            </div>
        );
    }
}

ApkEdit.contextTypes = {
    checkPermission: PropTypes.func
};

ApkEdit.propTypes = {
    allData: PropTypes.instanceOf(Map),
    status: PropTypes.instanceOf(Map),
    errors: PropTypes.instanceOf(Map),
    organization: PropTypes.instanceOf(List),
    activeTab: PropTypes.object,
    // Injected by react-router
    params: PropTypes.object,
    // Actions
    removeTab: PropTypes.func.isRequired,
    updateTabTitle: PropTypes.func.isRequired,
    getApk: PropTypes.func.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    resetApkState: PropTypes.func.isRequired,
    updateErrors: PropTypes.func.isRequired,
    editApk: PropTypes.func.isRequired,
    fetchAvailableBusinessUnits: PropTypes.func.isRequired
};

const mapStateToProps = (store, props) => {
    const { id } = props.params;
    const { apkInfo, tabMenu } = store;
    return {
        allData: apkInfo.getIn(['edit', id]) || new Map(),
        status: apkInfo.getIn(['edit', id, 'status']) || new Map(),
        errors: apkInfo.getIn(['edit', id, 'errors']) || new Map(),
        organization: apkInfo.getIn(['common', 'dropdownData', 'organization']) || new List(),
        activeTab: tabMenu.active
    };
};

export default connect(
    mapStateToProps,
    {
        removeTab,
        updateTabTitle,
        getApk,
        setActiveTab,
        resetApkState,
        updateErrors,
        editApk,
        fetchAvailableBusinessUnits
    }
)(ApkEdit);
