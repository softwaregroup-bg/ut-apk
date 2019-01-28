import React, { PropTypes } from 'react';
import { List, Map } from 'immutable';
import Popover from 'material-ui/Popover';
import { Table, Column } from 'react-virtualized';
import { ListItem } from 'material-ui/List';

const NO_OP = () => {};

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            anchorEl: undefined
        };

        this.cachedRenderer = ({cellData, columnData, dataKey, isScrolling, rowData, rowIndex}) => {
            return this.props.optionRenderer(rowData);
        };

        this.handleDropdownClick = this.handleDropdownClick.bind(this);
        this.handleRequestClose = this.handleRequestClose.bind(this);
        // React-virtualized bindings
        this.handleRowClick = this.handleRowClick.bind(this);
        this.rowGetter = ({index}) => this.props.data.get(index);
        this.cellDataGetter = ({columnData, dataKey, rowData}) => rowData;
    }

    handleRowClick({ index }) {
        const { onSelect, data } = this.props;
        if (typeof onSelect === 'function') {
            onSelect(data.get(index));
        }
        this.setState({
            open: false
        });
    }

    handleDropdownClick(event) {
        // This prevents ghost click.
        event.preventDefault();

        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    }

    handleRequestClose() {
        this.setState({
            open: false
        });
    }

    render() {
        const { data, selected, disabled } = this.props;
        return (
            <span onClick={!disabled && this.handleDropdownClick}>
                {this.props.selectRenderer(selected, this.state.open)}

                <Popover
                  open={this.state.open}
                  animated={false}
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'left', vertical: 'top'}}
                  onRequestClose={this.handleRequestClose}>
                    <Table
                      width={582}
                      height={Math.min(48 * data.size, 400)}
                      rowCount={data.size}
                      onRowClick={this.handleRowClick}
                      rowGetter={this.rowGetter}
                      rowHeight={48}
                      style={{padding: '10px 0px'}}>
                        <Column
                          dataKey='data'
                          flexGrow={1}
                          width={562}
                          cellRenderer={this.cachedRenderer}
                          cellDataGetter={this.cellDataGetter}
                          />
                    </Table>
                </Popover>
            </span>
        );
    }
}

Select.propTypes = {
    data: PropTypes.instanceOf(List).isRequired,

     /** Renders the dropdown menu
     * (selectedOptionData, isOpen) => React.Element
     */
    selectRenderer: PropTypes.func.isRequired,

    /** Renders a single option
     * (optionData) => React.Element
     */
    optionRenderer: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
    selected: PropTypes.instanceOf(Map)
};

Select.defaultProps = {
    data: new Map(),
    onSelect: NO_OP,
    optionRenderer: (optionData) => {
        return (
            <ListItem
              primaryText={'Item'}
            />
        );
    },
    selectRenderer: (selectedOptionData, isOpen) => {
        return (
            <ListItem
              primaryText={'Select'}
            />
        );
    }
};

export default Select;
