import React, { PropTypes } from 'react';

class OnClickRenderWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        const { cellData, dataKey, rowIndex, columnData } = this.props;
        const { onClick } = columnData;
        if (typeof onClick === 'function') {
            onClick({cellData, dataKey, rowIndex});
        }
    }

    render() {
        const { children, cellData, columnData, dataKey, isScrolling, rowData, rowIndex } = this.props;

        const create = React.isValidElement(children) ? React.cloneElement : React.createElement;
        return create(children, {
            cellData,
            columnData,
            dataKey,
            isScrolling,
            rowData,
            rowIndex,
            onClick: this.handleClick
        });
    }
}

OnClickRenderWrapper.propTypes = {
    children: PropTypes.node,

    cellData: PropTypes.any,
    columnData: PropTypes.object,
    dataKey: PropTypes.any,
    isScrolling: PropTypes.bool,
    rowData: PropTypes.any,
    rowIndex: PropTypes.number
};

OnClickRenderWrapper.defaultProps = {
    columnData: {}
};

export function enhanceWithOnClick(children) {
    // data is {cellData, columnData, dataKey, isScrolling, rowData, rowIndex} as per the
    // react-virtualized api
    return function VirtualizedRenderer(data) {
        return <OnClickRenderWrapper {...data} children={children} />;
    };
}

export default OnClickRenderWrapper;
