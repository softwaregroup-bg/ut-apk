import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Map, List, fromJS } from 'immutable';

import { removeTab } from 'ut-front-react/containers/TabMenu/actions';
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
    setActiveTab,
    resetApkState,
    updateErrors,
    createApk,
    fetchAvailableBusinessUnits
} from '../actions.js';

const baseTabTitle = 'Add Apk';

class ApkCreate extends Component {
    constructor(props, context) {
        super(props, context);
        this.renderTabContainer = this.renderTabContainer.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.updateErrors = this.updateErrors.bind(this);
    }

    componentWillMount() {
        const { setActiveTab, fetchAvailableBusinessUnits } = this.props;
        setActiveTab({
            mode: 'create',
            id: 'create'
        });
        fetchAvailableBusinessUnits();
    }

    componentWillReceiveProps(newProps) {}

    componentWillUnmount() {
        const { resetApkState } = this.props;
        resetApkState(true);
    }

    handleDialogClose() {
        const { resetApkState, status } = this.props;
        resetApkState(status.get('status') !== 'failed');
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
        const { allData, errors } = this.props;
        const tabs = [
            {
                title: 'Apk Info',
                component: <ApkInfo mode='create' id='create' />,
                validations: getApkInfoTabValidations(errors, allData)
            }
        ];
        const create = () => {
            const { allData } = this.props;
            return this.props.createApk(prepareApkToAdd(allData));
        };
        const close = () => {
            this.props.removeTab(this.props.activeTab.pathname);
        };
        const createAndClose = () => {
            return create().then((response) => {
                if (!response.error) {
                    this.closeHandler = close;
                }
                return Promise.resolve();
            });
        };
        const actionButtons = [
            { text: 'Add and Close', performFullValidation: true, onClick: createAndClose },
            { text: 'Add', performFullValidation: true, onClick: create },
            { text: 'Close', onClick: close }
        ];
        return (
            <TabContainer
              sourceMap={allData.get('data')}
              headerTitle={baseTabTitle}
              headerBreadcrumbsRemoveSlashes={2}
              actionButtons={actionButtons}
              tabs={tabs}
              errors={errors}
              onErrors={this.updateErrors} />
        );
    }

    render() {
        const { status } = this.props;

        return (
            <div>
                <AddTab pathname={getLink('ut-apk:apkCreate')} title={baseTabTitle} />
                <StatusDialog status={status} onClose={this.handleDialogClose} />
                <Container>
                    <Content style={{position: 'relative'}}>
                        {this.renderTabContainer()}
                    </Content>
                </Container>
            </div>
        );
    }
}

ApkCreate.contextTypes = {
    checkPermission: PropTypes.func
};

ApkCreate.propTypes = {
    allData: PropTypes.instanceOf(Map),
    externalUsers: PropTypes.instanceOf(List),
    status: PropTypes.instanceOf(Map),
    errors: PropTypes.instanceOf(Map),
    organization: PropTypes.instanceOf(List),
    activeTab: PropTypes.object,
    // Actions
    setActiveTab: PropTypes.func,
    removeTab: PropTypes.func,
    createApk: PropTypes.func,
    resetApkState: PropTypes.func,
    updateErrors: PropTypes.func,
    fetchLanguages: PropTypes.func,
    fetchItems: PropTypes.func,
    fetchAvailableBusinessUnits: PropTypes.func.isRequired,
    apkOrganization: PropTypes.string
};

const mapStateToProps = (store, ownProps) => {
    const {apkInfo, tabMenu} = store;
    return {
        allData: apkInfo.getIn(['create', 'create']) || new Map(),
        status: apkInfo.getIn(['create', 'create', 'status']) || new Map(),
        errors: apkInfo.getIn(['create', 'create', 'errors']) || new Map(),
        organization: apkInfo.getIn(['common', 'dropdownData', 'organization']) || new List(),
        apkOrganization: apkInfo.getIn(['create', 'create', 'data', 'apkInfo', 'organizationId'], ''),

        activeTab: tabMenu.active
    };
};

export default connect(
    mapStateToProps,
    {
        setActiveTab,
        removeTab,
        createApk,
        resetApkState,
        updateErrors,
        fetchAvailableBusinessUnits
    }
)(ApkCreate);
