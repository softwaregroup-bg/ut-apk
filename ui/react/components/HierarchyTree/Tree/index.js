import React, { Component, PropTypes } from 'react';
import ElementData from './ElementData';
import Element from '../Element';
import style from './style.css';

class HierarchyTree extends Component {
    render() {
        const { rootElement, makerCheckerMode } = this.props;
        if (rootElement !== null) {
            return (
                <ul className={makerCheckerMode ? style.makerCheckerWrapper : style.wrapper}>
                    <Element name={rootElement.name} list={rootElement.list} isRoot nameRightSection={rootElement.nameRightSection} />
                </ul>
            );
        } else {
            return (
                <div className={makerCheckerMode ? style.makerCheckerWrapper : style.wrapper}>No Hierarchy.</div>
            );
        }
    }
};

HierarchyTree.propTypes = {
    rootElement: PropTypes.instanceOf(ElementData),
    makerCheckerMode: PropTypes.bool
};

export default HierarchyTree;
