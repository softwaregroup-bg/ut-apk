import { connect } from 'react-redux';
import ClearFilter from 'ut-front-react/components/ClearFilter';
import { resetFilters } from '../../../../pages/ApkList/actions';

const mapStateToProps = ({apksList}) => {
    let filter = apksList.get('filter').toJS();
    let show = filter.statusId || filter.networkName || filter.customerNumber || filter.firstName || filter.lastName || [0, 1].indexOf(filter.isSuspended) !== -1;
    return { show: !!show };
};

const mapDispatchToProps = {
    onClick: resetFilters
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ClearFilter);
