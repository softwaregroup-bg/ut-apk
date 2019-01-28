import React, { PropTypes } from 'react';
import { List } from 'immutable';
import { Table, AutoSizer, SortDirection } from 'react-virtualized';
import classnames from 'classnames';
import Text from 'ut-front-react/components/Text';

import localStyle from './style.css';
import EmptyStateWrapper from './EmptyStateWrapper';

function defaultEmptyState() {
    return (
        <EmptyStateWrapper>
             <Text>No results found matching the given criteria</Text>
        </EmptyStateWrapper>
    );
}

class DataTable extends React.PureComponent {
    constructor(props) {
        super(props);
        // React-virtualized-related bindings
        this.handleRowClick = this.handleRowClick.bind(this);
        this._getRowData = this._getRowData.bind(this);
        this._getRowClassName = this._getRowClassName.bind(this);
        this._defaultNoRowsRenderer = defaultEmptyState.bind(this);
    }

    handleRowClick(params) {
        const { index } = params;
        if (typeof this.props.onSelectionChange === 'function') {
            this.props.onSelectionChange(this._getRowData(params), index, this.props.data);
        }
    }

    _getRowData({index}) {
        return this.props.data.get(index);
    }

    _getRowClassName({index}) {
        const { selectedIndex } = this.props;
        if (index === -1) {
            // Handle the header row separately
            return localStyle.row_header;
        }
        const isSelected = selectedIndex === index;
        const evenRowClass = classnames(localStyle.row_even, localStyle.bottomBorder, {[localStyle.row_selected]: isSelected});
        const oddRowClass = classnames(localStyle.row_odd, localStyle.bottomBorder, {[localStyle.row_selected]: isSelected});
        return index & 1 ? oddRowClass : evenRowClass;
    }

    render() {
        const { data, selectedIndex, children, noRowsRenderer, sort, sortDirection, sortBy } = this.props;
        return (
            <AutoSizer>
                {({ height, width }) => (
                    <Table
                      width={width}
                      height={height}
                      headerHeight={48}
                      headerClassName={localStyle.tableHeader}
                      gridClassName={localStyle.tableGrid}
                      scrollToIndex={selectedIndex >= 0 ? selectedIndex : undefined}
                      rowHeight={48}
                      rowCount={data.size}
                      rowGetter={this._getRowData}
                      rowClassName={this._getRowClassName}
                      sort={sort}
                      sortBy={sortBy}
                      sortDirection={sortDirection}
                      noRowsRenderer={noRowsRenderer || this._defaultNoRowsRenderer}
                      onRowClick={this.handleRowClick}
                    >
                        {children}
                    </Table>
                )}
            </AutoSizer>
        );
    }
}

DataTable.propTypes = {
    data: PropTypes.instanceOf(List),
    selectedIndex: PropTypes.number,
    // External properties
    onSelectionChange: PropTypes.func, // onSelectionChange(currentValue, index, allValues)
    children: PropTypes.node, // An Iterable with <Column /> elements
    noRowsRenderer: PropTypes.func,
    sort: PropTypes.func,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.oneOf([SortDirection.ASC, SortDirection.DESC])
};

DataTable.defaultProps = {
    data: new List(),
    selectedIndex: -1
};

export { EmptyStateWrapper };
export default DataTable;
