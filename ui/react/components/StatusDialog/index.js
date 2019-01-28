import React, { PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

function StatusDialog(props) {
    const { status, onClose } = props;
    const actions = [
        <FlatButton label='Ok' onTouchTap={onClose} />
    ];

    const isOpen = status.size > 0;
    const upperCasedStatus = status.get('status', '').toUpperCase();
    const message = status.get('message');
    const displayMsg = [];

    if (upperCasedStatus) {
        displayMsg.push(upperCasedStatus);
    }

    if (message) {
        displayMsg.push(message);
    }

    return (
        <div>
            <Dialog actions={actions} modal open={isOpen}>
                <div dangerouslySetInnerHTML={{__html: displayMsg.join(' - ')}} />
            </Dialog>
        </div>
    );
};

StatusDialog.propTypes = {
    status: PropTypes.object.isRequired, // immutalbe object,
    onClose: PropTypes.func.isRequired
};

export default StatusDialog;
