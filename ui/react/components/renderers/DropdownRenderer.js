import React from 'react';
import Dropdown from 'ut-front-react/components/Input/Dropdown';

function DropdownRenderer(data) {
    const {cellData, columnData = {}, dataKey, rowIndex} = data;

    // The options and onSelect action should be contained in the columnData
    const { onSelect, options } = columnData;
    return (
        <Dropdown data={options} onSelect={onSelect} keyProp={{dataKey, rowIndex}} defaultSelected={cellData} />
    );
}

export function createColumnData(options, onSelect) {
    return {
        onSelect,
        options
    };
};

export default DropdownRenderer;
