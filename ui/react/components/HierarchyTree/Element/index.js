import React, { Component, PropTypes } from 'react';
import ElementData from '../Tree/ElementData';
import style from './style.css';
import classnames from 'classnames';

class HierarchyElement extends Component {
    get list() {
        var listElements = [];
        for (var i = 0; i < this.props.list.length; i++) {
            let element = this.props.list[i];
            if (element instanceof ElementData) {
                listElements.push(
                    <HierarchyElement
                      key={element.id}
                      name={element.name}
                      list={element.list}
                      nameRightSection={element.nameRightSection}
                      isRoot={false} />);
            }
        }
        return listElements;
    }

    renderNameBox() {
        if (this.props.isRoot) {
            return (
                <div className={classnames(style.elementPlaceholder, style.elementIsRoot)}>
                    <div className={classnames(style.elementWrap, style.elementIsRoot)}>
                        <div className={style.element}>
                            <div className={style.elementNameLeft}>{this.props.name}</div>
                            {this.props.isRoot &&
                            <div className={style.elementNameLeftOwner}>Network Owner</div>}
                            {this.props.nameRightSection &&
                            <div className={style.elementNameRight}>
                                {this.props.nameRightSection}
                            </div>}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className={style.elementPlaceholder}>
                    <div className={style.elementWrap}>
                        <div className={style.element}>
                            <div className={style.elementNameLeft}>{this.props.name}</div>
                            {this.props.nameRightSection &&
                            <div className={style.elementNameRight}>
                                {this.props.nameRightSection}
                            </div>}
                        </div>
                    </div>
                </div>
            );
        }
    }

    renderList() {
        let className = this.props.isRoot ? classnames(style.ul, style.ulRoot) : style.ul;
        return (
            <ul className={className}>
                {this.list}
            </ul>
        );
    }

    render() {
        let className = this.props.isRoot ? classnames(style.li, style.liRoot) : style.li;
        return (
            <li className={className}>
                {this.renderNameBox()}
                {this.renderList()}
            </li>
        );
    }
};

HierarchyElement.propTypes = {
    name: PropTypes.string,
    nameRightSection: PropTypes.node,
    list: PropTypes.array,
    isRoot: PropTypes.bool
};

export default HierarchyElement;
