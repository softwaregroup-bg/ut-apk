import React, { Component, PropTypes } from 'react';

export const SORT_STATES = {
    Ascending: 0,
    Descending: 1,
    Neutral: 2
};

class HeadCell extends Component {
    constructor(props) {
        super(props);
        this.handleClick = e => {
            this.props.onClick(e);
            this.props.onSort(this.props.columnName, this.props.sortStates);
        };
    }

    getClassName() {
        let { sortOrder, sortBy, className, columnName, ascClassName, descClassName } = this.props;

        if (columnName === sortBy) {
            switch (sortOrder) {
                case SORT_STATES.Ascending:
                    className = `${className} ${ascClassName}`;
                    break;
                case SORT_STATES.Descending:
                    className = `${className} ${descClassName}`;
                    break;
            }
        }

        return className;
    }

    render() {
        return <th
          onClick={this.handleClick}
          className={this.getClassName()}
          children={this.props.children}
          style={this.props.style}
          {...this.props.innerProps}
        />;
    }
}

HeadCell.defaultProps = {
    className: 'f-gray-lighter f-semibold border-bottom bg-white pointer',
    ascClassName: 'upArrow',
    descClassName: 'downArrow',
    sortStates: 2,
    sortOrder: SORT_STATES.Neutral,
    onClick: function() {},
    onSort: function() {}
};

HeadCell.propTypes = {
    children: PropTypes.any,
    className: PropTypes.string,
    ascClassName: PropTypes.string,
    descClassName: PropTypes.string,
    columnName: PropTypes.string,
    innerProps: PropTypes.object,
    style: PropTypes.object,
    sortStates: PropTypes.oneOf([1, 2, 3]),
    onSort: PropTypes.func,
    onClick: PropTypes.func,
    sortBy: PropTypes.string,
    sortOrder: PropTypes.number
};

export default HeadCell;
