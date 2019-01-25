import React, { PropTypes } from 'react';
import classnames from 'classnames';
import SearchBox from 'ut-front-react/components/SearchBox';
import Text from 'ut-front-react/components/Text';

import Fetcher from '../../../../containers/Fetcher';
import FetcherTable from '../../../../containers/FetcherTable';
import styles from './style.css';
import { apkSearchColumns } from './config.js';

class ApkSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: -1,
            selectedValue: undefined
        };
        this._fetcherRenderer = this._fetcherRenderer.bind(this);
        this.handleSelectionChange = (value, index, items) => {
            this.setState({
                selectedIndex: index,
                selectedValue: value
            });
            if (typeof this.props.onSelect === 'function') {
                this.props.onSelect(value, index, items);
            }
        };
    }
    // componentWillReceiveProps(nextProps) {
    //     console.log('willreceiveProps', nextProps);
    //     this.setState({
    //         selectedIndex: -1,
    //         selectedValue: undefined
    //     });
    // }
    _fetcherRenderer(props) {
        const {fetcher: {getQueryProp, executeQueryWithProps}} = props;

        const handleOnSearch = (value) => {
            value = (value || '').trim();
            if (value === '') {
                return; // must contain at least one symbol
            }

            executeQueryWithProps({
                searchString: value
            });
        };

        return (
            <div className={classnames(styles.bottomBorder, styles.inputRow, 'clearfix')}>
                <div className={styles.inputRowLabel}>
                    <Text>Search</Text>
                </div>
                <div className={styles.inputRowInput}>
                    <SearchBox
                      placeholder='Search for apk'
                      onSearch={handleOnSearch}
                      defaultValue={getQueryProp('searchString') || ''} />
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className={styles.overflowedWrap}>
                <Fetcher
                  id='apk/apk/search'
                  method='apk.apk.search'
                  options={{suppressPreloadWindow: true, suppressErrorWindow: true}}>
                    {this._fetcherRenderer}
                </Fetcher>
                <FetcherTable
                  id='apk/apk/search'
                  dataPath={['result', 'apk']}
                  paginationPath={['result', 'pagination', 0]}
                  onSelectionChange={this.handleSelectionChange}
                  selectedIndex={this.state.selectedIndex}
                  config={apkSearchColumns} />
            </div>
        );
    }
}

ApkSearch.propTypes = {
    onSelect: PropTypes.func.isRequired
};

export default ApkSearch;
