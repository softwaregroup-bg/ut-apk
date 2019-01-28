import React, { PropTypes } from 'react';
import DropDownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import DropUpArrow from 'material-ui/svg-icons/navigation/arrow-drop-up';
import classnames from 'classnames';
import style from './style.css';

const defaultIconStyle = {
    width: '26px',
    height: '26px',
    color: '#fff'
};

export default function DropdownRenderer(props) {
    const { children, onClick, open, iconStyle, disabled } = props;
    // Material-UI icons inline the color, width, height - allow the client to change them -.-
    const computedStyle = Object.assign({}, defaultIconStyle, iconStyle);
    const rootClassName = classnames(style.dropdownWrap, {[style.dropdownWrapDisabled]: disabled});
    const iconClassName = classnames(style.dropdownIcon, {[style.dropdownIconDisabled]: disabled});
    return (
        <div onClick={!disabled && onClick} className={rootClassName} style={{display: 'flex', alignItems: 'stretch', justifyContent: 'center', padding: '1px'}}>
            <span style={{flexGrow: 1}}>{children}</span>
            <div style={{height: 'auto'}}>
                { open
                    ? <DropUpArrow className={iconClassName} style={computedStyle} />
                    : <DropDownArrow className={iconClassName} style={computedStyle} />
                }
            </div>
        </div>
    );
}

DropdownRenderer.propTypes = {
    children: PropTypes.node,
    open: PropTypes.bool,
    onClick: PropTypes.func,
    iconStyle: PropTypes.object,
    disabled: PropTypes.bool
};
