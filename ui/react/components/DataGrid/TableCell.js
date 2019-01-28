import React from 'react';

TableCell.defaultProps = {
    className: 'padding-all-15 word-break f-default border-bottom bg-white'
};

export default function TableCell(props) {
    return <td {...props} />;
}
