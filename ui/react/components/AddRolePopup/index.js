import React, { Component, PropTypes} from 'react';
// import immutable from 'immutable';
import Popover from 'material-ui/Popover';
import Popup from 'ut-front-react/components/Popup';
import SearchBox from 'ut-front-react/components/SearchBox';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import { SimpleGrid } from 'ut-front-react/components/SimpleGrid';
import { tabConfig, titleConfig } from './config';
import style from './style.css';

const maxRows = 10;

const fields = [{
    title: 'Role',
    name: 'name'
}];
class AddRolePopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchString: '',
            openSearchGrid: false,
            selectedRole: {},
            selectedParentRole: '',
            selectedRoleUpdated: {},
            selectedParentRoleUpdated: '',
            rolesFromSearch: [],
            errorMessage: ''
        };
        this.closePopup = this.closePopup.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleRoleSearch = this.handleRoleSearch.bind(this);
        this.closeRoleSearch = this.closeRoleSearch.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let { selectedRole, selectedParentRole } = nextProps;
        selectedRole && this.setState({ selectedRole });
        selectedParentRole && this.setState({ selectedParentRole });
    }

    get actionButtons() {
        let { selectedRole, selectedParentRole, selectedRoleUpdated, selectedParentRoleUpdated } = this.state;
        let { modeHierarchy, modeNode } = this.props;
        let label = modeHierarchy === 'network' ? titleConfig[modeHierarchy] : titleConfig[modeNode];
        let role = selectedRoleUpdated || selectedRole;
        let parentRole = selectedParentRoleUpdated || selectedParentRole;
        let hasChange = false;
        let disabled;
        if (modeHierarchy === 'role') {
            hasChange = (selectedRoleUpdated.size > 0 && selectedRole !== selectedRoleUpdated.get('key')) ||
            (selectedParentRoleUpdated && selectedParentRole !== selectedParentRoleUpdated);
            disabled = modeNode === 'editNode' && hasChange
                ? !(role.isValid === 1 || parentRole !== '')
                : !(role.isValid === 1 && parentRole !== '');
        } else {
            disabled = role.isValid !== 1;
        }

        return [
            {
                label: label,
                styleType: 'primaryDialog',
                disabled: disabled,
                onClick: this.handleSave
            },
            {
                label: 'Cancel',
                styleType: 'secondaryDialog',
                onClick: this.closePopup
            }
        ];
    }

    closePopup() {
        this.setState({
            searchString: '',
            selectedRole: {},
            selectedParentRole: '',
            selectedRoleUpdated: {},
            selectedParentRoleUpdated: '',
            rolesFromSearch: [],
            errorMessage: ''
        });
        this.props.closePopup();
    }

    handleSave() {
        const { selectedRole, selectedParentRole, selectedRoleUpdated, selectedParentRoleUpdated } = this.state;
        this.props.onSubmit({ selectedRole, selectedParentRole, selectedRoleUpdated, selectedParentRoleUpdated });
        this.closePopup();
    }

    handleRoleSearch(searchString) {
        const { availableRoles } = this.props;
        const data = availableRoles.filter((role) => role.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1);

        this.setState({
            searchString: searchString,
            openSearchGrid: true,
            rolesFromSearch: data,
            errorMessage: ''
        });

        return data;
    }

    closeRoleSearch() {
        this.setState({
            openSearchGrid: false
        });
    }

    // Handles selection of role

    handleRowClick(rowData) {
        let { selectedRole } = this.state;
        if (selectedRole) {
            this.setState({
                selectedRoleUpdated: rowData
            });
        } else {
            this.setState({
                selectedRole: rowData
            });
        }
        this.setState({
            searchString: '',
            errorMessage: (rowData && rowData.isValid === 0) ? 'This role is assigned to more than one networks and cannot be used.' : ''
        });
        this.closeRoleSearch();
        return rowData;
    }

    // Handle selection of parent

    handleDropdownChange({value}) {
        let { selectedParentRole } = this.state;
        if (selectedParentRole) {
            this.setState({
                selectedParentRoleUpdated: value
            });
        } else {
            this.setState({
                selectedParentRole: value
            });
        }
    }

    renderRoles(data, fields, handleRowClick) {
        if (data.length > maxRows) {
            return (
                <div className={style.gridResults}>
                    The results are more than 10 - please enter more detailed information!
                </div>
            );
        } else if (data.length === 0) {
            return (
                <div className={style.gridResults}>
                    No results found!
                </div>
            );
        }
        data.forEach((role) => {
            role.rowStyle = role.isValid === 1 ? '' : 'invalid';
        });

        return (
            <div className={style.gridWidth}>
                <SimpleGrid fields={fields} data={data} handleRowClick={handleRowClick} externalStyle={style} rowStyleField={'rowStyle'} />
            </div>
        );
    }

    renderPopupInputs(inputs) {
        const { modeHierarchy, modeNode, dropdownData } = this.props;
        let { selectedRole, selectedRoleUpdated, selectedParentRole, selectedParentRoleUpdated, openSearchGrid, rolesFromSearch, errorMessage } = this.state;
        let role = (selectedRoleUpdated.key) ? selectedRoleUpdated : selectedRole;
        let parentRole = selectedParentRoleUpdated || selectedParentRole;
        let dropdownDataUpdated = dropdownData.filter((parent) => {
            return parentRole ? parent.key !== selectedRole.key : true;
        });
        let searchStyle = {
            searchBoxWrapInput: style.invalidRole
        };
        let editedStyle = {
            searchBoxWrapInput: style.editedInput
        };
        let popoverStyle = {
            marginTop: '-11px',
            marginLeft: '69px'
        };
        let externalStyle = (role.key && role.isValid === 0)
            ? searchStyle
            : modeNode === 'editNode' && selectedRoleUpdated.key && selectedRoleUpdated !== selectedRole
                ? editedStyle : {};
        return inputs.map((input, index) => {
            if (!input.availableFor || (input.availableFor && input.availableFor === modeHierarchy)) {
                switch (input.type) {
                    case 'search':
                        return (
                            <div key={index} className={style.row} ref={(target) => { this.roleNameTarget = target; }}>
                                <SearchBox
                                  keyprop={input.type}
                                  defaultValue={this.state.searchString || role.name}
                                  label={input.label}
                                  boldLabel
                                  placeholder={input.placeholder}
                                  onSearch={this.handleRoleSearch}
                                  externalStyle={externalStyle} />
                                {errorMessage && <div className={style.error}>{errorMessage}</div>}
                                <Popover
                                  open={openSearchGrid}
                                  style={popoverStyle}
                                  anchorEl={this.roleNameTarget}
                                  anchorOrigin={{horizontal: 'middle', vertical: 'bottom'}}
                                  targetOrigin={{horizontal: 'middle', vertical: 'top'}}
                                  onRequestClose={this.closeRoleSearch} >
                                    {this.renderRoles(rolesFromSearch, fields, this.handleRowClick)}
                                </Popover>
                             </div>
                        );
                    case 'dropdown':
                        return (
                            <div key={index} className={style.row}>
                                <Dropdown
                                  keyprop={input.type}
                                  data={dropdownDataUpdated || []}
                                  defaultSelected={parentRole}
                                  label={input.label}
                                  placeholder={input.placeholder}
                                  boldLabel
                                  onSelect={this.handleDropdownChange}
                                  isEdited={!!(modeNode === 'editNode' && selectedParentRoleUpdated && selectedParentRole !== selectedParentRoleUpdated)}
                                  />
                            </div>
                        );
                    default:
                        break;
                }
            }
        });
    }

    render() {
        const { isOpen, modeHierarchy, modeNode } = this.props;
        let title = modeHierarchy === 'network' ? titleConfig[modeHierarchy] : titleConfig[modeNode];
        return (
            <Popup
              isOpen={isOpen}
              header={{ text: title, closePopup: this.closePopup }}
              footer={{ actionButtons: this.actionButtons }}
              closePopup={this.closePopup} >
                {this.renderPopupInputs(tabConfig || [])}
            </Popup>
        );
    }
}

AddRolePopup.propTypes = {
    modeHierarchy: PropTypes.string,
    modeNode: PropTypes.string,
    availableRoles: PropTypes.array,
    dropdownData: PropTypes.array,
    selectedRole: PropTypes.shape({
        key: PropTypes.string,
        name: PropTypes.string,
        isValid: PropTypes.number
    }),
    selectedParentRole: PropTypes.string,
    isOpen: PropTypes.bool,
    closePopup: PropTypes.func,
    onSubmit: PropTypes.func
};

export default AddRolePopup;
