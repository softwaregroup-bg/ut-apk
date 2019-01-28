import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import * as actions from './actions';

class Fetcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: {
            }
        };
        // Bind the actions
        this.setQueryProp = this.setQueryProp.bind(this);
        this.getQueryProp = this.getQueryProp.bind(this);
        this.executeQuery = this.executeQuery.bind(this);
        this.executeQueryWithProps = this.executeQueryWithProps.bind(this);
        this.clearQuery = this.clearQuery.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            query: nextProps.query && nextProps.query.toJS()
        });
    }
    componentWillUnmount() {
        const { clear, id, clearOnUnmount } = this.props;
        if (clearOnUnmount) {
            clear(id);
        }
    }
    setQueryProp(prop, value) {
        this.setState({
            query: Object.assign(this.state.query, { [prop]: value })
        });
    }
    getQueryProp(prop) {
        return this.state.query[prop];
    }
    executeQuery() {
        const { fetch, id, method, options } = this.props;
        const { query } = this.state;
        fetch(id, method, query, options);
    }
    executeQueryWithProps(props) {
        const { fetch, id, method, options } = this.props;
        const { query } = this.state;
        if (props instanceof Object) {
            // Delayed update
            this.setState({
                query: Object.assign(this.state.query, props)
            }, () => fetch(id, method, this.state.query, options));
        } else {
            fetch(id, method, query, options);
        }
    }
    clearQuery() {
        const { clear, id } = this.props;
        this.setState({
            query: {}
        });
        clear(id);
    }

    render() {
        const { query } = this.props;
        const fetcher = {
            setQueryProp: this.setQueryProp,
            getQueryProp: this.getQueryProp,
            executeQueryWithProps: this.executeQueryWithProps,
            executeQuery: this.executeQuery,
            clearQuery: this.clearQuery,
            query
        };
        return React.createElement(this.props.children, {
            fetcher
        });
    }
}

Fetcher.defaultProps = {
    clearOnUnmount: true
};

Fetcher.propTypes = {
    children: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    /** The backend method to be called */
    method: PropTypes.string.isRequired,
    options: PropTypes.object,
    clearOnUnmount: PropTypes.bool,
    query: PropTypes.instanceOf(Map),
    // Actions
    fetch: PropTypes.func.isRequired,
    clear: PropTypes.func.isRequired
};

export default connect(
    (state, props) => {
        const { id } = props;
        return {
            query: state.utFetcher.getIn(['data', id, 'query'], new Map())
        };
    },
    actions
)(Fetcher);
