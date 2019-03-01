import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { Button } from 'reactstrap';
import classnames from 'classnames';
import Text from 'ut-front-react/components/Text';
import ConfirmDialog from 'ut-front-react/components/ConfirmDialog';
import { getLink } from 'ut-front/react/routerHelper';

import { lockApk, deleteApk, approveApk } from '../../../pages/ApkList/actions';
import style from './style.css';

class ToolboxButtons extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            statusToSet : ''
        }
        this.permissions = {
            approve: context.checkPermission('apk.apk.approve'),
            lock: context.checkPermission('apk.suspendStatus.edit'),
            delete: context.checkPermission('apk.apk.delete')
        };
        this.getPrimaryActionButton = this.getPrimaryActionButton.bind(this);
        this.getLockButton = this.getLockButton.bind(this);
        this.getApproveButton = this.getApproveButton.bind(this);
    }

    componentWillMount(){
        let { selected } = this.props;
        this.setState({statusToSet: selected.get('statusId') === 'locked' ? 'pending' : 'locked'});
    }

    getPrimaryActionButton() {
        let { selected } = this.props;
        let isButtonDisabled = (selected.size === 0);
        let path;
        let label;
        // if (selected.get('statusId') === 'approved') {
        path = getLink('ut-apk:apkEdit', {id: selected.get('apkId')});
        label = 'Edit';
        // } else {
        //     path = getLink('ut-apk:apkApprove', {id: selected.get('apkId')});
        //     label = 'View Details';
        // }
        let className = isButtonDisabled ? style.statusActionButtonDisabled : style.statusActionButton;
        if (isButtonDisabled) {
            return (
                <Button
                  className={classnames('button', className)}
                  disabled={isButtonDisabled}>
                  <Text>{label}</Text>
                </Button>
            );
        } else {
            return (
                <Link to={path}>
                    <Button className={classnames('button', className)}>
                        <Text>{label}</Text>
                    </Button>
                </Link>
            );
        }
    }

    getApproveButton() {
        const { selected } = this.props;

        const canApprove = this.permissions.approve;
        const isButtonEnabled = !!(canApprove && selected.size);
        const className = isButtonEnabled ? style.statusActionButton : style.statusActionButtonDisabled;

        const handleButtonClick = () => {
            this.refs['confirmDialog-approve'].open();
        };

        return (
            <Button
              className={classnames('button', className)}
              onClick={handleButtonClick}
              disabled={!isButtonEnabled}>
              <Text>Approve</Text>
            </Button>
        );
    }

    getLockButton() {
        const { selected } = this.props;

        const canLock = this.permissions.lock;
        const byParent = selected.get('isSuspended') && selected.get('suspender') !== selected.get('apkId');
        const label = selected.get('statusId') === 'locked' ? 'Unlock' : 'Lock';
        const isButtonEnabled = !!(canLock && selected.size && !byParent);
        const className = isButtonEnabled ? style.statusActionButton : style.statusActionButtonDisabled;

        const handleButtonClick = () => {
            this.refs['confirmDialog-lock'].open();
        };

        return (
            <Button
              className={classnames('button', className)}
              onClick={handleButtonClick}
              disabled={!isButtonEnabled}>
              <Text>{label}</Text>
            </Button>
        );
    }

    getDeleteButton() {
        const { selected } = this.props;
        const canDelete = this.permissions.delete;
        const isButtonEnabled = !!(canDelete && selected.size);
        const className = isButtonEnabled ? style.statusActionButton : style.statusActionButtonDisabled;

        const handleButtonClick = () => {
            this.refs['confirmDialog-delete'].open();
        };

        return (
            <Button
              className={classnames('button', className)}
              onClick={handleButtonClick}
              disabled={!isButtonEnabled}>
              <Text>Delete</Text>
            </Button>
        );
    }

    render() {
        const primaryActionButton = this.getPrimaryActionButton();
        const lockButton = this.getLockButton();
        const deleteButton = this.getDeleteButton();
        const approveButton = this.getApproveButton();
        const { selected, lockApk, deleteApk, approveApk } = this.props;
        const {statusToSet} = this.state;

        return (
            <div>
                <ConfirmDialog
                  ref={'confirmDialog-approve'}
                  cancelLabel={'No'}
                  submitLabel={'Yes'}
                  title={'Confirm'}
                  message={'Are you sure that you want to approve the selected apk?'}
                  onSubmit={() => { approveApk(selected && selected.get('apkId')); }}
                />
                <ConfirmDialog
                  ref={'confirmDialog-lock'}
                  cancelLabel={'No'}
                  submitLabel={'Yes'}
                  title={'Confirm'}
                  message={'Are you sure that you want to change the lock status of the selected apk?'}
                  onSubmit={() => { lockApk(selected && selected.get('apkId'), statusToSet); }}
                />
                <ConfirmDialog
                  ref={'confirmDialog-delete'}
                  cancelLabel={'No'}
                  submitLabel={'Yes'}
                  title={'Confirm'}
                  message={'Are you sure that you want to delete the selected apk?'}
                  onSubmit={() => { deleteApk(selected && selected.get('apkId')); }}
                />
                <div className={style.actionStatusButtonWrap}>{primaryActionButton}</div>
                <div className={style.actionStatusButtonPad} />
                <div className={style.actionStatusButtonWrap}>{approveButton}</div>
                <div className={style.actionStatusButtonPad} />
                <div className={style.actionStatusButtonWrap}>{lockButton}</div>
                <div className={style.actionStatusButtonPad} />
                <div className={style.actionStatusButtonWrap}>{deleteButton}</div>
            </div>
        );
    };
};

ToolboxButtons.propTypes = {
    selected: PropTypes.object.isRequired, // immutable
    lockApk: PropTypes.func.isRequired,
    deleteApk: PropTypes.func.isRequired,
    approveApk: PropTypes.func.isRequired
};

ToolboxButtons.contextTypes = {
    checkPermission: PropTypes.func
};

export default connect(
    ({ apksList }) => {
        return {
            selected: apksList.get('selected')
        };
    },
    { lockApk, deleteApk, approveApk }
)(ToolboxButtons);
