import React, { PropTypes } from 'react';
import { List } from 'immutable';
import { Table, Column, AutoSizer } from 'react-virtualized';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { EmptyStateWrapper } from '../Table';
import DropdownRenderer from './DropdownRenderer';

function clamp(val, min, max) {
    return val <= min ? min : val >= max ? max : val;
}

function asArrayOrDefault(value, defArray = []) {
    return Array.isArray(value) ? value : (value ? [value] : defArray);
}

function applyFilter(data, nameProp, filter) {
    if (filter) {
        const trimmed = filter && filter.toLowerCase().trim();
        return data.filter((value) => value.getIn(nameProp).toLowerCase().includes(trimmed));
    } else {
        return data;
    }
}

const INDEX_NONE = -1;

class SelectPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,

            keyProp: asArrayOrDefault(props && props.keyProp, []),
            nameProp: asArrayOrDefault(props && props.nameProp, []),

            filterString: '', // Used to filter the data
            filteredData: props.data, // The filtered data
            focusIndex: INDEX_NONE, // Used when the user presses the arrow keys & enter
            selectedIndex: INDEX_NONE // Used for initial 'scrollTo'
        };

        this.getData = () => this.state.filteredData;

        this._onKey = (e) => {
            let { filterString } = this.state;
            let dir = 0;

            e.preventDefault();
            switch (e.which) {
                case 8: // Backspace
                    filterString = filterString.substr(0, Math.max(filterString.length - 1, 0));
                    break;
                case 13: // Enter
                    this.handleRowClick({index: this.state.focusIndex});
                    return;
                case 46: // Delete
                    filterString = '';
                    break;
                case 40: // DownArrow
                case 98: // Num2
                    dir = 1;
                    break;
                case 38: // UpArrow
                case 104: // Num8
                    dir = -1;
                    break;
                case 33: // PageUp
                    dir = -10;
                    break;
                case 34: // PageDown
                    dir = 10;
                    break;
                default:
                    if ((e.which >= 48 && e.which <= 90) || e.which === 32) {
                        filterString += e.key;
                    }
                    break;
            }
            const newFiltered = applyFilter(this.props.data, this.state.nameProp, filterString);
            const focusIndex = clamp(this.state.focusIndex + dir, 0, newFiltered.size - 1);

            this.setState({
                filterString,
                filteredData: newFiltered,
                focusIndex
            });
        };
        this.setDialogOpen = (isOpen) => {
            if (isOpen) {
                const filteredData = applyFilter(this.props.data, this.state.nameProp, '');
                const selectedIndex = this.props.selected ? filteredData.findIndex(value => value && value.getIn(this.state.keyProp) === this.props.selected) : INDEX_NONE;
                this.setState({
                    open: isOpen,
                    // We clear the filter when opening
                    filterString: '',
                    filteredData,
                    selectedIndex,
                    focusIndex: selectedIndex
                }, () => window.addEventListener('keydown', this._onKey));
            } else {
                this.setState({
                    open: isOpen
                }, () => window.removeEventListener('keydown', this._onKey));
            }
        };
        this.handleDialogCancel = () => this.setDialogOpen(false);
        this.handleDialogOpen = (e) => {
            e.preventDefault();
            this.setDialogOpen(true);
        };
        // React-virtualized bindings
        this.cellRenderer = ({cellData, columnData, dataKey, isScrolling, rowData, rowIndex}) => {
            return this.props.optionRenderer(cellData, rowIndex === this.state.focusIndex);
        };
        this.handleRowClick = this.handleRowClick.bind(this);
        this.rowGetter = ({index}) => this.getData().get(index);
        this.cellDataGetter = ({columnData, dataKey, rowData}) => rowData.getIn(dataKey);
        this.noRowsRenderer = () => <EmptyStateWrapper>No matches</EmptyStateWrapper>;
    }

    componentDidMount() {
        this.updateState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateState(nextProps);
    }

    updateState(nextProps) {
        // Cache the key/name prop as array, if it wans't passed as such, so we can use getIn()
        const keyProp = Array.isArray(nextProps.keyProp) ? nextProps.keyProp : [nextProps.keyProp];
        const nameProp = Array.isArray(nextProps.nameProp) ? nextProps.nameProp : [nextProps.nameProp];
        const filteredData = applyFilter(nextProps.data, nameProp, this.state.filterString);
        // Don't run findIndex at all if nothing is selected
        const selectedIndex = nextProps.selected ? filteredData.findIndex(value => value && value.getIn(keyProp) === nextProps.selected) : INDEX_NONE;
        this.setState({
            keyProp,
            nameProp,
            filteredData,
            selectedIndex,
            selectedValue: filteredData.getIn([selectedIndex, ...nameProp]),
            focusIndex: selectedIndex
        });
    }

    handleRowClick({index}) {
        const { onSelect } = this.props;
        if (typeof onSelect === 'function') {
            onSelect(this.getData().getIn([index, ...this.state.keyProp]), this.getData().get(index));
        }
        this.setDialogOpen(false);
    }

    renderDialogContent() {
        const { focusIndex } = this.state;
        return (
            <div style={{width: '100%'}}>
                <span>&nbsp;{this.state.filterString || 'Type to filter\u2026'}</span>
                <hr />
                <AutoSizer disableHeight>
                    {({ width }) => (
                        <Table
                          width={width}
                          height={240}
                          rowCount={this.getData().size}
                          onRowClick={this.handleRowClick}
                          scrollToIndex={focusIndex}
                          rowGetter={this.rowGetter}
                          noRowsRenderer={this.noRowsRenderer}
                          rowHeight={36}>
                            <Column
                              dataKey={this.state.nameProp}
                              flexGrow={1}
                              width={60}
                              cellRenderer={this.cellRenderer}
                              cellDataGetter={this.cellDataGetter}
                            />
                        </Table>
                    )}
                </AutoSizer>
            </div>
        );
    }

    render() {
        const { open } = this.state;
        const { style, className } = this.props;
        const value = this.state.selectedIndex !== INDEX_NONE ? this.state.selectedValue : 'Select';
        return (
            <span className={className} style={style}>
                <DropdownRenderer open={open} onClick={this.handleDialogOpen} >
                    <FlatButton
                      style={{width: '100%', height: '26px', lineHeight: '26px', textAlign: 'left', paddingLeft: '8px', fontFamily: 'Roboto, sans-serif', fontSize: '15px', color: '#595959'}}>
                        {value}
                    </FlatButton>
                </DropdownRenderer>
                <Dialog
                  title='Select Location'
                  open={open}
                  contentStyle={{width: 480}}
                  onRequestClose={this.handleDialogCancel}
                  >
                    {open && this.renderDialogContent()}
                </Dialog>
            </span>
        );
    }
}

SelectPopup.defaultProps = {
    data: new List(),
    keyProp: 'key',
    nameProp: 'name'
};

SelectPopup.propTypes = {
    data: PropTypes.instanceOf(List).isRequired,
    selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSelect: PropTypes.func,
    // eslint-disable-next-line
    keyProp: PropTypes.any,
    // eslint-disable-next-line
    nameProp: PropTypes.any,
    /**
     * Renders a single option:
     * (data) => React.Element
     */
    optionRenderer: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.any
};

export function createSimpleRenderer(keyProp) {
    return (data, isFocused) => <FlatButton backgroundColor={isFocused ? '#ffc' : 'inherit'} style={{width: '100%', height: '36px', lineHeight: '1', textAlign: 'left', color: isFocused ? '#222' : undefined}}>{data || 'Select'}</FlatButton>;
}

export default SelectPopup;
