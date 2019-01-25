import { connect } from 'react-redux';
import ByCustomSearch from 'ut-front-react/components/Filters/ByCustomSearch';
import { toolboxCustomSearchSetField, toolboxCustomSearchSetValue } from '../../../../pages/ApkList/actions';

const mapStateToProps = ({apksList}, ownProps) => {
    return {
        field: apksList.getIn(['toolbox', 'filters', 'customSearch', 'field']),
        value: apksList.getIn(['toolbox', 'filters', 'customSearch', 'value']) || ''
    };
};

const mapDispatchToProps = {
    setField: toolboxCustomSearchSetField,
    setValue: toolboxCustomSearchSetValue
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ByCustomSearch);
