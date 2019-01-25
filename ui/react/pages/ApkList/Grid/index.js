import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import immutable from 'immutable';
import Text from 'ut-front-react/components/Text';
import { SimpleGrid } from 'ut-front-react/components/SimpleGrid';
import mainStyle from 'ut-front-react/assets/index.css';

import { statusIdToReadableStringMap } from '../../../helpers/common';
import {
    fetchApks,
    selectApk,
    toggleColumnVisibility,
    fetchApkStatuses,
    setVisibleColumns
} from '../actions';

class ApksGrid extends Component {
    constructor(props, context) {
        super(props, context);
        this.permissions = {
            get: context.checkPermission('apk.apk.get')
        };
        this.handleOrder = this.handleOrder.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.handleTransformValue = this.handleTransformValue.bind(this);
    }

    componentWillMount() {
        this.props.setVisibleColumns();
        this.props.fetchApkStatuses();
        this.props.fetchApks(this.props.filter, this.props.pagination, this.props.order);
    }

    componentWillReceiveProps(nextProps) {
        let { apks, filter, order, pagination, requiresFetch } = nextProps;
        if (apks !== this.props.apks) {
            this.refs.grid && this.refs.grid.subscription();
        }
        let activeBusinessUnitId = filter.get('businessUnitId');
        if (activeBusinessUnitId !== this.props.filter.get('businessUnitId')) {
            this.props.fetchApks(filter, pagination, order);
        } else if (requiresFetch || pagination.get('pageSize') !== this.props.pagination.get('pageSize') || pagination.get('pageNumber') !== this.props.pagination.get('pageNumber')) {
            this.props.fetchApks(filter, pagination, order);
        }
    }

    get sortableColumns() {
        return [
            'apkName',
            'isSuspended',
            'mappingBranchName'];
    }

    handleOrder(order) {
        let { filter, fetchApks, pagination } = this.props;
        let newOrderBy;
        if (order.new !== '') {
            newOrderBy = immutable.Map({
                column: order.field,
                direction: order.new
            });
        } else {
            newOrderBy = immutable.Map({
                column: null,
                direction: null
            });
        }
        fetchApks(filter, pagination, newOrderBy);
    }

    handleRefresh() {
        let { filter, pagination, order, fetchApks } = this.props;
        fetchApks(filter, pagination, order);
    }

    handleTransformValue(value, field, data, isHeader) {
        if (isHeader) {
            return <Text>{value}</Text>;
        } else {
            if (field.name === 'statusId') {
                return statusIdToReadableStringMap[value];
            }
            if (field.name === 'isSuspended') {
                if (value) {
                    return 'Locked';
                }
                return 'Unlocked';
            }
        }
        return value;
    }

    render() {
        let { selectApk, fields, toggleColumnVisibility, apks, checkedRows } = this.props;
        let handleSelectApk = () => {};
        if (this.permissions.get) {
            handleSelectApk = selectApk;
        }
        let handleCheckApk = (a, b) => {
            handleSelectApk(b);
        };
        let gridFields = fields.toJS();

        return (
            <div className={mainStyle.tableWrap}>
                <SimpleGrid
                  multiSelect
                  globalMenu
                  emptyRowsMsg='No results'
                  fields={gridFields}
                  data={apks.toJS()}
                  handleRowClick={handleSelectApk}
                  handleCheckboxSelect={handleCheckApk}
                  orderBy={this.sortableColumns}
                  handleOrder={this.handleOrder}
                  rowsChecked={checkedRows.toList().toJS()}
                  toggleColumnVisibility={toggleColumnVisibility}
                  transformCellValue={this.handleTransformValue} />
            </div>
        );
    };
}

ApksGrid.propTypes = {
    // Data
    apks: PropTypes.object.isRequired, // immutable List
    filter: PropTypes.object.isRequired, // immutable Map
    order: PropTypes.object.isRequired, // immutable Map - grid sorting
    pagination: PropTypes.object.isRequired, // immutable Map
    requiresFetch: PropTypes.bool.isRequired,
    fields: PropTypes.object, // immutable List
    checkedRows: PropTypes.object,
    // Actions
    fetchApks: PropTypes.func.isRequired,
    fetchApkStatuses: PropTypes.func.isRequired,
    selectApk: PropTypes.func.isRequired,
    toggleColumnVisibility: PropTypes.func,
    setVisibleColumns: PropTypes.func
};

ApksGrid.contextTypes = {
    checkPermission: PropTypes.func
};

export default connect(
    ({apksList}) => {
        return {
            apks: apksList.get('apks'),
            filter: apksList.get('filter'),
            order: apksList.get('order'),
            pagination: apksList.get('pagination'),
            fields: apksList.getIn(['grid', 'fields']),
            checkedRows: apksList.getIn(['grid', 'checkedRows']),
            requiresFetch: apksList.get('requiresFetch')
        };
    },
    { fetchApks, selectApk, toggleColumnVisibility, setVisibleColumns, fetchApkStatuses }
)(ApksGrid);
