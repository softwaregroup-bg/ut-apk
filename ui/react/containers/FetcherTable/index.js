import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Column, SortDirection } from 'react-virtualized';
import { List, Map } from 'immutable';
// import Pagination from 'ut-front-react/components/Pagination';
import AdvancedPagination from 'ut-front-react/components/AdvancedPagination';

import DataTable from '../../components/Table';
import { immutableCellDataGetter } from '../../components/Table/helpers';
import { fetcherSelector } from '../Fetcher/reducers';
import { fetch } from '../Fetcher/actions';
import EmptyState from './EmptyState';
import style from './style.css';

const EMPTY_LIST = new List();
const DEFAULT_PAGINATION = new Map({
    pageNumber: 1,
    pageSize: 25,
    recordsTotal: 0
});

function FetcherTable(props) {
    const { config, items, pagination, isLoading, error, query, options, onSelectionChange, selectedIndex } = props;
    const columns = Object.keys(config).map(columnConfig => {
        return (
            <Column
              columnData={Object.assign({query, pagination}, config[columnConfig].columnData)}
              {...config[columnConfig]}
              dataKey={config[columnConfig].dataKey || columnConfig}
              key={columnConfig}
              cellDataGetter={config[columnConfig].cellDataGetter || immutableCellDataGetter}
            />
        );
    });

    const onUpdatePagination = (update) => {
        const newQuery = query
            .set('pageSize', update.get('pageSize'))
            .set('pageNumber', update.get('pageNumber'));
        props.fetch(props.id, props.method, newQuery, options);
    };

    const sort = ({ sortBy, sortDirection }) => {
        const newQuery = query
            .set('sortBy', sortBy)
            .set('sortOrder', sortDirection === SortDirection.DESC ? 'DESC' : 'ASC');
        props.fetch(props.id, props.method, newQuery, options);
    };
    // Need to pass an empty list while loading so the 'no results renderer' shows
    return (
        <div className={style.fetchTableContainer} style={{height: '400px'}}>
            <div className={style.fetchTable} >
                <DataTable
                  onSelectionChange={onSelectionChange}
                  selectedIndex={selectedIndex}
                  data={isLoading ? EMPTY_LIST : items}
                  sort={sort}
                  sortBy={query.get('sortBy')}
                  sortDirection={query.get('sortOrder') === 'ASC' ? SortDirection.ASC : SortDirection.DESC}
                  noRowsRenderer={() => <EmptyState isLoading={isLoading} error={error} />} >
                    {columns}
                </DataTable>
            </div>
            <div className={style.fetchPagination}>
                <AdvancedPagination pagination={pagination} onUpdate={onUpdatePagination} />
            </div>
        </div>
    );
}

FetcherTable.propTypes = {
    id: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    // From connect()
    method: PropTypes.string,
    items: PropTypes.instanceOf(List).isRequired,
    pagination: PropTypes.instanceOf(Map), // {pageNumber, pageSize, recordsTotal}
    error: PropTypes.any,
    isLoading: PropTypes.bool,
    query: PropTypes.instanceOf(Map),
    options: PropTypes.instanceOf(Map),
    // External
    onSelectionChange: PropTypes.func,
    selectedIndex: PropTypes.number,
    // Actions
    fetch: PropTypes.func.isRequired
};

FetcherTable.defaultProps = {
    pagination: DEFAULT_PAGINATION,
    selectedIndex: -1,
    dataPath: ['result'],
    paginationPath: ['result', 'pagination']
};

export default connect(
    (state, props) => {
        const { id, dataPath, paginationPath } = props;
        const result = fetcherSelector(state, id);
        return {
            items: result.getIn(dataPath, new List()),
            pagination: result.getIn(paginationPath, new Map()),
            error: result.get('error'),
            isLoading: result.get('isLoading'),
            query: result.get('query'),
            method: result.get('method'),
            options: result.get('options')
        };
    },
    {
        fetch
    }
)(FetcherTable);
