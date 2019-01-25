import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import { fetchApks } from '../../../../pages/ApkList/actions';

class ByStatus extends Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(selectedValue = null) {
        let { filter, pagination, fetchApks } = this.props;
        let newFilter;
        let newPagination = pagination.set('page', 1);
        if (selectedValue && selectedValue.value !== '__placeholder__') {
            newFilter = filter.set('isSuspended', selectedValue.value);
        } else {
            newFilter = filter.set('isSuspended', null);
        }
        fetchApks(newFilter, newPagination);
    }

    render() {
        return (
            <Dropdown
              defaultSelected={this.props.filter.get('isSuspended')}
              placeholder={'Lock Status'}
              canSelectPlaceholder
              keyProp='isSuspended'
              onSelect={this.handleSelect}
              data={this.props.data.toJS()}
              menuAutoWidth />
        );
    }
}

ByStatus.propTypes = {
    filter: PropTypes.object.isRequired, // immutable
    pagination: PropTypes.object.isRequired, // immutable
    data: PropTypes.instanceOf(List).isRequired,
    // Actions
    fetchApks: PropTypes.func.isRequired
};

export default connect(
    ({ apksList }) => {
        return {
            filter: apksList.get('filter'),
            pagination: apksList.get('pagination'),
            data: apksList.getIn(['items', 'lockStatuses'], new List())
        };
    },
    { fetchApks }
)(ByStatus);
