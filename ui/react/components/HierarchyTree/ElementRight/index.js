import React, { PropTypes } from 'react';
import style from './style.css';
import classnames from 'classnames';

const ElementRight = ({ onDelete, onEdit, elementData, hasChild }) => {
    return (
        <div>
            <div className={style.buttonsWrap}>
                <div className={style.buttons}>
                    <div className={hasChild
                        ? classnames(style.buttons, style.buttonSettings, style.buttonSettingsDisabled)
                        : classnames(style.buttons, style.buttonSettings)} onClick={!hasChild && onEdit} />
                    <div className={hasChild
                        ? classnames(style.buttons, style.buttonSettings, style.buttonDeleteDisabled)
                        : classnames(style.buttons, style.buttonDelete)} onClick={!hasChild && onDelete} />
                </div>
            </div>
        </div>
    );
};

ElementRight.propTypes = {
    elementData: PropTypes.object,
    hasChild: PropTypes.bool,
    onDelete: PropTypes.func,
    onEdit: PropTypes.func
};

export default ElementRight;
