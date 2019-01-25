import { connect } from 'react-redux';
import GridToolbox from 'ut-front-react/components/SimpleGridToolbox';
import { toolboxToggle } from '../../../pages/ApkList/actions';

export const ToolboxFilters = connect(
    (state) => {
        let hasSelectedItem = state.apksList.get('selected').size > 0;

        return {
            opened: hasSelectedItem ? state.apksList.getIn(['toolbox', 'filters', 'opened']) : true,
            title: hasSelectedItem ? 'Show Buttons' : 'Filter by',
            isTitleLink: hasSelectedItem
        };
    },
    { toggle: toolboxToggle }
)(GridToolbox);

export const ToolboxButtons = connect(
    (state) => {
        let hasSelectedItem = state.apksList.get('selected').size > 0;

        return {
            opened: hasSelectedItem ? state.apksList.getIn(['toolbox', 'buttons', 'opened']) : false,
            title: 'Show Filters',
            isTitleLink: hasSelectedItem
        };
    },
    { toggle: toolboxToggle }
)(GridToolbox);
