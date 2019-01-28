import React, { PropTypes } from 'react';
import classnames from 'classnames';
import localStyle from './style.css';

EmptyStateWrapper.propTypes = {
    children: PropTypes.node,
    style: PropTypes.any
};

/**
 * Full-size container which centers its children both horizontally & vertically
 */
function EmptyStateWrapper(props) {
    const { children, style } = props;
    return (
        <div className={classnames(localStyle.fillParent, localStyle.centerChildrenFlex, localStyle.tableHeader)} style={style}>
             {children}
        </div>
    );
}

export default EmptyStateWrapper;
