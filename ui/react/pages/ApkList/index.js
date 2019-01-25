import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ResizibleContainer from 'ut-front-react/components/ResiziblePageLayout/Container';
import resizibleTypes from 'ut-front-react/components/ResiziblePageLayout/resizibleTypes';
import Header from 'ut-front-react/components/PageLayout/Header';
import { getLink } from 'ut-front/react/routerHelper';
import { AddTab } from 'ut-front-react/containers/TabMenu';
import GridBreadcrumbs from 'ut-core/ui/react/containers/GridBreadcrumbs';
import BusinessUnitsTree from 'ut-core/ui/react/containers/BusinessUnits';
import Pagination from 'ut-core/ui/react/containers/Pagination';
import { buildBUText } from 'ut-core/ui/react/helpers';
import ApksGrid from './Grid';
import { ToolboxFilters, ToolboxButtons } from '../../containers/ApksList/ToolboxFilters';
import GridToolboxButtons from '../../containers/ApksList/ToolboxButtons';
// import FilterByStatus from '../../containers/ApksList/Filters/ByStatus'; - removed by MCTUNE-3166
import FilterByLockStatus from '../../containers/ApksList/Filters/ByLockStatus';
import FilterByCustomSearch from '../../containers/ApksList/Filters/ByCustomSearch';
import ClearFilter from '../../containers/ApksList/Filters/ClearFilter';
import { updatePagination, setParentBusinessUnit } from './actions';
import mainStyle from 'ut-front-react/assets/index.css';
import style from './style.css';

const defaultAsideWidth = 200;
const defaultAsideMinWidth = 100;
const defaultCollapsedWidth = 30;

const customSearchfields = [
    { key: 'apkName', name: 'APK Name' }
];

class ApksList extends Component {
    get headerButtons() {
        return [{
            text: 'Add APK',
            href: getLink('ut-apk:apkCreate'),
            permissions: ['apk.apk.add'],
            styleType: 'primaryLight'
        }];
    }

    getResizableCols() {
        const { setParentBusinessUnit, filter, pagination, updatePagination } = this.props;
        const leftAside = (
            <div style={{minWidth: defaultAsideWidth}}>
                <BusinessUnitsTree identifier='apksList' showUnselectAll onActiveClick={setParentBusinessUnit} />
            </div>
        );

        const content = (
            <div className={mainStyle.contentTableWrap}>
                <div className={mainStyle.actionBarWrap}>
                    <ToolboxFilters>
                        <div className={style.filterWrap} >
                            { /* <div className={style.filterSeparated}><FilterByStatus /></div> - removed until requested by client - MCTUNE-3166 */ }
                            <div className={style.filterSeparated}><FilterByLockStatus /></div>
                            <div className={style.filterCustomSearchSeparated}>
                                <FilterByCustomSearch
                                  fields={customSearchfields}
                                  defaultField='apkName' />
                            </div>
                            <div><ClearFilter /></div>
                        </div>
                    </ToolboxFilters>
                    <ToolboxButtons>
                        <div className={style.buttonWrap} >
                            <GridToolboxButtons />
                        </div>
                    </ToolboxButtons>
                </div>
                <GridBreadcrumbs selectedId={filter.get('businessUnitId')} breadcrumbs={filter.get('breadcrumbs')} />
                <ApksGrid />
                <Pagination pagination={pagination} onUpdate={updatePagination} />
            </div>
        );

        const containerNormalWidth = window.window.innerWidth - defaultAsideWidth;
        const asideStyles = {minWidth: defaultAsideWidth};
        const resizableContainerCols = [
            {
                type: resizibleTypes.ASIDE,
                id: 'apkLeftAside',
                width: defaultAsideWidth,
                normalWidth: defaultAsideWidth,
                minWidth: defaultAsideMinWidth,
                innerColStyles: {overflowX: 'hidden'},
                styles: asideStyles,
                collapsedWidth: defaultCollapsedWidth,
                heading: 'Business Units',
                info: buildBUText('apk'),
                child: leftAside
            },
            {
                type: resizibleTypes.CONTENT,
                id: 'apkContent',
                width: containerNormalWidth,
                normalWidth: containerNormalWidth,
                minWidth: 250,
                child: content
            }
        ];

        return resizableContainerCols;
    }

    render() {
        const { location } = this.props;
        const resizableContainerCols = this.getResizableCols();

        return (
            <div>
                <AddTab pathname={getLink('ut-apk:apks')} title='Apks' />
                <Header text='Apks' buttons={this.headerButtons} location={location} />
                <ResizibleContainer cols={resizableContainerCols} />
            </div>
        );
    }
};

ApksList.propTypes = {
    // Routing
    location: PropTypes.object.isRequired,
    // Data
    filter: PropTypes.object, // immutable
    pagination: PropTypes.object, // immutable
    // Actions
    updatePagination: PropTypes.func,
    setParentBusinessUnit: PropTypes.func
    // fetchApkstatuses: PropTypes.func - removed by MCTUNE-3166
};

ApksList.contextTypes = {
    checkPermission: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
    filter: state.apksList.get('filter'),
    pagination: state.apksList.get('pagination')
});

export default connect(
    mapStateToProps,
    {
        updatePagination,
        setParentBusinessUnit
    }
)(ApksList);