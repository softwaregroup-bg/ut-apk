import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import Dropdown from 'ut-front-react/components/Input/Dropdown';
import { fetchAgents } from '../../../../pages/AgentsList/actions';

class ByStatus extends Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(selectedValue = null) {
        let { filter, pagination, fetchAgents } = this.props;
        let newFilter;
        let newPagination = pagination.set('page', 1);
        if (selectedValue && selectedValue.value && selectedValue.value !== '__placeholder__') {
            newFilter = filter.set('statusId', selectedValue.value);
        } else {
            newFilter = filter.set('statusId', null);
        }
        fetchAgents(newFilter, newPagination);
    }

    render() {
        return (
            <Dropdown
              defaultSelected={this.props.filter.get('statusId')}
              placeholder={'Status'}
              canSelectPlaceholder
              keyProp='statusId'
              onSelect={this.handleSelect}
              data={this.props.data.toJS().map(i => { i.key = i.statusId; return i; })}
              menuAutoWidth />
        );
    }
}

ByStatus.propTypes = {
    filter: PropTypes.object.isRequired, // immutable
    pagination: PropTypes.object.isRequired, // immutable
    data: PropTypes.instanceOf(List).isRequired,
    // Actions
    fetchAgents: PropTypes.func.isRequired
};

export default connect(
    ({ agentsList }) => {
        return {
            filter: agentsList.get('filter'),
            pagination: agentsList.get('pagination'),
            data: agentsList.getIn(['items', 'agentStatus'], new List())
        };
    },
    { fetchAgents }
)(ByStatus);
