import React, { PropTypes, Component } from 'react';
import { fromJS, List } from 'immutable';
import { connect } from 'react-redux';
import classnames from 'classnames';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'ut-front-react/components/Input/Checkbox';
import style from './style.css';

class BusinessUnitsBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.expandedNodes = {};
        this.handleOnCheck = this.handleOnCheck.bind(this);
        this.renderModalUnits = this.renderModalUnits.bind(this);
        this.checkIfChildOrParentIsSelected = this.checkIfChildOrParentIsSelected.bind(this);
        this.renderChangeBtn = this.renderChangeBtn.bind(this);
    }

    handleOnCheck(obj) {
        let { activeParents, keyProp, parentsAdded, parentsRemoved, initialValue, onePerLeaf, onCheck } = this.props;

        if (this.props.singleSelection) {
            parentsAdded = new List();
            activeParents = new List();
        }

        // Update parents & update paretnsAdded/parentsRemoved
        const updateParentObject = {key: keyProp, updateEdited: false};
        if (keyProp === 'parent') {
            // Update it for finalValueObject keys
            keyProp = 'parents';
        }
        let finalValueObject = {};
        if (obj.isGranted) {
            let newParentsAddedValue = parentsAdded.push(obj.unitId);

            let activeIds = false;
            if (onePerLeaf) {
                activeIds = this.checkIfChildOrParentIsSelected(obj.unitId);
            }

            if (onePerLeaf && activeIds) {
                // we should remove activeIds from 'activeParents' & 'parentsAdded' (since activeId is integer it is for sure added to these two lists) & added it to parentsRemoved
                let updatedActiveParens;
                let updatedParentsAddedList;
                let updatedParentsRemovedList;
                for (let i = 0; i < activeIds.length; i += 1) {
                    const currentActiveId = activeIds[i];
                    const parentsAddedIndexToRemove = parentsAdded.indexOf(currentActiveId);
                    if (i === 0) { // if this is the first time we should get the original data, if not the variables are already holding values
                        updatedActiveParens = activeParents.filter((item) => item.get('actorId') !== currentActiveId);
                        updatedParentsAddedList = parentsAdded.delete(parentsAddedIndexToRemove);
                        updatedParentsRemovedList = parentsRemoved.push(currentActiveId);
                    } else {
                        updatedActiveParens = updatedActiveParens.filter((item) => item.get('actorId') !== currentActiveId);
                        updatedParentsAddedList = updatedParentsAddedList.delete(parentsAddedIndexToRemove);
                        updatedParentsRemovedList = updatedParentsRemovedList.push(currentActiveId);
                    }
                }

                // add new id to 'activeParents' & 'parentsAdded'
                updatedParentsAddedList = updatedParentsAddedList.push(obj.unitId);
                updatedActiveParens = updatedActiveParens.push(fromJS(obj.unit));

                finalValueObject[keyProp] = updatedActiveParens;
                finalValueObject[keyProp + 'Added'] = updatedParentsAddedList;
                finalValueObject[keyProp + 'Removed'] = updatedParentsRemovedList;
            } else {
                // Check if current value is already added to the removed list
                const removedListIndex = parentsRemoved.indexOf(obj.unitId);
                let newRemovedParentsList;
                if (removedListIndex >= 0) {
                    newRemovedParentsList = parentsRemoved.delete(removedListIndex);
                }

                finalValueObject[keyProp] = activeParents.push(fromJS(obj.unit)); // update parent
                finalValueObject[keyProp + 'Added'] = newParentsAddedValue;
                finalValueObject[keyProp + 'Removed'] = newRemovedParentsList || parentsRemoved;
            }
        } else {
            const newParentsRemovedValue = parentsRemoved.push(obj.unitId);
            const newParentWithoutRemovedOne = activeParents.filter((item) => item.get('actorId') !== obj.unitId); // update parent

            // Check if current value is already added to the added list
            const addedListIndex = parentsAdded.indexOf(obj.unitId);
            let newAddedParentsList;
            if (addedListIndex >= 0) {
                newAddedParentsList = parentsAdded.delete(addedListIndex);
            }

            finalValueObject[keyProp] = newParentWithoutRemovedOne; // update parent
            finalValueObject[keyProp + 'Added'] = newAddedParentsList || parentsAdded;
            finalValueObject[keyProp + 'Removed'] = newParentsRemovedValue;
        }

        if (initialValue) {
            finalValueObject[keyProp + 'Initial'] = initialValue;
        }

        updateParentObject.value = fromJS(finalValueObject);
        onCheck(updateParentObject);
    }

    handleToggle(currentId) {
        if (this.expandedNodes[currentId]) {
            this.expandedNodes[currentId] = false;
        } else {
            this.expandedNodes[currentId] = true;
        }
        this.forceUpdate();
    }

    checkIfChildOrParentIsSelected(id) {
        const { activeParents, unitsTreeChildrenAndParents } = this.props;
        const parentIds = unitsTreeChildrenAndParents.getIn([id, 'parentIds']);
        const childrenIds = unitsTreeChildrenAndParents.getIn([id, 'childrenIds']);
        const activeParentIds = activeParents.map((activeParent) => activeParent.get('actorId'));
        const foundResults = [];

        parentIds.forEach((parentId) => {
            if (activeParentIds.indexOf(parentId) >= 0) {
                foundResults.push(parentId);
            }
        });

        childrenIds.forEach((childrenId) => {
            if (activeParentIds.indexOf(childrenId) >= 0) {
                foundResults.push(childrenId);
            }
        });

        return foundResults.length > 0 ? foundResults : false;
    }

    renderModalUnits(units, activeParents, result, level = 1, counter = 0, previous, isCollapsed = false) {
        for (let i = 0; i < units.size; i += 1) {
            const currentUnit = units.get(i);

            const children = currentUnit.get('children');
            const parents = currentUnit.get('parents');
            const currentId = currentUnit.get('id');
            const dynamicStyle = {paddingLeft: 30 * level - 10, marginTop: 0, diplay: 'table'};

            if (level === 1) {
                dynamicStyle.marginTop = 20;
            }

            const currentNode = { previous, parents };
            const uniqueKey = currentId + counter++;
            const handleCheck = () => {
                const isActive = activeParents.find((item) => item.get('actorId') === currentId);
                const objToPass = {unit: {actorId: currentId, organizationName: currentUnit.get('title')}, unitId: currentId};
                if (isActive) {
                    objToPass.isGranted = false;
                    const {withPrimaryRole, primaryBusinessUnitId, onPrimaryBusinessUnitChange} = this.props;
                    if (withPrimaryRole && primaryBusinessUnitId === currentId) { // uncheck primary BU should clear primary BU
                        onPrimaryBusinessUnitChange(null);
                    }
                } else {
                    objToPass.isGranted = true;
                }
                this.handleOnCheck(objToPass);
            };
            const checked = activeParents.find((item) => item.get('actorId') === currentId) || false;
            if (checked) {
                this.traverseParents(currentNode);
            }
            const expanded = this.expandedNodes[currentId];
            if (!isCollapsed) {
                const defaultClass = style.toggle;
                let toggleClass;
                if (children && children.size > 0) {
                    toggleClass = expanded ? style.toggleExpanded : style.toggleCollapsed;
                }
                let onToggle = () => {
                    this.handleToggle(currentId);
                };
                if (!children) {
                    toggleClass = null;
                    onToggle = () => {};
                }

                result.push(
                    <div style={dynamicStyle} key={uniqueKey}>
                        <div className={style.tableCell}>
                            <span className={classnames([defaultClass, toggleClass])} onClick={onToggle} />
                        </div>
                        <div className={style.tableCell}>
                            <Checkbox onClick={handleCheck} checked={checked} label={currentUnit.get('title')} />
                        </div>
                    </div>
                );
            }

            if (children && children.size) {
                // should be var not let
                var isCollapsedRecursive = !expanded || isCollapsed;
                this.renderModalUnits(children, activeParents, result, level + 1, counter, currentNode, isCollapsedRecursive);
            }
        }

        return result;
    }

    traverseParents(node) {
        if (node.parents && !this.expandedNodes[node.parents]) {
            this.expandedNodes[node.parents] = true;
        }
        if (node.previous) {
            this.traverseParents(node.previous);
        }
    }

    callUnits(units, activeParents, result) {
        // traverse to set expanded nodes in this.expandedNodes valiable
        this.renderModalUnits(units, activeParents, []);
        // traverse to render
        this.renderModalUnits(units, activeParents, result);
        return result;
    }

    renderModal() {
        const save = () => {
            this.props.onSave();
            this.setState({open: false});
        };
        const cancel = () => {
            this.props.onCancel();
            this.setState({open: false});
        };
        const actions = [
            <FlatButton label='Ok' primary onTouchTap={save} />,
            <FlatButton label='Cancel' primary onTouchTap={cancel} />
        ];
        const displayNone = this.props.withPrimaryRole ? null : style.displayNone;
        return (
            <Dialog
              title='Visibility to Business Units'
              actions={actions}
              open={this.state.open}
              autoScrollBodyContent
              style={{paddingTop: 20}}
            >
                <div className={classnames(style.activeBUsWrapperInModal, displayNone)}>
                    {this.renderActiveBusinessUnits()}
                </div>
                {this.callUnits(this.props.unitsTree, this.props.activeParents, [])}
            </Dialog>
        );
    }

    renderActiveBusinessUnits() {
        const { activeParents, withPrimaryRole, primaryBusinessUnitId, onPrimaryBusinessUnitChange } = this.props;
        const displayNone = withPrimaryRole ? null : style.displayNone;
        return <div>
            {activeParents.map((item) => {
                const actorId = item.get('actorId');
                const isPrimary = actorId === primaryBusinessUnitId;

                const primaryStarClass = withPrimaryRole && isPrimary ? style.businessUnitPrimaryStar : null;
                const primaryBUClass = withPrimaryRole && isPrimary ? style.businessUnitBoxPrimary : null;

                const setPrimary = () => {
                    onPrimaryBusinessUnitChange(isPrimary ? null : actorId);
                };
                return <span key={actorId} className={classnames(style.businessUnitBox, primaryBUClass)}>
                    <span className={classnames(style.businessUnitStar, primaryStarClass, displayNone)} onClick={setPrimary} />{item.get('organizationName')}
                </span>;
            })}
        </div>;
    }

    renderChangeBtn() {
        const handleClick = () => {
            this.setState({open: true}, () => {
                this.props.onChangeOpen();
            });
        };
        if (!this.props.isInputsDisabled && !this.props.disabled) {
            return <span onTouchTap={handleClick} className={style.activeLink} style={{cursor: 'pointer'}}>Change</span>;
        }
    }

    render() {
        const { activeParents, withPrimaryRole } = this.props;
        const errorClass = this.props.isValid ? '' : style.error;
        return (
            <TitledContentBox title={this.props.header + ' *'} headRightWrap={!this.props.disabled && this.renderChangeBtn()}>
                {this.renderModal()}

                <div className={style.unitsWrapper}>
                    {this.renderActiveBusinessUnits()}
                    {activeParents.size === 0 && <div className={errorClass}>Please assign at least one business unit</div>}
                    {withPrimaryRole && activeParents.size > 0 ? <div>
                        <div className={style.infoText}>The filled star represents the primary business unit</div>
                        <div className={style.infoText}>To change the primary business unit click on the stars</div>
                    </div> : null}
                </div>
            </TitledContentBox>
        );
    }
}

BusinessUnitsBox.propTypes = {
    header: PropTypes.string,
    unitsTree: PropTypes.object.isRequired,
    // unitsTree: PropTypes.arrayOf(PropTypes.shape({
    //     id: PropTypes.any,
    //     title: PropTypes.any,
    //     children: PropTypes.array
    // })).isRequired,
    activeParents: PropTypes.object.isRequired,
    parentsAdded: PropTypes.object.isRequired,
    parentsRemoved: PropTypes.object.isRequired,
    initialValue: PropTypes.object,
    keyProp: PropTypes.string,
    withPrimaryRole: PropTypes.bool,
    primaryBusinessUnitId: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    onChangeOpen: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    onCheck: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    onePerLeaf: PropTypes.bool,
    unitsTreeChildrenAndParents: PropTypes.object, // is required when onePerLeaf is true
    isValid: PropTypes.bool,
    onPrimaryBusinessUnitChange: PropTypes.func,
    isInputsDisabled: PropTypes.bool,
    singleSelection: PropTypes.bool
};

BusinessUnitsBox.defaultProps = {
    header: 'Business unit assignment',
    disabled: false,
    onePerLeaf: false,
    initialValue: undefined,
    isValid: true,
    keyProp: 'parent',
    withPrimaryRole: false,
    onChangeOpen: () => {},
    updateError: () => {},
    onPrimaryBusinessUnitChange: () => {},
    singleSelection: false
};

function mapStateToProps(state, ownProps) {
    return {
        isInputsDisabled: state.userProfile.get('isInputsDisabled')
    };
}

export default connect(mapStateToProps, {})(BusinessUnitsBox);
